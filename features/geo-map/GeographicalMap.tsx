import React, { useState, useMemo, useEffect, useRef } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMapEvents, Polygon, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// --- Imports מתוקנים ---
import ConnectionsLayer from './components/ConnectionsLayer';
import FiltersControl from './components/FiltersControl';
// 👇 הוספנו את הרכיב החדש שיצרנו

// 👇 הוספנו את הפונקציות שהוצאנו לקובץ נפרד
import { getGuildColor, createCustomIcon } from './utils/mapStyles';

import TimelineControl from '../social-map/components/TimelineControl';
import { Family } from '../../types'; 
import { SESTI_DATA, QUARTIERI_DATA, DistrictPolygon } from '../../data/districts'; 

import { Search, Layers, Eye, EyeOff, Map as MapIcon, Clock, Users, ChevronDown, ChevronRight, X, Flag, Info } from 'lucide-react';

// --- Leaflet Icon Fix ---
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

// --- Constants ---
const CHRONICLE_YEARS = [1216, 1250, 1260, 1266, 1282, 1293, 1300, 1302];

const BASE_MAPS = {
    clean: { name: "Clean Light", url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", attribution: '&copy; OSM & CARTO' },
    satellite: { name: "Satellite", url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", attribution: '&copy; Esri' },
    dark: { name: "Dark Mode", url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", attribution: '&copy; CARTO' }
};

// --- Components ---
const SingleDistrict: React.FC<{ district: DistrictPolygon; currentYear: number; onSelect: (d: DistrictPolygon) => void; }> = ({ district, currentYear, onSelect }) => {
    const pathOptions = useMemo(() => ({
        className: 'district-glow',
        color: district.color,       
        fillColor: district.color,   
        fillOpacity: 0.4,            
        weight: 3,
        dashArray: currentYear < 1343 ? '10, 10' : undefined,
        smoothFactor: 1, 
        noClip: true     
    }), [district.color, currentYear]); 

    const handlers = useMemo(() => ({
        mouseover: (e: any) => {
            e.target.setStyle({ fillOpacity: 0.6, weight: 5, color: '#ffffff' }); 
            e.target.bringToFront(); 
        },
        mouseout: (e: any) => {
            e.target.setStyle({ fillOpacity: 0.4, weight: 3, color: district.color }); 
        },
        click: (e: any) => {
             L.DomEvent.stopPropagation(e);
             onSelect(district); 
        }
    }), [district, onSelect]);

    return (
        <Polygon positions={district.points as [number, number][]} pathOptions={pathOptions} eventHandlers={handlers}>
            <Tooltip 
                sticky 
                direction="left" 
                offset={[-5, 0] as [number, number]}
                className="font-serif text-xs font-bold uppercase tracking-widest bg-parchment border-earth-orange text-ink shadow-xl"
            >
                {district.name}
            </Tooltip>
        </Polygon>
    );
};

const DistrictsLayer = ({ currentYear, show, onSelectDistrict }: any) => {
    if (!show) return null;
    const activeData = currentYear < 1343 ? SESTI_DATA : QUARTIERI_DATA;
    return <>{activeData.map((d) => <SingleDistrict key={d.id} district={d} currentYear={currentYear} onSelect={onSelectDistrict} />)}</>;
};

const Section = ({ title, icon: Icon, children, isOpen, onToggle }: any) => (
    <div className="border-b border-ink/10">
        <button onClick={onToggle} className="w-full flex items-center justify-between p-3 bg-parchment hover:bg-ink/5 transition-colors">
            <div className="flex items-center gap-2">
                <Icon size={14} className="text-ink-light" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-ink">{title}</span>
            </div>
            {isOpen ? <ChevronDown size={14} className="text-earth-orange" /> : <ChevronRight size={14} className="text-ink/30" />}
        </button>
        {isOpen && <div className="p-3 bg-ink/5 border-t border-ink/5">{children}</div>}
    </div>
);

// Map Click Event 
const MapClickEvent = ({ onDeselect, setSource }: any) => {
    useMapEvents({
        click() {
            setSource('map'); 
            onDeselect();
        },
    });
    return null;
};

// --- Interfaces ---
interface GeographicalMapProps {
  data: Family[];
  year: number;
  onYearChange?: (year: number) => void;
  onSelectFamily: (family: Family | null) => void;
  selectedFamilyId?: string;
}

// --- INTERNAL COMPONENT: MAP SIDEBAR ---
// הוספנו את זה כאן פנימית כדי לפתור את בעיית ה-Import
interface MapSidebarProps {
    selectedDistrict: DistrictPolygon;
    currentYear: number;
    onClose: () => void;
}

const MapSidebar: React.FC<MapSidebarProps> = ({ selectedDistrict, currentYear, onClose }) => {
    return (
        <div className="w-72 bg-parchment border-l border-ink/20 shadow-xl z-20 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-4 border-b border-ink/10 flex items-start justify-between bg-ink/5">
                <div>
                    <h2 className="font-display text-xl font-bold text-ink">{selectedDistrict.name}</h2>
                    <span className="text-[10px] uppercase tracking-widest text-ink-light font-bold">
                            {currentYear < 1343 ? "Historical Sesto" : "Historical Quartiere"}
                    </span>
                </div>
                <button onClick={onClose} className="text-ink/40 hover:text-ink transition-colors"><X size={18} /></button>
            </div>
            
            <div className="p-5 flex-1 overflow-y-auto">
                <div className="mb-6 text-center">
                    <div className="w-32 h-32 mx-auto mb-2 flex items-center justify-center">
                        {selectedDistrict.img ? (
                            <img src={selectedDistrict.img} alt={selectedDistrict.name} className="w-full h-full object-contain drop-shadow-lg" />
                        ) : (
                            <Flag size={60} style={{ color: selectedDistrict.color }} />
                        )}
                    </div>
                    {selectedDistrict.mainSymbol && (
                        <div className="inline-block px-3 py-1 bg-ink/5 rounded-full text-xs font-bold text-ink border border-ink/10">{selectedDistrict.mainSymbol}</div>
                    )}
                </div>
                {selectedDistrict.description && (
                    <div className="mb-6">
                        <h4 className="text-[10px] uppercase font-bold text-ink-light mb-2 flex items-center gap-1"><Info size={12} /> Historical Context</h4>
                        <p className="text-sm font-serif leading-relaxed text-ink/80 italic">"{selectedDistrict.description}"</p>
                    </div>
                )}
                {selectedDistrict.gonfaloni && selectedDistrict.gonfaloni.length > 0 && (
                    <div>
                        <h4 className="text-[10px] uppercase font-bold text-ink-light mb-3 flex items-center gap-1"><Flag size={12} /> Gonfaloni (Companies)</h4>
                        <div className="space-y-2">
                            {selectedDistrict.gonfaloni.map((g, i) => (
                                <div key={i} className="flex items-center gap-3 p-2 rounded bg-white border border-ink/10 shadow-sm">
                                    <div className="w-2 h-8 bg-earth-orange/20 rounded-full" />
                                    <span className="text-xs font-bold text-ink">{g}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---
export const GeographicalMap: React.FC<GeographicalMapProps> = ({ 
  data, year, onYearChange, onSelectFamily, selectedFamilyId
}) => {
  
  const florenceCenter: [number, number] = [43.7710, 11.2560]; 
  
  // 1. STATE & REFS
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const lastCenteredRef = useRef<string | null>(null);  
  const familyListRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const selectionSourceRef = useRef<'map' | 'list' | null>(null);

  // UI State
  const [activeSesto, setActiveSesto] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredFamilyId, setHoveredFamilyId] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictPolygon | null>(null);
  const [activeCoordinates, setActiveCoordinates] = useState<{x: number, y: number} | null>(null);

  // Data Filters State
  const [activeRelTypes, setActiveRelTypes] = useState<Set<string>>(new Set([])); 
  const currentYear = year;
  
  const [colorMode, setColorMode] = useState<'default' | 'guild'>('default');
  const [showPins, setShowPins] = useState(true);

  // Map Layers State
  const [baseLayerKey, setBaseLayerKey] = useState<keyof typeof BASE_MAPS>('clean');
  const [showHistoricalMap, setShowHistoricalMap] = useState(true);
  const [mapOpacity, setMapOpacity] = useState(0.8);
  const [showDistricts, setShowDistricts] = useState(false);

  const [openSections, setOpenSections] = useState({
      layers: true, info: true, timeline: true, locations: false, families: true
  });

  // 2. CONNECTION LOGIC
  const familiesForConnections = useMemo(() => {
      if (!data) return [];
      return data.filter(family => {
          const startRaw = family.yearStart || family['Year Start'];
          const endRaw = family.yearEnd || family['Year End'];
          const startYear = parseInt(startRaw as string) || 0;
          const endYear = parseInt(endRaw as string) || 9999;
          const isAlive = currentYear >= startYear && currentYear <= endYear;
          return isAlive;
      });
  }, [data, currentYear]);

  // 3. SELECTION LOGIC
  const selectedFamily = useMemo(() => {
    if (selectedFamilyId && activeCoordinates) {
        const exactMatch = data.find(f => 
            f.id === selectedFamilyId && 
            f.coordinates && 
            f.coordinates.x === activeCoordinates.x && 
            f.coordinates.y === activeCoordinates.y
        );
        if (exactMatch) return exactMatch;
    }
    return data.find(f => f.id === selectedFamilyId);
  }, [data, selectedFamilyId, activeCoordinates]);  

  const filteredFamilies = useMemo(() => {
      return data.filter((f: Family) => {
          const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesSesto = activeSesto ? f.sesto === activeSesto : true;
          const start = (f.yearStart as number) || 1200;
          const end = (f.yearEnd as number) || 1900;
          const matchesTime = currentYear >= start && currentYear <= end;
          return matchesSearch && matchesSesto && matchesTime;
      });
  }, [data, searchTerm, activeSesto, currentYear]);

  const groupedList = useMemo(() => {
      const groups: Record<string, Family[]> = {};
      filteredFamilies.forEach((f: Family) => {
          const key = f.sesto || "Unknown Location";
          if (!groups[key]) groups[key] = [];
          groups[key].push(f);
      });
      return groups;
  }, [filteredFamilies]);

  // 4. EFFECTS
  useEffect(() => {
    if (!selectedFamilyId) setActiveCoordinates(null);
    if (selectedFamilyId && familyListRefs.current[selectedFamilyId] && selectionSourceRef.current === 'map') {
        familyListRefs.current[selectedFamilyId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        selectionSourceRef.current = null;
    }
  }, [selectedFamilyId]);

  const toggleSection = (key: keyof typeof openSections) => setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  
  const toggleRelType = (type: string) => {
      setActiveRelTypes(prev => {
          const newSet = new Set(prev);
          if (newSet.has(type)) newSet.delete(type); else newSet.add(type);
          return newSet;
      });
  };

  const handleFamilyDoubleClick = (family: Family) => {
      if (!mapInstance || !family.coordinates) return;
      const sameNameFamilies = filteredFamilies.filter(f => f.name === family.name && f.coordinates);
      sameNameFamilies.sort((a, b) => a.id.localeCompare(b.id));

      let targetFamily = family;
      const lastId = lastCenteredRef.current;
      const isLastWasSibling = lastId && sameNameFamilies.some(f => f.id === lastId);

      if (isLastWasSibling && sameNameFamilies.length > 1) {
          const currentIndex = sameNameFamilies.findIndex(f => f.id === lastId);
          const nextIndex = (currentIndex + 1) % sameNameFamilies.length;
          targetFamily = sameNameFamilies[nextIndex];
      }
      
      selectionSourceRef.current = 'list';
      setActiveCoordinates(targetFamily.coordinates!); 
      onSelectFamily(targetFamily);
      lastCenteredRef.current = targetFamily.id;

      mapInstance.flyTo([targetFamily.coordinates!.x, targetFamily.coordinates!.y], 18, { animate: true, duration: 1.5 });
  };

  // 5. RENDER
  return (
    <div className="flex h-full w-full bg-parchment overflow-hidden relative">
      
      {/* LEFT SIDEBAR */}
      <div className="w-80 border-r border-ink/20 flex flex-col z-20 bg-parchment shadow-md flex-shrink-0 relative">
         <div className="p-4 border-b border-ink/10 bg-parchment">
            <h2 className="text-lg font-display font-bold text-ink">Città di Firenze</h2>
            <div className="relative mt-2">
                <Search className="absolute left-2 top-2 text-ink-light" size={12} />
                <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-ink/5 border border-ink/10 rounded pl-7 pr-2 py-1 text-xs focus:outline-none focus:border-earth-orange" />
            </div>
         </div>

         <div className="flex-1 overflow-y-auto custom-scrollbar">
            <Section title="Map Layers" icon={Layers} isOpen={openSections.layers} onToggle={() => toggleSection('layers')}>
                <div className="flex gap-1 mb-3">
                     {['clean', 'satellite', 'dark'].map((k) => (
                        <button key={k} onClick={() => setBaseLayerKey(k as any)} className={`flex-1 py-1 rounded text-[9px] font-bold uppercase ${baseLayerKey === k ? 'bg-earth-orange text-white' : 'bg-white border border-ink/10 text-ink'}`}>{k}</button>
                     ))}
                </div>
                <div className="flex items-center justify-between mb-2">
                     <button onClick={() => setShowHistoricalMap(!showHistoricalMap)} className="flex items-center gap-2 text-xs font-bold text-ink hover:text-earth-orange">
                         {showHistoricalMap ? <Eye size={12}/> : <EyeOff size={12}/>} 1584 Map Overlay
                     </button>
                     <span className="text-[10px]">{Math.round(mapOpacity * 100)}%</span>
                </div>
                <input type="range" min="0" max="1" step="0.05" value={mapOpacity} onChange={(e) => setMapOpacity(parseFloat(e.target.value))} disabled={!showHistoricalMap} className={`w-full h-1 bg-ink/20 rounded-lg cursor-pointer ${!showHistoricalMap && 'opacity-50'}`} />
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-ink/5">
                     <button onClick={() => setShowDistricts(!showDistricts)} className="flex items-center gap-2 text-xs font-bold text-ink hover:text-earth-orange"><MapIcon size={12}/> Sesti/Quartieri</button>
                     <button onClick={() => setShowDistricts(!showDistricts)} className={`w-8 h-4 rounded-full relative transition-colors ${showDistricts ? 'bg-earth-orange' : 'bg-ink/20'}`}>
                        <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all shadow-sm ${showDistricts ? 'left-4.5' : 'left-0.5'}`} />
                     </button>
                </div>
            </Section>

            <Section title="Information & Filters" icon={Users} isOpen={openSections.info} onToggle={() => toggleSection('info')}>
                <FiltersControl 
                    colorMode={colorMode}
                    setColorMode={setColorMode}
                    activeRelTypes={activeRelTypes}
                    toggleRelType={toggleRelType}
                />
            </Section>

            <TimelineControl 
                currentYear={year} // וודאי שזה משתמש ב-year שמגיע מה-props
                onYearChange={(newYear) => {
                    console.log("Year changed to:", newYear); // לוג לבדיקה
                    if (onYearChange) {
                        onYearChange(newYear);
                    }
                }} 
            />

            <Section title={`Families (${filteredFamilies.length})`} icon={Users} isOpen={openSections.families} onToggle={() => toggleSection('families')}>
                {Object.entries(groupedList).sort().map(([sesto, families]: [string, Family[]]) => (
                  <div key={sesto} className="mb-4 last:mb-0">
                      <div className="flex items-center gap-2 cursor-pointer hover:text-earth-orange mb-1" onClick={() => setActiveSesto(sesto === activeSesto ? null : sesto)}>
                          <span className={`text-[9px] uppercase font-bold tracking-wider ${activeSesto === sesto ? 'text-earth-orange' : 'text-ink-light'}`}>{sesto}</span>
                          <div className="h-[1px] bg-ink/10 flex-1" />
                      </div>
                      <div className="space-y-0.5 pl-2 border-l border-ink/10 ml-1">
                          {(() => {
                              const uniqueFamiliesMap = new Map<string, Family[]>();
                              families.forEach(f => {
                                  if (!uniqueFamiliesMap.has(f.name)) { uniqueFamiliesMap.set(f.name, []); }
                                  uniqueFamiliesMap.get(f.name)!.push(f);
                              });
                              const sortedUniqueNames = Array.from(uniqueFamiliesMap.keys()).sort();

                              return sortedUniqueNames.map(name => {
                                  const siblings = uniqueFamiliesMap.get(name)!;
                                  const representative = siblings[0];
                                  const isSelectedGroup = selectedFamily && selectedFamily.name === name;

                                  return (
                                     <button
                                        key={representative.id}
                                        ref={el => { siblings.forEach(s => { familyListRefs.current[s.id] = el; }); }}
                                        onClick={() => {
                                            selectionSourceRef.current = 'list';
                                            onSelectFamily(representative);
                                        }}
                                        onDoubleClick={() => handleFamilyDoubleClick(representative)}
                                        onMouseEnter={() => setHoveredFamilyId(representative.id)}
                                        onMouseLeave={() => setHoveredFamilyId(null)}
                                        className={`w-full text-left px-2 py-1 rounded text-xs font-serif hover:bg-ink/5 flex items-center gap-2 ${isSelectedGroup ? 'bg-earth-orange/10 text-earth-orange font-bold border-l-2 border-earth-orange' : 'text-ink'}`}
                                        title="Double click to zoom/cycle locations"
                                      >
                                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: colorMode === 'guild' ? getGuildColor(representative.guild as string) : '#8B4513' }} />
                                      <span className="truncate">{representative.name} {siblings.length > 1 && `(${siblings.length})`}</span>
                                      </button>
                                  );
                              });
                          })()}
                      </div>
                  </div>
                ))}
            </Section>
         </div>
      </div>

      {/* MAP AREA */}
      <div className="flex-1 relative bg-[#E6DCCF] flex">
        <div className="flex-1 relative h-full">
            <MapContainer 
                center={florenceCenter} zoom={15} minZoom={13} maxZoom={22}
                style={{ height: "100%", width: "100%" }}
                ref={setMapInstance}
            >
                <MapClickEvent 
                    onDeselect={() => {
                        setActiveCoordinates(null); 
                        onSelectFamily(null);
                    }}
                    setSource={(src: any) => selectionSourceRef.current = src} 
                />

                <TileLayer attribution={BASE_MAPS[baseLayerKey].attribution} url={BASE_MAPS[baseLayerKey].url} maxZoom={22} maxNativeZoom={19} />
                
                {showHistoricalMap && (
                    <TileLayer url="https://tiles.arcgis.com/tiles/9NvE8jKNWWlDGsUJ/arcgis/rest/services/BuonsignoriGeoRef2016/MapServer/tile/{z}/{y}/{x}" attribution='Georeferencing by Colin Rose' opacity={mapOpacity} zIndex={10} maxZoom={22} maxNativeZoom={20} />
                )}

                <DistrictsLayer 
                    currentYear={currentYear} 
                    show={showDistricts} 
                    onSelectDistrict={(d: DistrictPolygon) => {
                        if (selectedDistrict && selectedDistrict.id === d.id) {
                            setSelectedDistrict(null);
                        } else {
                            setSelectedDistrict(d);
                        }
                        onSelectFamily(null);
                        setActiveCoordinates(null);
                    }} 
                />

                <ConnectionsLayer 
                    data={familiesForConnections} 
                    activeRelTypes={activeRelTypes} 
                    selectedFamilyId={selectedFamilyId} 
                />

                {showPins && filteredFamilies.map((family: Family) => {
                    if (!family.coordinates) return null;
                    
                    const isSelected = selectedFamily && family.name === selectedFamily.name;
                    const isHighlighted = isSelected || hoveredFamilyId === family.id;
                    
                    let dotColor = '#8B4513'; 
                    if (colorMode === 'guild') dotColor = getGuildColor(family.guild as string);
                    else {
                        if (family.originalFaction === 'Ghibelline') dotColor = '#F2E8C9'; 
                        if (family.originalFaction === 'Guelf') dotColor = '#478989'; 
                    }

                    if (isSelected) {
                        dotColor = '#D2691E'; 
                    }

                    return (
                        <Marker 
                            key={family.id} 
                            position={[family.coordinates.x, family.coordinates.y]}
                            icon={createCustomIcon(dotColor, isHighlighted)}
                            eventHandlers={{
                                click: (e) => { 
                                    L.DomEvent.stopPropagation(e as any); 
                                    selectionSourceRef.current = 'map'; 
                                    onSelectFamily(family); 
                                },
                                mouseover: () => setHoveredFamilyId(family.id),
                                mouseout: () => setHoveredFamilyId(null)
                            }}
                            zIndexOffset={isHighlighted ? 10000 : 100} 
                            opacity={isHighlighted ? 1 : 0.85}
                        >
                            {isHighlighted && (
                                <Popup offset={[0, -10]} closeButton={false} autoPan={false} className="custom-popup">
                                    <div className="text-center font-serif px-2 py-1 bg-parchment border border-ink/40 shadow-xl rounded-sm">
                                        <h3 className="font-bold text-xs text-ink uppercase tracking-widest m-0">{family.name}</h3>
                                    </div>
                                </Popup>
                            )}
                        </Marker>
                    );
                })}

            </MapContainer>
        </div>

        {/* RIGHT SIDEBAR - הוחלף ברכיב הנקי */}
        {selectedDistrict && (
            <MapSidebar 
                selectedDistrict={selectedDistrict}
                currentYear={currentYear}
                onClose={() => setSelectedDistrict(null)}
            />
        )}
      </div>
    </div>
  );
};

export default GeographicalMap;
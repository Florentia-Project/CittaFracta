import React, { useState, useMemo, useEffect, useRef } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMapEvents, Polygon, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// --- Components ---
import ConnectionsLayer from './components/ConnectionsLayer';
import FiltersControl from './components/FiltersControl';
import { LeftSidebar } from './components/LeftSidebar';
import { DistrictsSidebar } from './components/DistrictsSidebar';
import TimelineControl from '../social-map/components/TimelineControl';

// --- Utilities ---
import { getGuildColor, createCustomIcon } from './utils/mapStyles';
import { CHRONICLE_YEARS, BASE_MAPS, DEFAULT_OPEN_SECTIONS } from './utils/constants';
import { FLORENCE_CENTER } from './utils/mapConfig';

// --- Hooks ---
import { useMapState } from './hooks/useMapState';
import { useFilteredFamilies } from './hooks/useFilteredFamilies';
import { useFamilySelection } from './hooks/useFamilySelection';

// --- Types & Data ---
import { Family } from '../../types'; 
import { SESTI_DATA, QUARTIERI_DATA, DistrictPolygon } from '../../data/districts';

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

// --- Extracted Components ---
// --- Single District Polygon Component ---
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

// --- Map Click Handler ---

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

// --- MAIN COMPONENT ---
export const GeographicalMap: React.FC<GeographicalMapProps> = ({ 
  data, year, onYearChange, onSelectFamily, selectedFamilyId
}) => {
  // Use custom hooks for state management
  const {
    mapInstance,
    setMapInstance,
    activeSestos,
    toggleSesto,
    searchTerm,
    setSearchTerm,
    hoveredFamilyId,
    setHoveredFamilyId,
    selectedDistrict,
    setSelectedDistrict,
    activeCoordinates,
    setActiveCoordinates,
    activeRelTypes,
    toggleRelType,
    colorMode,
    setColorMode,
    baseLayerKey,
    setBaseLayerKey,
    showHistoricalMap,
    setShowHistoricalMap,
    mapOpacity,
    setMapOpacity,
    showDistricts,
    setShowDistricts,
    openSections,
    toggleSection,
  } = useMapState(DEFAULT_OPEN_SECTIONS);

  // Use filtering hook
  const { filteredFamilies, groupedList } = useFilteredFamilies(
    data,
    searchTerm,
    activeSestos,
    year
  );

  // Use selection hook
  const { 
    handleFamilyDoubleClick, 
    familyListRefs, 
    selectionSourceRef 
  } = useFamilySelection(data, filteredFamilies, mapInstance, onSelectFamily);

  // Connection logic
  const familiesForConnections = useMemo(() => {
      if (!data) return [];
      return data.filter(family => {
          const startRaw = family.yearStart || family['Year Start'];
          const endRaw = family.yearEnd || family['Year End'];
          const startYear = parseInt(startRaw as string) || 0;
          const endYear = parseInt(endRaw as string) || 9999;
          return year >= startYear && year <= endYear;
      });
  }, [data, year]);

  // Selection logic
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

  // Effect: scroll selected family into view
  useEffect(() => {
    if (!selectedFamilyId) setActiveCoordinates(null);
    if (selectedFamilyId && familyListRefs?.current && familyListRefs.current[selectedFamilyId] && selectionSourceRef?.current === 'map') {
        familyListRefs.current[selectedFamilyId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        selectionSourceRef.current = null;
    }
  }, [selectedFamilyId, familyListRefs, selectionSourceRef]);

  // 5. RENDER
  return (
    <div className="flex h-full w-full bg-parchment overflow-hidden relative">
      
      {/* LEFT SIDEBAR */}
      <LeftSidebar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        baseLayerKey={baseLayerKey}
        setBaseLayerKey={setBaseLayerKey}
        showHistoricalMap={showHistoricalMap}
        setShowHistoricalMap={setShowHistoricalMap}
        mapOpacity={mapOpacity}
        setMapOpacity={setMapOpacity}
        showDistricts={showDistricts}
        setShowDistricts={setShowDistricts}
        colorMode={colorMode}
        setColorMode={setColorMode}
        activeRelTypes={activeRelTypes}
        toggleRelType={toggleRelType}
        currentYear={year}
        onYearChange={onYearChange || (() => {})}
        groupedList={groupedList}
        activeSestos={activeSestos}
        toggleSesto={toggleSesto}
        onFamilyDoubleClick={handleFamilyDoubleClick}
        familyListRefs={familyListRefs}
        selectedFamilyId={selectedFamilyId}
        onFamilySelect={(family) => {
          selectionSourceRef.current = 'list';
          setSelectedDistrict(null);
          onSelectFamily(family);
        }}
        selectedFamilyName={selectedFamily?.name}
        openSections={openSections}
        toggleSection={toggleSection}
      />

      {/* MAP AREA */}
      <div className="flex-1 relative bg-[#E6DCCF] flex">
        <div className="flex-1 relative h-full">
            <MapContainer 
                center={FLORENCE_CENTER} zoom={15} minZoom={13} maxZoom={22}
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
                    currentYear={year} 
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

                {filteredFamilies.map((family: Family) => {
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
                                    setSelectedDistrict(null);
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

        {/* RIGHT SIDEBAR - Districts Details */}
        {selectedDistrict && (
            <DistrictsSidebar 
                selectedDistrict={selectedDistrict}
                currentYear={year}
                onClose={() => setSelectedDistrict(null)}
            />
        )}
      </div>
    </div>
  );
};

export default GeographicalMap;
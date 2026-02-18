// src/App.tsx
import React, { useState } from 'react';
import { SESTI_LIST } from './constants';
import { Family, HistoricalEvent } from './types';
import HistoricalMap from './features/social-map/HistoricalMap';
import GeographicalMap from './features/geo-map/GeographicalMap';
import ChronicleModal from './features/chronicle/components/ChronicleModal';
import { calculateFamilyState } from './features/social-map/logic/engine';
import { Play, Pause, ChevronRight, ChevronLeft, X, MapPin, Edit3, Save, BookOpen, Plus, Check, Users, Keyboard } from 'lucide-react';
import { getFamilyDistrict } from './utils/districtUtils'; 

// --- Custom Hooks ---
import { useTimeline } from './hooks/useTimeline';
import { useHistoricalData } from './hooks/useHistoricalData';

const App: React.FC = () => {
  // --- 1. Historical Data Hook ---
  const { data, setData, events, setEvents, isLoading } = useHistoricalData();

  // --- 2. Local UI State ---
  const [activeTab, setActiveTab] = useState<'map' | 'city'>('map'); 
  const [selectedFamily, setSelectedFamily] = useState<Family | null>(null);
  
  // Edit Mode State 
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Family>>({});

  // Chronicle System State
  const [isChronicleOpen, setIsChronicleOpen] = useState(false);
  const [isEditingEvent, setIsEditingEvent] = useState(false);
  const [eventForm, setEventForm] = useState<Partial<HistoricalEvent>>({});

  // --- 3. Timeline Hook ---
  // Enable keyboard shortcuts ONLY when viewing the political map
  const isKeyboardEnabled = activeTab === 'map';
  const { currentYear, setCurrentYear, isPlaying, setIsPlaying, jumpToEvent } = useTimeline(events, isKeyboardEnabled);
  
  // --- 4. Handlers & Helpers ---
  const activeEvent = events.find(e => e.year === currentYear);

  const handleSelectFamily = (family: Family | null) => {
      if (isEditing) {
          if (confirm("You have unsaved changes. Discard them?")) {
              setIsEditing(false);
              setEditForm({});
          } else {
              return;
          }
      }
      setSelectedFamily(family);
  };

  const startEdit = () => {
      if (!selectedFamily) return;
      setEditForm({ ...selectedFamily });
      setIsEditing(true);
  };

  const saveEdit = () => {
      if (!selectedFamily) return;
      const updatedFamily = { ...selectedFamily, ...editForm } as Family;
      const newData = data.map(f => f.id === updatedFamily.id ? updatedFamily : f);
      setData(newData);
      setSelectedFamily(updatedFamily);
      setIsEditing(false);
      setEditForm({});
  };

  const cancelEdit = () => {
      setIsEditing(false);
      setEditForm({});
  };

  const handleMapClick = (x: number, y: number) => {
      setEditForm(prev => ({
          ...prev,
          coordinates: { x, y }
      }));
  };

  // --- Event Editing Logic ---
  const startEventEdit = () => {
      if (activeEvent) {
          setEventForm({ ...activeEvent });
      } else {
          setEventForm({
              year: currentYear,
              title: '',
              shortDescription: '',
              fullDescription: '',
              sources: []
          });
      }
      setIsEditingEvent(true);
  };

  const saveEventEdit = () => {
      if (!eventForm.title) return; 
      
      const newEvent = { 
          ...eventForm, 
          year: currentYear,
          sources: Array.isArray(eventForm.sources) 
            ? eventForm.sources 
            : (typeof eventForm.sources === 'string' 
                ? (eventForm.sources as string).split(',').map(s => ({ title: s.trim(), quote: '' })) 
                : [])
      } as HistoricalEvent;

      const exists = events.some(e => e.year === currentYear);
      let newEvents;
      if (exists) {
          newEvents = events.map(e => e.year === currentYear ? newEvent : e);
      } else {
          newEvents = [...events, newEvent];
      }
      
      setEvents(newEvents);
      setIsEditingEvent(false);
      setEventForm({});
  };

  const currentState = selectedFamily ? calculateFamilyState(selectedFamily, currentYear) : null;

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center bg-parchment text-ink font-display text-2xl">Loading Historical Records...</div>;
  }

  // --- 5. RENDER ---
  return (
    <div className="h-screen bg-parchment flex flex-col font-sans overflow-hidden text-ink relative selection:bg-earth-orange/20">
      <div className="absolute inset-0 paper-texture z-50 pointer-events-none"></div>

      {/* Header */}
      <header className="pt-4 pb-2 px-8 flex justify-between items-end shrink-0 z-40 relative border-b border-ink/40 mx-6">
        <div className="pb-2">
          <h1 className="text-2xl font-display font-bold tracking-[0.15em] uppercase text-ink">Florentine Factions</h1>
          <p className="text-[10px] font-serif italic text-ink-light mt-0.5 tracking-wider">Historical Analysis (1215-1450)</p>
        </div>
        <div className="flex gap-6 text-[10px] font-sans font-bold tracking-widest uppercase mb-2">
          <button
            onClick={() => setActiveTab('map')}
            className={`flex items-center gap-2 transition-all pb-1 border-b ${activeTab === 'map' ? 'border-earth-orange text-earth-orange' : 'border-transparent text-ink-light hover:text-ink'}`}
          >
            <Users size={12} /> Visualization
          </button>
          <button
            onClick={() => setActiveTab('city')}
            className={`flex items-center gap-2 transition-all pb-1 border-b ${activeTab === 'city' ? 'border-earth-orange text-earth-orange' : 'border-transparent text-ink-light hover:text-ink'}`}
          >
            <MapPin size={12} /> City Map
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 relative z-0">
        
        <div className="flex-1 flex flex-col relative overflow-hidden flex-row">
           
           {activeTab === 'city' && (
              <div className="h-full w-full relative z-10">
                 <GeographicalMap 
                    data={data} 
                    onSelectFamily={handleSelectFamily}
                    selectedFamilyId={selectedFamily?.id}
                    isEditing={isEditing}
                    onCoordinatesChange={handleMapClick}
                    tempFamily={editForm}
                    year={currentYear}
                    onYearChange={setCurrentYear} 
                 />
              </div>
           )}

           {activeTab === 'map' && (
             <div className="flex-1 relative h-full flex">
                <div className="flex-1 relative h-full">
                    <HistoricalMap 
                        data={data} 
                        year={currentYear} 
                        onSelectFamily={handleSelectFamily}
                        selectedFamilyId={selectedFamily?.id}
                    />
                </div>

                <div className="w-48 border-l border-ink/10 bg-parchment p-6 flex flex-col items-end shrink-0 z-20 relative shadow-sm">
                     <div className="pointer-events-none mb-6 text-right">
                         <span className="block text-[10px] font-sans uppercase tracking-[0.2em] text-ink-light mb-1">Anno Domini</span>
                         <span className="block text-4xl font-display text-ink font-bold">{currentYear}</span>
                     </div>

                     <button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="flex items-center gap-2 px-4 py-1.5 border border-ink/20 rounded-full hover:bg-ink hover:text-parchment transition-all group bg-parchment/80 backdrop-blur shadow-sm mb-6"
                    >
                        {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                        <span className="text-[10px] uppercase tracking-widest font-bold">{isPlaying ? 'Pause' : 'Play'}</span>
                    </button>
                     
                     <div className="w-full text-right border-t border-ink/20 pt-4 animate-fade-in relative group/widget">
                         {!isEditingEvent && (
                             <button 
                                onClick={startEventEdit}
                                className="absolute top-4 left-0 text-ink-light hover:text-earth-orange opacity-0 group-hover/widget:opacity-100 transition-opacity"
                                title={activeEvent ? "Edit Event" : "Create Event"}
                             >
                                 <Edit3 size={12} />
                             </button>
                         )}

                         <span className="text-[9px] font-bold text-earth-orange uppercase tracking-wider block mb-2">Chronicle</span>
                         
                         {isEditingEvent ? (
                             <div className="flex flex-col gap-2 text-right">
                                 <span className="text-[9px] font-bold text-ink-light uppercase tracking-widest mb-1">
                                    Editing Entry ({currentYear})
                                 </span>
                                 <input 
                                    type="text" 
                                    placeholder="Title" 
                                    className="w-full bg-parchment-dark/30 border-b border-earth-orange text-sm font-display font-bold text-ink text-right outline-none p-1"
                                    value={eventForm.title || ''}
                                    onChange={e => setEventForm(p => ({...p, title: e.target.value}))}
                                 />
                                 <textarea 
                                    placeholder="Short Description" 
                                    className="w-full bg-parchment-dark/30 border-b border-ink/20 text-xs font-serif italic text-ink-light text-right outline-none p-1 h-16 resize-none"
                                    value={eventForm.shortDescription || ''}
                                    onChange={e => setEventForm(p => ({...p, shortDescription: e.target.value}))}
                                 />
                                 <textarea 
                                    placeholder="Full Text" 
                                    className="w-full bg-parchment-dark/30 border-b border-ink/20 text-[10px] font-serif text-ink text-right outline-none p-1 h-20 resize-none"
                                    value={eventForm.fullDescription || ''}
                                    onChange={e => setEventForm(p => ({...p, fullDescription: e.target.value}))}
                                 />
                                 <div className="flex justify-end gap-2 mt-2">
                                     <button onClick={saveEventEdit} className="p-1 bg-green-100 text-green-800 rounded hover:bg-green-200"><Check size={14} /></button>
                                     <button onClick={() => setIsEditingEvent(false)} className="p-1 bg-red-100 text-red-800 rounded hover:bg-red-200"><X size={14} /></button>
                                 </div>
                             </div>
                         ) : (
                             activeEvent ? (
                                <>
                                    <h3 className="text-lg font-display font-bold text-ink leading-tight mb-2">{activeEvent.title}</h3>
                                    <p className="text-xs font-serif italic text-ink-light leading-snug mb-3 line-clamp-3">{activeEvent.shortDescription}</p>
                                    
                                    <button 
                                        onClick={() => setIsChronicleOpen(true)}
                                        className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-ink hover:text-earth-orange transition-colors border-b border-transparent hover:border-earth-orange pb-0.5"
                                    >
                                        <span>Read Chronicle</span>
                                        <BookOpen size={12} />
                                    </button>
                                </>
                             ) : (
                                 <div className="text-ink-light/40 text-xs italic py-2 flex flex-col items-end gap-2">
                                     <span>No record for {currentYear}.</span>
                                     <button onClick={startEventEdit} className="flex items-center gap-1 text-[10px] uppercase font-bold text-ink hover:text-earth-orange">
                                         Create <Plus size={10} />
                                     </button>
                                 </div>
                             )
                         )}
                     </div>
                    <div className="mt-auto w-full pt-6 border-t border-ink/10 text-right opacity-40 hover:opacity-100 transition-opacity duration-300">
                         <div className="flex items-center justify-end gap-1.5 mb-3 text-ink-light">
                             <span className="text-[9px] uppercase font-bold tracking-widest">Controls</span>
                             <Keyboard size={12} />
                         </div>
                         
                         <div className="flex flex-col gap-2.5">
                             <div className="flex items-center justify-end gap-2">
                                 <span className="text-[10px] font-serif text-ink italic">Play / Pause</span>
                                 <kbd className="px-1.5 py-0.5 bg-ink/5 border border-ink/10 rounded text-[9px] font-sans text-ink font-bold shadow-sm">Space</kbd>
                             </div>
                             <div className="flex items-center justify-end gap-2">
                                 <span className="text-[10px] font-serif text-ink italic">Change Year</span>
                                 <div className="flex gap-0.5">
                                     <kbd className="px-1.5 py-0.5 bg-ink/5 border border-ink/10 rounded text-[9px] font-sans text-ink font-bold shadow-sm">←</kbd>
                                     <kbd className="px-1.5 py-0.5 bg-ink/5 border border-ink/10 rounded text-[9px] font-sans text-ink font-bold shadow-sm">→</kbd>
                                 </div>
                             </div>
                             <div className="flex items-center justify-end gap-2">
                                 <span className="text-[10px] font-serif text-ink italic">Jump to Event</span>
                                 <div className="flex items-center gap-1">
                                     <kbd className="px-1.5 py-0.5 bg-ink/5 border border-ink/10 rounded text-[9px] font-sans text-ink font-bold shadow-sm">Shift</kbd>
                                     <span className="text-[8px] text-ink-light">+</span>
                                     <kbd className="px-1.5 py-0.5 bg-ink/5 border border-ink/10 rounded text-[9px] font-sans text-ink font-bold shadow-sm">← / →</kbd>
                                 </div>
                             </div>
                         </div>
                     </div>
                </div>
            </div>
           )}
           
           <div className={`absolute top-0 right-0 bottom-0 w-80 bg-parchment border-l border-ink/20 shadow-[-5px_0_15px_-5px_rgba(0,0,0,0.1)] transition-transform duration-300 transform z-40 ${selectedFamily ? 'translate-x-0' : 'translate-x-full'}`}>
                {selectedFamily && currentState && (
                    <div className="h-full flex flex-col p-6 overflow-y-auto">
                        <div className="flex justify-between items-start mb-6">
                            <h2 className="text-xl font-display font-bold text-ink">{selectedFamily.name}</h2>
                            <div className="flex gap-2">
                                {!isEditing ? (
                                    <button onClick={startEdit} className="text-ink-light hover:text-earth-orange p-1 rounded hover:bg-ink/5" title="Edit Location & Details">
                                        <Edit3 size={16} />
                                    </button>
                                ) : (
                                    <div className="flex gap-2">
                                        <button onClick={saveEdit} className="text-green-700 hover:text-green-900 bg-green-100 p-1 rounded" title="Save Changes">
                                            <Save size={16} />
                                        </button>
                                        <button onClick={cancelEdit} className="text-red-700 hover:text-red-900 bg-red-100 p-1 rounded" title="Cancel">
                                            <X size={16} />
                                        </button>
                                    </div>
                                )}
                                <button onClick={() => handleSelectFamily(null)} className="text-ink-light hover:text-ink p-1">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {selectedFamily.coatOfArmsUrl && (
                            <div className="w-full h-32 mb-6 p-4 border border-ink/10 bg-parchment-dark/10 rounded flex items-center justify-center">
                                <img src={selectedFamily.coatOfArmsUrl} alt={`${selectedFamily.name} Coat of Arms`} referrerPolicy="no-referrer" className="h-full object-contain mix-blend-multiply" />
                            </div>
                        )}

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-[10px] font-sans font-bold uppercase tracking-widest text-ink-light mb-1">Current Status ({currentYear})</h3>
                                <div className="flex flex-wrap gap-2">
                                    <span className={`px-2 py-1 border border-ink/20 text-xs font-serif ${currentState.isExiled ? 'bg-earth-orange text-parchment border-earth-orange' : 'bg-parchment-dark/30 text-ink'}`}>
                                        {currentState.isExiled ? 'Exiled' : currentState.currentStatusLabel}
                                    </span>
                                    <span className={`px-2 py-1 border border-ink/20 text-xs font-serif bg-parchment-dark/30 text-ink`}>
                                        {currentState.currentFactionLabel}
                                    </span>
                                </div>
                            </div>

                            <div className="border-t border-ink/10 pt-4">
                                <h3 className="text-[10px] font-sans font-bold uppercase tracking-widest text-ink-light mb-2">Origins & Locations</h3>
                                <div className="grid grid-cols-1 gap-3 text-sm font-serif">
                                    {isEditing ? (
                                        <div className="bg-ink/5 p-3 rounded border border-ink/10 space-y-3">
                                            <div>
                                                <label className="block text-[10px] uppercase font-bold text-ink-light mb-1">Sesto (District)</label>
                                                <select value={editForm.sesto || ''} onChange={(e) => setEditForm(prev => ({ ...prev, sesto: e.target.value }))} className="w-full bg-parchment border border-ink/20 rounded px-2 py-1 text-sm font-serif focus:outline-none focus:border-earth-orange">
                                                    <option value="">Unknown Location</option>
                                                    {SESTI_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] uppercase font-bold text-ink-light mb-1">Coordinates</label>
                                                {editForm.coordinates ? (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-mono text-ink bg-parchment px-2 py-1 rounded border border-ink/10">{editForm.coordinates.x.toFixed(1)}%, {editForm.coordinates.y.toFixed(1)}%</span>
                                                        <span className="text-[10px] text-earth-orange italic">Pin Placed</span>
                                                    </div>
                                                ) : <span className="text-xs text-ink-light italic">Click map to set pin...</span>}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <span className="block text-ink-light text-xs italic">District ({currentYear < 1343 ? 'Sesto' : 'Quartiere'})</span>
                                                <span className="text-ink">{getFamilyDistrict(selectedFamily, currentYear)}</span>
                                            </div>
                                            <div>
                                                <span className="block text-ink-light text-xs italic">Coordinates</span>
                                                <span className="text-ink">{selectedFamily.coordinates ? 'Mapped' : 'Unmapped'}</span>
                                            </div>
                                            <div>
                                                <span className="block text-ink-light text-xs italic">Original Faction</span>
                                                <span className="text-ink">{selectedFamily.originalFaction}</span>
                                            </div>
                                            <div>
                                                <span className="block text-ink-light text-xs italic">Original Status</span>
                                                <span className="text-ink">{selectedFamily.originalStatus}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {selectedFamily.noticeablePeople && (
                                <div className="border-t border-ink/10 pt-4">
                                    <h3 className="text-[10px] font-sans font-bold uppercase tracking-widest text-ink-light mb-1">Noticeable People</h3>
                                    <p className="text-sm font-serif text-ink">{selectedFamily.noticeablePeople}</p>
                                </div>
                            )}

                            {(selectedFamily.occupation || selectedFamily.propertyType) && (
                                <div className="border-t border-ink/10 pt-4">
                                    <h3 className="text-[10px] font-sans font-bold uppercase tracking-widest text-ink-light mb-1">Economy</h3>
                                    {selectedFamily.occupation && <p className="text-sm font-serif text-ink mb-1"><span className="italic text-ink-light">Occupation:</span> {selectedFamily.occupation}</p>}
                                    {selectedFamily.propertyType && <p className="text-sm font-serif text-ink"><span className="italic text-ink-light">Property:</span> {selectedFamily.propertyType}</p>}
                                </div>
                            )}

                            {(selectedFamily.originalSourceTerm || selectedFamily.sourceCitation) && (
                                <div className="border-t border-ink/10 pt-4">
                                    <h3 className="text-[10px] font-sans font-bold uppercase tracking-widest text-ink-light mb-1">Sources</h3>
                                    <p className="text-xs font-serif text-ink-light italic">{selectedFamily.originalSourceTerm}</p>
                                    {selectedFamily.sourceCitation && <p className="text-[10px] text-ink-light mt-1">Ref: {selectedFamily.sourceCitation}</p>}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>

        {activeTab === 'map' && (
            <div className="bg-parchment pb-6 pt-2 px-12 shrink-0 z-30 relative">
                <div className="max-w-6xl mx-auto w-full relative flex items-center gap-8">
                    <div className="relative h-12 flex items-center flex-1">
                        <div className="absolute w-full h-[1px] bg-ink/30"></div>
                        {events
                            .filter((event) => event.year <= 1302) /* מסנן אירועים עתידיים כדי שלא יופיעו על הקו */
                            .map((event) => {
                             const position = ((event.year - 1215) / (1302 - 1215)) * 100; /* שינינו מ-1450 ל-1302 */
                             const isPast = currentYear >= event.year;
                             const isCurrent = currentYear === event.year;
                             
                             return (
                                 <div key={event.year} className="absolute transform -translate-x-1/2 flex flex-col items-center group cursor-pointer" style={{ left: `${position}%` }} onClick={() => setCurrentYear(event.year)}>
                                     <div className={`w-2.5 h-2.5 rotate-45 border transition-all duration-300 z-10 ${isPast ? 'bg-ink border-ink' : 'bg-parchment border-ink/40 group-hover:border-ink'}`} />
                                     <span className={`absolute top-5 text-[9px] font-bold font-sans text-ink uppercase tracking-wider transition-opacity duration-300 whitespace-nowrap ${isCurrent ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'}`}>
                                         {event.year}
                                     </span>
                                  </div>
                             )
                        })}
                         <div className="absolute w-4 h-4 bg-parchment border-[2px] border-earth-orange rounded-full shadow-sm pointer-events-none z-20 transform -translate-x-1/2 transition-all duration-300 ease-out flex items-center justify-center" style={{ left: `${((currentYear - 1215) / (1302 - 1215)) * 100}%` }}> {/* שינינו מ-1450 ל-1302 */}
                            <div className="w-1.5 h-1.5 bg-earth-orange rounded-full"></div>
                        </div>
                        <input type="range" min={1215} max={1302} value={currentYear} onChange={(e) => setCurrentYear(Number(e.target.value))} className="w-full h-12 opacity-0 cursor-pointer absolute z-30" /> {/* המקסימום של הסליידר שונה ל-1302 */}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => jumpToEvent('prev')} className="text-ink-light hover:text-ink flex items-center justify-center w-8 h-8 rounded-full border border-ink/20 hover:bg-ink/5 transition-colors group" title="Previous Event">
                           <ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> 
                        </button>
                         <button onClick={() => jumpToEvent('next')} className="text-ink-light hover:text-ink flex items-center justify-center w-8 h-8 rounded-full border border-ink/20 hover:bg-ink/5 transition-colors group" title="Next Event">
                           <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        )}
      </main>

      {isChronicleOpen && activeEvent && <ChronicleModal event={activeEvent} onClose={() => setIsChronicleOpen(false)} />}
    </div>
  );
};

export default App;
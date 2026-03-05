// src/App.tsx
import React, { useState } from 'react';
import { Family, HistoricalEvent } from './types';
import ChronicleModal from './features/chronicle/components/ChronicleModal';
import { calculateFamilyState } from './features/social-map/logic/engine'; 

// --- Layout Components ---
import { Header } from './components/layout/Header';
import { TabNavigation } from './components/layout/TabNavigation';

// --- Panel Components ---
import { FamilyDetailsPanel } from './components/panels/FamilyDetailsPanel';

// --- Controls ---
import { TimelineSlider } from './components/controls/TimelineSlider';

// --- Views ---
import { CityMapView } from './features/geo-map/views/CityMapView';
import { SocialMapView } from './features/social-map/views/SocialMapView';

// --- Custom Hooks ---
import { useTimeline } from './hooks/useTimeline';
import { useHistoricalData } from './hooks/useHistoricalData';

const App: React.FC = () => {
  // --- 1. Historical Data Hook ---
  const { data, events, isLoading } = useHistoricalData();

  // --- 2. Local UI State ---
  const [activeTab, setActiveTab] = useState<'map' | 'city'>('map'); 
  const [selectedFamily, setSelectedFamily] = useState<Family | null>(null);

  // --- 3. Timeline Hook ---
  // Enable keyboard shortcuts ONLY when viewing the political map
  const isKeyboardEnabled = activeTab === 'map';
  const { currentYear, setCurrentYear, isPlaying, setIsPlaying, jumpToEvent } = useTimeline(events, isKeyboardEnabled);
  
  // --- 4. Handlers & Helpers ---
  const activeEvent = events.find(e => e.year === currentYear);
  const [isChronicleOpen, setIsChronicleOpen] = useState(false);

  const handleSelectFamily = (family: Family | null) => {
      setSelectedFamily(family);
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
        <Header />
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 relative z-0">
        
        <div className="flex-1 flex flex-col relative overflow-hidden flex-row">
           
           {activeTab === 'city' && (
              <CityMapView
                data={data}
                onSelectFamily={handleSelectFamily}
                selectedFamilyId={selectedFamily?.id}
                currentYear={currentYear}
                onYearChange={setCurrentYear}
              />
           )}

           {activeTab === 'map' && (
              <SocialMapView
                data={data}
                currentYear={currentYear}
                onSelectFamily={handleSelectFamily}
                selectedFamily={selectedFamily}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                activeEvent={activeEvent}
                onOpenChronicle={() => setIsChronicleOpen(true)}
              />
           )}
           
           <FamilyDetailsPanel
              selectedFamily={selectedFamily}
              currentState={currentState}
              currentYear={currentYear}
              onClose={() => handleSelectFamily(null)}
            />
        </div>

        {activeTab === 'map' && (
            <TimelineSlider
              currentYear={currentYear}
              setCurrentYear={setCurrentYear}
              events={events}
              jumpToEvent={jumpToEvent}
            />
        )}
      </main>

      {isChronicleOpen && activeEvent && <ChronicleModal event={activeEvent} onClose={() => setIsChronicleOpen(false)} />}
    </div>
  );
};

export default App;
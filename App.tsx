// src/App.tsx
import React, { useState, useCallback } from 'react';
import { Family, HistoricalEvent } from './types';
import ChronicleModal from './features/chronicle/components/ChronicleModal';
import { calculateFamilyState } from './features/social-map/logic/engine';

// --- Layout Components ---
import { Header } from './components/layout/Header';
import { TabNavigation } from './components/layout/TabNavigation';
import { FolioHeader } from './components/layout/FolioHeader';
import { CodexDock } from './components/layout/CodexDock';
import { YearSheet } from './components/sheets/YearSheet';

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
  const [historicalMode, setHistoricalMode] = useState(false);
  const [yearSheetOpen, setYearSheetOpen] = useState(false);
  const toggleHistoricalMode = useCallback(() => setHistoricalMode(m => !m), []);

  // --- 3. Timeline Hook ---
  // Enable keyboard shortcuts ONLY when viewing the political map
  const isKeyboardEnabled = activeTab === 'map';
  const { currentYear, setCurrentYear, isPlaying, setIsPlaying, jumpToEvent } = useTimeline(events, isKeyboardEnabled);

  // --- 4. Handlers & Helpers ---
  const activeEvent = events.find(e => e.year === currentYear);
  const [isChronicleOpen, setIsChronicleOpen] = useState(false);

  // Zoom controls — populated by HistoricalMap via onZoomReady callback
  const [mapZoomIn, setMapZoomIn] = useState<(() => void) | null>(null);
  const [mapZoomOut, setMapZoomOut] = useState<(() => void) | null>(null);
  const [mapResetZoom, setMapResetZoom] = useState<(() => void) | null>(null);
  const handleZoomReady = useCallback((zIn: () => void, zOut: () => void, reset: () => void) => {
    setMapZoomIn(() => zIn);
    setMapZoomOut(() => zOut);
    setMapResetZoom(() => reset);
  }, []);

  const handleSelectFamily = (family: Family | null) => {
      setSelectedFamily(family);
  };

  const currentState = selectedFamily ? calculateFamilyState(selectedFamily, currentYear) : null;

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-parchment select-none px-8 gap-6 text-center">
        <span
          className="text-9xl text-rubric animate-pulse"
          style={{ fontFamily: "'IM Fell English', serif", opacity: 0.18, lineHeight: 1 }}
          aria-hidden="true"
        >
          F
        </span>
        <div className="flex flex-col gap-1.5">
          <p className="font-label text-rubric text-[10px] tracking-[0.4em]">FLORENTINE ARCHIVE</p>
          <p className="font-serif text-sm text-ink-faded italic">Loading historical records…</p>
        </div>
      </div>
    );
  }

  // --- 5. RENDER ---
  return (
    <div className={`h-screen bg-parchment flex flex-col font-sans overflow-hidden text-ink relative selection:bg-earth-orange/20${historicalMode ? ' historical-mode' : ''}`}>
      <div className="absolute inset-0 paper-texture z-50 pointer-events-none"></div>

      {/* Mobile Header */}
      <FolioHeader
        activeTab={activeTab}
        isHistoricalMode={historicalMode}
        toggleHistoricalMode={toggleHistoricalMode}
      />

      {/* Desktop Header */}
      <header className="pt-3 sm:pt-4 pb-2 px-4 sm:px-8 flex justify-between items-end shrink-0 z-40 relative border-b border-ink/40 mx-3 sm:mx-6">
        <Header />
        <div className="flex items-end gap-5">
          <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
          {/* Scriptorio mode toggle */}
          <button
            onClick={() => setHistoricalMode(m => !m)}
            title={historicalMode ? 'Switch to modern view' : 'Switch to Scriptorio historical view'}
            className={`mb-2 text-[9px] font-sans font-bold tracking-widest uppercase border px-2 py-1 rounded transition-colors ${
              historicalMode
                ? 'border-amber-700/70 text-amber-800 bg-amber-700/10'
                : 'border-ink/20 text-ink-light/60 hover:border-ink/40 hover:text-ink-light'
            }`}
          >
            {historicalMode ? '☀ Modern' : '☽ Scriptorio'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 relative z-0 pb-14 sm:pb-0">

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
                onZoomReady={handleZoomReady}
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
          <div className="hidden sm:block">
            <TimelineSlider
              currentYear={currentYear}
              setCurrentYear={setCurrentYear}
              events={events}
              jumpToEvent={jumpToEvent}
              onZoomIn={mapZoomIn ?? undefined}
              onZoomOut={mapZoomOut ?? undefined}
              onResetZoom={mapResetZoom ?? undefined}
            />
          </div>
        )}
      </main>

      {isChronicleOpen && activeEvent && <ChronicleModal event={activeEvent} onClose={() => setIsChronicleOpen(false)} />}

      {/* Mobile Bottom Dock */}
      <CodexDock
        activeTab={activeTab}
        setActiveTab={(tab) => setActiveTab(tab as 'map' | 'city')}
        currentYear={currentYear}
        onYearTap={() => setYearSheetOpen(true)}
      />

      {/* Mobile Year Sheet */}
      <YearSheet
        isOpen={yearSheetOpen}
        onClose={() => setYearSheetOpen(false)}
        currentYear={currentYear}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        activeEventTitle={activeEvent?.title}
        onPrevEvent={() => jumpToEvent('prev')}
        onNextEvent={() => jumpToEvent('next')}
        timelineSlider={
          <TimelineSlider
            currentYear={currentYear}
            setCurrentYear={setCurrentYear}
            events={events}
            jumpToEvent={jumpToEvent}
          />
        }
      />
    </div>
  );
};

export default App;

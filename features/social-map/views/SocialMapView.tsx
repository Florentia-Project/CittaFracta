import React from 'react';
import { Family, HistoricalEvent } from '../../../types';
import HistoricalMap from '../HistoricalMap';
import { TimelinePanel } from '../../../components/panels/TimelinePanel';
import { MobileFactionGrid } from '../components/MobileFactionGrid';

interface SocialMapViewProps {
  data: Family[];
  currentYear: number;
  onSelectFamily: (family: Family | null) => void;
  selectedFamily: Family | null;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  activeEvent: HistoricalEvent | undefined;
  onOpenChronicle: () => void;
  onZoomReady?: (zoomIn: () => void, zoomOut: () => void, resetZoom: () => void) => void;
  isHistoricalMode?: boolean;
}

export const SocialMapView: React.FC<SocialMapViewProps> = ({
  data,
  currentYear,
  onSelectFamily,
  selectedFamily,
  isPlaying,
  setIsPlaying,
  activeEvent,
  onOpenChronicle,
  onZoomReady,
  isHistoricalMode = false,
}) => {
  return (
    <div className="flex-1 relative h-full flex flex-col sm:flex-row">

      {/* Mobile: scrollable HTML grid — hidden on desktop */}
      <MobileFactionGrid
        data={data}
        year={currentYear}
        onSelectFamily={(f) => onSelectFamily(f)}
        selectedFamilyId={selectedFamily?.id}
      />

      {/* Desktop: pan/zoom SVG canvas — hidden on mobile */}
      <div className="hidden sm:flex flex-1 relative min-h-0">
        <HistoricalMap
          data={data}
          year={currentYear}
          onSelectFamily={onSelectFamily}
          selectedFamilyId={selectedFamily?.id}
          onZoomReady={onZoomReady}
          isHistoricalMode={isHistoricalMode}
        />
      </div>

      {/* Timeline panel — hidden on mobile */}
      <div className="hidden sm:flex">
        <TimelinePanel
          currentYear={currentYear}
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying(!isPlaying)}
          activeEvent={activeEvent}
          onOpenChronicle={onOpenChronicle}
        />
      </div>

    </div>
  );
};

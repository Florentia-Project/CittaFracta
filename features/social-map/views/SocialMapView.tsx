import React from 'react';
import { Family, HistoricalEvent } from '../../../types';
import HistoricalMap from '../HistoricalMap';
import { TimelinePanel } from '../../../components/panels/TimelinePanel';

interface SocialMapViewProps {
  data: Family[];
  currentYear: number;
  onSelectFamily: (family: Family | null) => void;
  selectedFamily: Family | null;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  activeEvent: HistoricalEvent | undefined;
  onOpenChronicle: () => void;
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
}) => {
  return (
    <div className="flex-1 relative h-full flex flex-col sm:flex-row">
      <div className="flex-1 relative min-h-0">
        <HistoricalMap
          data={data}
          year={currentYear}
          onSelectFamily={onSelectFamily}
          selectedFamilyId={selectedFamily?.id}
        />
      </div>

      <TimelinePanel
        currentYear={currentYear}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        activeEvent={activeEvent}
        onOpenChronicle={onOpenChronicle}
      />
    </div>
  );
};

import React from 'react';
import { HistoricalEvent } from '../../types';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize } from 'lucide-react';

interface TimelineSliderProps {
  currentYear: number;
  setCurrentYear: (year: number) => void;
  events: HistoricalEvent[];
  jumpToEvent: (direction: 'prev' | 'next') => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetZoom?: () => void;
}

export const TimelineSlider: React.FC<TimelineSliderProps> = ({
  currentYear,
  setCurrentYear,
  events,
  jumpToEvent,
  onZoomIn,
  onZoomOut,
  onResetZoom,
}) => {
  return (
    <div className="bg-parchment pb-4 sm:pb-6 pt-2 px-4 sm:px-12 shrink-0 z-30 relative">
      <div className="max-w-6xl mx-auto w-full relative flex items-center gap-4 sm:gap-8">

        {/* Zoom controls — left of track */}
        {(onZoomIn || onZoomOut || onResetZoom) && (
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={onZoomIn}
              title="Zoom in"
              className="text-ink-light hover:text-ink flex items-center justify-center w-7 h-7 rounded-full border border-ink/20 hover:bg-ink/5 transition-colors"
            >
              <ZoomIn size={12} />
            </button>
            <button
              onClick={onZoomOut}
              title="Zoom out"
              className="text-ink-light hover:text-ink flex items-center justify-center w-7 h-7 rounded-full border border-ink/20 hover:bg-ink/5 transition-colors"
            >
              <ZoomOut size={12} />
            </button>
            <button
              onClick={onResetZoom}
              title="Reset view"
              className="text-ink-light hover:text-ink flex items-center justify-center w-7 h-7 rounded-full border border-ink/20 hover:bg-ink/5 transition-colors"
            >
              <Maximize size={12} />
            </button>
          </div>
        )}

        <div className="relative h-12 flex items-center flex-1">
          <div className="absolute w-full h-[1px] bg-ink/30"></div>
          {events
            .filter((event) => event.year <= 1302)
            .map((event) => {
              const position = ((event.year - 1215) / (1302 - 1215)) * 100;
              const isPast = currentYear >= event.year;
              const isCurrent = currentYear === event.year;

              return (
                <div
                  key={event.year}
                  className="absolute transform -translate-x-1/2 flex flex-col items-center group cursor-pointer"
                  style={{ left: `${position}%` }}
                  onClick={() => setCurrentYear(event.year)}
                >
                  <div
                    className={`w-2.5 h-2.5 rotate-45 border transition-all duration-300 z-10 ${
                      isPast
                        ? 'bg-ink border-ink'
                        : 'bg-parchment border-ink/40 group-hover:border-ink'
                    }`}
                  />
                  <span
                    className={`absolute top-5 text-[9px] font-bold font-sans text-ink uppercase tracking-wider transition-opacity duration-300 whitespace-nowrap ${
                      isCurrent
                        ? 'opacity-100'
                        : 'opacity-40 group-hover:opacity-100'
                    }`}
                  >
                    {event.year}
                  </span>
                </div>
              );
            })}
          <div
            className="absolute w-4 h-4 bg-parchment border-[2px] border-earth-orange rounded-full shadow-sm pointer-events-none z-20 transform -translate-x-1/2 transition-all duration-300 ease-out flex items-center justify-center"
            style={{ left: `${((currentYear - 1215) / (1302 - 1215)) * 100}%` }}
          >
            <div className="w-1.5 h-1.5 bg-earth-orange rounded-full"></div>
          </div>
          <input
            type="range"
            min={1215}
            max={1302}
            value={currentYear}
            onChange={(e) => setCurrentYear(Number(e.target.value))}
            className="w-full h-12 opacity-0 cursor-pointer absolute z-30"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => jumpToEvent('prev')}
            className="text-ink-light hover:text-ink flex items-center justify-center w-8 h-8 rounded-full border border-ink/20 hover:bg-ink/5 transition-colors group"
            title="Previous Event"
          >
            <ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <button
            onClick={() => jumpToEvent('next')}
            className="text-ink-light hover:text-ink flex items-center justify-center w-8 h-8 rounded-full border border-ink/20 hover:bg-ink/5 transition-colors group"
            title="Next Event"
          >
            <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

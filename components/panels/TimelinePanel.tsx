import React from 'react';
import { HistoricalEvent } from '../../types';
import { Play, Pause, BookOpen, Keyboard } from 'lucide-react';

interface TimelinePanelProps {
  currentYear: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  activeEvent: HistoricalEvent | undefined;
  onOpenChronicle: () => void;
}

export const TimelinePanel: React.FC<TimelinePanelProps> = ({
  currentYear,
  isPlaying,
  onTogglePlay,
  activeEvent,
  onOpenChronicle,
}) => {
  return (
    <div className="w-48 border-l border-ink/10 bg-parchment p-6 flex flex-col items-end shrink-0 z-20 relative shadow-sm">
      <div className="pointer-events-none mb-6 text-right">
        <span className="block text-[10px] font-sans uppercase tracking-[0.2em] text-ink-light mb-1">
          Anno Domini
        </span>
        <span className="block text-4xl font-display text-ink font-bold">
          {currentYear}
        </span>
      </div>

      <button
        onClick={onTogglePlay}
        className="flex items-center gap-2 px-4 py-1.5 border border-ink/20 rounded-full hover:bg-ink hover:text-parchment transition-all group bg-parchment/80 backdrop-blur shadow-sm mb-6"
      >
        {isPlaying ? <Pause size={14} /> : <Play size={14} />}
        <span className="text-[10px] uppercase tracking-widest font-bold">
          {isPlaying ? 'Pause' : 'Play'}
        </span>
      </button>

      <div className="w-full text-right border-t border-ink/20 pt-4">
        <span className="text-[9px] font-bold text-earth-orange uppercase tracking-wider block mb-2">
          Chronicle
        </span>

        {activeEvent ? (
          <>
            <h3 className="text-lg font-display font-bold text-ink leading-tight mb-2">
              {activeEvent.title}
            </h3>
            <p className="text-xs font-serif italic text-ink-light leading-snug mb-3 line-clamp-3">
              {activeEvent.shortDescription}
            </p>

            <button
              onClick={onOpenChronicle}
              className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-ink hover:text-earth-orange transition-colors border-b border-transparent hover:border-earth-orange pb-0.5"
            >
              <span>Read Chronicle</span>
              <BookOpen size={12} />
            </button>
          </>
        ) : (
          <div className="text-ink-light/40 text-xs italic py-2">
            <span>No record for {currentYear}.</span>
          </div>
        )}
      </div>

      <div className="mt-auto w-full pt-6 border-t border-ink/10 text-right opacity-40 hover:opacity-100 transition-opacity duration-300">
        <div className="flex items-center justify-end gap-1.5 mb-3 text-ink-light">
          <span className="text-[9px] uppercase font-bold tracking-widest">
            Controls
          </span>
          <Keyboard size={12} />
        </div>

        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-end gap-2">
            <span className="text-[10px] font-serif text-ink italic">
              Play / Pause
            </span>
            <kbd className="px-1.5 py-0.5 bg-ink/5 border border-ink/10 rounded text-[9px] font-sans text-ink font-bold shadow-sm">
              Space
            </kbd>
          </div>
          <div className="flex items-center justify-end gap-2">
            <span className="text-[10px] font-serif text-ink italic">
              Change Year
            </span>
            <div className="flex gap-0.5">
              <kbd className="px-1.5 py-0.5 bg-ink/5 border border-ink/10 rounded text-[9px] font-sans text-ink font-bold shadow-sm">
                ←
              </kbd>
              <kbd className="px-1.5 py-0.5 bg-ink/5 border border-ink/10 rounded text-[9px] font-sans text-ink font-bold shadow-sm">
                →
              </kbd>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2">
            <span className="text-[10px] font-serif text-ink italic">
              Jump to Event
            </span>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-ink/5 border border-ink/10 rounded text-[9px] font-sans text-ink font-bold shadow-sm">
                Shift
              </kbd>
              <span className="text-[8px] text-ink-light">+</span>
              <kbd className="px-1.5 py-0.5 bg-ink/5 border border-ink/10 rounded text-[9px] font-sans text-ink font-bold shadow-sm">
                ← / →
              </kbd>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

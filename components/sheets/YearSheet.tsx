import React from 'react';

interface YearSheetProps {
  isOpen: boolean;
  onClose: () => void;
  currentYear: number;
  isPlaying: boolean;
  setIsPlaying: (v: boolean) => void;
  activeEventTitle?: string;
  onPrevEvent: () => void;
  onNextEvent: () => void;
  timelineSlider: React.ReactNode;
}

export function YearSheet({
  isOpen,
  onClose,
  currentYear,
  isPlaying,
  setIsPlaying,
  activeEventTitle,
  onPrevEvent,
  onNextEvent,
  timelineSlider,
}: YearSheetProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="sm:hidden fixed inset-0 bg-ink/20 z-40" onClick={onClose} />

      {/* Sheet */}
      <div
        className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-parchment border-t-2 border-parchment-deep flex flex-col max-h-[60vh] sheet-open"
        style={{ borderRadius: 0 }}
      >
        {/* Drag handle */}
        <div className="w-12 h-0.5 bg-parchment-deep/60 mx-auto mt-3 mb-3 shrink-0" />

        {/* Year */}
        <p className="font-display text-5xl text-ink text-center leading-none mb-2 shrink-0">
          {currentYear}
        </p>

        {/* Active event title */}
        {activeEventTitle && (
          <p className="font-serif text-sm text-ink-faded italic text-center px-8 mb-4 shrink-0 line-clamp-2">
            {activeEventTitle}
          </p>
        )}

        {/* Prev / Next event */}
        <div className="flex justify-center gap-12 mb-4 shrink-0">
          <button
            onClick={onPrevEvent}
            className="font-label text-[9px] tracking-wide text-rubric min-h-[44px] px-4"
            style={{ borderRadius: 0 }}
          >
            ◀ PREVIOUS
          </button>
          <button
            onClick={onNextEvent}
            className="font-label text-[9px] tracking-wide text-rubric min-h-[44px] px-4"
            style={{ borderRadius: 0 }}
          >
            NEXT ▶
          </button>
        </div>

        {/* Timeline slider */}
        <div className="px-5 shrink-0">{timelineSlider}</div>

        {/* Play / Stop */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`w-4/5 mx-auto h-12 mt-4 mb-6 font-label text-[10px] tracking-[0.3em] shrink-0 border ${
            isPlaying
              ? 'bg-parchment-deep text-ink border-parchment-deep'
              : 'bg-rubric text-parchment border-rubric'
          }`}
          style={{ borderRadius: 0 }}
        >
          {isPlaying ? '◼  STOP' : '▶  ADVANCE THROUGH TIME'}
        </button>
      </div>
    </>
  );
}

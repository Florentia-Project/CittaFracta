import React from 'react';

interface FolioHeaderProps {
  activeTab: string;
  isHistoricalMode: boolean;
  toggleHistoricalMode: () => void;
}

export function FolioHeader({ activeTab, isHistoricalMode, toggleHistoricalMode }: FolioHeaderProps) {
  const title = activeTab === 'city' ? 'CITY OF FLORENCE' : 'FACTIONS';

  return (
    <header className={`sm:hidden h-11 flex items-center justify-between px-4 border-b shrink-0 z-30 ${isHistoricalMode ? 'bg-transparent border-ink/15' : 'bg-parchment border-parchment-deep'}`}>
      <span className="font-label text-earth-orange text-lg select-none">✦</span>

      <span className="font-label text-ink text-[10px] tracking-[0.25em]">
        {title}
      </span>

      <button
        onClick={toggleHistoricalMode}
        className="font-label text-lg min-w-[44px] h-11 flex items-center justify-center"
        style={{ borderRadius: 0 }}
        aria-label="Toggle Historical Mode"
      >
        <span className={isHistoricalMode ? 'text-rubric' : 'text-ink-faded'}>§</span>
      </button>
    </header>
  );
}

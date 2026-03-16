import React from 'react';

interface CodexDockProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentYear: number;
  onYearTap: () => void;
}

export function CodexDock({ activeTab, setActiveTab, currentYear, onYearTap }: CodexDockProps) {
  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 h-14 z-40 bg-parchment border-t border-parchment-deep grid grid-cols-3">

      {/* FAZIONI */}
      <button
        onClick={() => setActiveTab('map')}
        className={`flex flex-col items-center justify-center gap-0.5 ${activeTab === 'map' ? 'text-rubric border-t-2 border-rubric' : 'text-ink-faded'}`}
        style={{ borderRadius: 0 }}
      >
        <span className="font-label text-base leading-none">⊕</span>
        <span className="font-label text-[8px] tracking-widest">FAZIONI</span>
      </button>

      {/* ANNO */}
      <button
        onClick={onYearTap}
        className="flex flex-col items-center justify-center"
        style={{ borderRadius: 0 }}
        aria-label="Open year navigation"
      >
        <span className="font-display text-[20px] text-ink leading-none">{currentYear}</span>
        <span className="font-label text-[6px] tracking-widest text-ink-faded mt-0.5">ANNO DOMINI</span>
      </button>

      {/* CITTÀ */}
      <button
        onClick={() => setActiveTab('city')}
        className={`flex flex-col items-center justify-center gap-0.5 ${activeTab === 'city' ? 'text-rubric border-t-2 border-rubric' : 'text-ink-faded'}`}
        style={{ borderRadius: 0 }}
      >
        <span className="font-label text-base leading-none">◈</span>
        <span className="font-label text-[8px] tracking-widest">CITTÀ</span>
      </button>

    </nav>
  );
}

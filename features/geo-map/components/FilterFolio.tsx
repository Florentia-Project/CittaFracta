import React from 'react';
import { createPortal } from 'react-dom';
import { BASE_MAPS } from '../utils/constants';

interface FilterFolioProps {
  isOpen: boolean;
  onClose: () => void;

  // Map layers
  baseLayerKey: keyof typeof BASE_MAPS;
  setBaseLayerKey: (key: keyof typeof BASE_MAPS) => void;
  showHistoricalMap: boolean;
  setShowHistoricalMap: (show: boolean) => void;
  mapOpacity: number;
  setMapOpacity: (opacity: number) => void;
  showDistricts: boolean;
  setShowDistricts: (show: boolean) => void;

  // Filters
  colorMode: 'default' | 'guild';
  setColorMode: (mode: 'default' | 'guild') => void;
  activeRelTypes: Set<string>;
  toggleRelType: (type: string) => void;
}

const LAYER_LABELS: Record<string, string> = {
  clean: 'PULITA',
  satellite: 'VEDUTA',
  dark: 'OSCURA',
};

const REL_TYPES = [
  { key: 'Marriage', label: 'MATRIMONIO' },
  { key: 'Blood', label: 'SANGUE' },
  { key: 'Feud', label: 'FAIDA' },
  { key: 'Alliance', label: 'ALLEANZA' },
];

function ManuscriptCheckbox({ checked, onToggle }: { checked: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="w-6 h-6 border border-ink-faded flex items-center justify-center font-label text-rubric text-sm touch-exempt"
      style={{ borderRadius: 0, minHeight: 'unset', minWidth: 'unset' }}
      aria-pressed={checked}
    >
      {checked ? '✓' : ''}
    </button>
  );
}

export function FilterFolio({
  isOpen,
  onClose,
  baseLayerKey,
  setBaseLayerKey,
  showHistoricalMap,
  setShowHistoricalMap,
  mapOpacity,
  setMapOpacity,
  showDistricts,
  setShowDistricts,
  colorMode,
  setColorMode,
  activeRelTypes,
  toggleRelType,
}: FilterFolioProps) {
  if (!isOpen) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9998] sm:hidden"
        style={{ background: 'rgba(44,26,14,0.15)' }}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-[9999] bg-parchment border-t-2 border-parchment-deep max-h-[70vh] flex flex-col sm:hidden sheet-open"
        style={{ borderRadius: 0 }}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-4 h-11 shrink-0 border-b border-parchment-deep">
          <span className="font-label text-[9px] tracking-[0.3em] text-rubric">§ FILTRI</span>
          <button
            onClick={onClose}
            className="font-label text-lg text-ink-faded min-w-[44px] min-h-[44px] flex items-center justify-center"
            style={{ borderRadius: 0 }}
            aria-label="Chiudi"
          >
            ✕
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-4 pb-8">

          {/* Map layers */}
          <p className="font-label text-[8px] tracking-[0.3em] text-ink-faded mt-5 mb-2">¶ STRATI DELLA MAPPA</p>
          <div className="flex gap-1">
            {(['clean', 'satellite', 'dark'] as const).map(k => (
              <button
                key={k}
                onClick={() => setBaseLayerKey(k)}
                className={`flex-1 h-9 border font-label text-[8px] tracking-[0.1em] ${
                  baseLayerKey === k
                    ? 'bg-parchment-deep border-ink text-ink'
                    : 'border-parchment-deep text-ink-faded'
                }`}
                style={{ borderRadius: 0 }}
              >
                {LAYER_LABELS[k]}
              </button>
            ))}
          </div>

          {/* 1584 overlay */}
          <p className="font-label text-[8px] tracking-[0.3em] text-ink-faded mt-5 mb-2">¶ CARTA DEL 1584</p>
          <div className="flex items-center gap-3 mb-2">
            <ManuscriptCheckbox
              checked={showHistoricalMap}
              onToggle={() => setShowHistoricalMap(!showHistoricalMap)}
            />
            <span className="font-serif text-sm text-ink">Sovrapposizione storica</span>
          </div>
          {showHistoricalMap && (
            <div className="flex items-center gap-3">
              <span className="font-label text-[8px] text-ink-faded tracking-wider">OPACITÀ</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={mapOpacity}
                onChange={e => setMapOpacity(parseFloat(e.target.value))}
                className="flex-1 h-1 bg-ink/20 cursor-pointer"
              />
              <span className="font-label text-[8px] text-ink-faded w-8 text-right">
                {Math.round(mapOpacity * 100)}%
              </span>
            </div>
          )}

          {/* Districts */}
          <p className="font-label text-[8px] tracking-[0.3em] text-ink-faded mt-5 mb-2">¶ SESTIERI</p>
          <div className="flex items-center gap-3">
            <ManuscriptCheckbox
              checked={showDistricts}
              onToggle={() => setShowDistricts(!showDistricts)}
            />
            <span className="font-serif text-sm text-ink">Sesti / Quartieri</span>
          </div>

          {/* Color mode */}
          <p className="font-label text-[8px] tracking-[0.3em] text-ink-faded mt-5 mb-2">¶ COLORE SIMBOLI</p>
          <div className="flex gap-1">
            {(['default', 'guild'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setColorMode(mode)}
                className={`flex-1 h-9 border font-label text-[8px] tracking-[0.1em] ${
                  colorMode === mode
                    ? 'bg-parchment-deep border-ink text-ink'
                    : 'border-parchment-deep text-ink-faded'
                }`}
                style={{ borderRadius: 0 }}
              >
                {mode === 'default' ? 'FAZIONE' : 'CORPORAZIONE'}
              </button>
            ))}
          </div>

          {/* Relationships */}
          <p className="font-label text-[8px] tracking-[0.3em] text-ink-faded mt-5 mb-2">¶ RELAZIONI</p>
          <div className="grid grid-cols-2 gap-1">
            {REL_TYPES.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => toggleRelType(key)}
                className={`h-11 border font-label text-[8px] tracking-[0.1em] ${
                  activeRelTypes.has(key)
                    ? 'text-rubric border-rubric bg-parchment-mid'
                    : 'border-parchment-deep text-ink-faded'
                }`}
                style={{ borderRadius: 0 }}
              >
                {label}
              </button>
            ))}
          </div>

        </div>
      </div>
    </>,
    document.body
  );
}

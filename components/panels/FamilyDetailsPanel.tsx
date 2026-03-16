import React from 'react';
import { Family, CalculatedState } from '../../types';
import { getFamilyDistrict } from '../../utils/districtUtils';
import { normalizeAssetPath } from '../../utils/assetPaths';

interface FamilyDetailsPanelProps {
  selectedFamily: Family | null;
  currentState: CalculatedState | null;
  currentYear: number;
  onClose: () => void;
}

function SectionHeader({ sigil, label }: { sigil: string; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <span className="font-label text-xs text-rubric">{sigil}</span>
      <span className="font-label text-[8px] tracking-[0.3em] text-ink-faded uppercase">{label}</span>
    </div>
  );
}

export const FamilyDetailsPanel: React.FC<FamilyDetailsPanelProps> = ({
  selectedFamily,
  currentState,
  currentYear,
  onClose,
}) => {
  return (
    <div
      className={`absolute z-40
        bottom-0 left-0 right-0 w-full max-h-[82vh]
        sm:bottom-auto sm:left-auto sm:right-0 sm:top-0 sm:w-80 sm:max-h-full sm:h-full
        bg-parchment
        border-t-2 border-parchment-deep
        sm:border-t-0 sm:border-l sm:border-parchment-deep
        shadow-[0_-4px_15px_-5px_rgba(0,0,0,0.12)] sm:shadow-[-5px_0_15px_-5px_rgba(0,0,0,0.1)]
        transition-transform duration-300 transform flex flex-col
        ${selectedFamily
          ? 'translate-y-0 sm:translate-x-0'
          : 'translate-y-full sm:translate-y-0 sm:translate-x-full'
        }`}
      style={{ borderRadius: 0 }}
    >
      {/* Drag handle — mobile only */}
      <div className="sm:hidden w-12 h-0.5 bg-parchment-deep/60 mx-auto mt-3 mb-3 shrink-0" />

      {selectedFamily && currentState && (
        <>
          {/* Non-scrolling family header */}
          <div className="flex items-start gap-3 px-4 pb-4 border-b border-parchment-deep shrink-0">
            {selectedFamily.coatOfArmsUrl ? (
              <img
                src={normalizeAssetPath(selectedFamily.coatOfArmsUrl)}
                alt=""
                referrerPolicy="no-referrer"
                className="w-14 h-14 object-contain shrink-0"
              />
            ) : (
              <div className="w-14 h-14 shrink-0 border border-parchment-deep flex items-center justify-center font-label text-2xl text-parchment-deep">
                ✦
              </div>
            )}
            <div className="flex-1 min-w-0 pt-1">
              <h2 className="font-display text-xl text-ink leading-tight mb-1">
                {selectedFamily.name}
              </h2>
              <p className="font-label text-[9px] tracking-[0.2em] text-rubric uppercase">
                {currentState.currentFactionLabel}
                {currentState.isExiled && ' · EXILED'}
                {currentState.isMagnate && ' · MAGNATE'}
              </p>
              <p className="font-label text-[9px] tracking-[0.2em] text-ink-faded uppercase">
                {currentState.currentStatusLabel}
              </p>
            </div>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-4 py-4">

            {/* Stato Politico */}
            <SectionHeader sigil="§" label="Political Status" />
            <div className="flex flex-wrap gap-2 mb-1">
              <span className={`px-2 py-1 border text-xs font-serif ${
                currentState.isExiled
                  ? 'bg-earth-orange/20 text-earth-orange border-earth-orange/40'
                  : 'bg-parchment-mid text-ink border-parchment-deep'
              }`}>
                {currentState.isExiled ? 'Exiled' : currentState.currentStatusLabel}
              </span>
              <span className="px-2 py-1 border border-parchment-deep text-xs font-serif bg-parchment-mid text-ink">
                {currentState.currentFactionLabel}
              </span>
              {currentState.isMagnate && (
                <span className="px-2 py-1 border border-rubric/40 text-xs font-serif text-rubric">
                  Magnate
                </span>
              )}
            </div>

            <hr className="border-t border-parchment-deep my-4" />

            {/* Origini */}
            <SectionHeader sigil="¶" label="Origins & Places" />
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm font-serif mb-1">
              <div>
                <span className="block text-ink-faded text-[10px] italic font-label">
                  {currentYear < 1343 ? 'Sesto' : 'Quartiere'}
                </span>
                <span className="text-ink text-[13px]">
                  {getFamilyDistrict(selectedFamily, currentYear)}
                </span>
              </div>
              <div>
                <span className="block text-ink-faded text-[10px] italic font-label">Coordinates</span>
                <span className="text-ink text-[13px]">
                  {selectedFamily.coordinates ? 'Mapped' : 'Not mapped'}
                </span>
              </div>
              {selectedFamily.originalFaction && (
                <div>
                  <span className="block text-ink-faded text-[10px] italic font-label">Orig. faction</span>
                  <span className="text-ink text-[13px]">{selectedFamily.originalFaction}</span>
                </div>
              )}
              {selectedFamily.originalStatus && (
                <div>
                  <span className="block text-ink-faded text-[10px] italic font-label">Orig. class</span>
                  <span className="text-ink text-[13px]">{selectedFamily.originalStatus}</span>
                </div>
              )}
            </div>

            {/* Persone Notevoli */}
            {selectedFamily.noticeablePeople && (
              <>
                <hr className="border-t border-parchment-deep my-4" />
                <SectionHeader sigil="✦" label="Notable People" />
                <p className="text-sm font-serif text-ink leading-relaxed">
                  {selectedFamily.noticeablePeople}
                </p>
              </>
            )}

            {/* Economia */}
            {(selectedFamily.occupation || selectedFamily.propertyType) && (
              <>
                <hr className="border-t border-parchment-deep my-4" />
                <SectionHeader sigil="¶" label="Economy" />
                {selectedFamily.occupation && (
                  <p className="text-sm font-serif text-ink mb-1">
                    <span className="italic text-ink-faded">Occupation: </span>
                    {selectedFamily.occupation}
                  </p>
                )}
                {selectedFamily.propertyType && (
                  <p className="text-sm font-serif text-ink">
                    <span className="italic text-ink-faded">Property: </span>
                    {selectedFamily.propertyType}
                  </p>
                )}
              </>
            )}

            {/* Fonti */}
            {(selectedFamily.originalSourceTerm || selectedFamily.sourceCitation) && (
              <>
                <hr className="border-t border-parchment-deep my-4" />
                <SectionHeader sigil="§" label="Sources" />
                {selectedFamily.originalSourceTerm && (
                  <p className="text-xs font-serif text-ink-faded italic mb-1">
                    {selectedFamily.originalSourceTerm}
                  </p>
                )}
                {selectedFamily.sourceCitation && (
                  <p className="text-[10px] font-label text-ink-faded tracking-wide">
                    Ref: {selectedFamily.sourceCitation}
                  </p>
                )}
              </>
            )}

          </div>

          {/* Non-scrolling close button */}
          <button
            onClick={onClose}
            className="shrink-0 mx-4 mb-4 mt-2 h-12 border border-rubric/40 bg-transparent font-label text-[9px] tracking-[0.3em] text-rubric"
            style={{ borderRadius: 0, width: 'calc(100% - 2rem)' }}
          >
            ✕  CLOSE
          </button>
        </>
      )}
    </div>
  );
};

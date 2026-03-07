import React from 'react';
import { Family, CalculatedState } from '../../types';
import { X } from 'lucide-react';
import { getFamilyDistrict } from '../../utils/districtUtils';

interface FamilyDetailsPanelProps {
  selectedFamily: Family | null;
  currentState: CalculatedState | null;
  currentYear: number;
  onClose: () => void;
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
        bottom-0 left-0 right-0 w-full max-h-[65vh]
        sm:bottom-auto sm:left-auto sm:right-0 sm:top-0 sm:w-80 sm:max-h-none sm:h-full
        bg-parchment
        border-t sm:border-t-0 sm:border-l border-ink/20
        shadow-[0_-4px_15px_-5px_rgba(0,0,0,0.12)] sm:shadow-[-5px_0_15px_-5px_rgba(0,0,0,0.1)]
        rounded-t-2xl sm:rounded-none
        transition-transform duration-300 transform
        ${selectedFamily
          ? 'translate-y-0 sm:translate-x-0'
          : 'translate-y-full sm:translate-y-0 sm:translate-x-full'
        }`}
    >
      {selectedFamily && currentState && (
        <div className="h-full flex flex-col p-6 overflow-y-auto">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-display font-bold text-ink">
              {selectedFamily.name}
            </h2>
            <button
              onClick={onClose}
              className="text-ink-light hover:text-ink p-1"
            >
              <X size={20} />
            </button>
          </div>

          {selectedFamily.coatOfArmsUrl && (
            <div className="w-full h-32 mb-6 p-4 border border-ink/10 bg-parchment-dark/10 rounded flex items-center justify-center">
              <img
                src={selectedFamily.coatOfArmsUrl}
                alt={`${selectedFamily.name} Coat of Arms`}
                referrerPolicy="no-referrer"
                className="h-full object-contain mix-blend-multiply"
              />
            </div>
          )}

          <div className="space-y-6">
            <div>
              <h3 className="text-[10px] font-sans font-bold uppercase tracking-widest text-ink-light mb-1">
                Current Status ({currentYear})
              </h3>
              <div className="flex flex-wrap gap-2">
                <span
                  className={`px-2 py-1 border border-ink/20 text-xs font-serif ${
                    currentState.isExiled
                      ? 'bg-earth-orange text-parchment border-earth-orange'
                      : 'bg-parchment-dark/30 text-ink'
                  }`}
                >
                  {currentState.isExiled
                    ? 'Exiled'
                    : currentState.currentStatusLabel}
                </span>
                <span className="px-2 py-1 border border-ink/20 text-xs font-serif bg-parchment-dark/30 text-ink">
                  {currentState.currentFactionLabel}
                </span>
              </div>
            </div>

            <div className="border-t border-ink/10 pt-4">
              <h3 className="text-[10px] font-sans font-bold uppercase tracking-widest text-ink-light mb-2">
                Origins & Locations
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm font-serif">
                <div>
                  <span className="block text-ink-light text-xs italic">
                    District ({currentYear < 1343 ? 'Sesto' : 'Quartiere'})
                  </span>
                  <span className="text-ink">
                    {getFamilyDistrict(selectedFamily, currentYear)}
                  </span>
                </div>
                <div>
                  <span className="block text-ink-light text-xs italic">
                    Coordinates
                  </span>
                  <span className="text-ink">
                    {selectedFamily.coordinates ? 'Mapped' : 'Unmapped'}
                  </span>
                </div>
                <div>
                  <span className="block text-ink-light text-xs italic">
                    Original Faction
                  </span>
                  <span className="text-ink">
                    {selectedFamily.originalFaction}
                  </span>
                </div>
                <div>
                  <span className="block text-ink-light text-xs italic">
                    Original Status
                  </span>
                  <span className="text-ink">
                    {selectedFamily.originalStatus}
                  </span>
                </div>
              </div>
            </div>

            {selectedFamily.noticeablePeople && (
              <div className="border-t border-ink/10 pt-4">
                <h3 className="text-[10px] font-sans font-bold uppercase tracking-widest text-ink-light mb-1">
                  Noticeable People
                </h3>
                <p className="text-sm font-serif text-ink">
                  {selectedFamily.noticeablePeople}
                </p>
              </div>
            )}

            {(selectedFamily.occupation || selectedFamily.propertyType) && (
              <div className="border-t border-ink/10 pt-4">
                <h3 className="text-[10px] font-sans font-bold uppercase tracking-widest text-ink-light mb-1">
                  Economy
                </h3>
                {selectedFamily.occupation && (
                  <p className="text-sm font-serif text-ink mb-1">
                    <span className="italic text-ink-light">Occupation:</span>{' '}
                    {selectedFamily.occupation}
                  </p>
                )}
                {selectedFamily.propertyType && (
                  <p className="text-sm font-serif text-ink">
                    <span className="italic text-ink-light">Property:</span>{' '}
                    {selectedFamily.propertyType}
                  </p>
                )}
              </div>
            )}

            {(selectedFamily.originalSourceTerm ||
              selectedFamily.sourceCitation) && (
              <div className="border-t border-ink/10 pt-4">
                <h3 className="text-[10px] font-sans font-bold uppercase tracking-widest text-ink-light mb-1">
                  Sources
                </h3>
                <p className="text-xs font-serif text-ink-light italic">
                  {selectedFamily.originalSourceTerm}
                </p>
                {selectedFamily.sourceCitation && (
                  <p className="text-[10px] text-ink-light mt-1">
                    Ref: {selectedFamily.sourceCitation}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

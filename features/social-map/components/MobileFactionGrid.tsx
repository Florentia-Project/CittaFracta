import React, { useMemo } from 'react';
import { Family } from '../../../types';
import { calculateFamilyState } from '../logic/engine';
import { deduplicateFamiliesByName } from '../utils/deduplicateFamilies';
import { normalizeAssetPath } from '../../../utils/assetPaths';

interface MobileFactionGridProps {
  data: Family[];
  year: number;
  onSelectFamily: (family: Family) => void;
  selectedFamilyId?: string;
}

interface FamilyWithState {
  family: Family;
  visualGroup: string;
  currentStatusLabel: string;
  isExiled: boolean;
  isMagnate: boolean;
  isGhibelline: boolean;
  classRow: 'grandi' | 'grassi' | 'popolo';
}

function FamilyCell({
  item,
  isSelected,
  onSelectFamily,
}: {
  item: FamilyWithState;
  isSelected: boolean;
  onSelectFamily: (family: Family) => void;
}) {
  return (
    <button
      onClick={() => onSelectFamily(item.family)}
      className={`w-full min-h-[52px] flex items-center gap-2 px-2 border border-parchment-deep/40 text-left ${
        isSelected ? 'border-l-4 border-rubric bg-parchment-mid' : ''
      } ${item.isExiled ? 'opacity-50' : ''}`}
      style={{ touchAction: 'manipulation', borderRadius: 0 }}
    >
      {item.family.coatOfArmsUrl && (
        <img
          src={normalizeAssetPath(item.family.coatOfArmsUrl)}
          alt=""
          className="w-7 h-7 object-contain shrink-0"
        />
      )}
      <span className="font-display text-[13px] text-ink leading-tight overflow-hidden text-ellipsis whitespace-nowrap flex-1 min-w-0">
        {item.family.name}
      </span>
      {item.isMagnate && (
        <span className="font-label text-[8px] text-rubric shrink-0" title="Magnate">M</span>
      )}
    </button>
  );
}

function ClassSection({
  label,
  ghib,
  guelf,
  selectedFamilyId,
  onSelectFamily,
}: {
  label: string;
  ghib: FamilyWithState[];
  guelf: FamilyWithState[];
  selectedFamilyId?: string;
  onSelectFamily: (family: Family) => void;
}) {
  if (ghib.length === 0 && guelf.length === 0) return null;

  return (
    <>
      {/* Class divider spanning full width */}
      <div className="col-span-2 h-7 flex items-center px-3 font-label text-[8px] tracking-[0.3em] italic text-ink-faded bg-parchment-mid border-y border-parchment-deep">
        {label}
      </div>

      {/* Two-column family cells */}
      <div className="col-span-2 grid grid-cols-2">
        {/* Ghibelline column */}
        <div className="flex flex-col border-r border-parchment-deep/40">
          {ghib.map(item => (
            <FamilyCell
              key={item.family.id}
              item={item}
              isSelected={selectedFamilyId === item.family.id}
              onSelectFamily={onSelectFamily}
            />
          ))}
          {ghib.length === 0 && <div className="min-h-[52px]" />}
        </div>

        {/* Guelf column */}
        <div className="flex flex-col">
          {guelf.map(item => (
            <FamilyCell
              key={item.family.id}
              item={item}
              isSelected={selectedFamilyId === item.family.id}
              onSelectFamily={onSelectFamily}
            />
          ))}
          {guelf.length === 0 && <div className="min-h-[52px]" />}
        </div>
      </div>
    </>
  );
}

export const MobileFactionGrid: React.FC<MobileFactionGridProps> = ({
  data,
  year,
  onSelectFamily,
  selectedFamilyId,
}) => {
  const grouped = useMemo(() => {
    const unique = deduplicateFamiliesByName(data);

    const items: FamilyWithState[] = unique.map(family => {
      const state = calculateFamilyState(family, year);
      const isGhibelline =
        state.visualGroup === 'Ghibelline' ||
        (state.isExiled &&
          (family.faction1Type === 'Ghibelline' || family.faction2Type === 'Ghibelline'));

      let classRow: 'grandi' | 'grassi' | 'popolo' = 'popolo';
      if (state.currentStatusLabel === 'Noble') {
        classRow = 'grandi';
      } else if (
        state.currentStatusLabel === 'Popolo Grasso' ||
        state.currentStatusLabel === 'Grassi'
      ) {
        classRow = 'grassi';
      }

      return { family, ...state, isGhibelline, classRow };
    });

    const result = {
      grandi: { ghib: [] as FamilyWithState[], guelf: [] as FamilyWithState[] },
      grassi: { ghib: [] as FamilyWithState[], guelf: [] as FamilyWithState[] },
      popolo: { ghib: [] as FamilyWithState[], guelf: [] as FamilyWithState[] },
    };

    items.forEach(item => {
      const row = result[item.classRow];
      if (item.isGhibelline) row.ghib.push(item);
      else row.guelf.push(item);
    });

    // Sort alphabetically within each group
    (['grandi', 'grassi', 'popolo'] as const).forEach(cls => {
      result[cls].ghib.sort((a, b) => a.family.name.localeCompare(b.family.name));
      result[cls].guelf.sort((a, b) => a.family.name.localeCompare(b.family.name));
    });

    return result;
  }, [data, year]);

  return (
    <div className="sm:hidden w-full overflow-y-auto overflow-x-hidden flex-1 grid grid-cols-2 content-start">
      {/* Sticky column headers */}
      <div className="col-span-2 sticky top-0 z-20 bg-parchment grid grid-cols-2">
        <div className="h-9 flex items-center justify-center font-label text-[9px] tracking-[0.2em] text-rubric border-b border-parchment-deep">
          GHIBELLINI
        </div>
        <div className="h-9 flex items-center justify-center font-label text-[9px] tracking-[0.2em] text-rubric border-b border-parchment-deep border-l border-parchment-deep/40">
          GUELFI
        </div>
      </div>

      <ClassSection
        label="GRANDI"
        ghib={grouped.grandi.ghib}
        guelf={grouped.grandi.guelf}
        selectedFamilyId={selectedFamilyId}
        onSelectFamily={onSelectFamily}
      />
      <ClassSection
        label="GRASSI"
        ghib={grouped.grassi.ghib}
        guelf={grouped.grassi.guelf}
        selectedFamilyId={selectedFamilyId}
        onSelectFamily={onSelectFamily}
      />
      <ClassSection
        label="POPOLO"
        ghib={grouped.popolo.ghib}
        guelf={grouped.popolo.guelf}
        selectedFamilyId={selectedFamilyId}
        onSelectFamily={onSelectFamily}
      />
    </div>
  );
};

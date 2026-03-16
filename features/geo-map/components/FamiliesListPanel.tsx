import React from 'react';
import { Users } from 'lucide-react';
import { Family } from '../../../types';
import { Section } from './Section';

interface FamiliesListPanelProps {
    groupedList: Record<string, Family[]>;
    activeSestos: Set<string>;
    toggleSesto: (sesto: string) => void;
    onFamilyDoubleClick: (family: Family, index: number) => void;
    familyListRefs?: React.MutableRefObject<(HTMLDivElement | null)[]>;
    selectedFamilyId?: string;
    onFamilySelect?: (family: Family) => void;
    selectedFamilyName?: string;
    colorMode?: 'default' | 'guild';
    getGuildColor?: (guild: string) => string;
    isOpen: boolean;
    onToggle: () => void;
}

export const FamiliesListPanel: React.FC<FamiliesListPanelProps> = ({
    groupedList,
    activeSestos,
    toggleSesto,
    onFamilyDoubleClick,
    familyListRefs,
    selectedFamilyId,
    onFamilySelect,
    selectedFamilyName,
    colorMode = 'default',
    getGuildColor,
    isOpen,
    onToggle
}) => {
    const totalFamilies = Object.values(groupedList).reduce((sum: number, arr: Family[]) => sum + arr.length, 0);

    return (
        <Section
            title={`Families (${totalFamilies})`}
            icon={Users}
            isOpen={isOpen}
            onToggle={onToggle}
        >
            <div className="space-y-2">
                {Object.entries(groupedList).sort().map(([sesto, families]: [string, Family[]]) => {
                    if ((families as Family[]).length === 0) return null;

                    const isActive = activeSestos.has(sesto);

                    return (
                        <div key={sesto} className="border border-ink/10 rounded-lg overflow-hidden">
                            <button
                                onClick={() => toggleSesto(sesto)}
                                className={`w-full px-3 py-2 flex items-center justify-between text-xs font-bold uppercase transition-colors ${
                                    isActive
                                        ? 'bg-earth-orange/20 text-earth-orange border-b border-earth-orange/20'
                                        : 'bg-ink/5 text-ink hover:bg-ink/10'
                                }`}
                            >
                                <span>{sesto}</span>
                                <span className="text-[10px] font-normal">({(families as Family[]).length})</span>
                            </button>

                            {isActive && (
                                <div className="max-h-48 overflow-y-auto space-y-1 p-2 bg-white">
                                    {(families as Family[]).map((family, fIdx) => {
                                        const isSelected = selectedFamilyName && family.name === selectedFamilyName;
                                        return (
                                            <div
                                                key={`${sesto}-${fIdx}`}
                                                ref={(el) => {
                                                    if (familyListRefs?.current) {
                                                        familyListRefs.current[fIdx] = el;
                                                    }
                                                }}
                                                onDoubleClick={() => onFamilyDoubleClick(family, fIdx)}
                                                onClick={() => onFamilySelect?.(family)}
                                                className={`px-2 py-1 text-xs rounded border cursor-pointer transition-colors ${
                                                    isSelected
                                                        ? 'bg-earth-orange/10 text-earth-orange font-bold border-earth-orange/20'
                                                        : 'bg-ink/5 text-ink border-ink/10 hover:bg-earth-orange/10 hover:border-earth-orange/20'
                                                }`}
                                            >
                                                <span className="font-bold">{family.name}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </Section>
    );
};

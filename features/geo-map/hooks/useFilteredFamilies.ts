import { useMemo } from 'react';
import { Family } from '../../../types';

export const useFilteredFamilies = (
    data: Family[],
    searchTerm: string,
    activeSestos: Set<string>,
    currentYear: number
) => {
    const filteredFamilies = useMemo(() => {
        return data.filter((f: Family) => {
            const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase());
            
            // Apply same grouping logic as in groupedList: use "Unknown Location" fallback
            const familySesto = f.sesto || "Unknown Location";
            // If activeSestos is empty, show all. Otherwise, only show if sesto is in activeSestos
            const matchesSesto = activeSestos.size === 0 ? true : activeSestos.has(familySesto);
            
            const start = (f.yearStart as number) || 1200;
            const end = (f.yearEnd as number) || 1900;
            const matchesTime = currentYear >= start && currentYear <= end;
            return matchesSearch && matchesSesto && matchesTime;
        });
    }, [data, searchTerm, activeSestos, currentYear]);

    const groupedList = useMemo(() => {
        const groups: Record<string, Family[]> = {};
        filteredFamilies.forEach((f: Family) => {
            const key = f.sesto || "Unknown Location";
            if (!groups[key]) groups[key] = [];
            groups[key].push(f);
        });
        return groups;
    }, [filteredFamilies]);

    return { filteredFamilies, groupedList };
};

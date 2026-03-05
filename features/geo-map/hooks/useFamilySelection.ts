import { useMemo, useRef } from 'react';
import { Family } from '../../../types';

export const useFamilySelection = (
    data: Family[],
    filteredFamilies: Family[],
    mapInstance: any,
    onSelectFamily: (family: Family | null) => void
) => {
    const lastCenteredRef = useRef<string | null>(null);
    const familyListRefs = useRef<(HTMLDivElement | null)[]>([]);
    const selectionSourceRef = useRef<'map' | 'list' | null>(null);

    const handleFamilyDoubleClick = (family: Family, index: number) => {
        if (!mapInstance || !family.coordinates) return;

        const sameNameFamilies = filteredFamilies.filter(
            f => f.name === family.name && f.coordinates
        );
        sameNameFamilies.sort((a, b) => a.id.localeCompare(b.id));

        let targetFamily = family;
        const lastId = lastCenteredRef.current;
        const isLastWasSibling = lastId && sameNameFamilies.some(f => f.id === lastId);

        if (isLastWasSibling && sameNameFamilies.length > 1) {
            const currentIndex = sameNameFamilies.findIndex(f => f.id === lastId);
            const nextIndex = (currentIndex + 1) % sameNameFamilies.length;
            targetFamily = sameNameFamilies[nextIndex];
        }

        selectionSourceRef.current = 'list';
        onSelectFamily(targetFamily);
        lastCenteredRef.current = targetFamily.id;

        mapInstance.flyTo(
            [targetFamily.coordinates!.x, targetFamily.coordinates!.y],
            18,
            { animate: true, duration: 1.5 }
        );
    };

    return {
        familyListRefs,
        selectionSourceRef,
        handleFamilyDoubleClick
    };
};

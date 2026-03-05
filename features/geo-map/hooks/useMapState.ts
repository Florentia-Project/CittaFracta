import { useState } from 'react';

interface OpenSections {
    layers: boolean;
    info: boolean;
    timeline: boolean;
    locations: boolean;
    families: boolean;
}

export const useMapState = (initialSections: OpenSections) => {
    // Map instance & refs
    const [mapInstance, setMapInstance] = useState(null);

    // UI State for selections
    const [activeSestos, setActiveSestos] = useState<Set<string>>(new Set());
    const [searchTerm, setSearchTerm] = useState('');
    const [hoveredFamilyId, setHoveredFamilyId] = useState<string | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [activeCoordinates, setActiveCoordinates] = useState<{x: number, y: number} | null>(null);

    // Data Filters State
    const [activeRelTypes, setActiveRelTypes] = useState<Set<string>>(new Set([]));
    const [colorMode, setColorMode] = useState<'default' | 'guild'>('default');
    const [showPins, setShowPins] = useState(true);

    // Map Layers State
    const [baseLayerKey, setBaseLayerKey] = useState<'clean' | 'satellite' | 'dark'>('clean');
    const [showHistoricalMap, setShowHistoricalMap] = useState(true);
    const [mapOpacity, setMapOpacity] = useState(0.8);
    const [showDistricts, setShowDistricts] = useState(false);

    // Section visibility
    const [openSections, setOpenSections] = useState<OpenSections>(initialSections);

    const toggleSection = (key: keyof OpenSections) => {
        setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const toggleSesto = (sesto: string) => {
        setActiveSestos(prev => {
            const newSet = new Set(prev);
            if (newSet.has(sesto)) {
                newSet.delete(sesto);
            } else {
                newSet.add(sesto);
            }
            return newSet;
        });
    };

    const toggleRelType = (type: string) => {
        setActiveRelTypes(prev => {
            const newSet = new Set(prev);
            if (newSet.has(type)) {
                newSet.delete(type);
            } else {
                newSet.add(type);
            }
            return newSet;
        });
    };

    return {
        // Map
        mapInstance,
        setMapInstance,
        // UI
        activeSestos,
        toggleSesto,
        searchTerm,
        setSearchTerm,
        hoveredFamilyId,
        setHoveredFamilyId,
        selectedDistrict,
        setSelectedDistrict,
        activeCoordinates,
        setActiveCoordinates,
        // Filters
        activeRelTypes,
        toggleRelType,
        colorMode,
        setColorMode,
        showPins,
        setShowPins,
        // Layers
        baseLayerKey,
        setBaseLayerKey,
        showHistoricalMap,
        setShowHistoricalMap,
        mapOpacity,
        setMapOpacity,
        showDistricts,
        setShowDistricts,
        // Sections
        openSections,
        toggleSection
    };
};

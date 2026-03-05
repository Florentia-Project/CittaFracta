import React from 'react';
import { Layers, Info, Users, Clock } from 'lucide-react';
import { Family } from '../../../types';
import { DistrictPolygon } from '../../../data/districts';
import { SearchBar } from './SearchBar';
import { MapLayers } from './MapLayers';
import { FamiliesListPanel } from './FamiliesListPanel';
import FiltersControl from './FiltersControl';
import TimelineControl from '../../social-map/components/TimelineControl';
import { Section } from './Section';
import { BASE_MAPS } from '../utils/constants';

interface LeftSidebarProps {
    // Search
    searchTerm: string;
    setSearchTerm: (term: string) => void;

    // Map Layers
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

    // Timeline
    currentYear: number;
    onYearChange: (year: number) => void;

    // Families List
    groupedList: Record<string, Family[]>;
    activeSestos: Set<string>;
    toggleSesto: (sesto: string) => void;
    onFamilyDoubleClick: (family: Family, index: number) => void;
    familyListRefs?: React.MutableRefObject<(HTMLDivElement | null)[]>;
    selectedFamilyId?: string;
    onFamilySelect?: (family: Family) => void;
    selectedFamilyName?: string;

    // Sections State
    openSections: Record<string, boolean>;
    toggleSection: (key: string) => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
    searchTerm,
    setSearchTerm,
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
    currentYear,
    onYearChange,
    groupedList,
    activeSestos,
    toggleSesto,
    onFamilyDoubleClick,
    familyListRefs,
    selectedFamilyId,
    onFamilySelect,
    selectedFamilyName,
    openSections,
    toggleSection
}) => {
    return (
        <div className="w-80 border-r border-ink/20 flex flex-col z-20 bg-parchment shadow-md flex-shrink-0 relative">
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <MapLayers
                    baseLayerKey={baseLayerKey}
                    setBaseLayerKey={setBaseLayerKey}
                    showHistoricalMap={showHistoricalMap}
                    setShowHistoricalMap={setShowHistoricalMap}
                    mapOpacity={mapOpacity}
                    setMapOpacity={setMapOpacity}
                    showDistricts={showDistricts}
                    setShowDistricts={setShowDistricts}
                    isOpen={openSections['layers'] || false}
                    onToggle={() => toggleSection('layers')}
                />

                <Section
                    title="Information & Filters"
                    icon={Info}
                    isOpen={openSections['info'] || false}
                    onToggle={() => toggleSection('info')}
                >
                    <FiltersControl
                        colorMode={colorMode}
                        setColorMode={setColorMode}
                        activeRelTypes={activeRelTypes}
                        toggleRelType={toggleRelType}
                    />
                </Section>

                <Section
                    title="Timeline"
                    icon={Clock}
                    isOpen={openSections['timeline'] || false}
                    onToggle={() => toggleSection('timeline')}
                >
                    <TimelineControl
                        currentYear={currentYear}
                        onYearChange={onYearChange}
                    />
                </Section>

                <FamiliesListPanel
                    groupedList={groupedList}
                    activeSestos={activeSestos}
                    toggleSesto={toggleSesto}
                    onFamilyDoubleClick={onFamilyDoubleClick}
                    familyListRefs={familyListRefs}
                    selectedFamilyId={selectedFamilyId}
                    onFamilySelect={onFamilySelect}
                    selectedFamilyName={selectedFamilyName}
                    isOpen={openSections['families'] || false}
                    onToggle={() => toggleSection('families')}
                />
            </div>
        </div>
    );
};

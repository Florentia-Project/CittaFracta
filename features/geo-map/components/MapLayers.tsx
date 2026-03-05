import React, { useMemo } from 'react';
import { Eye, EyeOff, MapIcon, Layers } from 'lucide-react';
import { BASE_MAPS } from '../utils/constants';
import { Section } from './Section';

interface MapLayersProps {
    baseLayerKey: keyof typeof BASE_MAPS;
    setBaseLayerKey: (key: keyof typeof BASE_MAPS) => void;
    showHistoricalMap: boolean;
    setShowHistoricalMap: (show: boolean) => void;
    mapOpacity: number;
    setMapOpacity: (opacity: number) => void;
    showDistricts: boolean;
    setShowDistricts: (show: boolean) => void;
    isOpen: boolean;
    onToggle: () => void;
}

export const MapLayers: React.FC<MapLayersProps> = ({
    baseLayerKey,
    setBaseLayerKey,
    showHistoricalMap,
    setShowHistoricalMap,
    mapOpacity,
    setMapOpacity,
    showDistricts,
    setShowDistricts,
    isOpen,
    onToggle
}) => {
    return (
        <Section title="Map Layers" icon={Layers} isOpen={isOpen} onToggle={onToggle}>
            <div className="flex gap-1 mb-3">
                {(['clean', 'satellite', 'dark'] as const).map((k) => (
                    <button
                        key={k}
                        onClick={() => setBaseLayerKey(k)}
                        className={`flex-1 py-1 rounded text-[9px] font-bold uppercase ${
                            baseLayerKey === k
                                ? 'bg-earth-orange text-white'
                                : 'bg-white border border-ink/10 text-ink'
                        }`}
                    >
                        {k}
                    </button>
                ))}
            </div>

            <div className="flex items-center justify-between mb-2">
                <button
                    onClick={() => setShowHistoricalMap(!showHistoricalMap)}
                    className="flex items-center gap-2 text-xs font-bold text-ink hover:text-earth-orange"
                >
                    {showHistoricalMap ? <Eye size={12} /> : <EyeOff size={12} />}
                    1584 Map Overlay
                </button>
                <span className="text-[10px]">{Math.round(mapOpacity * 100)}%</span>
            </div>

            <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={mapOpacity}
                onChange={(e) => setMapOpacity(parseFloat(e.target.value))}
                disabled={!showHistoricalMap}
                className={`w-full h-1 bg-ink/20 rounded-lg cursor-pointer ${!showHistoricalMap && 'opacity-50'}`}
            />

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-ink/5">
                <button
                    onClick={() => setShowDistricts(!showDistricts)}
                    className="flex items-center gap-2 text-xs font-bold text-ink hover:text-earth-orange"
                >
                    <MapIcon size={12} />
                    Sesti/Quartieri
                </button>
                <button
                    onClick={() => setShowDistricts(!showDistricts)}
                    className={`w-8 h-4 rounded-full relative transition-colors ${showDistricts ? 'bg-earth-orange' : 'bg-ink/20'}`}
                >
                    <div
                        className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all shadow-sm ${showDistricts ? 'left-4.5' : 'left-0.5'}`}
                    />
                </button>
            </div>
        </Section>
    );
};

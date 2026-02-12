import React from 'react';
import { DistrictPolygon } from '../../../data/districts';
import { X, Flag, Info } from 'lucide-react';

interface MapSidebarProps {
    selectedDistrict: DistrictPolygon;
    currentYear: number;
    onClose: () => void;
}

// 👇 השינוי: export const (בלי default)
export const MapSidebar: React.FC<MapSidebarProps> = ({ selectedDistrict, currentYear, onClose }) => {
    return (
        <div className="w-72 bg-parchment border-l border-ink/20 shadow-xl z-20 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-4 border-b border-ink/10 flex items-start justify-between bg-ink/5">
                <div>
                    <h2 className="font-display text-xl font-bold text-ink">{selectedDistrict.name}</h2>
                    <span className="text-[10px] uppercase tracking-widest text-ink-light font-bold">
                            {currentYear < 1343 ? "Historical Sesto" : "Historical Quartiere"}
                    </span>
                </div>
                <button onClick={onClose} className="text-ink/40 hover:text-ink transition-colors"><X size={18} /></button>
            </div>
            
            <div className="p-5 flex-1 overflow-y-auto">
                <div className="mb-6 text-center">
                    <div className="w-32 h-32 mx-auto mb-2 flex items-center justify-center">
                        {selectedDistrict.img ? (
                            <img src={selectedDistrict.img} alt={selectedDistrict.name} className="w-full h-full object-contain drop-shadow-lg" />
                        ) : (
                            <Flag size={60} style={{ color: selectedDistrict.color }} />
                        )}
                    </div>
                    {selectedDistrict.mainSymbol && (
                        <div className="inline-block px-3 py-1 bg-ink/5 rounded-full text-xs font-bold text-ink border border-ink/10">{selectedDistrict.mainSymbol}</div>
                    )}
                </div>
                {selectedDistrict.description && (
                    <div className="mb-6">
                        <h4 className="text-[10px] uppercase font-bold text-ink-light mb-2 flex items-center gap-1"><Info size={12} /> Historical Context</h4>
                        <p className="text-sm font-serif leading-relaxed text-ink/80 italic">"{selectedDistrict.description}"</p>
                    </div>
                )}
                {selectedDistrict.gonfaloni && selectedDistrict.gonfaloni.length > 0 && (
                    <div>
                        <h4 className="text-[10px] uppercase font-bold text-ink-light mb-3 flex items-center gap-1"><Flag size={12} /> Gonfaloni (Companies)</h4>
                        <div className="space-y-2">
                            {selectedDistrict.gonfaloni.map((g, i) => (
                                <div key={i} className="flex items-center gap-3 p-2 rounded bg-white border border-ink/10 shadow-sm">
                                    <div className="w-2 h-8 bg-earth-orange/20 rounded-full" />
                                    <span className="text-xs font-bold text-ink">{g}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
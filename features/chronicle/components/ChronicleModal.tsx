
import React, { useState } from 'react';
import { HistoricalEvent } from '../../../src/types';
import { X, BookOpen, Feather, ChevronDown, ChevronUp } from 'lucide-react';

interface ChronicleModalProps {
  event: HistoricalEvent | null;
  onClose: () => void;
}

const ChronicleModal: React.FC<ChronicleModalProps> = ({ event, onClose }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (!event) return null;
  
  const toggleSource = (idx: number) => {
      setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-500">
      
      {/* Container simulating a book/manuscript */}
      <div 
        className="relative w-full max-w-2xl bg-[#F3EDE2] rounded-sm border-2 border-[#8B5E3C] max-h-[85vh] flex flex-col overflow-hidden"
        style={{
            // "Paper lifting off a desk" shadow effect:
            // 1. Tight inner border for thickness
            // 2. Medium ambient shadow for ground contact
            // 3. Large, spread-out shadow for the "lift"
            boxShadow: `
                0 0 0 1px rgba(139, 94, 60, 0.4), 
                0 20px 40px -10px rgba(0, 0, 0, 0.6), 
                0 40px 80px -20px rgba(0, 0, 0, 0.5), 
                inset 0 0 120px rgba(139, 94, 60, 0.15)
            `
        }}
      >
        {/* Paper Texture Overlay */}
        <div className="absolute inset-0 paper-texture opacity-30 pointer-events-none z-0"></div>

        {/* Header / Decorative Border */}
        <div className="relative z-10 p-8 pb-4 text-center border-b border-ink/10">
            {/* Wax Seal Close Button */}
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 bg-[#800020] rounded-full shadow-lg flex items-center justify-center text-[#F3EDE2] hover:bg-[#A00028] transition-transform hover:scale-110 active:scale-95 border-2 border-black/20"
                title="Close Chronicle"
                style={{ boxShadow: '2px 4px 8px rgba(0,0,0,0.4)' }}
            >
                <X size={20} strokeWidth={2.5} />
            </button>

            <div className="flex justify-center mb-2 text-[#8B5E3C] opacity-60">
                <BookOpen size={32} strokeWidth={1} />
            </div>
            
            <h2 className="text-3xl md:text-5xl font-medieval font-bold text-ink leading-tight mb-2 drop-shadow-sm tracking-wide">
                {event.title}
            </h2>
            <div className="flex items-center justify-center gap-3">
                 <div className="h-[1px] w-12 bg-earth-orange/50"></div>
                 <span className="font-display font-bold text-earth-orange text-xl">{event.year} A.D.</span>
                 <div className="h-[1px] w-12 bg-earth-orange/50"></div>
            </div>
        </div>

        {/* Content Scroll Area */}
        <div className="relative z-10 flex-1 overflow-y-auto p-8 pt-6 custom-scrollbar">
            
            {/* Illuminated First Letter Style (Drop Cap) */}
            <div className="font-serif text-xl md:text-2xl leading-relaxed text-ink/90 text-justify">
                <span className="float-left mr-3 mt-[-8px] text-8xl font-medieval font-bold text-[#800020] leading-[0.7] drop-shadow-md select-none first-letter:float-left">
                    {event.fullDescription.charAt(0)}
                </span>
                {event.fullDescription.slice(1)}
            </div>

            {/* Sources Section */}
            {event.sources && event.sources.length > 0 && (
                <div className="mt-12 border-t border-ink/20 pt-6">
                    <div className="flex items-center gap-2 mb-3 opacity-70">
                        <Feather size={16} className="text-ink-light" />
                        <h4 className="text-xs font-bold uppercase tracking-widest text-ink-light">Historical Sources</h4>
                    </div>
                    <ul className="space-y-3">
                        {event.sources.map((source, idx) => (
                            <li key={idx} className="group">
                                <button 
                                    onClick={() => toggleSource(idx)}
                                    className="w-full text-left flex items-start gap-2 text-sm font-serif italic text-ink-light hover:text-earth-orange transition-colors focus:outline-none"
                                >
                                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-ink/20 group-hover:bg-earth-orange shrink-0"></span>
                                    <div className="flex-1">
                                        <span className="border-b border-transparent group-hover:border-earth-orange/30 transition-all">
                                            {source.title}
                                        </span>
                                        {source.quote && (
                                            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedIndex === idx ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                                                <p className="text-ink/80 border-l-2 border-earth-orange/40 pl-3 py-1 text-sm leading-relaxed">
                                                    "{source.quote}"
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    {source.quote && (
                                        <span className="text-ink/20 group-hover:text-earth-orange shrink-0">
                                            {expandedIndex === idx ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                        </span>
                                    )}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>

        {/* Footer decoration */}
        <div className="relative z-10 h-8 bg-[#E6DCCF] border-t border-ink/10 flex items-center justify-center">
             <div className="text-[10px] text-ink/40 uppercase tracking-[0.3em] font-sans font-bold">Florentine Chronicle</div>
        </div>

      </div>
    </div>
  );
};

export default ChronicleModal;

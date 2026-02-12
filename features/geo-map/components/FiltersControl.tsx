import React from 'react';
import { Heart, Droplet, Skull, Zap, Users, Palette } from 'lucide-react';

const FiltersControl = ({ 
  colorMode, 
  setColorMode, 
  activeRelTypes, 
  toggleRelType 
}) => {

  return (
    <div className="flex flex-col gap-4 p-1">
      
      {/* --- Pin Coloring Section --- */}
      <div>
        <div className="flex items-center gap-2 mb-2">
            <Palette size={12} className="text-ink-light" />
            <p className="text-[10px] uppercase font-bold text-ink-light tracking-widest">Pin Coloring</p>
        </div>
        <div className="flex gap-1 bg-white p-1 rounded border border-ink/10 shadow-sm">
          <button 
            onClick={() => setColorMode('default')} 
            className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded transition-all ${
              colorMode === 'default' 
                ? 'bg-[#c27646] text-white shadow-sm' 
                : 'text-ink/60 hover:bg-ink/5'
            }`}
          >
            Default
          </button>
          <button 
            onClick={() => setColorMode('guild')} 
            className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded transition-all ${
              colorMode === 'guild' 
                ? 'bg-[#c27646] text-white shadow-sm' 
                : 'text-ink/60 hover:bg-ink/5'
            }`}
          >
            Guilds
          </button>
        </div>
      </div>

      {/* --- Relationships Filter Section --- */}
      <div>
        <div className="flex items-center gap-2 mb-2">
            <Users size={12} className="text-ink-light" />
            <p className="text-[10px] uppercase font-bold text-ink-light tracking-widest">Relationships</p>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {/* Marriage */}
          <button 
            onClick={() => toggleRelType('Marriage')} 
            className={`flex items-center justify-center gap-2 px-2 py-2 rounded border text-[10px] font-bold transition-all ${
              activeRelTypes.has('Marriage') 
                ? 'bg-green-50 border-green-600 text-green-800 shadow-sm' 
                : 'bg-white border-ink/10 text-ink/40 hover:border-ink/30'
            }`}
          >
            <Heart size={12} className={activeRelTypes.has('Marriage') ? 'fill-current' : ''} /> 
            Marriage
          </button>

          {/* Blood */}
          <button 
            onClick={() => toggleRelType('Blood')} 
            className={`flex items-center justify-center gap-2 px-2 py-2 rounded border text-[10px] font-bold transition-all ${
              activeRelTypes.has('Blood') 
                ? 'bg-red-50 border-red-800 text-red-900 shadow-sm' 
                : 'bg-white border-ink/10 text-ink/40 hover:border-ink/30'
            }`}
          >
            <Droplet size={12} className={activeRelTypes.has('Blood') ? 'fill-current' : ''} /> 
            Blood
          </button>

          {/* Feud */}
          <button 
            onClick={() => toggleRelType('Feud')} 
            className={`flex items-center justify-center gap-2 px-2 py-2 rounded border text-[10px] font-bold transition-all ${
              activeRelTypes.has('Feud') 
                ? 'bg-red-50 border-red-500 text-red-600 shadow-sm' 
                : 'bg-white border-ink/10 text-ink/40 hover:border-ink/30'
            }`}
          >
            <Skull size={12} className={activeRelTypes.has('Feud') ? 'fill-current' : ''} /> 
            Feud
          </button>

          {/* Alliance */}
          <button 
            onClick={() => toggleRelType('Alliance')} 
            className={`flex items-center justify-center gap-2 px-2 py-2 rounded border text-[10px] font-bold transition-all ${
              activeRelTypes.has('Alliance') 
                ? 'bg-blue-50 border-blue-600 text-blue-800 shadow-sm' 
                : 'bg-white border-ink/10 text-ink/40 hover:border-ink/30'
            }`}
          >
            <Zap size={12} className={activeRelTypes.has('Alliance') ? 'fill-current' : ''} /> 
            Alliance
          </button>
        </div>
      </div>

    </div>
  );
};

export default FiltersControl;
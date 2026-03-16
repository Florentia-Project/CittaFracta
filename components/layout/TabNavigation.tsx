import React from 'react';
import { Users, MapPin } from 'lucide-react';

interface TabNavigationProps {
  activeTab: 'map' | 'city';
  setActiveTab: (tab: 'map' | 'city') => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="hidden sm:flex gap-6 text-[10px] font-sans font-bold tracking-widest uppercase mb-2">
      <button
        onClick={() => setActiveTab('map')}
        className={`flex items-center gap-2 transition-all pb-1 border-b ${
          activeTab === 'map'
            ? 'border-earth-orange text-earth-orange'
            : 'border-transparent text-ink-light hover:text-ink'
        }`}
      >
        <Users size={12} /> Visualization
      </button>
      <button
        onClick={() => setActiveTab('city')}
        className={`flex items-center gap-2 transition-all pb-1 border-b ${
          activeTab === 'city'
            ? 'border-earth-orange text-earth-orange'
            : 'border-transparent text-ink-light hover:text-ink'
        }`}
      >
        <MapPin size={12} /> City Map
      </button>
    </div>
  );
};

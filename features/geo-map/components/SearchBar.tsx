import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm }) => {
    return (
        <div className="p-4 border-b border-ink/10 bg-parchment">
            <h2 className="text-lg font-display font-bold text-ink mb-2">Città di Firenze</h2>
            <div className="relative">
                <Search className="absolute left-2 top-2 text-ink-light" size={12} />
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-ink/5 border border-ink/10 rounded pl-7 pr-2 py-1 text-xs focus:outline-none focus:border-earth-orange"
                />
            </div>
        </div>
    );
};

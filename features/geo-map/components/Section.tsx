import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface SectionProps {
    title: string;
    icon: any;
    children: React.ReactNode;
    isOpen: boolean;
    onToggle: () => void;
}

export const Section: React.FC<SectionProps> = ({ title, icon: Icon, children, isOpen, onToggle }) => (
    <div className="border-b border-ink/10">
        <button
            onClick={onToggle}
            className="w-full flex items-center justify-between p-3 bg-parchment hover:bg-ink/5 transition-colors"
        >
            <div className="flex items-center gap-2">
                <Icon size={14} className="text-ink-light" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-ink">{title}</span>
            </div>
            {isOpen ? (
                <ChevronDown size={14} className="text-earth-orange" />
            ) : (
                <ChevronRight size={14} className="text-ink/30" />
            )}
        </button>
        {isOpen && <div className="p-3 bg-ink/5 border-t border-ink/5">{children}</div>}
    </div>
);

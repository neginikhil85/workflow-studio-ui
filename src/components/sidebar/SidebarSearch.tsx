import React from 'react';
import { Search } from 'lucide-react';

interface SidebarSearchProps {
    value: string;
    onChange: (value: string) => void;
}

export const SidebarSearch: React.FC<SidebarSearchProps> = ({ value, onChange }) => {
    return (
        <div className="p-3">
            <div className="relative group">
                <Search className="absolute left-2.5 top-2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={14} />
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all placeholder:text-slate-400"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            </div>
        </div>
    );
};

import React from 'react';
import { Globe } from 'lucide-react';
import { EnvironmentVariable } from '../../../services/IEnvironmentService';

interface SuggestionsListProps {
    suggestions: EnvironmentVariable[];
    onSelect: (id: string) => void;
}

export const SuggestionsList: React.FC<SuggestionsListProps> = ({ suggestions, onSelect }) => (
    <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-white rounded-lg shadow-xl border border-slate-200 max-h-48 overflow-y-auto animate-in fade-in zoom-in-95 duration-100 text-slate-800">
        <div className="px-2 py-1.5 bg-slate-50 border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-2">
            <Globe size={10} /> Global Variables
        </div>
        {suggestions.map(v => (
            <button
                key={v.id}
                onClick={() => onSelect(v.id)}
                className="w-full text-left px-3 py-2 text-xs hover:bg-violet-50 hover:text-violet-700 flex items-center justify-between group transition-colors"
            >
                <span className="font-mono font-medium">{v.id}</span>
                <span className="text-[10px] text-slate-400 font-mono group-hover:text-violet-400 truncate max-w-[100px]">
                    {v.value ? '••••••' : '(empty)'}
                </span>
            </button>
        ))}
    </div>
);

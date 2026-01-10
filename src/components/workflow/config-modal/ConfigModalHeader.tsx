import React from 'react';
import { X, HelpCircle } from 'lucide-react';

interface ConfigModalHeaderProps {
    nodeLabel: string;
    onClose: () => void;
}

export const ConfigModalHeader: React.FC<ConfigModalHeaderProps> = ({ nodeLabel, onClose }) => {
    return (
        <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-white z-10">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <HelpCircle size={20} className="text-slate-400" />
                <span>Configure {nodeLabel}</span>
            </h2>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 text-slate-400 transition-colors">
                <X size={20} />
            </button>
        </div>
    );
};

import React from 'react';
import { ChevronDown } from 'lucide-react';

export const SidebarProfile: React.FC = () => {
    return (
        <div className="p-3 border-t border-slate-200">
            <button className="flex items-center gap-2.5 w-full p-1.5 hover:bg-slate-200/50 rounded-lg transition-colors text-left group">
                <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600 border border-indigo-200">
                    JD
                </div>
                <div className="flex-1 overflow-hidden">
                    <p className="text-xs font-semibold text-slate-700 truncate">John Doe</p>
                    <p className="text-[10px] text-slate-500 truncate">Workspace Admin</p>
                </div>
                <ChevronDown size={14} className="text-slate-400 group-hover:text-slate-600" />
            </button>
        </div>
    );
};

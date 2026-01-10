import { Blocks } from 'lucide-react';
import React from 'react';

export const SidebarBranding: React.FC = () => {
    return (
        <div className="h-14 flex items-center px-4 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-linear-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center shadow-md shadow-indigo-500/20">
                    <Blocks className="text-white" size={18} />
                </div>
                <div>
                    <span className="block text-sm font-bold text-slate-900 tracking-tight leading-none">Workflow</span>
                    <span className="block text-[10px] font-medium text-slate-500 uppercase tracking-wider leading-none mt-0.5">Studio</span>
                </div>
            </div>
        </div>
    );
};

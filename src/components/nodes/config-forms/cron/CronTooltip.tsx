import React from 'react';
import { Info } from 'lucide-react';

export const CronTooltip: React.FC = () => {
    return (
        <div className="group relative">
            <Info size={14} className="text-slate-400 cursor-help hover:text-indigo-500 transition-colors" />

            {/* Tooltip - Positioned below (top-full) and aligned left to avoid clipping */}
            <div className="absolute left-0 top-full mt-2 w-80 p-3 bg-slate-800 text-white text-[10px] rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none origin-top-left">
                <div className="font-bold mb-2 text-slate-200 border-b border-slate-700 pb-1">Cron Expression Guidelines</div>

                <div className="font-mono bg-slate-700/50 p-1.5 rounded mb-2 text-center text-indigo-200 text-[9px] tracking-wide whitespace-nowrap">
                    Format: Second Minute Hour Day Month DayOfWeek
                </div>

                <div className="grid grid-cols-[24px_1fr] gap-x-1 gap-y-1.5 text-[9px]">
                    <div className="text-center font-mono font-bold text-indigo-300 bg-slate-700/30 rounded">*</div>
                    <div className="text-slate-300 flex items-center">Every <span className="text-slate-500 ml-1">(e.g. * * *)</span></div>

                    <div className="text-center font-mono font-bold text-indigo-300 bg-slate-700/30 rounded">*/n</div>
                    <div className="text-slate-300 flex items-center">Interval <span className="text-slate-500 ml-1">(e.g. */30)</span></div>

                    <div className="text-center font-mono font-bold text-indigo-300 bg-slate-700/30 rounded">,</div>
                    <div className="text-slate-300 flex items-center">List <span className="text-slate-500 ml-1">(e.g. 10,20)</span></div>

                    <div className="text-center font-mono font-bold text-indigo-300 bg-slate-700/30 rounded">-</div>
                    <div className="text-slate-300 flex items-center">Range <span className="text-slate-500 ml-1">(e.g. 1-5)</span></div>
                </div>

                {/* Arrow pointing up */}
                <div className="absolute top-[-4px] left-1 w-2 h-2 bg-slate-800 rotate-45"></div>
            </div>
        </div>
    );
};

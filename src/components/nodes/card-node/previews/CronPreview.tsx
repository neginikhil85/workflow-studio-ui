import React from 'react';
import { Clock } from 'lucide-react';
import { PreviewField } from './PreviewField';

export const CronPreview: React.FC<{ config: any }> = ({ config }) => {
    if (!config.cron) {
        return (
            <div className="flex items-center gap-2 mt-2 px-2 py-1.5 bg-slate-50 rounded-md border border-slate-100/50">
                <Clock size={10} className="text-slate-400" />
                <span className="text-[10px] text-slate-400 italic">No schedule</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2 mt-2 px-2 py-1.5 bg-slate-50 rounded-md border border-slate-100/50">
            <Clock size={10} className="text-slate-400" />
            <span className="text-[10px] font-mono text-slate-600">{config.cron}</span>
        </div>
    );
};

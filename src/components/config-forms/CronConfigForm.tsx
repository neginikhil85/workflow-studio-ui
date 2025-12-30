import React from 'react';
import { NodeConfig } from '../../types/workflow';

interface CronConfigFormProps {
    config: NodeConfig;
    onChange: (key: string, value: any) => void;
}

const CronConfigForm: React.FC<CronConfigFormProps> = ({ config, onChange }) => {
    return (
        <div className="space-y-4">
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Cron Expression</label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={config.cron || ''}
                        onChange={(e) => onChange('cron', e.target.value)}
                        placeholder="* * * * *"
                        className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                </div>
                <p className="text-xs text-slate-400 mt-2">Format: Minute Hour Day Month DayOfWeek</p>
            </div>
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Description</label>
                <input
                    type="text"
                    value={config.description || ''}
                    onChange={(e) => onChange('description', e.target.value)}
                    placeholder="e.g., Run every morning at 8am"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
            </div>
        </div>
    );
};

export default CronConfigForm;

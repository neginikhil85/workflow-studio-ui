import React, { useMemo } from 'react';
import cronstrue from 'cronstrue';
import { NodeConfig } from '../../../../types/workflow.interfaces';
import { CronTooltip } from './CronTooltip';

interface CronConfigFormProps {
    config: NodeConfig;
    onChange: (key: string, value: any) => void;
}

const CronConfigForm: React.FC<CronConfigFormProps> = ({ config, onChange }) => {
    const cronDescription = useMemo(() => {
        const cron = config.cron?.trim();
        if (!cron) return null;
        try {
            return cronstrue.toString(cron, { throwExceptionOnParseError: true });
        } catch {
            return null;
        }
    }, [config.cron]);

    const isValidCron = cronDescription !== null;

    return (
        <div className="space-y-4">
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase">Cron Expression</label>
                    <CronTooltip />
                </div>
                <input
                    type="text"
                    value={config.cron || ''}
                    onChange={(e) => onChange('cron', e.target.value)}
                    placeholder="0 0 9 * * *"
                    className={`w-full px-3 py-2 font-mono bg-slate-50 border rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 ${config.cron && !isValidCron
                        ? 'border-rose-300 focus:ring-rose-500/50'
                        : 'border-slate-300 focus:ring-blue-500/50'
                        }`}
                />

                {config.cron && (
                    <div className="mt-1.5 ml-1">
                        {isValidCron ? (
                            <div className="flex items-center gap-1.5 text-xs font-medium text-green-600">
                                <span>📅</span>
                                <span>{cronDescription}</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1.5 text-xs font-medium text-rose-600">
                                <span>⚠️</span>
                                <span>Invalid cron expression</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Description</label>
                <input
                    type="text"
                    value={config.description || ''}
                    onChange={(e) => onChange('description', e.target.value)}
                    placeholder="e.g., My Daily Backup Schedule"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-mono"
                />
            </div>
        </div>
    );
};

export default CronConfigForm;

import React, { useMemo } from 'react';
import cronstrue from 'cronstrue';
import { NodeConfig } from '../../../../types/workflow.interfaces';
import { CronTooltip } from './CronTooltip';
import { VariableInput } from '../../../../components/common/VariableInput';

interface CronConfigFormProps {
    config: NodeConfig;
    onChange: (key: string, value: any) => void;
}

const CronConfigForm: React.FC<CronConfigFormProps> = ({ config, onChange }) => {
    const cronDescription = useMemo(() => {
        const cron = config.cron?.trim();
        if (!cron) return null;
        // If it contains a variable, don't try to parse it
        if (cron.includes('${')) return "Dynamic cron expression";

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
                <VariableInput
                    value={config.cron || ''}
                    onValueChange={(val) => onChange('cron', val)}
                    placeholder="0 0 9 * * *"
                    className={`font-mono bg-slate-50 text-slate-900 ${config.cron && !isValidCron && !config.cron.includes('${')
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
                <VariableInput
                    value={config.description || ''}
                    onValueChange={(val) => onChange('description', val)}
                    placeholder="e.g., My Daily Backup Schedule"
                    className="bg-slate-50 border-slate-200 font-mono"
                />
            </div>
        </div>
    );
};

export default CronConfigForm;

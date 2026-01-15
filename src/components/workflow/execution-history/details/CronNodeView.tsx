import React from 'react';
import { NodeExecutionResult } from '../../../../types/workflow.interfaces';
import { Clock } from 'lucide-react';

interface CronNodeViewProps {
    result: NodeExecutionResult;
}

export const CronNodeView: React.FC<CronNodeViewProps> = ({ result }) => {
    const cronDetails = (result.executionDetails || {}) as any;

    return (
        <div className="p-6 flex flex-col items-center justify-center h-full text-center">
            <div className="mb-6 p-4 bg-slate-50 rounded-full">
                <div className="p-3 bg-white rounded-full shadow-sm text-blue-600">
                    <Clock size={32} strokeWidth={1.5} />
                </div>
            </div>

            <h3 className="text-sm font-semibold text-slate-800 mb-1">Scheduled Trigger</h3>
            <p className="text-xs text-slate-500 mb-6 max-w-[200px]">
                This workflow was triggered by a Cron Schedule.
            </p>

            <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 w-full max-w-sm">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-slate-400 font-medium uppercase">Expression</span>
                    <div className="text-lg font-bold text-slate-700 tracking-wider font-mono bg-slate-100 p-2 rounded">
                        {cronDetails.expression || 'Invalid Expression'}
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400 font-medium uppercase">Triggered At</span>
                    <span className="text-xs text-slate-800">
                        {new Date(result.startedAt).toLocaleString()}
                    </span>
                </div>
            </div>
        </div>
    );
};

import React from 'react';
import { NodeExecutionResult } from '../../../../types/workflow.interfaces';
import { Terminal } from 'lucide-react';

interface ConsoleNodeViewProps {
    result: NodeExecutionResult;
}

export const ConsoleNodeView: React.FC<ConsoleNodeViewProps> = ({ result }) => {
    const logData = (result.executionDetails || {}) as any;

    // Sometimes the log message is directly in input, or in a specific field
    const logMessage = typeof logData === 'string' ? logData : JSON.stringify(logData, null, 2);

    return (
        <div className="flex flex-col h-full bg-slate-900 text-slate-200 font-mono text-xs">
            <div className="flex items-center gap-2 p-3 border-b border-slate-700 bg-slate-800/50">
                <Terminal size={14} className="text-emerald-400" />
                <span className="font-semibold text-slate-300">Console Output</span>
            </div>

            <div className="flex-1 p-4 overflow-auto whitespace-pre-wrap">
                <span className="text-emerald-500 mr-2">➜</span>
                <span className="opacity-90">{logMessage}</span>

                <div className="mt-2 text-slate-500 text-[10px]">
                    Executed in {result.duration}ms
                </div>
            </div>
        </div>
    );
};

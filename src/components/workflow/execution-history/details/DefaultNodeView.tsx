import React from 'react';
import { NodeExecutionResult } from '../../../../types/workflow.interfaces';
import { FileJson } from 'lucide-react';

interface DefaultNodeViewProps {
    result: NodeExecutionResult;
}

export const DefaultNodeView: React.FC<DefaultNodeViewProps> = ({ result }) => {
    const JsonBlock = ({ label, data }: { label: string; data: any }) => {
        if (!data || (typeof data === 'object' && Object.keys(data).length === 0)) return null;

        return (
            <div className="mb-4">
                <h4 className="text-[10px] font-semibold text-slate-400 uppercase mb-2 ml-1">{label}</h4>
                <div className="bg-slate-50 border border-slate-200 rounded-md overflow-hidden">
                    <pre className="p-3 text-[10px] text-slate-700 font-mono overflow-auto max-h-[300px]">
                        {JSON.stringify(data, null, 2)}
                    </pre>
                </div>
            </div>
        );
    };

    return (
        <div className="h-full flex flex-col">
            <div className="bg-white p-4 border-b border-slate-100 flex items-center gap-2">
                <FileJson size={16} className="text-slate-400" />
                <span className="font-semibold text-slate-700 text-sm">Execution Details</span>
            </div>

            <div className="p-6 flex-1 overflow-y-auto">
                <JsonBlock label="Execution Details" data={result.executionDetails} />

                {result.errorMessage && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-md text-red-600 text-xs font-mono">
                        <strong>Error:</strong> {result.errorMessage}
                    </div>
                )}
            </div>
        </div>
    );
};

import { NodeExecutionResult } from '../../../types/workflow.interfaces';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { NODE_STATUS } from '../../../config/constants';

interface RunDetailsViewProps {
    nodeResults: NodeExecutionResult[];
}

export const RunDetailsView: React.FC<RunDetailsViewProps> = ({ nodeResults }) => {
    if (!nodeResults || nodeResults.length === 0) {
        return <div className="p-4 text-center text-slate-400 text-sm">No node execution details available.</div>;
    }

    return (
        <div className="bg-slate-50 border-t border-slate-100 p-4 animate-fade-in">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Node Execution Trace</h4>
            <div className="space-y-2">
                {nodeResults.map((node) => (
                    <div key={node.id} className="bg-white border border-slate-200 rounded-md p-3 text-sm shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                {node.status === NODE_STATUS.SUCCESS ? (
                                    <CheckCircle size={14} className="text-emerald-500" />
                                ) : (
                                    <AlertCircle size={14} className="text-red-500" />
                                )}
                                <span className="font-medium text-slate-800 font-mono text-xs">{node.nodeId}</span>
                                <span className="text-xs text-slate-400">
                                    {node.duration}ms
                                </span>
                            </div>
                            <span className="text-[10px] text-slate-400">
                                {new Date(node.startedAt).toLocaleTimeString()}
                            </span>
                        </div>

                        {/* Data Viewer */}
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            <div className="bg-slate-50 p-2 rounded border border-slate-100">
                                <span className="text-[10px] font-semibold text-slate-400 block mb-1">INPUT</span>
                                <pre className="text-[10px] text-slate-600 overflow-x-auto">
                                    {JSON.stringify(node.executionDetails?.input || {}, null, 2)}
                                </pre>
                            </div>
                            <div className="bg-slate-50 p-2 rounded border border-slate-100">
                                <span className="text-[10px] font-semibold text-slate-400 block mb-1">OUTPUT</span>
                                <pre className="text-[10px] text-slate-600 overflow-x-auto">
                                    {JSON.stringify(node.executionDetails?.output || node.errorMessage || {}, null, 2)}
                                </pre>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

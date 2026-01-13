import React, { useEffect, useState } from 'react';
import { X, Clock, AlertCircle, CheckCircle, Ban, PlayCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { WorkflowRun, NodeExecutionResult } from '../../../types/workflow.interfaces';
import { RunDetailsView } from './RunDetailsView';
import { WORKFLOW_STATUS, TIME_MS, STATUS_COLORS } from '../../../config/constants';

interface ExecutionHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    workflowId: string | null;
}

const formatDuration = (start: string, end?: string) => {
    if (!end) return '-';
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    const diff = e - s;
    if (diff < TIME_MS.SECOND) return `${diff}ms`;
    if (diff < TIME_MS.MINUTE) return `${(diff / TIME_MS.SECOND).toFixed(2)}s`;
    return `${(diff / TIME_MS.MINUTE).toFixed(2)}m`;
};

const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
        case WORKFLOW_STATUS.COMPLETED: return <CheckCircle size={16} className={STATUS_COLORS[WORKFLOW_STATUS.COMPLETED]} />;
        case WORKFLOW_STATUS.FAILED: return <AlertCircle size={16} className={STATUS_COLORS[WORKFLOW_STATUS.FAILED]} />;
        case WORKFLOW_STATUS.ACTIVE: return <PlayCircle size={16} className={STATUS_COLORS[WORKFLOW_STATUS.ACTIVE]} />;
        case WORKFLOW_STATUS.STOPPED:
        case WORKFLOW_STATUS.CANCELLED: return <Ban size={16} className={STATUS_COLORS[WORKFLOW_STATUS.STOPPED]} />;
        default: return <Clock size={16} className={STATUS_COLORS.DEFAULT} />;
    }
};

export const ExecutionHistoryModal: React.FC<ExecutionHistoryModalProps> = ({ isOpen, onClose, workflowId }) => {
    const [runs, setRuns] = useState<WorkflowRun[]>([]);
    const [loading, setLoading] = useState(false);
    const [expandedRunId, setExpandedRunId] = useState<string | null>(null);
    const [nodeResults, setNodeResults] = useState<Record<string, NodeExecutionResult[]>>({});
    const [loadingNodes, setLoadingNodes] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (isOpen && workflowId) {
            setLoading(true);

            const fetchRuns = async () => {
                try {
                    const { HttpWorkflowService } = await import('../../../services/HttpWorkflowService');
                    const service = new HttpWorkflowService();
                    const data = await service.getWorkflowRuns(workflowId);
                    setRuns(data);
                } catch (e) {
                    console.error("Failed to load runs", e);
                } finally {
                    setLoading(false);
                }
            };
            fetchRuns();
            setExpandedRunId(null);
            setNodeResults({});
        }
    }, [isOpen, workflowId]);

    const toggleRun = async (runId: string) => {
        if (expandedRunId === runId) {
            setExpandedRunId(null);
            return;
        }

        setExpandedRunId(runId);

        if (!nodeResults[runId]) {
            setLoadingNodes(prev => ({ ...prev, [runId]: true }));
            try {
                const { HttpWorkflowService } = await import('../../../services/HttpWorkflowService');
                const service = new HttpWorkflowService();
                const data = await service.getRunNodeExecutions(runId);
                setNodeResults(prev => ({ ...prev, [runId]: data }));
            } catch (e) {
                console.error("Failed to load node results", e);
            } finally {
                setLoadingNodes(prev => ({ ...prev, [runId]: false }));
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden border border-slate-100 flex flex-col max-h-[80vh]">

                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-800">Execution History</h2>
                        <p className="text-xs text-slate-500">History of workflow runs</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
                    {loading ? (
                        <div className="text-center py-12 text-slate-400">Loading history...</div>
                    ) : runs.length === 0 ? (
                        <div className="text-center py-12 text-slate-400 border-2 border-dashed border-slate-200 rounded-lg">
                            No execution history available.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {runs.map(run => (
                                <div key={run.id} className="bg-white rounded-lg border border-slate-200 shadow-sm transition-all overflow-hidden">
                                    <div
                                        className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50"
                                        onClick={() => toggleRun(run.id)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <StatusIcon status={run.status} />
                                            <div>
                                                <div className="text-sm font-medium text-slate-900">
                                                    {new Date(run.startTime).toLocaleString()}
                                                </div>
                                                <div className="text-xs text-slate-500 flex gap-2">
                                                    <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-mono">
                                                        {run.triggerType}
                                                    </span>
                                                    <span>Duration: {formatDuration(run.startTime, run.endTime)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="text-right text-xs text-slate-400">
                                                <div>ID: {run.id.substring(0, 8)}...</div>
                                                {run.totalExecutions > 1 && (
                                                    <div className="text-orange-500 font-medium">{run.totalExecutions} attempts</div>
                                                )}
                                            </div>
                                            {expandedRunId === run.id ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                                        </div>
                                    </div>

                                    {/* Expanded Details */}
                                    {expandedRunId === run.id && (
                                        <div className="border-t border-slate-100">
                                            {loadingNodes[run.id] ? (
                                                <div className="p-4 text-center text-xs text-slate-400">Loading details...</div>
                                            ) : (
                                                <RunDetailsView nodeResults={nodeResults[run.id] || []} />
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

import React, { useEffect, useState } from 'react';
import { X, Clock, AlertCircle, CheckCircle, Ban, PlayCircle } from 'lucide-react';
import { WorkflowRun } from '../../../types/workflow.interfaces';

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
    if (diff < 1000) return `${diff}ms`;
    if (diff < 60000) return `${(diff / 1000).toFixed(2)}s`;
    return `${(diff / 60000).toFixed(2)}m`;
};

const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
        case 'COMPLETED': return <CheckCircle size={16} className="text-emerald-500" />;
        case 'FAILED': return <AlertCircle size={16} className="text-red-500" />;
        case 'ACTIVE': return <PlayCircle size={16} className="text-blue-500 animate-pulse" />;
        case 'STOPPED':
        case 'CANCELLED': return <Ban size={16} className="text-slate-400" />;
        default: return <Clock size={16} className="text-slate-400" />;
    }
};

export const ExecutionHistoryModal: React.FC<ExecutionHistoryModalProps> = ({ isOpen, onClose, workflowId }) => {
    const [runs, setRuns] = useState<WorkflowRun[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && workflowId) {
            setLoading(true);
            // We need to cast persistence to any or extend the interface in useWorkflow hook
            // Assuming persistence.service is accessible or we add getRuns to persistence wrapper
            // Note: useWorkflowPersistence doesn't expose service directly usually.
            // For now, I'll assume we expanded persistence wrapper or use service directly.
            // Since we didn't update useWorkflowPersistence yet, I will create a temp fix here.

            // Actually, best to import service directly if persistence wrapper is limited
            // But let's verify if we can update persistence wrapper.
            // For now, let's use the service instance if we can get it, or import HttpWorkflowService directly.

            const fetchRuns = async () => {
                try {
                    // Temporary direct service usage for speed, assuming single instance pattern
                    // Ideally should come from hook
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
        }
    }, [isOpen, workflowId]);

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
                                <div key={run.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
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

                                    <div className="text-right text-xs text-slate-400">
                                        <div>ID: {run.id.substring(0, 8)}...</div>
                                        {run.totalExecutions > 1 && (
                                            <div className="text-orange-500 font-medium">{run.totalExecutions} attempts</div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

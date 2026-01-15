import React, { useEffect, useState } from 'react';
import { X, Clock, AlertCircle, CheckCircle, Ban, PlayCircle, Loader2 } from 'lucide-react';
import { WorkflowRun, NodeExecutionResult, WorkflowExecution, WorkflowNodeDefinition } from '../../../types/workflow.interfaces';
import { WORKFLOW_STATUS, STATUS_COLORS, TIME_MS } from '../../../config/constants';
import { RunTimeline } from './RunTimeline';
import { NodeDetailPanel } from './NodeDetailPanel';

interface ExecutionHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    workflowId: string | null;
    nodes: any[];
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

export const ExecutionHistoryModal: React.FC<ExecutionHistoryModalProps> = ({ isOpen, onClose, workflowId, nodes }) => {
    const [runs, setRuns] = useState<WorkflowRun[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedRunId, setSelectedRunId] = useState<string | null>(null);

    // Detailed Data for selected run
    const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
    const [nodeResults, setNodeResults] = useState<NodeExecutionResult[]>([]);
    const [loadingDetails, setLoadingDetails] = useState(false);

    // Selection
    const [selectedNodeResult, setSelectedNodeResult] = useState<NodeExecutionResult | null>(null);

    // Normalize nodes (ReactFlow -> WorkflowNodeDefinition)
    const normalizedNodes: WorkflowNodeDefinition[] = React.useMemo(() => {
        return nodes.map((n: any) => ({
            id: n.id,
            nodeType: n.type || n.nodeType, // Handle both ReactFlow 'type' and internal 'nodeType'
            config: n.data?.config || n.config,
            metadata: {
                label: n.data?.label || n.metadata?.label,
                position: n.position || n.metadata?.position
            }
        }));
    }, [nodes]);

    useEffect(() => {
        if (isOpen && workflowId) {
            setLoading(true);
            const fetchRuns = async () => {
                try {
                    const { HttpWorkflowService } = await import('../../../services/HttpWorkflowService');
                    const service = new HttpWorkflowService();
                    const data = await service.getWorkflowRuns(workflowId);
                    setRuns(data);
                    if (data.length > 0) {
                        setSelectedRunId(data[0].id); // Auto select latest
                    }
                } catch (e) { console.error(e); } finally { setLoading(false); }
            };
            fetchRuns();
        }
    }, [isOpen, workflowId]);

    // Fetch details when run is selected
    useEffect(() => {
        if (selectedRunId) {
            setLoadingDetails(true);
            const fetchDetails = async () => {
                try {
                    const { HttpWorkflowService } = await import('../../../services/HttpWorkflowService');
                    const service = new HttpWorkflowService();

                    // Parallel fetch
                    const [execs, nodes] = await Promise.all([
                        service.getExecutionsForRun(selectedRunId),
                        service.getRunNodeExecutions(selectedRunId)
                    ]);

                    setExecutions(execs);
                    setNodeResults(nodes);

                    // Auto-select first node of latest execution
                    if (nodes.length > 0) {
                        setSelectedNodeResult(nodes[nodes.length - 1]);
                    } else {
                        setSelectedNodeResult(null);
                    }
                } catch (e) {
                    console.error(e);
                } finally {
                    setLoadingDetails(false);
                }
            };
            fetchDetails();
        }
    }, [selectedRunId]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-8">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[85vh] flex flex-col overflow-hidden border border-slate-200">

                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Execution History</h2>
                        <p className="text-xs text-slate-500">Inspect workflow runs and step details</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex flex-1 overflow-hidden">

                    {/* LEFT SIDEBAR: Run List */}
                    <div className="w-64 border-r border-slate-200 flex flex-col bg-white">
                        <div className="p-3 border-b border-slate-100 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Workflow Runs
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {loading ? (
                                <div className="p-4 flex justify-center"><Loader2 className="animate-spin text-slate-400" /></div>
                            ) : runs.map(run => (
                                <div
                                    key={run.id}
                                    onClick={() => setSelectedRunId(run.id)}
                                    className={`p-3 border-b border-slate-100 cursor-pointer transition-colors ${selectedRunId === run.id ? 'bg-blue-50/50 border-l-4 border-l-blue-500' : 'hover:bg-slate-50 border-l-4 border-l-transparent'
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <StatusIcon status={run.status} />
                                        <span className="text-[10px] text-slate-400 font-mono">{run.id.substring(0, 6)}</span>
                                    </div>
                                    <div className="text-sm font-medium text-slate-700 mb-1">
                                        {new Date(run.startTime).toLocaleTimeString()}
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] text-slate-500">
                                        <span>{run.triggerType}</span>
                                        <span>{formatDuration(run.startTime, run.endTime)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* MIDDLE: Timeline (Executions & Steps) */}
                    <div className="w-80 flex-shrink-0 border-r border-slate-200 flex flex-col bg-slate-50/30">
                        {loadingDetails ? (
                            <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-slate-400" /></div>
                        ) : (
                            <RunTimeline
                                executions={executions}
                                nodesResults={nodeResults}
                                nodesDefs={normalizedNodes}
                                selectedResultId={selectedNodeResult?.id || null}
                                onSelect={setSelectedNodeResult}
                            />
                        )}
                    </div>

                    {/* RIGHT: Details Panel */}
                    <div className="flex-1 bg-white overflow-hidden">
                        <NodeDetailPanel
                            result={selectedNodeResult}
                            nodeDef={selectedNodeResult ? normalizedNodes.find(n => n.id === selectedNodeResult.nodeId) : undefined}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

import React from 'react';
import { WorkflowExecution, NodeExecutionResult, WorkflowNodeDefinition } from '../../../types/workflow.interfaces';
import { CheckCircle, AlertCircle, Clock, ChevronRight, Play } from 'lucide-react';
import { NODE_STATUS } from '../../../config/constants';

interface RunTimelineProps {
    executions: WorkflowExecution[];
    nodesResults: NodeExecutionResult[];
    nodesDefs: WorkflowNodeDefinition[];
    selectedResultId: string | null;
    onSelect: (result: NodeExecutionResult) => void;
}

export const RunTimeline: React.FC<RunTimelineProps> = ({
    executions,
    nodesResults,
    nodesDefs,
    selectedResultId,
    onSelect
}) => {

    // Group results by executionId
    const groupedResults = executions.map(exec => ({
        execution: exec,
        results: nodesResults.filter(r => r.executionId === exec.id).sort((a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime())
    }));

    // If no executions metadata but we have results (legacy support), create a dummy group
    if (executions.length === 0 && nodesResults.length > 0) {
        groupedResults.push({
            execution: { id: 'legacy', runId: 'legacy', workflowId: '', status: 'COMPLETED', startedAt: nodesResults[0].startedAt, executedNodes: [] },
            results: nodesResults.sort((a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime())
        });
    }

    const getNodeName = (nodeId: string) => {
        const def = nodesDefs.find(n => n.id === nodeId);
        return def?.metadata?.label || def?.nodeType || nodeId;
    };

    return (
        <div className="h-full overflow-y-auto bg-slate-50 border-r border-slate-200">
            <div className="p-4 space-y-6">
                {groupedResults.map((group, index) => (
                    <div key={group.execution.id} className="relative">
                        {/* Execution Header */}
                        <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            <span className="w-6 h-6 rounded bg-slate-200 flex items-center justify-center text-slate-500">#{groupedResults.length - index}</span>
                            <span>Execution Attempt</span>
                            <span className="ml-auto text-[10px] font-normal normal-case opacity-70">
                                {new Date(group.execution.startedAt).toLocaleTimeString()}
                            </span>
                        </div>

                        {/* Node Steps */}
                        <div className="space-y-1 ml-3 border-l-2 border-slate-200 pl-3 pb-2">
                            {group.results.map((node) => {
                                const isSelected = selectedResultId === node.id;
                                const isSuccess = node.status === NODE_STATUS.SUCCESS;

                                return (
                                    <div
                                        key={node.id}
                                        onClick={() => onSelect(node)}
                                        className={`group relative flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${isSelected
                                                ? 'bg-blue-50 border border-blue-200 shadow-sm'
                                                : 'hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100'
                                            }`}
                                    >
                                        <div className={`flex-shrink-0 `}>
                                            {isSuccess ? <CheckCircle size={14} className="text-emerald-500" /> : <AlertCircle size={14} className="text-red-500" />}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className={`text-sm font-medium truncate ${isSelected ? 'text-blue-700' : 'text-slate-700'}`}>
                                                {getNodeName(node.nodeId)}
                                            </div>
                                            <div className="text-[10px] text-slate-400">
                                                {node.duration}ms
                                            </div>
                                        </div>

                                        {isSelected && <ChevronRight size={14} className="text-blue-400" />}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

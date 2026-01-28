import React from 'react';
import { Trash2, Square, Play, History, Globe, Save } from 'lucide-react';
import { HeaderExecution, HeaderPersistence } from '../../../types/workflow.interfaces';

interface HeaderActionsProps {
    execution: HeaderExecution;
    persistence: HeaderPersistence;
    onWorkflows: () => void;
    onHistory: () => void;
    onOpenSettings: () => void;
}

export const HeaderActions: React.FC<HeaderActionsProps> = ({ execution, persistence, onWorkflows, onHistory, onOpenSettings }) => {
    return (
        <div className="flex items-center gap-3">
            {/* Status Badge - Removed as per user request */}

            <button
                onClick={onOpenSettings}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-violet-600 hover:bg-violet-50 border border-slate-200 rounded-md transition-all group"
                title="Global Environmental Variables"
            >
                <Globe size={14} className="text-slate-400 group-hover:text-violet-500" />
                <span className="hidden md:inline">Variables</span>
            </button>

            <button
                onClick={onWorkflows}
                className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-primary-600 hover:bg-slate-50 border border-slate-200 rounded-md transition-all"
            >
                My Workflows
            </button>

            <button
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                onClick={() => persistence.clearWorkflow()}
                title="Clear Canvas"
            >
                <Trash2 size={16} />
            </button>

            <div className="h-4 w-px bg-slate-200"></div>

            <button
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-all shadow-sm shadow-blue-500/30"
                onClick={persistence.saveWorkflow}
            >
                <Save size={16} />
                <span>Save</span>
            </button>

            {/* Grouped Run & History Controls (Split Button) */}
            <div className={`flex items-center rounded-md shadow-sm transition-colors ${execution.isRunning ? 'bg-red-600 hover:bg-red-700 shadow-red-500/30' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/30'
                }`}>
                {execution.isRunning ? (
                    <button
                        className="flex items-center gap-2 px-3 py-1.5 text-white text-sm font-medium rounded-l-md hover:bg-black/10 transition-colors border-r border-red-500"
                        onClick={execution.stopWorkflow}
                    >
                        <Square size={14} fill="currentColor" />
                        <span>Stop</span>
                    </button>
                ) : (
                    <button
                        className="flex items-center gap-2 px-3 py-1.5 text-white text-sm font-medium rounded-l-md hover:bg-black/10 transition-colors border-r border-emerald-500"
                        onClick={execution.runWorkflow}
                    >
                        <Play size={14} fill="currentColor" />
                        <span>Run</span>
                    </button>
                )}

                <button
                    onClick={onHistory}
                    className="group relative px-2 py-1.5 text-white/90 hover:text-white hover:bg-black/10 rounded-r-md transition-colors"
                >
                    <History size={16} />
                    <span className="absolute top-full mt-2 right-0 w-max px-2 py-1 bg-slate-800 text-white text-[10px] rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                        View Run History
                    </span>
                </button>
            </div>
        </div>
    );
};

import React from 'react';
import { Trash2, Play } from 'lucide-react';

interface HeaderProps {
    onClear: () => void;
    onSave: () => void;
    onRun: () => void;
    onWorkflows: () => void;
    workflowId?: string | null;
    workflowName?: string;
}

const Header: React.FC<HeaderProps> = ({ onClear, onSave, onRun, onWorkflows, workflowId, workflowName }) => {
    return (
        <div className="h-14 bg-slate-100 border-b border-slate-200 flex items-center px-4 justify-between z-20 relative">
            <div className="flex items-center gap-4">
                {/* Breadcrumbs or Title */}
                <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-slate-500 hover:text-slate-700 cursor-pointer transition-colors">Workflows</span>
                    <span className="text-slate-300">/</span>
                    <span className="font-semibold text-slate-900">{workflowName || 'New Workflow'}</span>
                    {workflowId && (
                        <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-[10px] font-bold text-indigo-700 border border-indigo-200 ml-1.5 uppercase tracking-wide shadow-sm">
                            WF-{workflowId}
                        </span>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={onWorkflows}
                    className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-primary-600 hover:bg-slate-50 border border-slate-200 rounded-md transition-all mr-2"
                >
                    My Workflows
                </button>
                {/* Actions */}
                <button
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    onClick={onClear}
                    title="Clear Canvas"
                >
                    <Trash2 size={16} />
                </button>

                <div className="h-4 w-px bg-slate-200 mx-1"></div>

                <button
                    className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-all shadow-sm shadow-blue-500/30"
                    onClick={onSave}
                >
                    Save
                </button>

                <button
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-md shadow-sm shadow-emerald-500/30 transition-all active:scale-95"
                    onClick={onRun}
                >
                    <Play size={14} fill="currentColor" />
                    <span>Run</span>
                </button>
            </div>
        </div>
    );
};

export default Header;

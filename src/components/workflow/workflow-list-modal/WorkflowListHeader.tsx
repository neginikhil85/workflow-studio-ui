import React from 'react';
import { FolderOpen, Plus, X } from 'lucide-react';

interface WorkflowListHeaderProps {
    onClose: () => void;
    onCreate: () => void;
}

export const WorkflowListHeader: React.FC<WorkflowListHeaderProps> = ({ onClose, onCreate }) => {
    return (
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <FolderOpen size={18} className="text-primary-600" />
                My Workflows
            </h2>
            <div className="flex items-center gap-2">
                <button
                    onClick={onCreate}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md shadow-sm transition-all"
                >
                    <Plus size={14} />
                    New Workflow
                </button>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors ml-2">
                    <X size={20} />
                </button>
            </div>
        </div>
    );
};

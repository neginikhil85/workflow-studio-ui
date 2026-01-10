import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { Workflow } from '../../../types/workflow.interfaces';

interface WorkflowListItemProps {
    workflow: Workflow;
    onSelect: (workflow: Workflow) => void;
    onRename: (workflow: Workflow, e: React.MouseEvent) => void;
    onDelete: (id: string, e: React.MouseEvent) => void;
}

export const WorkflowListItem: React.FC<WorkflowListItemProps> = ({ workflow, onSelect, onRename, onDelete }) => {
    return (
        <div className="group flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg hover:border-primary-400 hover:shadow-md transition-all cursor-pointer" onClick={() => onSelect(workflow)}>
            <div className="flex flex-col">
                <span className="font-semibold text-slate-800 group-hover:text-primary-700 transition-colors">{workflow.name || 'Untitled Workflow'}</span>
                <span className="text-xs text-slate-500 mt-1">{workflow.description || 'No description'}</span>
                <span className="text-[10px] text-slate-400 mt-2">ID: {workflow.id}</span>
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={(e) => onRename(workflow, e)}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    title="Rename"
                >
                    <Edit2 size={16} />
                </button>
                <button
                    onClick={(e) => onDelete(workflow.id!, e)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    title="Delete"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
};

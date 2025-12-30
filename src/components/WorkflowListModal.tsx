import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Workflow } from '../types/workflow';
import { Trash2, FolderOpen, Plus, Loader2, Edit2 } from 'lucide-react';

interface WorkflowListModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (workflow: Workflow) => void;
    onDelete: (id: string) => void;
    onCreate: (name: string) => void;
}

const WorkflowListModal: React.FC<WorkflowListModalProps> = ({ isOpen, onClose, onSelect, onDelete, onCreate }) => {
    const [workflows, setWorkflows] = useState<Workflow[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchWorkflows = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/workflows');
            setWorkflows(response.data);
        } catch (error) {
            console.error("Error fetching workflows:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchWorkflows();
        }
    }, [isOpen]);



    const handleRename = async (wf: Workflow, e: React.MouseEvent) => {
        e.stopPropagation();
        const newName = prompt("Enter new name:", wf.name);
        if (!newName || newName === wf.name) return;

        try {
            // We need to fetch the full workflow to update it, as PUT expects full object usually.
            // Or if backend supports PATCH, that's better. Assuming PUT for now.
            const response = await axios.get(`/api/workflows/${wf.id}`);
            const fullWorkflow = response.data;
            fullWorkflow.name = newName;

            await axios.put(`/api/workflows/${wf.id}`, fullWorkflow);
            fetchWorkflows();
        } catch (error) {
            console.error("Error renaming workflow:", error);
            alert("Failed to rename workflow");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-slide-up border border-slate-100">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                        <FolderOpen size={18} className="text-primary-600" />
                        My Workflows
                    </h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => {
                                const name = prompt("Enter workflow name:", "New Workflow");
                                if (name) {
                                    onCreate(name);
                                    onClose();
                                }
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md shadow-sm transition-all"
                        >
                            <Plus size={14} />
                            New Workflow
                        </button>
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors ml-2">
                            ✕
                        </button>
                    </div>
                </div>

                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="animate-spin text-primary-600" size={32} />
                        </div>
                    ) : workflows.length === 0 ? (
                        <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                            <p className="mb-2">No workflows found.</p>
                            <p className="text-sm">Create a new one to get started!</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {workflows.map(wf => (
                                <div key={wf.id} className="group flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg hover:border-primary-400 hover:shadow-md transition-all cursor-pointer" onClick={() => onSelect(wf)}>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-slate-800 group-hover:text-primary-700 transition-colors">{wf.name || 'Untitled Workflow'}</span>
                                        <span className="text-xs text-slate-500 mt-1">{wf.description || 'No description'}</span>
                                        <span className="text-[10px] text-slate-400 mt-2">ID: {wf.id}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={(e) => handleRename(wf, e)}
                                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                            title="Rename"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onDelete(wf.id!); fetchWorkflows(); }}
                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
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

export default WorkflowListModal;

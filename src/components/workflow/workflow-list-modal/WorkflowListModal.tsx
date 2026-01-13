import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Workflow } from '../../../types/workflow.interfaces';
import { WorkflowListHeader } from './WorkflowListHeader';
import { WorkflowListItem } from './WorkflowListItem';

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
            const { HttpWorkflowService } = await import('../../../services/HttpWorkflowService');
            const service = new HttpWorkflowService();
            const workflowList = await service.getWorkflowList();

            // Map WorkflowSummary to Workflow type for the list (since list only needs basic info)
            // Note: In a real app we might want separate types, but for now we cast or map
            const fullWorkflows = workflowList.map(s => ({
                id: s.id,
                name: s.name,
                description: s.description,
                nodes: [],
                edges: []
            } as Workflow));

            setWorkflows(fullWorkflows);
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

    const handleCreate = () => {
        const name = prompt("Enter workflow name:", "New Workflow");
        if (name) {
            onCreate(name);
            onClose();
        }
    };

    const handleRename = async (wf: Workflow, e: React.MouseEvent) => {
        e.stopPropagation();
        const newName = prompt("Enter new name:", wf.name);
        if (!newName || newName === wf.name) return;

        try {
            const { HttpWorkflowService } = await import('../../../services/HttpWorkflowService');
            const service = new HttpWorkflowService();

            // 1. Load full workflow
            const fullWorkflow = await service.loadWorkflow(wf.id!);

            // 2. Update name
            fullWorkflow.name = newName;

            // 3. Save
            await service.saveWorkflow(fullWorkflow);

            fetchWorkflows();
        } catch (error) {
            console.error("Error renaming workflow:", error);
            alert("Failed to rename workflow");
        }
    };

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(id);
        fetchWorkflows();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-slide-up border border-slate-100">

                <WorkflowListHeader onClose={onClose} onCreate={handleCreate} />

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
                                <WorkflowListItem
                                    key={wf.id}
                                    workflow={wf}
                                    onSelect={onSelect}
                                    onRename={handleRename}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WorkflowListModal;

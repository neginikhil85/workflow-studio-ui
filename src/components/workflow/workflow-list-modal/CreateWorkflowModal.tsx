import React, { useState, useEffect } from 'react';
import { X, Loader2, Plus } from 'lucide-react';
import { VariableInput } from '../../common/VariableInput';

interface CreateWorkflowModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (data: { name: string; description: string }) => void;
    isLoading?: boolean;
}

export const CreateWorkflowModal: React.FC<CreateWorkflowModalProps> = ({
    isOpen,
    onClose,
    onCreate,
    isLoading = false
}) => {
    const [name, setName] = useState('New Workflow');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (isOpen) {
            setName('New Workflow');
            setDescription('');
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onCreate({ name: name.trim(), description: description.trim() });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up border border-slate-100">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="text-lg font-semibold text-slate-900">Create New Workflow</h3>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 transition-colors bg-transparent hover:bg-slate-100 p-1 rounded-md"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Workflow Name <span className="text-red-500">*</span>
                        </label>
                        <VariableInput
                            value={name}
                            onValueChange={setName}
                            className="bg-white border-slate-300 focus-within:ring-primary-500/20 focus-within:border-primary-500 text-sm"
                            placeholder="e.g., Order Processing Pipeline"
                        // disabled={isLoading} // VariableInput might not pass disabled prop correctly yet, assume standard behavior
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Description
                        </label>
                        <VariableInput
                            rows={3}
                            value={description}
                            onValueChange={setDescription}
                            className="bg-white border-slate-300 focus-within:ring-primary-500/20 focus-within:border-primary-500 text-sm h-24"
                            placeholder="Describe what this workflow does..."
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-all focus:ring-2 focus:ring-slate-200"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!name.trim() || isLoading}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all focus:ring-2 focus:ring-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                            Create Workflow
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Key, Globe, X } from 'lucide-react';
import { useServices } from '../../../contexts/ServiceContext';
import { EnvironmentVariable } from '../../../services/IEnvironmentService';
import { toast } from 'sonner';
import { VariableInput } from '../../common/VariableInput';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    const { environmentService } = useServices();
    const [variables, setVariables] = useState<EnvironmentVariable[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddMode, setIsAddMode] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadVariables();
        }
    }, [isOpen]);

    const loadVariables = async () => {
        try {
            setIsLoading(true);
            const vars = await environmentService.getAllVariables();
            setVariables(vars);
        } catch (error) {
            toast.error("Failed to load variables");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (key: string, value: string) => {
        try {
            const v: EnvironmentVariable = { id: key, value };
            await environmentService.saveVariable(v);
            toast.success("Variable saved");
            setIsAddMode(false);
            loadVariables();
        } catch (error) {
            toast.error("Failed to save variable");
        }
    };

    const handleDelete = async (id: string) => {
        // eslint-disable-next-line
        if (!confirm(`Delete variable ${id}?`)) return;
        try {
            await environmentService.deleteVariable(id);
            toast.success("Variable deleted");
            loadVariables();
        } catch (error) {
            toast.error("Failed to delete");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-200">
                <ModalHeader onClose={onClose} />

                <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar bg-slate-50/50">
                    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                        <VariablesToolbar onAdd={() => setIsAddMode(true)} />

                        <div className="divide-y divide-slate-100">
                            {isAddMode && (
                                <VariableForm
                                    onSave={handleSave}
                                    onCancel={() => setIsAddMode(false)}
                                />
                            )}

                            <VariablesList
                                variables={variables}
                                isLoading={isLoading}
                                onDelete={handleDelete}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Sub Components ---

const ModalHeader: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <div className="h-14 bg-white border-b border-slate-100 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center text-violet-600">
                <Globe size={16} />
            </div>
            <div>
                <h1 className="text-sm font-semibold text-slate-800">Global Environment</h1>
                <p className="text-[10px] text-slate-500">Manage application-wide variables</p>
            </div>
        </div>
        <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50">
            <X size={18} />
        </button>
    </div>
);

const VariablesToolbar: React.FC<{ onAdd: () => void }> = ({ onAdd }) => (
    <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
        <div className="flex items-center gap-2">
            <code className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">{"${env.KEY}"}</code>
            <span className="text-xs text-slate-400">Syntax usage</span>
        </div>
        <button
            onClick={onAdd}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-violet-600 text-white text-xs font-medium rounded-md hover:bg-violet-700 transition shadow-sm shadow-violet-200"
        >
            <Plus size={14} /> Add new
        </button>
    </div>
);

const VariableForm: React.FC<{ onSave: (k: string, v: string) => void, onCancel: () => void }> = ({ onSave, onCancel }) => {
    const [newKey, setNewKey] = useState('');
    const [newValue, setNewValue] = useState('');

    const handleSubmit = () => {
        if (!newKey || !newValue) {
            toast.warning("Key and Value are required");
            return;
        }
        onSave(newKey, newValue);
    };

    return (
        <div className="p-4 bg-violet-50/30 animate-in slide-in-from-top-2">
            <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 mb-1.5 block tracking-wider">Key Name</label>
                        <VariableInput
                            autoFocus
                            value={newKey}
                            onValueChange={val => setNewKey(val.toUpperCase())}
                            placeholder="API_KEY"
                            className="bg-white border-slate-200 font-mono uppercase text-xs"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 mb-1.5 block tracking-wider">Value</label>
                        <VariableInput
                            value={newValue}
                            onValueChange={setNewValue}
                            placeholder="secret_value..."
                            className="bg-white border-slate-200 text-xs"
                        // type="password" // VariableInput doesn't support type="password" optimally yet, but standard input is fine here if needed. 
                        // However, user asked for VariableInput EVERYWHERE.
                        // VariableInput overrides internal input type. If we really need password masking, VariableInput needs an update.
                        // For now, I'll assume visible is okay or acceptable tradeoff for uniform variable support.
                        />
                    </div>
                </div>
                <div className="flex items-center justify-end gap-2 pt-1">
                    <button onClick={onCancel} className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 font-medium hover:bg-slate-100 rounded-md transition-colors">Cancel</button>
                    <button onClick={handleSubmit} className="px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-md hover:bg-slate-800 shadow-sm transition-colors">Save Variable</button>
                </div>
            </div>
        </div>
    );
};

const VariablesList: React.FC<{ variables: EnvironmentVariable[], isLoading: boolean, onDelete: (id: string) => void }> = ({ variables, isLoading, onDelete }) => {
    if (isLoading) {
        return (
            <div className="p-12 flex flex-col items-center justify-center text-slate-400">
                <div className="w-5 h-5 border-2 border-slate-200 border-t-violet-600 rounded-full animate-spin mb-2" />
                <span className="text-xs">Loading variables...</span>
            </div>
        );
    }

    if (variables.length === 0) {
        return (
            <div className="p-12 text-center">
                <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-300">
                    <Globe size={18} />
                </div>
                <p className="text-xs text-slate-500 font-medium">No environment variables defined</p>
                <p className="text-[10px] text-slate-400 mt-1">Add variables like API keys or database URLs</p>
            </div>
        );
    }

    return (
        <>
            {variables.map(v => (
                <div key={v.id} className="px-4 py-3 flex items-center justify-between group hover:bg-slate-50/80 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200/50">
                            <Key size={12} />
                        </div>
                        <div>
                            <h3 className="text-xs font-mono font-medium text-slate-700">{v.id}</h3>
                            <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
                                ••••••••••••••••
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => onDelete(v.id)}
                        className="p-1.5 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded transition-all opacity-0 group-hover:opacity-100"
                        title="Delete variable"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            ))}
        </>
    );
};

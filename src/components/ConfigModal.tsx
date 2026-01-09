import React, { useState, useEffect } from 'react';
import { X, HelpCircle, AlertCircle } from 'lucide-react';
import { WorkflowNode, NodeConfig } from '../types/workflow';

// --- IMPORT FORMS DIRECTLY ---
import HttpConfigForm from './config-forms/HttpConfigForm';
import CronConfigForm from './config-forms/CronConfigForm';
import EmailConfigForm from './config-forms/EmailConfigForm';
import WebhookConfigForm from './config-forms/WebhookConfigForm';
import KafkaConfigForm from './config-forms/KafkaConfigForm';

interface ConfigModalProps {
    node: WorkflowNode | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (id: string, config: NodeConfig) => void;
}

const ConfigModal: React.FC<ConfigModalProps> = ({ node, isOpen, onClose, onSave }) => {
    const [config, setConfig] = useState<NodeConfig>({});

    useEffect(() => {
        if (node) {
            setConfig(JSON.parse(JSON.stringify(node.data.config || {})));
        }
    }, [node]);

    if (!isOpen || !node) return null;

    const nodeType = (node.data.nodeType || node.type || '').trim();

    const handleSave = () => {
        onSave(node.id, config);
        onClose();
    };

    const handleConfigChange = (key: string, value: any) => {
        setConfig(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const renderForm = () => {
        // --- STATIC MAPPING ---
        switch (nodeType) {
            case 'IntegrationNodeType_HTTP_CALL':
                return <HttpConfigForm config={config} onChange={handleConfigChange} />;
            case 'IntegrationNodeType_KAFKA':
                return <KafkaConfigForm config={config} onChange={handleConfigChange} />;
            case 'TriggerNodeType_CRON':
                return <CronConfigForm config={config} onChange={handleConfigChange} />;
            case 'TriggerNodeType_WEBHOOK':
                return <WebhookConfigForm config={config} onChange={handleConfigChange} />;
            case 'NotificationNodeType_EMAIL':
                return <EmailConfigForm config={config} onChange={handleConfigChange} />;
            default:
                // Fallback for unknown types
                return (
                    <div className="flex flex-col items-center justify-center h-40 text-slate-400">
                        <AlertCircle size={32} className="mb-2 opacity-50" />
                        <p className="text-sm">No specific configuration for this node type.</p>
                        <div className="mt-4 p-2 bg-slate-100 rounded text-xs text-slate-500 font-mono">
                            Type="{nodeType}"
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-[600px] max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden transform relative">

                {/* Header */}
                <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-white z-10">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <HelpCircle size={20} className="text-slate-400" />
                        <span>Configure {node.data.label}</span>
                    </h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 text-slate-400 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-5 overflow-y-auto flex-1 bg-white relative z-0">
                    {renderForm()}
                </div>

                {/* Footer */}
                <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 z-10">
                    <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 font-medium transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-md shadow-blue-200 transition-all active:scale-95">
                        Save Configuration
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ConfigModal;

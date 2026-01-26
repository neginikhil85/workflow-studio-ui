import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import {
    WorkflowNode,
    NodeConfig,
    KafkaMode,
    HttpNodeConfig,
    ActiveMQNodeConfig,
    KafkaNodeConfig,
    CronNodeConfig,
    WebhookNodeConfig,
    EmailNodeConfig
} from '../../../types/workflow.interfaces';
import { ConfigModalHeader } from './ConfigModalHeader';
import { ConfigModalFooter } from './ConfigModalFooter';

// --- IMPORT FORMS DIRECTLY ---
import HttpConfigForm from '../../nodes/config-forms/http/HttpConfigForm';
import CronConfigForm from '../../nodes/config-forms/cron/CronConfigForm';
import EmailConfigForm from '../../nodes/config-forms/EmailConfigForm';
import WebhookConfigForm from '../../nodes/config-forms/WebhookConfigForm';
import KafkaConfigForm from '../../nodes/config-forms/kafka/KafkaConfigForm';
import ActiveMQConfigForm from '../../nodes/config-forms/activemq/ActiveMQConfigForm';

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
                return <HttpConfigForm config={config as HttpNodeConfig} onChange={handleConfigChange} />;
            case 'IntegrationNodeType_ACTIVE_MQ':
                return <ActiveMQConfigForm config={config as ActiveMQNodeConfig} onChange={handleConfigChange} />;
            case 'IntegrationNodeType_KAFKA':
                return <KafkaConfigForm config={config as KafkaNodeConfig} onChange={handleConfigChange} />;
            case 'TriggerNodeType_KAFKA':
                return <KafkaConfigForm config={config as KafkaNodeConfig} onChange={handleConfigChange} fixedMode={KafkaMode.CONSUMER} accentColor="fuchsia" />;
            case 'TriggerNodeType_CRON':
                return <CronConfigForm config={config as CronNodeConfig} onChange={handleConfigChange} />;
            case 'TriggerNodeType_WEBHOOK':
                return <WebhookConfigForm config={config as WebhookNodeConfig} onChange={handleConfigChange} />;
            case 'NotificationNodeType_EMAIL':
                return <EmailConfigForm config={config as EmailNodeConfig} onChange={handleConfigChange} />;
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

                <ConfigModalHeader nodeLabel={node.data.label} onClose={onClose} />

                <div className="p-5 overflow-y-auto flex-1 bg-white relative z-0">
                    {renderForm()}
                </div>

                <ConfigModalFooter onClose={onClose} onSave={handleSave} />

            </div>
        </div>
    );
};

export default ConfigModal;

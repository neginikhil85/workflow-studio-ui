import React from 'react';
import { WebhookNodeConfig } from '../../../types/workflow.interfaces';
import { VariableInput } from '../../common/variable-input/VariableInput';

interface WebhookConfigFormProps {
    config: WebhookNodeConfig;
    onChange: (key: string, value: any) => void;
}

const WebhookConfigForm: React.FC<WebhookConfigFormProps> = ({ config, onChange }) => {
    return (
        <div className="space-y-4">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                <p className="font-bold mb-1">Webhook Configuration</p>
                <p>This node triggers the workflow when an external HTTP request is received.</p>
                <p className="mt-2 text-xs text-blue-600">
                    Endpoint: <code className="bg-blue-100 px-1 rounded">POST /api/webhooks/start</code>
                </p>
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Description</label>
                <VariableInput
                    value={config.description || ''}
                    onValueChange={(val) => onChange('description', val)}
                    placeholder="e.g., Stripe Payment Webhook"
                    className="bg-slate-50 border-slate-200"
                />
            </div>
        </div>
    );
};

export default WebhookConfigForm;

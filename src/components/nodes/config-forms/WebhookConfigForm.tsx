import React from 'react';
import { NodeConfig } from '../../../types/workflow.interfaces';

interface WebhookConfigFormProps {
    config: NodeConfig;
    onChange?: (key: string, value: any) => void;
}

const WebhookConfigForm: React.FC<WebhookConfigFormProps> = ({ config }) => {
    return (
        <div className="flex flex-col items-center justify-center h-48 text-center space-y-3">
            <div className="p-3 bg-blue-50 rounded-full">
                <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <div>
                <h3 className="text-sm font-bold text-slate-700">Webhook Trigger</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-[250px] mx-auto">
                    Values sent to this webhook URL will be passed as input to the workflow.
                </p>
            </div>
        </div>
    );
};

export default WebhookConfigForm;

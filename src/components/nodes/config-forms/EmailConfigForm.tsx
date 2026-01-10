import React from 'react';
import { NodeConfig } from '../../../types/workflow.interfaces';

interface EmailConfigFormProps {
    config: NodeConfig;
    onChange: (key: string, value: any) => void;
}

const EmailConfigForm: React.FC<EmailConfigFormProps> = ({ config, onChange }) => {
    return (
        <div className="space-y-4">
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Recipient (To)</label>
                <input
                    type="email"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    placeholder="user@example.com"
                    value={config.to || ''}
                    onChange={(e) => onChange('to', e.target.value)}
                />
                <p className="text-xs text-slate-400 mt-2">
                    The email address to send the notification to.
                </p>
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Subject</label>
                <input
                    type="text"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    placeholder="Email Subject"
                    value={config.subject || ''}
                    onChange={(e) => onChange('subject', e.target.value)}
                />
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Body</label>
                <textarea
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 min-h-[120px]"
                    placeholder="Hello ${#input.name}, your order ${#input.id} is ready!"
                    value={config.body || ''}
                    onChange={(e) => onChange('body', e.target.value)}
                />
                <p className="text-xs text-slate-400 mt-2">
                    Supports dynamic values using SpEL: <code>{'${#input.field}'}</code> or <code>{'${#ctx.workflowId}'}</code>
                </p>
            </div>
        </div>
    );
};

export default EmailConfigForm;

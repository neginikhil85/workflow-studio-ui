import React from 'react';
import { EmailNodeConfig } from '../../../types/workflow.interfaces';
import { VariableInput } from '../../common/variable-input/VariableInput';

interface EmailConfigFormProps {
    config: EmailNodeConfig;
    onChange: (key: string, value: any) => void;
}

const EmailConfigForm: React.FC<EmailConfigFormProps> = ({ config, onChange }) => {
    return (
        <div className="space-y-4">
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Recipient (To)</label>
                <VariableInput
                    placeholder="user@example.com"
                    value={config.to || ''}
                    onValueChange={(val) => onChange('to', val)}
                    className="bg-slate-50 border-slate-200"
                />
                <p className="text-xs text-slate-400 mt-2">
                    The email address to send the notification to.
                </p>
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Subject</label>
                <VariableInput
                    placeholder="Email Subject"
                    value={config.subject || ''}
                    onValueChange={(val) => onChange('subject', val)}
                    className="bg-slate-50 border-slate-200"
                />
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Body</label>
                <VariableInput
                    rows={5}
                    placeholder="Hello ${#input.name}, your order ${#input.id} is ready!"
                    value={config.body || ''}
                    onValueChange={(val) => onChange('body', val)}
                    className="bg-slate-50 border-slate-200 min-h-[120px]"
                />
                <p className="text-xs text-slate-400 mt-2">
                    Supports dynamic values using SpEL: <code>{'${#input.field}'}</code> or <code>{'${#ctx.workflowId}'}</code>
                </p>
            </div>
        </div>
    );
};

export default EmailConfigForm;

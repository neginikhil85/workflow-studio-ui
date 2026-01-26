import React, { useState } from 'react';
import { Server, User, Lock, Shield, Loader2, Radio, CheckCircle2, XCircle } from 'lucide-react';
import { ActiveMQNodeConfig } from '../../../../types/workflow.interfaces';
import { VariableInput } from '../../../common/variable-input/VariableInput';
import { ActiveMQService } from '../../../../services/ActiveMQService';

interface ActiveMQBrokerConfigProps {
    config: ActiveMQNodeConfig;
    onChange: (key: string, value: any) => void;
    accentColor?: string;
}

export const ActiveMQBrokerConfig: React.FC<ActiveMQBrokerConfigProps> = ({
    config,
    onChange,
    accentColor = '#660033'
}) => {
    const [testing, setTesting] = useState(false);
    const [testStatus, setTestStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [testMessage, setTestMessage] = useState('');

    const focusClass = `focus-within:ring-[${accentColor}]/20 focus-within:border-[${accentColor}]`;
    const btnClass = `bg-[${accentColor}] hover:bg-[${accentColor}]/90 shadow-sm text-white`;

    const handleTestConnection = async () => {
        setTesting(true);
        setTestStatus('idle');
        setTestMessage('');

        try {
            const service = new ActiveMQService();
            const result = await service.testConnection(config);
            if (result.success) {
                setTestStatus('success');
            } else {
                setTestStatus('error');
                setTestMessage(result.message || 'Connection failed');
            }
        } catch (e: any) {
            setTestStatus('error');
            setTestMessage(e.message);
        } finally {
            setTesting(false);
        }
    };

    return (
        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                    <Server size={12} />
                    <span>Broker Configuration</span>
                </div>
                {testStatus === 'success' && <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1"><CheckCircle2 size={10} /> Connected</span>}
            </div>

            <div className="space-y-2">
                <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Broker URL</label>
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <VariableInput
                                small
                                value={config.brokerUrl || ''}
                                onValueChange={(val) => onChange('brokerUrl', val)}
                                placeholder="tcp://localhost:61616"
                                className={`bg-slate-50 border border-slate-200 font-mono text-[11px] ${focusClass}`}
                            />
                        </div>
                        <button
                            onClick={handleTestConnection}
                            disabled={testing || !config.brokerUrl}
                            className={`px-3 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${btnClass}`}
                            style={{ backgroundColor: accentColor }}
                        >
                            {testing ? <Loader2 size={12} className="animate-spin" /> : <Radio size={12} />}
                            Test Connection
                        </button>
                    </div>
                    {testStatus === 'error' && (
                        <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1">
                            <XCircle size={10} /> {testMessage}
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
                            <User size={10} /> Username
                        </label>
                        <VariableInput
                            small
                            value={config.username || ''}
                            onValueChange={(val) => onChange('username', val)}
                            className={`bg-slate-50 border border-slate-200 text-[11px] ${focusClass}`}
                            placeholder="admin"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
                            <Lock size={10} /> Password
                        </label>
                        <VariableInput
                            small
                            type="password"
                            value={config.password || ''}
                            onValueChange={(val) => onChange('password', val)}
                            className={`bg-slate-50 border border-slate-200 text-[11px] ${focusClass}`}
                            placeholder="••••••"
                        />
                    </div>
                </div>
            </div>


        </div>
    );
};

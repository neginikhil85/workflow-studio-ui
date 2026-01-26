import { ChevronDown, ChevronRight, Shield } from 'lucide-react';
import React, { useState } from 'react';
import { KafkaSecurityProtocol, NodeConfig } from '../../../../types/workflow.interfaces';
import { VariableInput } from '../../../../components/common/VariableInput';

interface KafkaSecurityConfigProps {
    config: NodeConfig;
    onChange: (key: string, value: any) => void;
    accentColor?: 'violet' | 'fuchsia';
}


export const KafkaSecurityConfig: React.FC<KafkaSecurityConfigProps> = ({ config, onChange, accentColor = 'violet' }) => {
    const [isOpen, setIsOpen] = useState(false);

    const securityProtocol = (config.securityProtocol || 'PLAINTEXT') as KafkaSecurityProtocol;
    const showSSL = securityProtocol === 'SSL' || securityProtocol === 'SASL_SSL';
    const showSASL = securityProtocol === 'SASL_PLAINTEXT' || securityProtocol === 'SASL_SSL';

    const ringClass = accentColor === 'fuchsia' ? 'focus:ring-fuchsia-500/50' : 'focus:ring-violet-500/50';

    return (
        <div className="border border-slate-200 rounded-lg overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-3 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
            >
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase">
                    <Shield size={14} />
                    <span>Security & Authentication</span>
                </div>
                {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>

            {isOpen && (
                <div className="p-4 space-y-4 border-t border-slate-200">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Security Protocol</label>
                        <select
                            value={securityProtocol}
                            onChange={(e) => onChange('securityProtocol', e.target.value)}
                            className={`w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 ${ringClass}`}
                        >
                            <option value="PLAINTEXT">PLAINTEXT</option>
                            <option value="SSL">SSL</option>
                            <option value="SASL_PLAINTEXT">SASL_PLAINTEXT</option>
                            <option value="SASL_SSL">SASL_SSL</option>
                        </select>
                    </div>

                    {showSASL && <SaslConfigFields config={config} onChange={onChange} />}
                    {showSSL && <SslConfigFields config={config} onChange={onChange} />}
                </div>
            )}
        </div>
    );
};


/** SASL mechanism and JAAS config fields */
const SaslConfigFields: React.FC<{
    config: NodeConfig;
    onChange: (key: string, value: any) => void;
}> = ({ config, onChange }) => (
    <div className="space-y-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-xs font-bold text-amber-700">SASL Configuration</p>
        <div>
            <label className="block text-xs font-medium text-amber-700 mb-1">SASL Mechanism</label>
            <select
                value={config.saslMechanism || 'PLAIN'}
                onChange={(e) => onChange('saslMechanism', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-amber-300 rounded text-sm"
            >
                <option value="PLAIN">PLAIN</option>
                <option value="SCRAM-SHA-256">SCRAM-SHA-256</option>
                <option value="SCRAM-SHA-512">SCRAM-SHA-512</option>
            </select>
        </div>
        <div>
            <label className="block text-xs font-medium text-amber-700 mb-1">JAAS Config</label>
            <VariableInput
                rows={3}
                value={config.saslJaasConfig || ''}
                onValueChange={(val) => onChange('saslJaasConfig', val)}
                placeholder="org.apache.kafka.common.security.plain.PlainLoginModule required username='user' password='pass';"
                className="bg-white border-amber-300 font-mono text-xs"
            />
        </div>
    </div>
);

/** SSL truststore/keystore configuration fields */
const SslConfigFields: React.FC<{
    config: NodeConfig;
    onChange: (key: string, value: any) => void;
}> = ({ config, onChange }) => (
    <div className="space-y-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs font-bold text-blue-700">SSL Configuration</p>
        <div className="grid grid-cols-2 gap-3">
            <div>
                <label className="block text-xs font-medium text-blue-700 mb-1">Truststore Location</label>
                <VariableInput
                    value={config.sslTruststoreLocation || ''}
                    onValueChange={(val) => onChange('sslTruststoreLocation', val)}
                    placeholder="/path/to/truststore.jks"
                    className="bg-white border-blue-300"
                />
            </div>
            <div>
                <label className="block text-xs font-medium text-blue-700 mb-1">Truststore Password</label>
                <VariableInput
                    value={config.sslTruststorePassword || ''}
                    onValueChange={(val) => onChange('sslTruststorePassword', val)}
                    className="bg-white border-blue-300"
                    type="password"
                />
            </div>
            <div>
                <label className="block text-xs font-medium text-blue-700 mb-1">Keystore Location</label>
                <VariableInput
                    value={config.sslKeystoreLocation || ''}
                    onValueChange={(val) => onChange('sslKeystoreLocation', val)}
                    placeholder="/path/to/keystore.jks"
                    className="bg-white border-blue-300"
                />
            </div>
            <div>
                <label className="block text-xs font-medium text-blue-700 mb-1">Keystore Password</label>
                <VariableInput
                    value={config.sslKeystorePassword || ''}
                    onValueChange={(val) => onChange('sslKeystorePassword', val)}
                    className="bg-white border-blue-300"
                    type="password"
                />
            </div>
        </div>
    </div>
);

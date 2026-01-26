import { ChevronDown, ChevronRight, Shield } from 'lucide-react';
import React, { useState } from 'react';
import { KafkaSecurityProtocol, NodeConfig } from '../../../../types/workflow.interfaces';
import { VariableInput } from '../../../../components/common/variable-input/VariableInput';

interface KafkaSecurityConfigProps {
    config: NodeConfig;
    onChange: (key: string, value: any) => void;
    accentColor?: string;
}

export const KafkaSecurityConfig: React.FC<KafkaSecurityConfigProps> = ({ config, onChange, accentColor = '#7C3AED' }) => {
    const [isOpen, setIsOpen] = useState(false);

    const securityProtocol = (config.securityProtocol || 'PLAINTEXT') as KafkaSecurityProtocol;
    const showSSL = securityProtocol === 'SSL' || securityProtocol === 'SASL_SSL';
    const showSASL = securityProtocol === 'SASL_PLAINTEXT' || securityProtocol === 'SASL_SSL';

    const ringClass = `focus:ring-[${accentColor}]/50`;

    return (
        <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-3 py-2 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
            >
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase">
                    <Shield size={12} />
                    <span>Security & Authentication</span>
                </div>
                {isOpen ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />}
            </button>

            {isOpen && (
                <div className="p-3 space-y-3 border-t border-slate-200">
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Security Protocol</label>
                        <select
                            value={securityProtocol}
                            onChange={(e) => onChange('securityProtocol', e.target.value)}
                            className={`w-full px-2 py-1.5 bg-white border border-slate-200 rounded text-[11px] focus:outline-none focus:ring-2 ${ringClass}`}
                        >
                            <option value="PLAINTEXT">PLAINTEXT</option>
                            <option value="SSL">SSL</option>
                            <option value="SASL_PLAINTEXT">SASL_PLAINTEXT</option>
                            <option value="SASL_SSL">SASL_SSL</option>
                        </select>
                    </div>

                    {showSASL && <SaslConfigFields config={config} onChange={onChange} accentColor={accentColor} />}
                    {showSSL && <SslConfigFields config={config} onChange={onChange} accentColor={accentColor} />}
                </div>
            )}
        </div>
    );
};


/** SASL mechanism and JAAS config fields */
const SaslConfigFields: React.FC<{
    config: NodeConfig;
    onChange: (key: string, value: any) => void;
    accentColor: string;
}> = ({ config, onChange, accentColor }) => (
    <div className="pl-3 border-l-2 border-amber-400 space-y-3">
        <p className="text-[10px] font-bold text-amber-600 uppercase">SASL Configuration</p>
        <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">SASL Mechanism</label>
            <select
                value={config.saslMechanism || 'PLAIN'}
                onChange={(e) => onChange('saslMechanism', e.target.value)}
                className={`w-full px-2 py-1.5 bg-white border border-slate-200 rounded text-[11px] focus:outline-none focus:ring-2 focus:ring-[${accentColor}]/50`}
            >
                <option value="PLAIN">PLAIN</option>
                <option value="SCRAM-SHA-256">SCRAM-SHA-256</option>
                <option value="SCRAM-SHA-512">SCRAM-SHA-512</option>
            </select>
        </div>
        <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">JAAS Config</label>
            <VariableInput
                small
                rows={2}
                value={config.saslJaasConfig || ''}
                onValueChange={(val) => onChange('saslJaasConfig', val)}
                placeholder="org.apache.kafka...PlainLoginModule..."
                className={`bg-slate-50 border border-slate-200 font-mono text-[10px] focus-within:ring-[${accentColor}]/20 focus-within:border-[${accentColor}]`}
            />
        </div>
    </div>
);

import { SslConfigForm, SslConfigValues } from '../shared/SslConfigForm';

// ... imports

/** SSL truststore/keystore configuration fields */
const SslConfigFields: React.FC<{
    config: NodeConfig;
    onChange: (key: string, value: any) => void;
    accentColor: string;
}> = ({ config, onChange, accentColor }) => {

    // Map common fields to Kafka specific keys (lowerCamelCase)
    const handleSslChange = (field: keyof SslConfigValues, value: string) => {
        const map: Record<keyof SslConfigValues, string> = {
            truststoreLocation: 'sslTruststoreLocation',
            truststorePassword: 'sslTruststorePassword',
            keystoreLocation: 'sslKeystoreLocation',
            keystorePassword: 'sslKeystorePassword'
        };
        onChange(map[field], value);
    };

    const sslValues: SslConfigValues = {
        truststoreLocation: config.sslTruststoreLocation,
        truststorePassword: config.sslTruststorePassword,
        keystoreLocation: config.sslKeystoreLocation,
        keystorePassword: config.sslKeystorePassword
    };

    return (
        <div className="pl-3 border-l-2 border-blue-400 space-y-3">
            <p className="text-[10px] font-bold text-blue-600 uppercase">SSL Configuration</p>
            <SslConfigForm
                values={sslValues}
                onChange={handleSslChange}
                accentColor={accentColor}
            />
        </div>
    );
};

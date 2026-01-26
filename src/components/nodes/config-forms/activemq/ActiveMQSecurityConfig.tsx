import { ChevronDown, ChevronRight, Shield } from 'lucide-react';
import React, { useState } from 'react';
import { ActiveMQNodeConfig } from '../../../../types/workflow.interfaces';
import { SslConfigForm, SslConfigValues } from '../shared/SslConfigForm';

interface ActiveMQSecurityConfigProps {
    config: ActiveMQNodeConfig;
    onChange: (key: string, value: any) => void;
    accentColor?: string;
}

export const ActiveMQSecurityConfig: React.FC<ActiveMQSecurityConfigProps> = ({ config, onChange, accentColor = '#660033' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const ringClass = `focus:ring-[${accentColor}]/50`;

    const handleSslChange = (field: keyof SslConfigValues, value: string) => {
        // Map common fields to ActiveMQ specific keys (CamelCase)
        const map: Record<keyof SslConfigValues, string> = {
            truststoreLocation: 'sslTrustStoreLocation',
            truststorePassword: 'sslTrustStorePassword',
            keystoreLocation: 'sslKeyStoreLocation',
            keystorePassword: 'sslKeyStorePassword'
        };
        onChange(map[field], value);
    };

    const sslValues: SslConfigValues = {
        truststoreLocation: config.sslTrustStoreLocation,
        truststorePassword: config.sslTrustStorePassword,
        keystoreLocation: config.sslKeyStoreLocation,
        keystorePassword: config.sslKeyStorePassword
    };

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
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={config.sslEnabled || false}
                            onChange={(e) => onChange('sslEnabled', e.target.checked)}
                            className={`rounded border-slate-300 w-3 h-3 text-[${accentColor}] ${ringClass}`}
                        />
                        <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1 select-none">
                            Enable SSL / TLS
                        </span>
                    </label>

                    {config.sslEnabled && (
                        <div className="pl-3 border-l-2 border-slate-200 animate-in fade-in slide-in-from-top-1 duration-200">
                            <SslConfigForm
                                values={sslValues}
                                onChange={handleSslChange}
                                accentColor={accentColor}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

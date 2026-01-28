import React from 'react';
import { ActiveMQNodeConfig } from '../../../../types/workflow.interfaces';
import { ActiveMQBrokerConfig } from './ActiveMQBrokerConfig';
import { ActiveMQPayloadConfig } from './ActiveMQPayloadConfig';
import { ActiveMQDestinationConfig } from './ActiveMQDestinationConfig';
import { ActiveMQSecurityConfig } from './ActiveMQSecurityConfig';


interface ActiveMQConfigFormProps {
    config: ActiveMQNodeConfig;
    onChange: (key: string, value: any) => void;
    fixedMode?: 'PRODUCER' | 'CONSUMER';
    accentColor?: string;
}

const ActiveMQConfigForm: React.FC<ActiveMQConfigFormProps> = ({ config, onChange, fixedMode, accentColor = '#660033' }) => {
    // Default to PRODUCER if not set, or use fixedMode if provided
    const mode = fixedMode || config.activeMQMode || 'PRODUCER';

    return (
        <div className="space-y-3">
            <ActiveMQBrokerConfig
                config={config}
                onChange={onChange}
                accentColor={accentColor}
            />

            <ActiveMQSecurityConfig
                config={config}
                onChange={onChange}
                accentColor={accentColor}
            />

            {!fixedMode && (
                <ModeSelector
                    mode={mode}
                    onChange={(m) => onChange('activeMQMode', m)}
                    accentColor={accentColor}
                />
            )}

            {/* Mode Specific Section - Destination is now contextual */}
            <ActiveMQDestinationConfig
                config={config}
                onChange={onChange}
                accentColor={accentColor}
                mode={mode}
            />

            <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                <ActiveMQPayloadConfig
                    kafkaMode={mode}
                    config={config}
                    onChange={onChange}
                    accentColor={accentColor}
                />
            </div>
        </div>
    );
};



const ModeSelector: React.FC<{
    mode: 'PRODUCER' | 'CONSUMER';
    onChange: (mode: 'PRODUCER' | 'CONSUMER') => void;
    accentColor: string;
}> = ({ mode, onChange, accentColor }) => {
    const activeClass = `text-white shadow-sm`;

    return (
        <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
            <button
                onClick={() => onChange('PRODUCER')}
                style={{ backgroundColor: mode === 'PRODUCER' ? accentColor : undefined }}
                className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all ${mode === 'PRODUCER'
                    ? activeClass
                    : 'text-slate-500 hover:bg-slate-200'
                    }`}
            >
                Producer
            </button>
            <button
                onClick={() => onChange('CONSUMER')}
                style={{ backgroundColor: mode === 'CONSUMER' ? accentColor : undefined }}
                className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all ${mode === 'CONSUMER'
                    ? activeClass
                    : 'text-slate-500 hover:bg-slate-200'
                    }`}
            >
                Consumer
            </button>
        </div>
    );
};

export default ActiveMQConfigForm;

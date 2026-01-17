import React from 'react';
import { NodeConfig } from '../../../../types/workflow.interfaces';

interface KafkaPayloadConfigProps {
    kafkaMode: 'PRODUCER' | 'CONSUMER';
    config: NodeConfig;
    onChange: (key: string, value: any) => void;
    accentColor?: 'violet' | 'fuchsia';
}


export const KafkaPayloadConfig: React.FC<KafkaPayloadConfigProps> = ({ kafkaMode, config, onChange, accentColor = 'violet' }) => {

    return (
        <div className="space-y-5">


            {kafkaMode === 'PRODUCER' && (
                <ProducerFields
                    message={config.message || ''}
                    onChange={(value) => onChange('message', value)}
                    accentColor={accentColor}
                />
            )}

            {kafkaMode === 'CONSUMER' && (
                <ConsumerFields
                    consumerGroup={config.consumerGroup || ''}
                    pollTimeoutMs={config.pollTimeoutMs || 5000}
                    autoOffsetReset={config.autoOffsetReset || 'latest'}
                    onChange={onChange}
                    accentColor={accentColor}
                />
            )}
        </div>
    );
};

/** Producer message input field */
const ProducerFields: React.FC<{
    message: string;
    onChange: (value: string) => void;
    accentColor: 'violet' | 'fuchsia';
}> = ({ message, onChange, accentColor }) => {
    const ringClass = accentColor === 'fuchsia' ? 'focus:ring-fuchsia-500/50' : 'focus:ring-violet-500/50';
    return (
        <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Message</label>
            <textarea
                value={message}
                onChange={(e) => onChange(e.target.value)}
                placeholder='{ "orderId": 123, "status": "created" }'
                className={`w-full px-3 py-2 bg-slate-900 text-slate-200 rounded-lg text-sm font-mono h-32 focus:outline-none focus:ring-2 ${ringClass}`}
            />
            <p className="text-xs text-slate-400 mt-1">
                Message will be sent to the selected topic when workflow executes.
            </p>
        </div>
    );
};

/** Consumer group and poll timeout fields */
const ConsumerFields: React.FC<{
    consumerGroup: string;
    pollTimeoutMs: number;
    autoOffsetReset: 'latest' | 'earliest';
    onChange: (key: string, value: any) => void;
    accentColor: 'violet' | 'fuchsia';
}> = ({ consumerGroup, pollTimeoutMs, autoOffsetReset, onChange, accentColor }) => {
    const ringClass = accentColor === 'fuchsia' ? 'focus:ring-fuchsia-500/50' : 'focus:ring-violet-500/50';
    return (
        <div className="space-y-4">
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Consumer Group</label>
                <input
                    value={consumerGroup}
                    onChange={(e) => onChange('consumerGroup', e.target.value)}
                    placeholder="workflow-consumer-group"
                    className={`w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 ${ringClass}`}
                />
            </div>
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Poll Timeout (ms)</label>
                <input
                    type="number"
                    value={pollTimeoutMs}
                    onChange={(e) => onChange('pollTimeoutMs', parseInt(e.target.value) || 5000)}
                    min={1000}
                    max={30000}
                    className={`w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 ${ringClass}`}
                />
                <p className="text-xs text-slate-400 mt-1">
                    Maximum time to wait for messages.
                </p>
            </div>
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Auto Offset Reset</label>
                <select
                    value={autoOffsetReset}
                    onChange={(e) => onChange('autoOffsetReset', e.target.value)}
                    className={`w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 ${ringClass}`}
                >
                    <option value="latest">Latest</option>
                    <option value="earliest">Earliest</option>
                </select>
                <p className="text-xs text-slate-400 mt-1">
                    Policy for resetting offsets when no initial offset is found.
                </p>
            </div>
        </div>
    );
};

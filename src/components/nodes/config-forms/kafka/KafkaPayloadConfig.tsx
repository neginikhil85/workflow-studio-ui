import React from 'react';
import { NodeConfig } from '../../../../types/workflow.interfaces';
import { VariableInput } from '../../../../components/common/VariableInput';

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
    const ringClass = accentColor === 'fuchsia' ? 'focus-within:ring-fuchsia-500/50' : 'focus-within:ring-violet-500/50';
    return (
        <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Message</label>
            <VariableInput
                rows={5}
                value={message}
                onValueChange={(val) => onChange(val)}
                placeholder='{ "orderId": 123, "status": "created" }'
                className={`bg-slate-900 text-slate-200 border-slate-700 min-h-[128px] ${ringClass}`}
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
    const ringClass = accentColor === 'fuchsia' ? 'focus-within:ring-fuchsia-500/50' : 'focus-within:ring-violet-500/50';
    const pollTimeoutValue = pollTimeoutMs?.toString() || '5000';

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Consumer Group</label>
                <VariableInput
                    value={consumerGroup}
                    onValueChange={(val) => onChange('consumerGroup', val)}
                    placeholder="workflow-consumer-group"
                    className={`bg-slate-50 border-slate-200 ${ringClass}`}
                />
            </div>
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Poll Timeout (ms)</label>
                <VariableInput
                    value={pollTimeoutValue}
                    onValueChange={(val) => {
                        // If plain number, convert to int for config cleanliness, else keep string
                        const num = parseInt(val);
                        if (!isNaN(num) && num.toString() === val) {
                            onChange('pollTimeoutMs', num);
                        } else {
                            onChange('pollTimeoutMs', val);
                        }
                    }}
                    placeholder="5000"
                    className={`bg-slate-50 border-slate-200 ${ringClass}`}
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

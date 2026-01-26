import React from 'react';
import { NodeConfig } from '../../../../types/workflow.interfaces';
import { VariableInput } from '../../../../components/common/variable-input/VariableInput';
import { BodyEditor } from '../http/BodyEditor';

interface KafkaPayloadConfigProps {
    kafkaMode: 'PRODUCER' | 'CONSUMER';
    config: NodeConfig;
    onChange: (key: string, value: any) => void;
    accentColor?: string;
}

export const KafkaPayloadConfig: React.FC<KafkaPayloadConfigProps> = ({ kafkaMode, config, onChange, accentColor = '#7C3AED' }) => {
    return (
        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm space-y-4">
            {kafkaMode === 'PRODUCER' && (
                <div className="h-[250px]">
                    <BodyEditor
                        body={config.message || ''}
                        onChange={(value) => onChange('message', value)}
                    />
                </div>
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

/** Consumer group and poll timeout fields */
const ConsumerFields: React.FC<{
    consumerGroup: string;
    pollTimeoutMs: number;
    autoOffsetReset: 'latest' | 'earliest';
    onChange: (key: string, value: any) => void;
    accentColor: string;
}> = ({ consumerGroup, pollTimeoutMs, autoOffsetReset, onChange, accentColor }) => {
    const focusClass = `focus-within:ring-[${accentColor}]/20 focus-within:border-[${accentColor}]`;
    const ringClass = `focus:ring-[${accentColor}]/50`;

    const pollTimeoutValue = pollTimeoutMs?.toString() || '5000';

    return (
        <div className="space-y-3">
            <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Consumer Group</label>
                <VariableInput
                    small
                    value={consumerGroup}
                    onValueChange={(val) => onChange('consumerGroup', val)}
                    placeholder="workflow-consumer-group"
                    className={`bg-slate-50 border border-slate-200 text-[11px] ${focusClass}`}
                />
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Poll Timeout (ms)</label>
                    <VariableInput
                        small
                        value={pollTimeoutValue}
                        onValueChange={(val) => {
                            const num = parseInt(val);
                            if (!isNaN(num) && num.toString() === val) {
                                onChange('pollTimeoutMs', num);
                            } else {
                                onChange('pollTimeoutMs', val);
                            }
                        }}
                        placeholder="5000"
                        className={`bg-slate-50 border border-slate-200 text-[11px] ${focusClass}`}
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Auto Offset Reset</label>
                    <select
                        value={autoOffsetReset}
                        onChange={(e) => onChange('autoOffsetReset', e.target.value)}
                        className={`w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded text-[11px] focus:outline-none focus:ring-2 ${ringClass}`}
                    >
                        <option value="latest">Latest</option>
                        <option value="earliest">Earliest</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

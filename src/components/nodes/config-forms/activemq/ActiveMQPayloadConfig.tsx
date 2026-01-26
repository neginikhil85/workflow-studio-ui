import React from 'react';
import { ActiveMQNodeConfig } from '../../../../types/workflow.interfaces';
import { VariableInput } from '../../../common/variable-input/VariableInput';
import { BodyEditor } from '../http/BodyEditor';

interface ActiveMQPayloadConfigProps {
    kafkaMode: 'PRODUCER' | 'CONSUMER';
    config: ActiveMQNodeConfig;
    onChange: (key: string, value: any) => void;
    accentColor?: string;
}

export const ActiveMQPayloadConfig: React.FC<ActiveMQPayloadConfigProps> = ({ kafkaMode, config, onChange, accentColor = '#660033' }) => {
    return (
        <div>
            {kafkaMode === 'PRODUCER' && (
                <div className="h-[250px]">
                    <BodyEditor
                        body={config.messageBody || ''}
                        onChange={(value) => onChange('messageBody', value)}
                    />
                </div>
            )}

            {kafkaMode === 'CONSUMER' && (
                <ConsumerFields
                    consumerGroup={config.consumerGroup || ''}
                    pollTimeoutMs={config.pollTimeoutMs || 5000}
                    batchSize={config.batchSize}
                    onChange={onChange}
                    accentColor={accentColor}
                />
            )}
        </div>
    );
};

const ConsumerFields: React.FC<{
    consumerGroup: string;
    pollTimeoutMs: number;
    batchSize?: number;
    onChange: (key: string, value: any) => void;
    accentColor: string;
}> = ({ consumerGroup, pollTimeoutMs, batchSize, onChange, accentColor }) => {
    const focusClass = `focus-within:ring-[${accentColor}]/20 focus-within:border-[${accentColor}]`;
    const pollTimeoutValue = pollTimeoutMs?.toString() || '5000';
    const batchSizeValue = batchSize?.toString() || '50';

    return (
        <div className="space-y-3 pt-1">
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Consumer ID</label>
                    <VariableInput
                        small
                        value={consumerGroup}
                        onValueChange={(val) => onChange('consumerGroup', val)}
                        placeholder="my-durable-id"
                        className={`bg-slate-50 border border-slate-200 text-[11px] ${focusClass}`}
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Receive Timeout (ms)</label>
                    <VariableInput
                        small
                        value={pollTimeoutValue}
                        onValueChange={(val) => {
                            const num = parseInt(val);
                            if (!isNaN(num)) onChange('pollTimeoutMs', num);
                            else onChange('pollTimeoutMs', val);
                        }}
                        placeholder="5000"
                        className={`bg-slate-50 border border-slate-200 text-[11px] ${focusClass}`}
                    />
                </div>
            </div>

            <div className="w-1/2 pr-1.5">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Batch Size</label>
                <VariableInput
                    small
                    value={batchSizeValue}
                    onValueChange={(val) => {
                        const num = parseInt(val);
                        if (!isNaN(num)) onChange('batchSize', num);
                        else onChange('batchSize', val);
                    }}
                    placeholder="50"
                    className={`bg-slate-50 border border-slate-200 text-[11px] ${focusClass}`}
                />
                <p className="text-[10px] text-slate-400 mt-1">Max messages to fetch per execution cycle</p>
            </div>
        </div>
    );
};

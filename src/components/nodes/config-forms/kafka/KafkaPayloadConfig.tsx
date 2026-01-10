import React from 'react';
import { NodeConfig } from '../../../../types/workflow.interfaces';

interface KafkaPayloadConfigProps {
    kafkaMode: 'PRODUCER' | 'CONSUMER';
    config: NodeConfig;
    onChange: (key: string, value: any) => void;
}


export const KafkaPayloadConfig: React.FC<KafkaPayloadConfigProps> = ({ kafkaMode, config, onChange }) => {

    return (
        <div className="space-y-5">


            {kafkaMode === 'PRODUCER' && (
                <ProducerFields
                    message={config.message || ''}
                    onChange={(value) => onChange('message', value)}
                />
            )}

            {kafkaMode === 'CONSUMER' && (
                <ConsumerFields
                    consumerGroup={config.consumerGroup || ''}
                    pollTimeoutMs={config.pollTimeoutMs || 5000}
                    onChange={onChange}
                />
            )}
        </div>
    );
};

/** Producer message input field */
const ProducerFields: React.FC<{
    message: string;
    onChange: (value: string) => void;
}> = ({ message, onChange }) => (
    <div>
        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Message</label>
        <textarea
            value={message}
            onChange={(e) => onChange(e.target.value)}
            placeholder='{ "orderId": 123, "status": "created" }'
            className="w-full px-3 py-2 bg-slate-900 text-slate-200 rounded-lg text-sm font-mono h-32 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50"
        />
        <p className="text-xs text-slate-400 mt-1">
            Message will be sent to the selected topic when workflow executes.
        </p>
    </div>
);

/** Consumer group and poll timeout fields */
const ConsumerFields: React.FC<{
    consumerGroup: string;
    pollTimeoutMs: number;
    onChange: (key: string, value: any) => void;
}> = ({ consumerGroup, pollTimeoutMs, onChange }) => (
    <div className="space-y-4">
        <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Consumer Group</label>
            <input
                value={consumerGroup}
                onChange={(e) => onChange('consumerGroup', e.target.value)}
                placeholder="workflow-consumer-group"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50"
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
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50"
            />
            <p className="text-xs text-slate-400 mt-1">
                Maximum time to wait for messages.
            </p>
        </div>
    </div>
);

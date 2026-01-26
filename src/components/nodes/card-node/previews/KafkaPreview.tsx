import React from 'react';
import { PreviewField } from './PreviewField';

export const KafkaPreview: React.FC<{ config: any }> = ({ config }) => {
    const mode = config.kafkaMode || 'PRODUCER';
    return (
        <div className="flex flex-col gap-2 mt-2">
            <PreviewField
                label={mode}
                value={config.topic}
                title={config.topic}
                placeholder="Configure Kafka..."
                labelClassName="text-violet-600"
            />
        </div>
    );
};

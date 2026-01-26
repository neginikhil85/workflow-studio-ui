import React from 'react';
import { PreviewField } from './PreviewField';

export const KafkaTriggerPreview: React.FC<{ config: any }> = ({ config }) => {
    return (
        <div className="flex flex-col gap-2 mt-2">
            <PreviewField
                label="LISTENING TOPIC"
                value={config.topic}
                title={config.topic}
                placeholder="Configure Kafka trigger..."
                labelClassName="text-fuchsia-600"
            />
        </div>
    );
};

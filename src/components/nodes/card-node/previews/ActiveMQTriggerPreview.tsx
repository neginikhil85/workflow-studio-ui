import React from 'react';
import { PreviewField } from './PreviewField';

export const ActiveMQTriggerPreview: React.FC<{ config: any }> = ({ config }) => {
    return (
        <div className="flex flex-col gap-2 mt-2">
            <PreviewField
                label="LISTENING TO"
                value={config.destinationName}
                title={config.destinationName}
                placeholder="Configure ActiveMQ trigger..."
                labelClassName="text-[#660033]"
            />
        </div>
    );
};

import React from 'react';
import { PreviewField } from './PreviewField';

export const ActiveMQPreview: React.FC<{ config: any }> = ({ config }) => {
    const mode = config.activeMQMode || 'PRODUCER';
    const color = '#660033';

    return (
        <div className="flex flex-col gap-2 mt-2">
            <PreviewField
                label={mode}
                value={config.destinationName}
                title={config.destinationName}
                placeholder="Configure ActiveMQ..."
                labelClassName="text-[#660033]"
            />
        </div>
    );
};

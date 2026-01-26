import React from 'react';
import { PreviewField } from './PreviewField';

export const HttpPreview: React.FC<{ config: any }> = ({ config }) => {
    const method = config.method || 'GET';
    const url = config.url ? config.url.replace(/^https?:\/\//, '') : undefined;

    return (
        <div className="flex flex-col gap-2 mt-2">
            <PreviewField
                label={method}
                value={url}
                title={config.url}
                placeholder="Configure endpoint..."
                labelClassName="text-slate-500"
            />
        </div>
    );
};

import React from 'react';
import { PreviewField } from './PreviewField';

export const EmailPreview: React.FC<{ config: any }> = ({ config }) => {
    return (
        <div className="flex flex-col gap-1 mt-2">
            <PreviewField
                label="TO"
                value={config.to}
                title={config.to}
                placeholder="No recipient"
                labelClassName="text-slate-500"
            />
        </div>
    );
};

import React, { memo } from 'react';
import { mergeStyles } from '../../../utils/styleUtils';
import { getNodeStyle } from '../../../config/nodes/node.styles';

interface NodeHeaderProps {
    label: string;
    nodeType: string;
}

export const NodeHeader: React.FC<NodeHeaderProps> = memo(({ label, nodeType }) => {
    const style = getNodeStyle(nodeType);
    const IconComponent = style.icon;

    return (
        <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
                <div className={mergeStyles("w-8 h-8 rounded-lg flex items-center justify-center border shadow-sm", style.bg, style.color, style.border)}>
                    <IconComponent size={16} strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-slate-900 leading-tight truncate">
                        {label}
                    </h3>
                    <p className="text-[10px] text-slate-500 font-medium mt-0.5 truncate">
                        {nodeType.split('_')[1] || 'Node'}
                    </p>
                </div>
            </div>
        </div>
    );
});

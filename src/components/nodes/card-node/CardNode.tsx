import { Copy, X } from 'lucide-react'; // Clock removed, it's inside NodeConfigPreview now
import React, { memo } from 'react';
import { NodeProps, useReactFlow } from 'reactflow';
import { mergeStyles } from '../../../utils/styleUtils';

import { NodeData } from '../../../types/workflow.interfaces';
import { NodeActionBtn } from './NodeActionBtn';
import { NodeConfigPreview } from './NodeConfigPreview';
import { NodeHeader } from './NodeHeader';
import { NodePorts } from './NodePorts';


const CardNode = memo(({ id, data, selected }: NodeProps<NodeData>) => {
    const { deleteElements } = useReactFlow();
    const nodeType = data.nodeType || 'default';
    const config = data.config || {};

    // renderConfigPreview removed, replaced by component

    const handleDeleteNode = (event: React.MouseEvent) => {
        event.stopPropagation();
        deleteElements({ nodes: [{ id }] });
    };

    const handleDuplicateNode = (event: React.MouseEvent) => {
        event.stopPropagation();
        data.onDuplicate?.(id);
    };

    return (
        <div className={mergeStyles(
            "w-55 bg-white rounded-2xl transition-all duration-300 group font-sans border relative",
            selected
                ? "ring-2 ring-indigo-500 ring-offset-2 border-transparent shadow-premium scale-[1.02]"
                : "border-slate-200 shadow-xl hover:border-indigo-200 hover:shadow-premium hover:scale-[1.01]"
        )}>
            <NodePorts />

            <div className="p-3">
                <NodeHeader label={data.label} nodeType={nodeType} />
                <NodeConfigPreview nodeType={nodeType} config={config} />
                <NodeStatusIndicator selected={selected} />
            </div>

            <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all z-50">
                <NodeActionBtn onClick={handleDuplicateNode} title="Duplicate Node" variant="blue">
                    <Copy size={10} strokeWidth={2.5} />
                </NodeActionBtn>

                <NodeActionBtn onClick={handleDeleteNode} title="Remove Node" variant="red">
                    <X size={12} strokeWidth={3} />
                </NodeActionBtn>
            </div>
        </div>
    );
});

const NodeStatusIndicator = ({ selected }: { selected: boolean }) => {
    if (!selected) return null;
    return (
        <div className="mt-2 flex items-center gap-1.5 justify-end">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-medium text-emerald-600">Active</span>
        </div>
    );
};

export default CardNode;

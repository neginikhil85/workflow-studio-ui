import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const HANDLE_STYLE = "!w-2.5 !h-2.5 !bg-slate-400 !border-[2px] !border-white transition-colors group-hover:!bg-primary-500";

export const NodePorts: React.FC = memo(() => {
    return (
        <>
            <Handle type="target" position={Position.Top} className={HANDLE_STYLE} />
            <Handle type="source" position={Position.Bottom} className={HANDLE_STYLE} />
            <Handle type="target" position={Position.Left} className={HANDLE_STYLE} id="l-in" style={{ top: '50%' }} />
            <Handle type="source" position={Position.Right} className={HANDLE_STYLE} id="r-out" style={{ top: '50%' }} />
        </>
    );
});

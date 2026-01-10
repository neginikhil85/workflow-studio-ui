import React from 'react';
import { mergeStyles } from '../../../utils/styleUtils';

export type NodeActionVariant = 'blue' | 'emerald' | 'red';

interface NodeActionBtnProps {
    onClick: (event: React.MouseEvent) => void;
    title: string;
    variant?: NodeActionVariant;
    children: React.ReactNode;
}

const VARIANT_STYLES: Record<NodeActionVariant, string> = {
    blue: "hover:text-blue-500 hover:border-blue-200",
    emerald: "hover:text-emerald-500 hover:border-emerald-200",
    red: "hover:text-red-500 hover:border-red-200"
};

export const NodeActionBtn: React.FC<NodeActionBtnProps> = ({ onClick, title, variant = 'blue', children }) => {
    return (
        <button
            className={mergeStyles(
                "w-5 h-5 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 shadow-sm cursor-pointer",
                VARIANT_STYLES[variant]
            )}
            onClick={onClick}
            onMouseDown={(e) => e.stopPropagation()}
            title={title}
        >
            {children}
        </button>
    );
};

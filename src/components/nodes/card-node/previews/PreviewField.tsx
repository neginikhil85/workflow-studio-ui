import React from 'react';

interface PreviewFieldProps {
    label: string | React.ReactNode;
    value?: string;
    placeholder?: string;
    title?: string;
    labelClassName?: string;
    icon?: React.ReactNode;
}

export const PreviewField: React.FC<PreviewFieldProps> = ({
    label,
    value,
    placeholder,
    title,
    labelClassName = 'text-slate-500',
    icon
}) => {
    if (!value) {
        return (
            <div className="px-2 py-1.5 text-[10px] text-slate-400 italic">
                {placeholder}
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2 px-2 py-1.5 bg-slate-50 rounded-md border border-slate-100/50">
            {icon}
            <span className={`text-[9px] font-bold uppercase tracking-wider ${labelClassName}`}>
                {label}
            </span>
            <span
                className="text-[10px] text-slate-600 truncate font-mono tracking-tight opacity-80"
                title={title || value}
            >
                {value}
            </span>
        </div>
    );
};

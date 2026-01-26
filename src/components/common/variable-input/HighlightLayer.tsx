import React, { RefObject } from 'react';

interface HighlightLayerProps {
    text: string;
    className: string;
    scrollRef: RefObject<HTMLDivElement>;
}

export const HighlightLayer: React.FC<HighlightLayerProps> = ({ text, className, scrollRef }) => {
    // Basic syntax highlighting for ${variables}
    const parts = text.split(/(\${[^}]+})/g);

    return (
        <div ref={scrollRef} aria-hidden="true" className={className}>
            {parts.map((part, index) => {
                if (part.startsWith('${') && part.endsWith('}')) {
                    return (
                        <span key={index} className="text-amber-500 font-bold bg-amber-500/10 rounded-[2px] mx-[0.5px] inline-block border border-amber-500/20">
                            {part}
                        </span>
                    );
                }
                return <span key={index}>{part}</span>;
            })}
        </div>
    );
};

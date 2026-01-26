import React, { useRef, useEffect } from 'react';
import { useVariableSuggestions, useInputStyles } from './useVariableInput';
import { HighlightLayer } from './HighlightLayer';
import { SuggestionsList } from './SuggestionsList';

interface VariableInputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
    rows?: number;
    onValueChange: (value: string) => void;
    small?: boolean;
}

export const VariableInput: React.FC<VariableInputProps> = ({
    rows,
    value: propValue,
    onValueChange,
    className = '',
    small = false,
    ...props
}) => {
    const value = String(propValue || '');

    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const highlightRef = useRef<HTMLDivElement>(null);

    const { suggestions, isOpen, setIsOpen, checkTrigger } = useVariableSuggestions();
    const styles = useInputStyles({ isMultiline: !!rows, small, value, className });

    // Handle outside clicks to close suggestions
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [setIsOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        if (!rows && newValue.includes('\n')) return;

        onValueChange(newValue);
        checkTrigger(newValue, e.target.selectionStart || 0);
    };

    const handleSelectVariable = (variableId: string) => {
        if (!inputRef.current) return;

        const cursorPosition = inputRef.current.selectionStart || 0;
        const textBeforeCursor = value.substring(0, cursorPosition);
        const lastOpenBrace = textBeforeCursor.lastIndexOf('${');

        if (lastOpenBrace !== -1) {
            const prefix = value.substring(0, lastOpenBrace);
            const suffix = value.substring(cursorPosition);
            const newValue = `${prefix}\${env.${variableId}}${suffix}`;

            onValueChange(newValue);
            setIsOpen(false);

            // Restore focus and cursor position
            setTimeout(() => {
                inputRef.current?.focus();
                const newCursorPos = prefix.length + variableId.length + 7; // 7 = ${env.} + } length
                inputRef.current?.setSelectionRange(newCursorPos, newCursorPos);
            }, 0);
        }
    };

    const handleScroll = () => {
        if (inputRef.current && highlightRef.current) {
            highlightRef.current.scrollTop = inputRef.current.scrollTop;
            highlightRef.current.scrollLeft = inputRef.current.scrollLeft;
        }
    };

    return (
        <div className={styles.container} ref={containerRef}>
            <HighlightLayer
                text={value}
                className={styles.highlight}
                scrollRef={highlightRef as React.RefObject<HTMLDivElement>}
            />

            <textarea
                ref={inputRef}
                className={styles.input}
                rows={rows || 1}
                value={value}
                onChange={handleChange}
                onScroll={handleScroll}
                spellCheck={false}
                onKeyDown={(e) => {
                    if (!rows && e.key === 'Enter') e.preventDefault();
                }}
                {...props as any}
            />

            {isOpen && (
                <SuggestionsList
                    suggestions={suggestions}
                    onSelect={handleSelectVariable}
                />
            )}
        </div>
    );
};

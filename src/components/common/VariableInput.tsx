import React, { useState, useRef, useEffect } from 'react';
import { useServices } from '../../contexts/ServiceContext';
import { EnvironmentVariable } from '../../services/IEnvironmentService';
import { Globe } from 'lucide-react';

interface VariableInputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
    rows?: number; // If present, renders a textarea
    onValueChange: (value: string) => void;
}

export const VariableInput: React.FC<VariableInputProps> = ({
    rows,
    value,
    onValueChange,
    className = '', // Default to empty string
    ...props
}) => {
    const { environmentService } = useServices();
    const [suggestions, setSuggestions] = useState<EnvironmentVariable[]>([]);
    const [filteredSuggestions, setFilteredSuggestions] = useState<EnvironmentVariable[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const highlightRef = useRef<HTMLDivElement>(null);

    // Initial load
    useEffect(() => {
        const loadVars = async () => {
            try {
                const vars = await environmentService.getAllVariables();
                setSuggestions(vars);
            } catch (e) {
                console.error("Failed to load variables");
            }
        };
        loadVars();
    }, [environmentService]);

    const highlightText = (text: string) => {
        if (!text) return null;
        const parts = text.split(/(\${[^}]+})/g);
        return parts.map((part, index) => {
            if (part.startsWith('${') && part.endsWith('}')) {
                return (
                    <span key={index} className="text-amber-500 font-bold bg-amber-500/10 rounded-[2px] mx-[0.5px] inline-block border border-amber-500/20">
                        {part}
                    </span>
                );
            }
            return <span key={index}>{part}</span>;
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        if (!rows && newValue.includes('\n')) return;

        onValueChange(newValue);

        const cursorPosition = e.target.selectionStart || 0;
        const textBeforeCursor = newValue.substring(0, cursorPosition);
        const lastOpenBrace = textBeforeCursor.lastIndexOf('${');

        if (lastOpenBrace !== -1) {
            const textAfterTrigger = textBeforeCursor.substring(lastOpenBrace + 2);
            if (!/[{}]/.test(textAfterTrigger)) {
                const query = textAfterTrigger.trim().toUpperCase();
                const filtered = suggestions.filter(v => v.id.includes(query));
                if (filtered.length > 0) {
                    setFilteredSuggestions(filtered);
                    setShowSuggestions(true);
                    return;
                }
            }
        }
        setShowSuggestions(false);
    };

    const handleSelectVariable = (variableId: string) => {
        if (!inputRef.current) return;

        const currentValue = String(value || '');
        const cursorPosition = inputRef.current.selectionStart || 0;
        const textBeforeCursor = currentValue.substring(0, cursorPosition);
        const lastOpenBrace = textBeforeCursor.lastIndexOf('${');

        if (lastOpenBrace !== -1) {
            const prefix = currentValue.substring(0, lastOpenBrace);
            const suffix = currentValue.substring(cursorPosition);
            const newValue = `${prefix}\${env.${variableId}}${suffix}`;

            onValueChange(newValue);
            setShowSuggestions(false);

            setTimeout(() => {
                inputRef.current?.focus();
                const newCursorPos = prefix.length + variableId.length + 7;
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

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const isMultiline = !!rows;
    const fontStyles = "font-mono text-xs leading-relaxed";
    const paddingStyles = "px-3 py-2";
    const hasBg = className.includes('bg-');
    const hasText = className.includes('text-');
    const hasBorder = className.includes('border-');
    const defaultBg = hasBg ? '' : 'bg-white';
    const defaultText = hasText ? '' : 'text-slate-800';
    const defaultBorder = hasBorder ? '' : 'border border-slate-200';
    const containerClasses = `relative w-full group rounded-md ${defaultBg} ${defaultText} ${defaultBorder} ${className} ${isMultiline ? '' : 'min-h-[38px] h-[38px]'}`;
    const highlightStyles = `absolute inset-0 z-0 ${fontStyles} ${paddingStyles} whitespace-pre-wrap break-words bg-transparent text-inherit overflow-hidden pointer-events-none`;
    const isDarkMode = className.includes('bg-slate-900') || className.includes('text-white') || className.includes('text-slate-200');
    const caretClass = isDarkMode ? 'caret-white placeholder:text-slate-500' : 'caret-slate-900 placeholder:text-slate-400';
    const inputStyles = `absolute inset-0 z-10 w-full h-full bg-transparent text-transparent ${caretClass} ${fontStyles} ${paddingStyles} focus:outline-none rounded-md resize-none overflow-auto`;
    const containerFocusClasses = `focus-within:ring-2 focus-within:ring-violet-500/20 focus-within:border-violet-500`;
    const displayValue = String(value || '');

    return (
        <div className={`${containerClasses} ${containerFocusClasses}`} ref={containerRef}>
            {/* Highlight Layer */}
            <div
                ref={highlightRef}
                aria-hidden="true"
                className={highlightStyles}
            >
                {highlightText(displayValue)}
            </div>

            {/* Interactive Layer */}
            <textarea
                ref={inputRef}
                className={inputStyles}
                rows={rows || 1}
                value={displayValue}
                onChange={handleChange}
                onScroll={handleScroll}
                spellCheck={false}
                onKeyDown={(e) => {
                    if (!isMultiline && e.key === 'Enter') {
                        e.preventDefault();
                    }
                }}
                {...props as any}
            />

            {/* Suggestions Dropdown */}
            {showSuggestions && (
                <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-white rounded-lg shadow-xl border border-slate-200 max-h-48 overflow-y-auto animate-in fade-in zoom-in-95 duration-100 text-slate-800">
                    <div className="px-2 py-1.5 bg-slate-50 border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-2">
                        <Globe size={10} /> Global Variables
                    </div>
                    {filteredSuggestions.map(v => (
                        <button
                            key={v.id}
                            onClick={() => handleSelectVariable(v.id)}
                            className="w-full text-left px-3 py-2 text-xs hover:bg-violet-50 hover:text-violet-700 flex items-center justify-between group transition-colors"
                        >
                            <span className="font-mono font-medium">{v.id}</span>
                            <span className="text-[10px] text-slate-400 font-mono group-hover:text-violet-400 truncate max-w-[100px]">
                                {v.value ? '••••••' : '(empty)'}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

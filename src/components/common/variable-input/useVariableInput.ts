import { useState, useEffect, useMemo } from 'react';
import { useServices } from '../../../contexts/ServiceContext';
import { EnvironmentVariable } from '../../../services/IEnvironmentService';

/**
 * Manages fetching environment variables and filtering suggestions based on input
 */
export const useVariableSuggestions = () => {
    const { environmentService } = useServices();
    const [allVariables, setAllVariables] = useState<EnvironmentVariable[]>([]);
    const [filtered, setFiltered] = useState<EnvironmentVariable[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    // Initial load
    useEffect(() => {
        environmentService.getAllVariables()
            .then(setAllVariables)
            .catch(() => console.error("Failed to load variables"));
    }, [environmentService]);

    const checkTrigger = (text: string, cursorPosition: number) => {
        const textBeforeCursor = text.substring(0, cursorPosition);
        const lastOpenBrace = textBeforeCursor.lastIndexOf('${');

        if (lastOpenBrace !== -1) {
            const textAfterTrigger = textBeforeCursor.substring(lastOpenBrace + 2);
            // Verify we are actually inside a variable declaration context (no closing braces yet)
            if (!/[{}]/.test(textAfterTrigger)) {
                const query = textAfterTrigger.trim().toUpperCase();
                const matches = allVariables.filter(v => v.id.includes(query));
                if (matches.length > 0) {
                    setFiltered(matches);
                    setIsOpen(true);
                    return true;
                }
            }
        }
        setIsOpen(false);
        return false;
    };

    return {
        suggestions: filtered,
        isOpen,
        setIsOpen,
        checkTrigger
    };
};

/**
 * Computes CSS classes for the container, input, and highlighter
 */
export const useInputStyles = (props: {
    isMultiline: boolean,
    small: boolean,
    value: string,
    className: string
}) => {
    const { isMultiline, small, value, className } = props;

    return useMemo(() => {
        const fontStyles = small
            ? "font-mono text-[11px] leading-relaxed"
            : "font-mono text-xs leading-relaxed";

        const paddingStyles = small ? "px-2 py-1" : "px-3 py-2";

        const hasBg = className.includes('bg-');
        const hasText = className.includes('text-');

        // Check for explicit border width class to avoid invisible borders
        const hasBorderWidth = className.split(' ').some(c => c === 'border' || c.startsWith('border-[') || /^border-\d/.test(c));

        const baseStyles = [
            'relative w-full group rounded-md',
            hasBg ? '' : 'bg-white',
            hasText ? '' : 'text-slate-800',
            hasBorderWidth ? '' : 'border border-slate-200',
            className,
            // Height constraints
            small
                ? (isMultiline ? '' : 'min-h-[30px] h-[30px]')
                : (isMultiline ? '' : 'min-h-[38px] h-[38px]'),
            // Flex alignment for single line inputs
            isMultiline ? '' : 'flex items-center'
        ].filter(Boolean).join(' ');

        const isDarkMode = className.includes('bg-slate-900') || className.includes('text-white') || className.includes('text-slate-200');
        const accentColor = small ? '#660033' : 'violet';

        const focusStyles = `focus-within:ring-2 focus-within:ring-[${accentColor}]/20 focus-within:border-[${accentColor}]`;

        // Text Visibility Logic
        // If there is a value, we make the real text transparent so the highlight layer shows through.
        // If empty, we show the real text so the placeholder is visible.
        const textVisibilityClass = value ? 'text-transparent' : (isDarkMode ? 'text-slate-200' : 'text-slate-800');
        const placeholderColor = isDarkMode ? 'placeholder:text-slate-500' : 'placeholder:text-slate-400';
        const caretColor = isDarkMode ? 'caret-white' : 'caret-slate-900';

        const scrollbarStyles = isDarkMode
            ? '[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-slate-800 [&::-webkit-scrollbar-thumb]:bg-slate-400 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb]:hover:bg-slate-500'
            : '';

        const inputClasses = `absolute inset-0 z-10 w-full h-full bg-transparent ${textVisibilityClass} ${caretColor} ${placeholderColor} ${fontStyles} ${paddingStyles} focus:outline-none rounded-md resize-none overflow-auto ${scrollbarStyles}`;

        const highlightClasses = `absolute inset-0 z-0 ${fontStyles} ${paddingStyles} whitespace-pre-wrap break-words bg-transparent text-inherit overflow-hidden pointer-events-none`;

        return {
            container: `${baseStyles} ${focusStyles}`,
            input: inputClasses,
            highlight: highlightClasses
        };
    }, [isMultiline, small, value, className]);
};

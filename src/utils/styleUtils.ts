import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind CSS classes intelligently, handling conflicts and conditional logic.
 * Example: mergeStyles("p-4", condition && "bg-blue-500", "p-2") -> "bg-blue-500 p-2"
 */
export function mergeStyles(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

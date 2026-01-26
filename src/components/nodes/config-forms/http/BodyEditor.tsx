import React from 'react';
import { Wand2 } from 'lucide-react';

import { VariableInput } from '../../../common/variable-input/VariableInput';

interface BodyEditorProps {
    body: string;
    onChange: (value: string) => void;
}

export const BodyEditor: React.FC<BodyEditorProps> = ({ body, onChange }) => {
    const isValidJson = () => { try { JSON.parse(body); return true; } catch { return false; } };
    const looksLikeJson = body.trim().match(/^[{[]/);
    const hasJsonError = looksLikeJson && !isValidJson();

    const formatJson = () => {
        try {
            const parsed = JSON.parse(body);
            onChange(JSON.stringify(parsed, null, 2));
        } catch { /* Ignore */ }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Body Content</label>
                    {body && (
                        <button
                            onClick={formatJson}
                            className="text-[10px] flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded hover:bg-indigo-100 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Format JSON"
                            disabled={!isValidJson()}
                        >
                            <Wand2 size={10} /> Format
                        </button>
                    )}
                </div>
                <BodyTypeBadge body={body} />
            </div>
            <VariableInput
                value={body}
                onValueChange={(val) => onChange(val)}
                className={`flex-1 h-full min-h-[200px] bg-slate-900 text-slate-200 border-slate-700 font-mono text-xs transition-all 
                    ${hasJsonError
                        ? 'focus-within:ring-rose-500 border-rose-500/50'
                        : 'border-slate-700'
                    }`}
                placeholder='{ "key": "value" } or plain text'
                rows={8}
            />
            {hasJsonError && <JsonErrorMessage body={body} />}
        </div>
    );
};

const BodyTypeBadge: React.FC<{ body: string }> = ({ body }) => {
    if (!body) return <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Empty</span>;
    try {
        JSON.parse(body);
        return <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">JSON</span>;
    } catch {
        return <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">Plain Text</span>;
    }
};

const JsonErrorMessage: React.FC<{ body: string }> = ({ body }) => {
    try {
        JSON.parse(body);
        return null;
    } catch (e: any) {
        return (
            <div className="mt-2 text-[10px] text-rose-500 flex items-start gap-1 p-2 bg-rose-500/10 rounded">
                <span className="font-bold whitespace-nowrap">Syntax Error:</span>
                <span className="break-all">{e.message}</span>
            </div>
        );
    }
};

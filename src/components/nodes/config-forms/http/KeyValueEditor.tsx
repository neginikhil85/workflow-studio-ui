import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

import { VariableInput } from '../../../common/VariableInput';

interface KeyValueEditorProps {
    items: { key: string; value: string }[];
    label: string;
    onAdd: () => void;
    onUpdate: (index: number, field: 'key' | 'value', value: string) => void;
    onRemove: (index: number) => void;
}

export const KeyValueEditor: React.FC<KeyValueEditorProps> = ({
    items,
    label,
    onAdd,
    onUpdate,
    onRemove
}) => (
    <div className="space-y-2">
        <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-bold text-slate-500 uppercase">{label}</label>
            <button onClick={onAdd} className="text-blue-500 hover:text-blue-600 text-xs font-medium flex items-center gap-1">
                <Plus size={12} /> Add
            </button>
        </div>
        {items.length === 0 && (
            <div className="text-xs text-slate-400 italic text-center py-2 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                No {label.toLowerCase()} defined
            </div>
        )}
        {items.map((item, idx) => (
            <div key={idx} className="flex gap-2">
                <div className="flex-1">
                    <VariableInput
                        placeholder="Key"
                        value={item.key}
                        onValueChange={(val) => onUpdate(idx, 'key', val)}
                        className="bg-slate-50 border-slate-200"
                    />
                </div>
                <div className="flex-1">
                    <VariableInput
                        placeholder="Value"
                        value={item.value}
                        onValueChange={(val) => onUpdate(idx, 'value', val)}
                        className="bg-slate-50 border-slate-200"
                    />
                </div>
                <button onClick={() => onRemove(idx)} className="text-slate-400 hover:text-red-500 pt-2">
                    <Trash2 size={14} />
                </button>
            </div>
        ))}
    </div>
);

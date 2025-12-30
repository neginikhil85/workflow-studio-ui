import React, { useState } from 'react';
import { Plus, Trash2, Wand2 } from 'lucide-react';
import { NodeConfig } from '../../types/workflow';

interface HttpConfigFormProps {
    config: NodeConfig;
    onChange: (key: string, value: any) => void;
}

const HttpConfigForm: React.FC<HttpConfigFormProps> = ({ config, onChange }) => {
    const [activeTab, setActiveTab] = useState<'params' | 'headers' | 'body'>('params');
    const method = config.method || 'GET';
    const hasBody = ['POST', 'PUT', 'PATCH'].includes(method);

    const updateMapItem = (key: 'params' | 'headers', index: number, field: 'key' | 'value', value: string) => {
        // Ensure strictly typed array access
        const list = [...((config[key] as { key: string; value: string }[]) || [])];
        if (!list[index]) list[index] = { key: '', value: '' };
        list[index][field] = value;
        onChange(key, list);
    };

    const removeMapItem = (key: 'params' | 'headers', index: number) => {
        const list = [...((config[key] as { key: string; value: string }[]) || [])];
        list.splice(index, 1);
        onChange(key, list);
    };

    const addMapItem = (key: 'params' | 'headers') => {
        const list = [...((config[key] as { key: string; value: string }[]) || [])];
        list.push({ key: '', value: '' });
        onChange(key, list);
    };

    const renderKeyValueEditor = (key: 'params' | 'headers', label: string) => {
        const items = (config[key] as { key: string; value: string }[]) || [];

        return (
            <div className="space-y-2">
                <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">{label}</label>
                    <button onClick={() => addMapItem(key)} className="text-blue-500 hover:text-blue-600 text-xs font-medium flex items-center gap-1">
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
                        <input
                            placeholder="Key"
                            value={item.key}
                            onChange={(e) => updateMapItem(key, idx, 'key', e.target.value)}
                            className="flex-1 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs focus:ring-1 focus:ring-blue-500"
                        />
                        <input
                            placeholder="Value"
                            value={item.value}
                            onChange={(e) => updateMapItem(key, idx, 'value', e.target.value)}
                            className="flex-1 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs focus:ring-1 focus:ring-blue-500"
                        />
                        <button onClick={() => removeMapItem(key, idx)} className="text-slate-400 hover:text-red-500">
                            <Trash2 size={14} />
                        </button>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-3">
                <div className="w-1/4">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Method</label>
                    <select
                        value={method}
                        onChange={(e) => onChange('method', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    >
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="DELETE">DELETE</option>
                        <option value="PATCH">PATCH</option>
                    </select>
                </div>
                <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">URL</label>
                    <input
                        value={config.url || ''}
                        onChange={(e) => onChange('url', e.target.value)}
                        placeholder="https://api.example.com/v1/resource"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-mono"
                    />
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200 flex gap-4">
                <button
                    onClick={() => setActiveTab('params')}
                    className={`pb-2 text-xs font-bold uppercase tracking-wide transition-colors ${activeTab === 'params' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    Params
                </button>
                <button
                    onClick={() => setActiveTab('headers')}
                    className={`pb-2 text-xs font-bold uppercase tracking-wide transition-colors ${activeTab === 'headers' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    Headers
                </button>
                {hasBody && (
                    <button
                        onClick={() => setActiveTab('body')}
                        className={`pb-2 text-xs font-bold uppercase tracking-wide transition-colors ${activeTab === 'body' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Body
                    </button>
                )}
            </div>

            <div className="pt-2 min-h-[200px]">
                {activeTab === 'params' && renderKeyValueEditor('params', 'Query Parameters')}
                {activeTab === 'headers' && renderKeyValueEditor('headers', 'Headers')}
                {activeTab === 'body' && (
                    <div className="flex flex-col h-full">
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Body Content</label>
                                {config.body && (
                                    <button
                                        onClick={() => {
                                            try {
                                                const parsed = JSON.parse(config.body || '{}');
                                                onChange('body', JSON.stringify(parsed, null, 2));
                                            } catch (e) {
                                                // Ignore format if invalid
                                            }
                                        }}
                                        className="text-[10px] flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded hover:bg-indigo-100 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Format JSON"
                                        disabled={!config.body || (() => { try { JSON.parse(config.body); return false; } catch { return true; } })()}
                                    >
                                        <Wand2 size={10} /> Format
                                    </button>
                                )}
                            </div>
                            {(() => {
                                if (!config.body) return <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Empty</span>;
                                try {
                                    JSON.parse(config.body);
                                    return <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">JSON</span>;
                                } catch (e) {
                                    return <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">Plain Text</span>;
                                }
                            })()}
                        </div>
                        <textarea
                            value={config.body || ''}
                            onChange={(e) => onChange('body', e.target.value)}
                            className={`w-full h-48 bg-slate-900 text-slate-200 p-3 rounded-lg font-mono text-xs focus:outline-none focus:ring-2 transition-all ${config.body && config.body.trim().match(/^[{[]/) && (() => { try { JSON.parse(config.body); return false; } catch { return true; } })()
                                    ? 'focus:ring-rose-500 border border-rose-500/50'
                                    : 'focus:ring-blue-500 border-transparent'
                                }`}
                            placeholder='{ "key": "value" } or plain text'
                        />
                        {config.body && config.body.trim().match(/^[{[]/) && (() => {
                            try {
                                JSON.parse(config.body);
                                return null;
                            } catch (e: any) {
                                return (
                                    <div className="mt-2 text-[10px] text-rose-500 flex items-start gap-1 p-2 bg-rose-500/10 rounded">
                                        <span className="font-bold whitespace-nowrap">Syntax Error:</span>
                                        <span className="break-all">{e.message}</span>
                                    </div>
                                );
                            }
                        })()}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HttpConfigForm;

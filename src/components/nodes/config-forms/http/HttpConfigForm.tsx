import React, { useState, useEffect } from 'react';
import { HttpNodeConfig } from '../../../../types/workflow.interfaces';
import { KeyValueEditor } from './KeyValueEditor';
import { BodyEditor } from './BodyEditor';
import { VariableInput } from '../../../common/variable-input/VariableInput';

interface HttpConfigFormProps {
    config: HttpNodeConfig;
    onChange: (key: string, value: any) => void;
}

const HttpConfigForm: React.FC<HttpConfigFormProps> = ({ config, onChange }) => {
    const [activeTab, setActiveTab] = useState<'params' | 'headers' | 'body'>('params');
    const method = config.method || 'GET';
    const hasBody = ['POST', 'PUT', 'PATCH'].includes(method);

    // Reset tab if method changes to one without body
    useEffect(() => {
        if (!hasBody && activeTab === 'body') {
            setActiveTab('params');
        }
    }, [hasBody, activeTab]);

    const updateMapItem = (key: 'params' | 'headers', index: number, field: 'key' | 'value', value: string) => {
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

    return (
        <div className="space-y-4">
            <MethodUrlInputs config={config} onChange={onChange} />

            <TabNavigation
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                hasBody={hasBody}
            />

            <div className="pt-2 min-h-[200px]">
                {activeTab === 'params' && (
                    <KeyValueEditor
                        items={(config.params as { key: string; value: string }[]) || []}
                        label="Query Parameters"
                        onAdd={() => addMapItem('params')}
                        onUpdate={(idx, field, value) => updateMapItem('params', idx, field, value)}
                        onRemove={(idx) => removeMapItem('params', idx)}
                    />
                )}
                {activeTab === 'headers' && (
                    <KeyValueEditor
                        items={(config.headers as { key: string; value: string }[]) || []}
                        label="Headers"
                        onAdd={() => addMapItem('headers')}
                        onUpdate={(idx, field, value) => updateMapItem('headers', idx, field, value)}
                        onRemove={(idx) => removeMapItem('headers', idx)}
                    />
                )}
                {activeTab === 'body' && (
                    <BodyEditor
                        body={config.body || ''}
                        onChange={(value) => onChange('body', value)}
                    />
                )}
            </div>
        </div>
    );
};

export default HttpConfigForm;

/** Method dropdown and URL input */
const MethodUrlInputs: React.FC<{
    config: HttpNodeConfig;
    onChange: (key: string, value: any) => void;
}> = ({ config, onChange }) => (
    <div className="flex gap-3">
        <div className="w-1/4">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Method</label>
            <select
                value={config.method || 'GET'}
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
            <VariableInput
                value={config.url || ''}
                onValueChange={(val) => onChange('url', val)}
                placeholder="https://api.example.com/v1/resource"
                className="bg-slate-50 border-slate-200 font-mono"
            />
        </div>
    </div>
);

/** Tab navigation for params/headers/body */
const TabNavigation: React.FC<{
    activeTab: 'params' | 'headers' | 'body';
    setActiveTab: (tab: 'params' | 'headers' | 'body') => void;
    hasBody: boolean;
}> = ({ activeTab, setActiveTab, hasBody }) => (
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
);
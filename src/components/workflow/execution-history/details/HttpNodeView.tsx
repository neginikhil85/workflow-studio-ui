import React, { useState } from 'react';
import { NodeExecutionResult } from '../../../../types/workflow.interfaces';
import { Globe } from 'lucide-react';

interface HttpNodeViewProps {
    result: NodeExecutionResult;
}

export const HttpNodeView: React.FC<HttpNodeViewProps> = ({ result }) => {
    // State for tabs and response format
    const [tab, setTab] = useState<'request' | 'response'>('request');
    const [responseFormat, setResponseFormat] = useState<'json' | 'text'>('json');

    const httpDetails = (result.executionDetails || {}) as any;

    const JsonBlock = ({ data }: { data: any }) => (
        <pre className="text-[10px] font-mono bg-slate-50 p-3 rounded-md border border-slate-100 overflow-x-auto text-slate-700">
            {typeof data === 'string' ? data : JSON.stringify(data, null, 2)}
        </pre>
    );

    return (
        <div className="flex flex-col h-full">
            {/* Header Summary */}
            <div className="bg-white p-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                        <Globe size={18} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-700 text-sm">{httpDetails.method || 'HTTP'}</span>
                            <span className="bg-slate-100 text-slate-500 text-[10px] px-1.5 py-0.5 rounded font-mono truncate max-w-[200px]">
                                {httpDetails.url || 'URL not captured'}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs font-medium px-1.5 rounded ${httpDetails.status >= 200 && httpDetails.status < 300
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-red-100 text-red-700'
                                }`}>
                                {httpDetails.status || '---'}
                            </span>
                            <span className="text-xs text-slate-400">{result.duration}ms</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-100">
                <button
                    onClick={() => setTab('request')}
                    className={`flex-1 py-2 text-xs font-medium border-b-2 transition-colors ${tab === 'request' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                >
                    Request
                </button>
                <button
                    onClick={() => setTab('response')}
                    className={`flex-1 py-2 text-xs font-medium border-b-2 transition-colors ${tab === 'response' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                >
                    Response
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
                {tab === 'request' ? (
                    <div className="space-y-4">
                        <div>
                            <h4 className="text-[10px] font-semibold text-slate-400 uppercase mb-2">Request Body</h4>
                            <JsonBlock data={httpDetails.requestBody || 'No Body'} />
                        </div>
                        {httpDetails.requestHeaders && (
                            <div className="mt-4">
                                <h4 className="text-[10px] font-semibold text-slate-400 uppercase mb-2">Request Headers</h4>
                                <JsonBlock data={httpDetails.requestHeaders} />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="text-[10px] font-semibold text-slate-400 uppercase">Response Body</h4>
                            <div className="flex gap-1 bg-slate-100 p-0.5 rounded">
                                <button
                                    onClick={() => setResponseFormat('json')}
                                    className={`px-2 py-0.5 text-[10px] rounded ${responseFormat === 'json' ? 'bg-white shadow-sm text-slate-700' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    JSON
                                </button>
                                <button
                                    onClick={() => setResponseFormat('text')}
                                    className={`px-2 py-0.5 text-[10px] rounded ${responseFormat === 'text' ? 'bg-white shadow-sm text-slate-700' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    Text
                                </button>
                            </div>
                        </div>

                        {responseFormat === 'json' ? (
                            <JsonBlock data={httpDetails.data || httpDetails.response || {}} />
                        ) : (
                            <pre className="text-[10px] font-mono bg-slate-50 p-3 rounded-md border border-slate-100 overflow-x-auto text-slate-700 whitespace-pre-wrap">
                                {typeof (httpDetails.data || httpDetails.response) === 'object'
                                    ? JSON.stringify(httpDetails.data || httpDetails.response, null, 2)
                                    : String(httpDetails.data || httpDetails.response)
                                }
                            </pre>
                        )}

                        {httpDetails.headers && (
                            <div className="mt-4">
                                <h4 className="text-[10px] font-semibold text-slate-400 uppercase mb-2">Response Headers</h4>
                                <JsonBlock data={httpDetails.headers} />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

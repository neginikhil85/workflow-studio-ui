import { CheckCircle2, Loader2, Radio, Server, XCircle } from 'lucide-react';
import React from 'react';
import { NodeConfig } from '../../../../types/workflow.interfaces';
import { VariableInput } from '../../../../components/common/variable-input/VariableInput';

interface KafkaBrokerConfigProps {
    config: NodeConfig;
    onChange: (key: string, value: any) => void;
    connectionStatus: 'idle' | 'testing' | 'success' | 'error';
    connectionError: string;
    clusterInfo: { clusterId?: string; brokers?: string[] } | null;
    onTestConnection: () => void;
    accentColor?: string;
}

export const KafkaBrokerConfig: React.FC<KafkaBrokerConfigProps> = ({
    config,
    onChange,
    connectionStatus,
    connectionError,
    clusterInfo,
    onTestConnection,
    accentColor = '#7C3AED' // Default Violet
}) => {
    const focusClass = `focus-within:ring-[${accentColor}]/20 focus-within:border-[${accentColor}]`;
    const btnClass = `bg-[${accentColor}] hover:bg-[${accentColor}]/90 shadow-sm text-white`;

    return (
        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                    <Server size={12} />
                    <span>Broker Configuration</span>
                </div>
                {connectionStatus === 'success' && (
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 size={10} /> Connected
                    </span>
                )}
            </div>

            <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Bootstrap Servers</label>
                <div className="flex gap-2">
                    <div className="flex-1">
                        <VariableInput
                            small
                            value={config.bootstrapServers || ''}
                            onValueChange={(val) => onChange('bootstrapServers', val)}
                            placeholder="localhost:9092"
                            className={`bg-slate-50 border border-slate-200 font-mono text-[11px] ${focusClass}`}
                        />
                    </div>
                    <button
                        onClick={onTestConnection}
                        disabled={connectionStatus === 'testing' || !config.bootstrapServers}
                        className={`px-3 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${btnClass}`}
                        style={{ backgroundColor: accentColor }}
                    >
                        {connectionStatus === 'testing' ? (
                            <Loader2 size={12} className="animate-spin" />
                        ) : (
                            <Radio size={12} />
                        )}
                        Test Connection
                    </button>
                </div>

                {/* Status Feedback */}
                <ConnectionStatusDetails
                    status={connectionStatus}
                    error={connectionError}
                    clusterInfo={clusterInfo}
                />
            </div>
        </div>
    );
};

/** Displays detailed success/error status */
const ConnectionStatusDetails: React.FC<{
    status: 'idle' | 'testing' | 'success' | 'error';
    error: string;
    clusterInfo: { clusterId?: string; brokers?: string[] } | null;
}> = ({ status, error, clusterInfo }) => {
    if (status === 'success' && clusterInfo) {
        return (
            <div className="mt-2 text-[10px] bg-emerald-50 text-emerald-800 p-2 rounded border border-emerald-100">
                <div className="flex gap-2">
                    <span className="font-bold opacity-70">Cluster ID:</span>
                    <span className="font-mono">{clusterInfo.clusterId}</span>
                </div>
                {clusterInfo.brokers && (
                    <div className="flex gap-2 mt-0.5">
                        <span className="font-bold opacity-70">Brokers:</span>
                        <span className="font-mono">{clusterInfo.brokers.length} active</span>
                    </div>
                )}
            </div>
        );
    }
    if (status === 'error') {
        return (
            <p className="text-[10px] text-red-500 mt-1.5 flex items-start gap-1">
                <XCircle size={10} className="mt-0.5 shrink-0" />
                <span>{error}</span>
            </p>
        );
    }
    return null;
};

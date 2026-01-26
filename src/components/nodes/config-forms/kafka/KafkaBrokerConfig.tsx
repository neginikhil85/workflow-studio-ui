import { CheckCircle2, Loader2, Radio, Server, XCircle } from 'lucide-react';
import React from 'react';
import { NodeConfig } from '../../../../types/workflow.interfaces';
import { VariableInput } from '../../../../components/common/VariableInput';

interface KafkaBrokerConfigProps {
    config: NodeConfig;
    onChange: (key: string, value: any) => void;
    connectionStatus: 'idle' | 'testing' | 'success' | 'error';
    connectionError: string;
    clusterInfo: { clusterId?: string; brokers?: string[] } | null;
    onTestConnection: () => void;
    accentColor?: 'violet' | 'fuchsia';
}


export const KafkaBrokerConfig: React.FC<KafkaBrokerConfigProps> = ({
    config,
    onChange,
    connectionStatus,
    connectionError,
    clusterInfo,
    onTestConnection,
    accentColor = 'violet'
}) => {
    const focusRing = accentColor === 'fuchsia' ? 'focus-within:ring-fuchsia-500/50' : 'focus-within:ring-violet-500/50';
    const btnClass = accentColor === 'fuchsia'
        ? 'bg-fuchsia-600 hover:bg-fuchsia-700 disabled:bg-fuchsia-400 shadow-fuchsia-200'
        : 'bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 shadow-violet-200';

    return (
        <div className="space-y-5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
                <Server size={14} />
                <span>Broker Configuration</span>
            </div>

            <div className="flex gap-3">
                <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Bootstrap Servers</label>
                    <VariableInput
                        value={config.bootstrapServers || ''}
                        onValueChange={(val) => onChange('bootstrapServers', val)}
                        placeholder="localhost:9092"
                        className={`bg-slate-50 border-slate-200 font-mono ${focusRing}`}
                    />
                </div>
                <div className="flex items-end">
                    <button
                        onClick={onTestConnection}
                        disabled={connectionStatus === 'testing'}
                        className={`px-4 py-2 text-white rounded-lg text-sm font-bold flex items-center gap-2 transition-colors shadow-md ${btnClass}`}
                    >
                        {connectionStatus === 'testing' ? (
                            <Loader2 size={14} className="animate-spin" />
                        ) : (
                            <Radio size={14} />
                        )}
                        Test Connection
                    </button>
                </div>
            </div>

            <ConnectionStatusBadge
                status={connectionStatus}
                error={connectionError}
                clusterInfo={clusterInfo}
            />
        </div>
    );
};


/** Displays success/error status after connection test */
const ConnectionStatusBadge: React.FC<{
    status: 'idle' | 'testing' | 'success' | 'error';
    error: string;
    clusterInfo: { clusterId?: string; brokers?: string[] } | null;
}> = ({ status, error, clusterInfo }) => {
    if (status === 'success' && clusterInfo) {
        return (
            <div className="flex items-start gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <CheckCircle2 size={16} className="text-emerald-600 mt-0.5" />
                <div className="text-xs">
                    <p className="font-bold text-emerald-700">Connected Successfully</p>
                    <p className="text-emerald-600">Cluster: {clusterInfo.clusterId}</p>
                    <p className="text-emerald-600">Brokers: {clusterInfo.brokers?.join(', ')}</p>
                </div>
            </div>
        );
    }
    if (status === 'error') {
        return (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <XCircle size={16} className="text-red-600 mt-0.5" />
                <div className="text-xs">
                    <p className="font-bold text-red-700">Connection Failed</p>
                    <p className="text-red-600">{error}</p>
                </div>
            </div>
        );
    }
    return null;
};

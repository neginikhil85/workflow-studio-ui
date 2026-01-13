import React, { useEffect, useState } from 'react';
import { KafkaMode, NodeConfig } from '../../../../types/workflow.interfaces';
import { KafkaBrokerConfig } from './KafkaBrokerConfig';
import { KafkaPayloadConfig } from './KafkaPayloadConfig';
import { KafkaSecurityConfig } from './KafkaSecurityConfig';
import { KafkaTopicConfig } from './KafkaTopicConfig';

interface KafkaConfigFormProps {
    config: NodeConfig;
    onChange: (key: string, value: any) => void;
}

const KafkaConfigForm: React.FC<KafkaConfigFormProps> = ({ config, onChange }) => {
    // Connection test state
    const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
    const [connectionError, setConnectionError] = useState<string>('');
    const [clusterInfo, setClusterInfo] = useState<{ clusterId?: string; brokers?: string[] } | null>(null);

    const kafkaMode = (config.kafkaMode || 'PRODUCER') as KafkaMode;

    // Topics state
    const [topics, setTopics] = useState<string[]>([]);
    const [loadingTopics, setLoadingTopics] = useState(false);

    // Build connection config for API calls
    const buildConnectionConfig = () => ({
        bootstrapServers: config.bootstrapServers || 'localhost:9092',
        securityProtocol: config.securityProtocol || 'PLAINTEXT',
        sslTruststoreLocation: config.sslTruststoreLocation,
        sslTruststorePassword: config.sslTruststorePassword,
        sslKeystoreLocation: config.sslKeystoreLocation,
        sslKeystorePassword: config.sslKeystorePassword,
        saslMechanism: config.saslMechanism,
        saslJaasConfig: config.saslJaasConfig,
    });

    // Test connection
    const testConnection = async () => {
        setConnectionStatus('testing');
        setConnectionError('');
        setClusterInfo(null);

        try {
            const { KafkaService } = await import('../../../../services/KafkaService');
            const service = new KafkaService();
            const data = await service.testConnection(buildConnectionConfig());

            setConnectionStatus('success');
            setClusterInfo({
                clusterId: data.clusterId,
                brokers: data.brokers
            });
            // Auto-load topics on successful connection
            loadTopics();
        } catch (e: any) {
            setConnectionStatus('error');
            setConnectionError(e.message || 'Connection failed');
        }
    };

    // Load topics
    const loadTopics = async () => {
        setLoadingTopics(true);
        try {
            const { KafkaService } = await import('../../../../services/KafkaService');
            const service = new KafkaService();
            const topics = await service.getTopics(buildConnectionConfig());
            setTopics(topics);
        } catch (e) {
            console.error('Failed to load topics', e);
        } finally {
            setLoadingTopics(false);
        }
    };

    // Auto-test on bootstrap server change (debounced)
    useEffect(() => {
        if (connectionStatus === 'success') {
            setConnectionStatus('idle');
        }
    }, [config.bootstrapServers, config.securityProtocol]);

    return (
        <div className="space-y-3">
            <KafkaBrokerConfig
                config={config}
                onChange={onChange}
                connectionStatus={connectionStatus}
                connectionError={connectionError}
                clusterInfo={clusterInfo}
                onTestConnection={testConnection}
            />

            <KafkaSecurityConfig
                config={config}
                onChange={onChange}
            />

            <ModeSelector
                mode={kafkaMode}
                onChange={(mode: any) => onChange('kafkaMode', mode)}
            />

            <KafkaTopicConfig
                config={config}
                onChange={onChange}
                topics={topics}
                loadingTopics={loadingTopics}
                onLoadTopics={loadTopics}
                buildConnectionConfig={buildConnectionConfig}
                onTopicCreated={(newTopic) => setTopics(prev => [...prev, newTopic])}
                connectionStatus={connectionStatus}
            />

            <KafkaPayloadConfig
                kafkaMode={kafkaMode}
                config={config}
                onChange={onChange}
            />
        </div>
    );
};

export default KafkaConfigForm;


/** Producer/Consumer mode toggle buttons */
const ModeSelector: React.FC<{
    mode: KafkaMode;
    onChange: (mode: KafkaMode) => void;
}> = ({ mode, onChange }) => (
    <div>
        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Mode</label>
        <div className="flex gap-2">
            <button
                onClick={() => onChange('PRODUCER' as KafkaMode)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${mode === 'PRODUCER'
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
            >
                Producer
            </button>
            <button
                onClick={() => onChange('CONSUMER' as KafkaMode)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${mode === 'CONSUMER'
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
            >
                Consumer
            </button>
        </div>
    </div>
);
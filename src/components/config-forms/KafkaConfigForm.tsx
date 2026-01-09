import React, { useState, useEffect } from 'react';
import { NodeConfig } from '../../types/workflow';
import {
    CheckCircle2,
    XCircle,
    Loader2,
    Plus,
    RefreshCw,
    ChevronDown,
    ChevronRight,
    Server,
    Shield,
    Radio
} from 'lucide-react';
import axios from 'axios';

interface KafkaConfigFormProps {
    config: NodeConfig;
    onChange: (key: string, value: any) => void;
}

type SecurityProtocol = 'PLAINTEXT' | 'SSL' | 'SASL_PLAINTEXT' | 'SASL_SSL';
type KafkaMode = 'PRODUCER' | 'CONSUMER';

const KafkaConfigForm: React.FC<KafkaConfigFormProps> = ({ config, onChange }) => {
    // Connection test state
    const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
    const [connectionError, setConnectionError] = useState<string>('');
    const [clusterInfo, setClusterInfo] = useState<{ clusterId?: string; brokers?: string[] } | null>(null);

    // Topics state
    const [topics, setTopics] = useState<string[]>([]);
    const [loadingTopics, setLoadingTopics] = useState(false);

    // Create topic state
    const [showCreateTopic, setShowCreateTopic] = useState(false);
    const [newTopicName, setNewTopicName] = useState('');
    const [newTopicPartitions, setNewTopicPartitions] = useState(1);
    const [creatingTopic, setCreatingTopic] = useState(false);

    // Collapsible sections
    const [showSecuritySection, setShowSecuritySection] = useState(false);

    const securityProtocol = (config.securityProtocol || 'PLAINTEXT') as SecurityProtocol;
    const kafkaMode = (config.kafkaMode || 'PRODUCER') as KafkaMode;
    const showSSL = securityProtocol === 'SSL' || securityProtocol === 'SASL_SSL';
    const showSASL = securityProtocol === 'SASL_PLAINTEXT' || securityProtocol === 'SASL_SSL';

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
            const response = await axios.post('/api/kafka/test-connection', buildConnectionConfig());
            if (response.data.success) {
                setConnectionStatus('success');
                setClusterInfo({
                    clusterId: response.data.clusterId,
                    brokers: response.data.brokers
                });
                // Auto-load topics on successful connection
                loadTopics();
            } else {
                setConnectionStatus('error');
                setConnectionError(response.data.error || 'Connection failed');
            }
        } catch (e: any) {
            setConnectionStatus('error');
            setConnectionError(e.response?.data?.error || e.message || 'Connection failed');
        }
    };

    // Load topics
    const loadTopics = async () => {
        setLoadingTopics(true);
        try {
            const response = await axios.post('/api/kafka/topics', buildConnectionConfig());
            if (response.data.success) {
                setTopics(response.data.topics || []);
            }
        } catch (e) {
            console.error('Failed to load topics', e);
        } finally {
            setLoadingTopics(false);
        }
    };

    // Create topic
    const createTopic = async () => {
        if (!newTopicName.trim()) return;

        setCreatingTopic(true);
        try {
            const response = await axios.post('/api/kafka/topics/create', {
                ...buildConnectionConfig(),
                topicName: newTopicName,
                partitions: newTopicPartitions,
                replicationFactor: 1
            });

            if (response.data.success) {
                setTopics(prev => [...prev, newTopicName]);
                onChange('topic', newTopicName);
                setNewTopicName('');
                setShowCreateTopic(false);
            }
        } catch (e: any) {
            console.error('Failed to create topic', e);
        } finally {
            setCreatingTopic(false);
        }
    };

    // Auto-test on bootstrap server change (debounced)
    useEffect(() => {
        if (connectionStatus === 'success') {
            setConnectionStatus('idle');
        }
    }, [config.bootstrapServers, config.securityProtocol]);

    return (
        <div className="space-y-5">
            {/* Connection Section */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
                    <Server size={14} />
                    <span>Broker Configuration</span>
                </div>

                <div className="flex gap-3">
                    <div className="flex-1">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Bootstrap Servers</label>
                        <input
                            value={config.bootstrapServers || ''}
                            onChange={(e) => onChange('bootstrapServers', e.target.value)}
                            placeholder="localhost:9092"
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50"
                        />
                    </div>
                    <div className="flex items-end">
                        <button
                            onClick={testConnection}
                            disabled={connectionStatus === 'testing'}
                            className="px-4 py-2 bg-fuchsia-600 hover:bg-fuchsia-700 disabled:bg-fuchsia-400 text-white rounded-lg text-sm font-bold flex items-center gap-2 transition-colors shadow-md shadow-fuchsia-200"
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

                {/* Connection Status */}
                {connectionStatus === 'success' && clusterInfo && (
                    <div className="flex items-start gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                        <CheckCircle2 size={16} className="text-emerald-600 mt-0.5" />
                        <div className="text-xs">
                            <p className="font-bold text-emerald-700">Connected Successfully</p>
                            <p className="text-emerald-600">Cluster: {clusterInfo.clusterId}</p>
                            <p className="text-emerald-600">Brokers: {clusterInfo.brokers?.join(', ')}</p>
                        </div>
                    </div>
                )}
                {connectionStatus === 'error' && (
                    <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <XCircle size={16} className="text-red-600 mt-0.5" />
                        <div className="text-xs">
                            <p className="font-bold text-red-700">Connection Failed</p>
                            <p className="text-red-600">{connectionError}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Security Section */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
                <button
                    onClick={() => setShowSecuritySection(!showSecuritySection)}
                    className="w-full px-4 py-3 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase">
                        <Shield size={14} />
                        <span>Security & Authentication</span>
                    </div>
                    {showSecuritySection ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>

                {showSecuritySection && (
                    <div className="p-4 space-y-4 border-t border-slate-200">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Security Protocol</label>
                            <select
                                value={securityProtocol}
                                onChange={(e) => onChange('securityProtocol', e.target.value)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50"
                            >
                                <option value="PLAINTEXT">PLAINTEXT</option>
                                <option value="SSL">SSL</option>
                                <option value="SASL_PLAINTEXT">SASL_PLAINTEXT</option>
                                <option value="SASL_SSL">SASL_SSL</option>
                            </select>
                        </div>

                        {/* SASL Config */}
                        {showSASL && (
                            <div className="space-y-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                <p className="text-xs font-bold text-amber-700">SASL Configuration</p>
                                <div>
                                    <label className="block text-xs font-medium text-amber-700 mb-1">SASL Mechanism</label>
                                    <select
                                        value={config.saslMechanism || 'PLAIN'}
                                        onChange={(e) => onChange('saslMechanism', e.target.value)}
                                        className="w-full px-3 py-2 bg-white border border-amber-300 rounded text-sm"
                                    >
                                        <option value="PLAIN">PLAIN</option>
                                        <option value="SCRAM-SHA-256">SCRAM-SHA-256</option>
                                        <option value="SCRAM-SHA-512">SCRAM-SHA-512</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-amber-700 mb-1">JAAS Config</label>
                                    <textarea
                                        value={config.saslJaasConfig || ''}
                                        onChange={(e) => onChange('saslJaasConfig', e.target.value)}
                                        placeholder="org.apache.kafka.common.security.plain.PlainLoginModule required username='user' password='pass';"
                                        className="w-full px-3 py-2 bg-white border border-amber-300 rounded text-xs font-mono h-20"
                                    />
                                </div>
                            </div>
                        )}

                        {/* SSL Config */}
                        {showSSL && (
                            <div className="space-y-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-xs font-bold text-blue-700">SSL Configuration</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-blue-700 mb-1">Truststore Location</label>
                                        <input
                                            value={config.sslTruststoreLocation || ''}
                                            onChange={(e) => onChange('sslTruststoreLocation', e.target.value)}
                                            placeholder="/path/to/truststore.jks"
                                            className="w-full px-2 py-1.5 bg-white border border-blue-300 rounded text-xs"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-blue-700 mb-1">Truststore Password</label>
                                        <input
                                            type="password"
                                            value={config.sslTruststorePassword || ''}
                                            onChange={(e) => onChange('sslTruststorePassword', e.target.value)}
                                            className="w-full px-2 py-1.5 bg-white border border-blue-300 rounded text-xs"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-blue-700 mb-1">Keystore Location</label>
                                        <input
                                            value={config.sslKeystoreLocation || ''}
                                            onChange={(e) => onChange('sslKeystoreLocation', e.target.value)}
                                            placeholder="/path/to/keystore.jks"
                                            className="w-full px-2 py-1.5 bg-white border border-blue-300 rounded text-xs"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-blue-700 mb-1">Keystore Password</label>
                                        <input
                                            type="password"
                                            value={config.sslKeystorePassword || ''}
                                            onChange={(e) => onChange('sslKeystorePassword', e.target.value)}
                                            className="w-full px-2 py-1.5 bg-white border border-blue-300 rounded text-xs"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Mode Selection */}
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Mode</label>
                <div className="flex gap-2">
                    <button
                        onClick={() => onChange('kafkaMode', 'PRODUCER')}
                        className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${kafkaMode === 'PRODUCER'
                            ? 'bg-fuchsia-600 text-white shadow-md shadow-fuchsia-200'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                    >
                        Producer
                    </button>
                    <button
                        onClick={() => onChange('kafkaMode', 'CONSUMER')}
                        className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${kafkaMode === 'CONSUMER'
                            ? 'bg-fuchsia-600 text-white shadow-md shadow-fuchsia-200'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                    >
                        Consumer
                    </button>
                </div>
            </div>

            {/* Topic Selection */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Topic</label>
                    <div className="flex gap-2">
                        <button
                            onClick={loadTopics}
                            disabled={loadingTopics}
                            className="text-xs text-fuchsia-600 hover:text-fuchsia-700 flex items-center gap-1"
                        >
                            <RefreshCw size={12} className={loadingTopics ? 'animate-spin' : ''} />
                            Refresh
                        </button>
                        <button
                            onClick={() => setShowCreateTopic(!showCreateTopic)}
                            className="text-xs text-fuchsia-600 hover:text-fuchsia-700 flex items-center gap-1"
                        >
                            <Plus size={12} />
                            Create New
                        </button>
                    </div>
                </div>

                {showCreateTopic && (
                    <div className="mb-3 p-3 bg-fuchsia-50 border border-fuchsia-200 rounded-lg space-y-2">
                        <div className="flex gap-2">
                            <input
                                value={newTopicName}
                                onChange={(e) => setNewTopicName(e.target.value)}
                                placeholder="New topic name"
                                className="flex-1 px-2 py-1.5 bg-white border border-fuchsia-300 rounded text-sm"
                            />
                            <input
                                type="number"
                                value={newTopicPartitions}
                                onChange={(e) => setNewTopicPartitions(parseInt(e.target.value) || 1)}
                                min={1}
                                className="w-20 px-2 py-1.5 bg-white border border-fuchsia-300 rounded text-sm text-center"
                                placeholder="Partitions"
                            />
                            <button
                                onClick={createTopic}
                                disabled={creatingTopic || !newTopicName.trim()}
                                className="px-3 py-1.5 bg-fuchsia-600 text-white rounded text-sm font-bold disabled:opacity-50"
                            >
                                {creatingTopic ? <Loader2 size={14} className="animate-spin" /> : 'Create'}
                            </button>
                        </div>
                        <p className="text-[10px] text-fuchsia-600">Enter topic name and number of partitions</p>
                    </div>
                )}

                <select
                    value={config.topic || ''}
                    onChange={(e) => onChange('topic', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50"
                >
                    <option value="">Select a topic...</option>
                    {topics.map(topic => (
                        <option key={topic} value={topic}>{topic}</option>
                    ))}
                </select>
                {topics.length === 0 && connectionStatus !== 'success' && (
                    <p className="text-xs text-slate-400 mt-1">Test connection to load available topics</p>
                )}
            </div>

            {/* Producer Config */}
            {kafkaMode === 'PRODUCER' && (
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Message</label>
                    <textarea
                        value={config.message || ''}
                        onChange={(e) => onChange('message', e.target.value)}
                        placeholder='{ "orderId": 123, "status": "created" }'
                        className="w-full px-3 py-2 bg-slate-900 text-slate-200 rounded-lg text-sm font-mono h-32 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50"
                    />
                    <p className="text-xs text-slate-400 mt-1">
                        Message will be sent to the selected topic when workflow executes.
                        Use pipeline input data for dynamic messages.
                    </p>
                </div>
            )}

            {/* Consumer Config */}
            {kafkaMode === 'CONSUMER' && (
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Consumer Group</label>
                        <input
                            value={config.consumerGroup || ''}
                            onChange={(e) => onChange('consumerGroup', e.target.value)}
                            placeholder="workflow-consumer-group"
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Poll Timeout (ms)</label>
                        <input
                            type="number"
                            value={config.pollTimeoutMs || 5000}
                            onChange={(e) => onChange('pollTimeoutMs', parseInt(e.target.value) || 5000)}
                            min={1000}
                            max={30000}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50"
                        />
                        <p className="text-xs text-slate-400 mt-1">
                            Maximum time to wait for messages. Returns any messages received within this time.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KafkaConfigForm;

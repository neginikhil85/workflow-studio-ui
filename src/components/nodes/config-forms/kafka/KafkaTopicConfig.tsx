import React, { useState } from 'react';
import { Loader2, Plus, RefreshCw } from 'lucide-react';
import { NodeConfig } from '../../../../types/workflow.interfaces';

interface KafkaTopicConfigProps {
    config: NodeConfig;
    onChange: (key: string, value: any) => void;
    topics: string[];
    loadingTopics: boolean;
    onLoadTopics: () => void;
    buildConnectionConfig: () => any;
    onTopicCreated: (topic: string) => void;
    connectionStatus: 'idle' | 'testing' | 'success' | 'error';
    accentColor?: 'violet' | 'fuchsia';
}

export const KafkaTopicConfig: React.FC<KafkaTopicConfigProps> = ({
    config,
    onChange,
    topics,
    loadingTopics,
    onLoadTopics,
    buildConnectionConfig,
    onTopicCreated,
    connectionStatus,
    accentColor = 'violet'
}) => {
    const [showCreateForm, setShowCreateForm] = useState(false);

    const textClass = accentColor === 'fuchsia' ? 'text-fuchsia-700 hover:text-fuchsia-800' : 'text-violet-700 hover:text-violet-800';
    const ringClass = accentColor === 'fuchsia' ? 'focus:ring-fuchsia-500/50' : 'focus:ring-violet-500/50';

    const handleCreateTopic = async (name: string, partitions: number) => {
        try {
            const { KafkaService } = await import('../../../../services/KafkaService');
            const service = new KafkaService();
            await service.createTopic({
                ...buildConnectionConfig(),
                topicName: name,
                partitions,
                replicationFactor: 1
            });
            onTopicCreated(name);
            onChange('topic', name);
        } catch (e: any) {
            console.error('Failed to create topic', e);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Topic</label>
                <div className="flex gap-2">
                    <button
                        onClick={onLoadTopics}
                        disabled={loadingTopics}
                        className={`text-xs flex items-center gap-1 ${textClass}`}
                    >
                        <RefreshCw size={12} className={loadingTopics ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                    <button
                        onClick={() => setShowCreateForm(!showCreateForm)}
                        className={`text-xs flex items-center gap-1 ${textClass}`}
                    >
                        <Plus size={12} />
                        Create New
                    </button>
                </div>
            </div>

            {showCreateForm && (
                <CreateTopicForm
                    onCreateTopic={handleCreateTopic}
                    onClose={() => setShowCreateForm(false)}
                    accentColor={accentColor}
                />
            )}

            <select
                value={config.topic || ''}
                onChange={(e) => onChange('topic', e.target.value)}
                className={`w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 ${ringClass}`}
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
    );
};


/** Form to create a new Kafka topic */
const CreateTopicForm: React.FC<{
    onCreateTopic: (name: string, partitions: number) => Promise<void>;
    onClose: () => void;
    accentColor: 'violet' | 'fuchsia';
}> = ({ onCreateTopic, onClose, accentColor }) => {
    const [topicName, setTopicName] = useState('');
    const [partitions, setPartitions] = useState(1);
    const [creating, setCreating] = useState(false);

    const handleSubmit = async () => {
        if (!topicName.trim()) return;
        setCreating(true);
        await onCreateTopic(topicName, partitions);
        setCreating(false);
        setTopicName('');
        onClose();
    };

    const bgClass = accentColor === 'fuchsia' ? 'bg-fuchsia-50 border-fuchsia-200' : 'bg-violet-50 border-violet-200';
    const inputBorder = accentColor === 'fuchsia' ? 'border-fuchsia-300' : 'border-violet-300';
    const btnClass = accentColor === 'fuchsia' ? 'bg-fuchsia-600' : 'bg-violet-600';
    const textNote = accentColor === 'fuchsia' ? 'text-fuchsia-600' : 'text-violet-600';

    return (
        <div className={`mb-3 p-3 border rounded-lg space-y-2 ${bgClass}`}>
            <div className="flex gap-2">
                <input
                    value={topicName}
                    onChange={(e) => setTopicName(e.target.value)}
                    placeholder="New topic name"
                    className={`flex-1 px-2 py-1.5 bg-white border rounded text-sm ${inputBorder}`}
                />
                <input
                    type="number"
                    value={partitions}
                    onChange={(e) => setPartitions(parseInt(e.target.value) || 1)}
                    min={1}
                    className={`w-20 px-2 py-1.5 bg-white border rounded text-sm text-center ${inputBorder}`}
                    placeholder="Partitions"
                />
                <button
                    onClick={handleSubmit}
                    disabled={creating || !topicName.trim()}
                    className={`px-3 py-1.5 text-white rounded text-sm font-bold disabled:opacity-50 ${btnClass}`}
                >
                    {creating ? <Loader2 size={14} className="animate-spin" /> : 'Create'}
                </button>
            </div>
            <p className={`text-[10px] ${textNote}`}>Enter topic name and number of partitions</p>
        </div>
    );
};

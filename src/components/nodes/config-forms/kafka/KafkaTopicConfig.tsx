import axios from 'axios';
import { Loader2, Plus, RefreshCw } from 'lucide-react';
import React, { useState } from 'react';
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
}


export const KafkaTopicConfig: React.FC<KafkaTopicConfigProps> = ({
    config,
    onChange,
    topics,
    loadingTopics,
    onLoadTopics,
    buildConnectionConfig,
    onTopicCreated,
    connectionStatus
}) => {
    const [showCreateForm, setShowCreateForm] = useState(false);

    const handleCreateTopic = async (name: string, partitions: number) => {
        try {
            const response = await axios.post('/api/kafka/topics/create', {
                ...buildConnectionConfig(),
                topicName: name,
                partitions,
                replicationFactor: 1
            });
            if (response.data.success) {
                onTopicCreated(name);
                onChange('topic', name);
            }
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
                        className="text-xs text-violet-700 hover:text-violet-800 flex items-center gap-1"
                    >
                        <RefreshCw size={12} className={loadingTopics ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                    <button
                        onClick={() => setShowCreateForm(!showCreateForm)}
                        className="text-xs text-violet-700 hover:text-violet-800 flex items-center gap-1"
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
                />
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
    );
};


/** Form to create a new Kafka topic */
const CreateTopicForm: React.FC<{
    onCreateTopic: (name: string, partitions: number) => Promise<void>;
    onClose: () => void;
}> = ({ onCreateTopic, onClose }) => {
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

    return (
        <div className="mb-3 p-3 bg-violet-50 border border-violet-200 rounded-lg space-y-2">
            <div className="flex gap-2">
                <input
                    value={topicName}
                    onChange={(e) => setTopicName(e.target.value)}
                    placeholder="New topic name"
                    className="flex-1 px-2 py-1.5 bg-white border border-violet-300 rounded text-sm"
                />
                <input
                    type="number"
                    value={partitions}
                    onChange={(e) => setPartitions(parseInt(e.target.value) || 1)}
                    min={1}
                    className="w-20 px-2 py-1.5 bg-white border border-violet-300 rounded text-sm text-center"
                    placeholder="Partitions"
                />
                <button
                    onClick={handleSubmit}
                    disabled={creating || !topicName.trim()}
                    className="px-3 py-1.5 bg-violet-600 text-white rounded text-sm font-bold disabled:opacity-50"
                >
                    {creating ? <Loader2 size={14} className="animate-spin" /> : 'Create'}
                </button>
            </div>
            <p className="text-[10px] text-violet-600">Enter topic name and number of partitions</p>
        </div>
    );
};

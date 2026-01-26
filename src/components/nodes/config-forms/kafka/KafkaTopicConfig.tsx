import React, { useState } from 'react';
import { Loader2, Plus, RefreshCw } from 'lucide-react';
import { NodeConfig } from '../../../../types/workflow.interfaces';
import { VariableInput } from '../../../../components/common/variable-input/VariableInput';

interface KafkaTopicConfigProps {
    config: NodeConfig;
    onChange: (key: string, value: any) => void;
    topics: string[];
    loadingTopics: boolean;
    onLoadTopics: () => void;
    buildConnectionConfig: () => any;
    onTopicCreated: (topic: string) => void;
    connectionStatus: 'idle' | 'testing' | 'success' | 'error';
    accentColor?: string;
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
    accentColor = '#7C3AED'
}) => {
    const [showCreateForm, setShowCreateForm] = useState(false);

    // Dynamic classes based on accent color
    const textClass = `text-[${accentColor}] hover:opacity-80`;
    const ringClass = `focus:ring-[${accentColor}]/50`;

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
        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                    <span>Topic</span>
                    {loadingTopics && <Loader2 size={10} className="animate-spin text-slate-400" />}
                </label>
                <div className="flex gap-2">
                    <button
                        onClick={onLoadTopics}
                        disabled={loadingTopics}
                        className={`text-[10px] flex items-center gap-1 font-bold transition-colors hover:opacity-80`}
                        style={{ color: accentColor }}
                        title="Refresh Topics"
                    >
                        <RefreshCw size={10} className={loadingTopics ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                    <button
                        onClick={() => setShowCreateForm(!showCreateForm)}
                        className={`text-[10px] flex items-center gap-1 font-bold transition-colors ${textClass}`}
                        style={{ color: accentColor }}
                    >
                        <Plus size={10} />
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

            <div className="relative">
                <select
                    value={config.topic || ''}
                    onChange={(e) => onChange('topic', e.target.value)}
                    className={`w-full pl-2 pr-8 py-1.5 bg-slate-50 border border-slate-200 rounded text-[11px] focus:outline-none focus:ring-2 ${ringClass}`}
                >
                    <option value="">Select a topic...</option>
                    {topics.map(topic => (
                        <option key={topic} value={topic}>{topic}</option>
                    ))}
                </select>
            </div>

            {topics.length === 0 && connectionStatus !== 'success' && (
                <p className="text-[10px] text-slate-400 mt-1 italic">
                    * Test connection to load topics
                </p>
            )}
        </div>
    );
};


/** Form to create a new Kafka topic */
const CreateTopicForm: React.FC<{
    onCreateTopic: (name: string, partitions: number) => Promise<void>;
    onClose: () => void;
    accentColor: string;
}> = ({ onCreateTopic, onClose, accentColor }) => {
    const [topicName, setTopicName] = useState('');
    const [partitions, setPartitions] = useState('1');
    const [creating, setCreating] = useState(false);

    const handleSubmit = async () => {
        if (!topicName.trim()) return;
        setCreating(true);
        const parts = parseInt(partitions) || 1;
        await onCreateTopic(topicName, parts);
        setCreating(false);
        setTopicName('');
        onClose();
    };

    const focusClass = `focus-within:ring-[${accentColor}]/20 focus-within:border-[${accentColor}]`;
    const btnClass = `bg-[${accentColor}] hover:bg-[${accentColor}]/90`;

    return (
        <div className="mb-2 p-2 border border-slate-100 bg-slate-50 rounded-lg space-y-2 animate-in slide-in-from-top-2 duration-200">
            <div className="flex gap-2">
                <VariableInput
                    small
                    value={topicName}
                    onValueChange={setTopicName}
                    placeholder="New topic name"
                    className={`flex-1 bg-white border border-slate-200 rounded text-[11px] ${focusClass}`}
                />
                <VariableInput
                    small
                    value={partitions}
                    onValueChange={setPartitions}
                    className={`w-16 bg-white border border-slate-200 rounded text-[11px] text-center ${focusClass}`}
                    placeholder="#"
                />
                <button
                    onClick={handleSubmit}
                    disabled={creating || !topicName.trim()}
                    className={`px-3 py-1 text-white rounded text-[10px] font-bold disabled:opacity-50 transition-colors ${btnClass}`}
                    style={{ backgroundColor: accentColor }}
                >
                    {creating ? <Loader2 size={12} className="animate-spin" /> : 'Create'}
                </button>
            </div>
        </div>
    );
};

import React, { useState } from 'react';
import { RefreshCw, Plus, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { ActiveMQNodeConfig } from '../../../../types/workflow.interfaces';
import { VariableInput } from '../../../common/variable-input/VariableInput';
import { ActiveMQService } from '../../../../services/ActiveMQService';

interface ActiveMQDestinationConfigProps {
    config: ActiveMQNodeConfig;
    onChange: (key: string, value: any) => void;
    accentColor: string;
    mode?: 'PRODUCER' | 'CONSUMER';
}

export const ActiveMQDestinationConfig: React.FC<ActiveMQDestinationConfigProps> = ({
    config,
    onChange,
    accentColor,
    mode: propMode
}) => {
    const [destinations, setDestinations] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [showCreate, setShowCreate] = useState(false);

    // Derived state
    const mode = propMode || config.activeMQMode || 'PRODUCER';
    const type = config.destinationType || 'QUEUE';

    // Styles
    const activeClass = `text-white shadow-sm`;
    const inactiveClass = "bg-slate-100 text-slate-500 hover:bg-slate-200";
    const textLinkClass = `text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors hover:opacity-80`;

    const handleRefresh = async () => {
        setLoading(true);
        try {
            const service = new ActiveMQService();
            const results = await service.getDestinations(config);
            setDestinations(results);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    // Auto-load on mount/type change if we have connection or just empty for now?
    // Maybe wait for manual refresh to avoid errors if config incomplete.

    const handleTypeChange = (newType: 'QUEUE' | 'TOPIC') => {
        onChange('destinationType', newType);
        onChange('destinationName', '');
        setDestinations([]);
    };

    return (
        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase">
                    {mode === 'PRODUCER' ? <ArrowRight size={12} /> : <ArrowLeft size={12} />}
                    <span>{mode === 'PRODUCER' ? 'Send To Destination' : 'Consume From Destination'}</span>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={handleRefresh}
                        className={textLinkClass}
                        style={{ color: accentColor }}
                    >
                        <RefreshCw size={10} className={loading ? 'animate-spin' : ''} /> Refresh
                    </button>
                    <button
                        onClick={() => setShowCreate(!showCreate)}
                        className={textLinkClass}
                        style={{ color: accentColor }}
                    >
                        <Plus size={10} /> Create New
                    </button>
                </div>
            </div>

            <div className="space-y-3">
                {showCreate && (
                    <CreateDestinationForm
                        config={config}
                        accentColor={accentColor}
                        onClose={() => setShowCreate(false)}
                        onCreated={(name) => {
                            onChange('destinationName', name);
                            setShowCreate(false);
                        }}
                    />
                )}

                {/* Configuration Row */}
                <div className="flex gap-2">
                    <div className="w-1/3">
                        <div className="flex p-0.5 bg-slate-100/50 rounded-md border border-slate-200/50 h-[30px]">
                            <button
                                onClick={() => handleTypeChange('QUEUE')}
                                style={{ backgroundColor: type === 'QUEUE' ? accentColor : undefined }}
                                className={`flex-1 rounded-[4px] text-[10px] font-bold transition-all duration-200 ${type === 'QUEUE' ? activeClass : inactiveClass}`}
                            >
                                Queue
                            </button>
                            <button
                                onClick={() => handleTypeChange('TOPIC')}
                                style={{ backgroundColor: type === 'TOPIC' ? accentColor : undefined }}
                                className={`flex-1 rounded-[4px] text-[10px] font-bold transition-all duration-200 ${type === 'TOPIC' ? activeClass : inactiveClass}`}
                            >
                                Topic
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 relative">

                        {(destinations.length > 0) ? (
                            <select
                                value={config.destinationName || ''}
                                onChange={(e) => onChange('destinationName', e.target.value)}
                                className={`w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-[11px] font-mono h-[30px] focus:outline-none focus:ring-2 focus:ring-[${accentColor}]/20 focus:border-[${accentColor}]`}
                            >
                                <option value="">Select {type.toLowerCase()}...</option>
                                {destinations.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        ) : (
                            <VariableInput
                                small
                                value={config.destinationName || ''}
                                onValueChange={(val) => onChange('destinationName', val)}
                                placeholder={`e.g. ${type === 'TOPIC' ? 'events.orders' : 'orders.input'}`}
                                className={`bg-slate-50 border border-slate-200 font-mono text-[11px] text-[${accentColor}] focus-within:ring-[${accentColor}]/20 focus-within:border-[${accentColor}]`}
                            />
                        )}

                        {destinations.length === 0 && !loading && (
                            <p className="text-[9px] text-slate-400 mt-1 pl-1">
                                Click 'Refresh' to load from broker.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const CreateDestinationForm: React.FC<{
    config: ActiveMQNodeConfig;
    accentColor: string;
    onClose: () => void;
    onCreated: (name: string) => void;
}> = ({ config, accentColor, onClose, onCreated }) => {
    const [name, setName] = useState('');
    const [creating, setCreating] = useState(false);

    const handleCreate = async () => {
        if (!name) return;
        setCreating(true);
        try {
            const service = new ActiveMQService();
            await service.createDestination(config, name, (config.destinationType as any) || 'QUEUE');
            onCreated(name);
        } catch (e) {
            console.error(e);
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className="mb-2 p-2 bg-slate-50 border border-slate-200 rounded-md animate-in fade-in zoom-in-95">
            <div className="flex gap-2">
                <VariableInput
                    small
                    value={name}
                    onValueChange={setName}
                    placeholder={`New ${config.destinationType || 'QUEUE'} name`}
                    className="flex-1 bg-white border border-slate-200 text-[11px]"
                />
                <button
                    onClick={handleCreate}
                    disabled={creating || !name}
                    style={{ backgroundColor: accentColor }}
                    className="px-3 text-white rounded-md text-[10px] font-bold flex items-center gap-1 disabled:opacity-50"
                >
                    {creating ? <Loader2 size={10} className="animate-spin" /> : 'Create'}
                </button>
            </div>
        </div>
    );
};

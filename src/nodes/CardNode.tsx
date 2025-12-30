import React, { memo } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from 'reactflow';
import {
    Bell,
    Circle,
    Clock,    // Used
    Globe,    // Used
    Mail,     // Used
    FileText, // Used
    Terminal, // Used
    Braces,   // Used
    FunctionSquare, // Used
    GitFork,  // Used
    ToggleLeft, // Used
    Repeat,   // Used
    Hourglass, // Used
    ShieldCheck, // Used
    Scale,    // Used
    ListChecks,
    X,
    Copy
} from 'lucide-react';
import { Icon } from '@iconify/react';
import { NodeData } from '../types/workflow';


function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ');
}

// Icon Adapters for Iconify
const KafkaIcon = ({ size, className }: { size?: number, className?: string }) => <Icon icon="simple-icons:apachekafka" width={size} height={size} className={className} color="currentColor" />;
const ArtemisIcon = ({ size, className }: { size?: number, className?: string }) => <Icon icon="simple-icons:apache" width={size} height={size} className={className} color="currentColor" />;
const ActiveMQIcon = ({ size, className }: { size?: number, className?: string }) => <Icon icon="simple-icons:apache" width={size} height={size} className={className} color="currentColor" />;

// Minimalist colors for icon backgrounds & accents
const NodeConfig = {
    // Triggers
    TriggerNodeType_WEBHOOK: { icon: Bell, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    TriggerNodeType_CRON: { icon: Clock, color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100' },

    // Integration
    IntegrationNodeType_HTTP_CALL: { icon: Globe, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    IntegrationNodeType_KAFKA: { icon: KafkaIcon, color: 'text-fuchsia-600', bg: 'bg-fuchsia-50', border: 'border-fuchsia-100' },
    IntegrationNodeType_ARTEMIS_QUEUE: { icon: ArtemisIcon, color: 'text-pink-600', bg: 'bg-pink-50', border: 'border-pink-100' },
    IntegrationNodeType_ACTIVE_MQ: { icon: ActiveMQIcon, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' },

    // Notification
    NotificationNodeType_EMAIL: { icon: Mail, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' },
    NotificationNodeType_LOG: { icon: FileText, color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-100' },
    NotificationNodeType_CONSOLE: { icon: Terminal, color: 'text-gray-900', bg: 'bg-slate-200', border: 'border-slate-300' },

    // Transformation
    TransformationNodeType_JSON_MAPPER: { icon: Braces, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
    TransformationNodeType_EXPRESSION: { icon: FunctionSquare, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },

    // Control Flow
    ControlFlowNodeType_IF: { icon: GitFork, color: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-100' },
    ControlFlowNodeType_SWITCH: { icon: ToggleLeft, color: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-100' },
    ControlFlowNodeType_LOOP: { icon: Repeat, color: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-100' },
    ControlFlowNodeType_DELAY: { icon: Hourglass, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },

    // Validation
    ValidationNodeType_SCHEMA_CHECK: { icon: ShieldCheck, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
    ValidationNodeType_BUSINESS_RULE: { icon: Scale, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
    ValidationNodeType_REQUIRED_FIELDS: { icon: ListChecks, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },

    default: { icon: Circle, color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-100' },
} as const;

const HandleStyle = "!w-2.5 !h-2.5 !bg-slate-400 !border-[2px] !border-white transition-colors group-hover:!bg-primary-500";

const CardNode = memo(({ id, data, selected }: NodeProps<NodeData>) => {
    const { deleteElements } = useReactFlow();
    const nodeTypeKey = (data.nodeType || 'default') as keyof typeof NodeConfig;
    const style = NodeConfig[nodeTypeKey] || NodeConfig.default;
    const Icon = style.icon;
    const config = data.config || {};

    const renderConfigPreview = () => {
        if (nodeTypeKey === 'IntegrationNodeType_HTTP_CALL') {
            const method = config.method || 'GET';
            return (
                <div className="flex flex-col gap-2 mt-2">
                    {config.url ? (
                        <div className="flex items-center gap-2 px-2 py-1.5 bg-slate-50 rounded-md border border-slate-100/50">
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">{method}</span>
                            <span className="text-[10px] text-slate-600 truncate font-mono tracking-tight opacity-80" title={config.url}>
                                {config.url.replace(/^https?:\/\//, '')}
                            </span>
                        </div>
                    ) : (
                        <div className="px-2 py-1.5 text-[10px] text-slate-400 italic">Configure endpoint...</div>
                    )}
                </div>
            );
        }
        if (nodeTypeKey === 'TriggerNodeType_CRON') {
            return (
                <div className="flex items-center gap-2 mt-2 px-2 py-1.5 bg-slate-50 rounded-md border border-slate-100/50">
                    <Clock size={10} className="text-slate-400" />
                    {config.cron ? (
                        <span className="text-[10px] font-mono text-slate-600">{config.cron}</span>
                    ) : (
                        <span className="text-[10px] text-slate-400 italic">No schedule</span>
                    )}
                </div>
            );
        }
        if (nodeTypeKey === 'NotificationNodeType_EMAIL') {
            return (
                <div className="flex flex-col gap-1 mt-2">
                    {config.to ? (
                        <div className="flex items-center gap-2 px-2 py-1.5 bg-slate-50 rounded-md border border-slate-100/50">
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">TO</span>
                            <span className="text-[10px] text-slate-600 truncate font-mono tracking-tight opacity-80" title={config.to}>
                                {config.to}
                            </span>
                        </div>
                    ) : (
                        <div className="px-2 py-1.5 text-[10px] text-slate-400 italic">No recipient</div>
                    )}
                </div>
            );
        }
        return null;
    };

    return (
        <div className={cn(
            "w-[220px] bg-white rounded-xl shadow-card transition-all duration-200 group font-sans border relative",
            selected
                ? "ring-2 ring-primary-500/20 border-primary-500 shadow-card-hover"
                : "border-slate-200/60 hover:border-slate-300 hover:shadow-card-hover"
        )}>
            {/* Handles: All 4 Sides */}
            <Handle type="target" position={Position.Top} className={HandleStyle} />
            <Handle type="source" position={Position.Bottom} className={HandleStyle} />
            <Handle type="target" position={Position.Left} className={HandleStyle} id="l-in" style={{ top: '50%' }} />
            <Handle type="source" position={Position.Right} className={HandleStyle} id="r-out" style={{ top: '50%' }} />

            <div className="p-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center border shadow-sm", style.bg, style.color, style.border)}>
                            <Icon size={16} strokeWidth={2.5} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-slate-900 leading-tight truncate">
                                {data.label}
                            </h3>
                            <p className="text-[10px] text-slate-500 font-medium mt-0.5 truncate">
                                {nodeTypeKey.split('_')[1] || 'Node'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                {renderConfigPreview()}

                {/* Status Indicator (Mock for now) */}
                {selected && (
                    <div className="mt-2 flex items-center gap-1.5 justify-end">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[9px] font-medium text-emerald-600">Active</span>
                    </div>
                )}
            </div>

            {/* Actions (Visible on Hover/Select) */}
            <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all z-50">
                {/* Duplicate Button */}
                <button
                    className="w-5 h-5 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-blue-500 hover:border-blue-200 shadow-sm cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (data.onDuplicate) {
                            data.onDuplicate(id);
                        }
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    title="Duplicate Node"
                >
                    <Copy size={10} strokeWidth={2.5} />
                </button>

                {/* Delete Button */}
                <button
                    className="w-5 h-5 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-200 shadow-sm cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent node selection
                        deleteElements({ nodes: [{ id }] });
                    }}
                    onMouseDown={(e) => e.stopPropagation()} // Prevent drag start
                    title="Remove Node"
                >
                    <X size={12} strokeWidth={3} />
                </button>
            </div>
        </div>
    );
});

export default CardNode;

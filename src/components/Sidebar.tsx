import React, { useState } from 'react';
import {
    ChevronDown,
    Search,
    Blocks,
    Bell,
    Clock,
    Globe,
    Mail,
    FileText,
    Terminal,
    Braces,
    FunctionSquare,
    GitFork,
    ToggleLeft,
    Repeat,
    Hourglass,
    ShieldCheck,
    Scale,
    ListChecks
} from 'lucide-react';
import { Icon } from '@iconify/react';

// --- ICONS ADAPTERS ---
const KafkaIcon = ({ size, className }: { size?: number, className?: string }) => <Icon icon="simple-icons:apachekafka" width={size || 16} height={size || 16} className={className} color="currentColor" />;
const ArtemisIcon = ({ size, className }: { size?: number, className?: string }) => <Icon icon="simple-icons:apache" width={size || 16} height={size || 16} className={className} color="currentColor" />;
const ActiveMQIcon = ({ size, className }: { size?: number, className?: string }) => <Icon icon="simple-icons:apache" width={size || 16} height={size || 16} className={className} color="currentColor" />;

function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ');
}

// --- STATIC CONFIGURATION (Pre-Registry Style) ---
const SIDEBAR_SECTIONS = [
    {
        title: 'Triggers',
        items: [
            { label: 'Webhook', nodeType: 'TriggerNodeType_WEBHOOK', icon: Bell, color: 'text-blue-600' },
            { label: 'Cron Schedule', nodeType: 'TriggerNodeType_CRON', icon: Clock, color: 'text-violet-600' }
        ]
    },
    {
        title: 'Integration',
        items: [
            { label: 'HTTP Request', nodeType: 'IntegrationNodeType_HTTP_CALL', icon: Globe, color: 'text-emerald-600' },
            { label: 'Kafka', nodeType: 'IntegrationNodeType_KAFKA', icon: KafkaIcon, color: 'text-fuchsia-600' },
            { label: 'Artemis Queue', nodeType: 'IntegrationNodeType_ARTEMIS_QUEUE', icon: ArtemisIcon, color: 'text-pink-600' },
            { label: 'ActiveMQ', nodeType: 'IntegrationNodeType_ACTIVE_MQ', icon: ActiveMQIcon, color: 'text-orange-600' }
        ]
    },
    {
        title: 'Notification',
        items: [
            { label: 'Send Email', nodeType: 'NotificationNodeType_EMAIL', icon: Mail, color: 'text-orange-600' },
            { label: 'Log', nodeType: 'NotificationNodeType_LOG', icon: FileText, color: 'text-gray-600' },
            { label: 'Console', nodeType: 'NotificationNodeType_CONSOLE', icon: Terminal, color: 'text-gray-900' }
        ]
    },
    {
        title: 'Transformation',
        items: [
            { label: 'JSON Mapper', nodeType: 'TransformationNodeType_JSON_MAPPER', icon: Braces, color: 'text-indigo-600' },
            { label: 'Expression', nodeType: 'TransformationNodeType_EXPRESSION', icon: FunctionSquare, color: 'text-indigo-600' }
        ]
    },
    {
        title: 'Control Flow',
        items: [
            { label: 'If Condition', nodeType: 'ControlFlowNodeType_IF', icon: GitFork, color: 'text-cyan-600' },
            { label: 'Switch', nodeType: 'ControlFlowNodeType_SWITCH', icon: ToggleLeft, color: 'text-cyan-600' },
            { label: 'Loop', nodeType: 'ControlFlowNodeType_LOOP', icon: Repeat, color: 'text-cyan-600' },
            { label: 'Delay', nodeType: 'ControlFlowNodeType_DELAY', icon: Hourglass, color: 'text-amber-600' }
        ]
    },
    {
        title: 'Validation',
        items: [
            { label: 'Schema Check', nodeType: 'ValidationNodeType_SCHEMA_CHECK', icon: ShieldCheck, color: 'text-rose-600' },
            { label: 'Business Rule', nodeType: 'ValidationNodeType_BUSINESS_RULE', icon: Scale, color: 'text-rose-600' },
            { label: 'Required Fields', nodeType: 'ValidationNodeType_REQUIRED_FIELDS', icon: ListChecks, color: 'text-rose-600' }
        ]
    }
];

interface SidebarItemProps {
    label: string;
    icon: React.ElementType;
    nodeType: string;
    color?: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ label, icon, nodeType, color }) => {
    const onDragStart = (event: React.DragEvent, nodeTypeStr: string, labelStr: string) => {
        event.dataTransfer.setData('application/reactflow', nodeTypeStr); // Send Full Type directly
        event.dataTransfer.setData('nodeLabel', labelStr);
        // We removed the wrapper, so 'application/reactflow' SHOULD be the type
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <div
            className={cn(
                "flex items-center gap-3 px-3 py-2 mx-2 rounded-md cursor-grab transition-all duration-200 group select-none relative",
                "hover:bg-slate-100 hover:text-slate-900 text-slate-600"
            )}
            onDragStart={(event) => onDragStart(event, nodeType, label)}
            draggable
        >
            <div className={cn("transition-colors", color || "text-slate-400 group-hover:text-primary-600")}>
                {(() => {
                    const IconComp = icon;
                    return <IconComp size={16} />;
                })()}
            </div>
            <span className="text-sm font-medium">{label}</span>

            {/* Drag Indicator */}
            <div className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
            </div>
        </div>
    );
};

const SidebarSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6">
        <h3 className="px-5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            {title}
        </h3>
        <div className="space-y-0.5">
            {children}
        </div>
    </div>
);

const Sidebar: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const shouldShowSection = (items: { label: string }[]) => {
        if (!searchQuery) return true;
        return items.some(item => item.label.toLowerCase().includes(searchQuery.toLowerCase()));
    };

    const shouldShowItem = (label: string) => {
        if (!searchQuery) return true;
        return label.toLowerCase().includes(searchQuery.toLowerCase());
    };

    return (
        <aside className="w-64 bg-slate-100 border-r border-slate-200 flex flex-col z-10 h-full shadow-subtle text-slate-900">
            {/* Header / Brand */}
            <div className="h-14 flex items-center px-4 border-b border-slate-200">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center shadow-md shadow-indigo-500/20">
                        <Blocks className="text-white" size={18} />
                    </div>
                    <div>
                        <span className="block text-sm font-bold text-slate-900 tracking-tight leading-none">Workflow</span>
                        <span className="block text-[10px] font-medium text-slate-500 uppercase tracking-wider leading-none mt-0.5">Studio</span>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="p-3">
                <div className="relative group">
                    <Search className="absolute left-2.5 top-2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={14} />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all placeholder:text-slate-400"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
                {SIDEBAR_SECTIONS.map((section, idx) => (
                    shouldShowSection(section.items) && (
                        <SidebarSection key={idx} title={section.title}>
                            {section.items.map((item, itemIdx) => (
                                shouldShowItem(item.label) && (
                                    <SidebarItem
                                        key={itemIdx}

                                        label={item.label}
                                        icon={item.icon}
                                        nodeType={item.nodeType}
                                        color={item.color}
                                    />
                                )
                            ))}
                        </SidebarSection>
                    )
                ))}
            </div>

            {/* User Profile */}
            <div className="p-3 border-t border-slate-200">
                <button className="flex items-center gap-2.5 w-full p-1.5 hover:bg-slate-200/50 rounded-lg transition-colors text-left group">
                    <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600 border border-indigo-200">
                        JD
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-xs font-semibold text-slate-700 truncate">John Doe</p>
                        <p className="text-[10px] text-slate-500 truncate">Workspace Admin</p>
                    </div>
                    <ChevronDown size={14} className="text-slate-400 group-hover:text-slate-600" />
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;

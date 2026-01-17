import { Clock } from 'lucide-react';
import React from 'react';
import {
    IntegrationNodeType,
    NotificationNodeType,
    TriggerNodeType,
} from '../../../types/workflow.enums';

interface NodeConfigPreviewProps {
    nodeType: string;
    config: any;
}

export const NodeConfigPreview: React.FC<NodeConfigPreviewProps> = ({ nodeType, config }) => {
    if (nodeType === IntegrationNodeType.HTTP_CALL) {
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

    if (nodeType === TriggerNodeType.CRON) {
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

    if (nodeType === NotificationNodeType.EMAIL) {
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

    if (nodeType === IntegrationNodeType.KAFKA) {
        const mode = config.kafkaMode || 'PRODUCER';
        return (
            <div className="flex flex-col gap-2 mt-2">
                {config.topic ? (
                    <div className="flex items-center gap-2 px-2 py-1.5 bg-slate-50 rounded-md border border-slate-100/50">
                        <span className={`text-[9px] font-bold uppercase tracking-wider ${mode === 'PRODUCER' ? 'text-violet-600' : 'text-violet-600'}`}>
                            {mode}
                        </span>
                        <span className="text-[10px] text-slate-600 truncate font-mono tracking-tight opacity-80" title={config.topic}>
                            {config.topic}
                        </span>
                    </div>
                ) : (
                    <div className="px-2 py-1.5 text-[10px] text-slate-400 italic">Configure Kafka...</div>
                )}
            </div>
        );
    }

    if (nodeType === TriggerNodeType.KAFKA) {
        return (
            <div className="flex flex-col gap-2 mt-2">
                {config.topic ? (
                    <div className="flex items-center gap-2 px-2 py-1.5 bg-slate-50 rounded-md border border-slate-100/50">
                        <span className="text-[9px] font-bold text-fuchsia-600 uppercase tracking-wider">LISTENING TOPIC</span>
                        <span className="text-[10px] text-slate-600 truncate font-mono tracking-tight opacity-80" title={config.topic}>
                            {config.topic}
                        </span>
                    </div>
                ) : (
                    <div className="px-2 py-1.5 text-[10px] text-slate-400 italic">Configure Kafka trigger...</div>
                )}
            </div>
        );
    }

    return null;
};

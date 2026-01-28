import React from 'react';
import {
    IntegrationNodeType,
    NotificationNodeType,
    TriggerNodeType,
} from '../../../types/workflow.enums';
import { ActiveMQPreview } from './previews/ActiveMQPreview';
import { CronPreview } from './previews/CronPreview';
import { EmailPreview } from './previews/EmailPreview';
import { HttpPreview } from './previews/HttpPreview';
import { KafkaPreview } from './previews/KafkaPreview';
import { KafkaTriggerPreview } from './previews/KafkaTriggerPreview';
import { ActiveMQTriggerPreview } from './previews/ActiveMQTriggerPreview';

interface NodeConfigPreviewProps {
    nodeType: string;
    config: any;
}

const PREVIEW_REGISTRY: Record<string, React.FC<{ config: any }>> = {
    [IntegrationNodeType.HTTP_CALL]: HttpPreview,
    [TriggerNodeType.CRON]: CronPreview,
    [NotificationNodeType.EMAIL]: EmailPreview,
    [IntegrationNodeType.KAFKA]: KafkaPreview,
    [TriggerNodeType.KAFKA]: KafkaTriggerPreview,
    [IntegrationNodeType.ACTIVE_MQ]: ActiveMQPreview,
    [TriggerNodeType.ACTIVEMQ]: ActiveMQTriggerPreview,
};

export const NodeConfigPreview: React.FC<NodeConfigPreviewProps> = ({ nodeType, config }) => {
    const PreviewComponent = PREVIEW_REGISTRY[nodeType];

    if (!PreviewComponent) {
        return null;
    }

    return <PreviewComponent config={config} />;
};

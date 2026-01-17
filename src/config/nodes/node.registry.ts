import CardNode from '../../components/nodes/card-node/CardNode';
import {
    TriggerNodeType,
    IntegrationNodeType,
    NotificationNodeType,
    TransformationNodeType,
    ControlFlowNodeType,
    ValidationNodeType,
} from '../../types/workflow.enums';

type NodeTypeRegistry = Record<string, typeof CardNode>;

export const NODE_TYPE_REGISTRY: NodeTypeRegistry = {
    // Triggers
    [TriggerNodeType.WEBHOOK]: CardNode,
    [TriggerNodeType.CRON]: CardNode,
    [TriggerNodeType.KAFKA]: CardNode,

    // Integration
    [IntegrationNodeType.HTTP_CALL]: CardNode,
    [IntegrationNodeType.KAFKA]: CardNode,
    [IntegrationNodeType.ARTEMIS_QUEUE]: CardNode,
    [IntegrationNodeType.ACTIVE_MQ]: CardNode,

    // Notification
    [NotificationNodeType.EMAIL]: CardNode,
    [NotificationNodeType.LOG]: CardNode,
    [NotificationNodeType.CONSOLE]: CardNode,

    // Transformation
    [TransformationNodeType.JSON_MAPPER]: CardNode,
    [TransformationNodeType.EXPRESSION]: CardNode,

    // Control Flow
    [ControlFlowNodeType.IF]: CardNode,
    [ControlFlowNodeType.SWITCH]: CardNode,
    [ControlFlowNodeType.LOOP]: CardNode,
    [ControlFlowNodeType.DELAY]: CardNode,

    // Validation
    [ValidationNodeType.SCHEMA_CHECK]: CardNode,
    [ValidationNodeType.BUSINESS_RULE]: CardNode,
    [ValidationNodeType.REQUIRED_FIELDS]: CardNode,

    // Default
    default: CardNode,
};

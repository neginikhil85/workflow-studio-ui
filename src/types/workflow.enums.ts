export enum WorkflowNodeCategory {
    TRIGGER = 'Trigger',
    INTEGRATION = 'Integration',
    NOTIFICATION = 'Notification',
    TRANSFORMATION = 'Transformation',
    CONTROL_FLOW = 'ControlFlow',
    VALIDATION = 'Validation',
}

export enum TriggerNodeType {
    WEBHOOK = 'TriggerNodeType_WEBHOOK',
    CRON = 'TriggerNodeType_CRON',
    KAFKA = 'TriggerNodeType_KAFKA',
}

export enum IntegrationNodeType {
    HTTP_CALL = 'IntegrationNodeType_HTTP_CALL',
    KAFKA = 'IntegrationNodeType_KAFKA',
    ARTEMIS_QUEUE = 'IntegrationNodeType_ARTEMIS_QUEUE',
    ACTIVE_MQ = 'IntegrationNodeType_ACTIVE_MQ',
}

export enum NotificationNodeType {
    EMAIL = 'NotificationNodeType_EMAIL',
    LOG = 'NotificationNodeType_LOG',
    CONSOLE = 'NotificationNodeType_CONSOLE',
}

export enum TransformationNodeType {
    JSON_MAPPER = 'TransformationNodeType_JSON_MAPPER',
    EXPRESSION = 'TransformationNodeType_EXPRESSION',
}

export enum ControlFlowNodeType {
    IF = 'ControlFlowNodeType_IF',
    SWITCH = 'ControlFlowNodeType_SWITCH',
    LOOP = 'ControlFlowNodeType_LOOP',
    DELAY = 'ControlFlowNodeType_DELAY',
}

export enum ValidationNodeType {
    SCHEMA_CHECK = 'ValidationNodeType_SCHEMA_CHECK',
    BUSINESS_RULE = 'ValidationNodeType_BUSINESS_RULE',
    REQUIRED_FIELDS = 'ValidationNodeType_REQUIRED_FIELDS',
}

export enum WorkflowExecutionStatus {
    RUNNING = 'RUNNING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
    CANCELLED = 'CANCELLED',
    SCHEDULED = 'SCHEDULED',
    IDLE = 'IDLE',
}

export enum KafkaMode {
    PRODUCER = 'PRODUCER',
    CONSUMER = 'CONSUMER',
}

export enum KafkaSecurityProtocol {
    PLAINTEXT = 'PLAINTEXT',
    SSL = 'SSL',
    SASL_PLAINTEXT = 'SASL_PLAINTEXT',
    SASL_SSL = 'SASL_SSL',
}

export enum SaslMechanism {
    PLAIN = 'PLAIN',
    SCRAM_SHA_256 = 'SCRAM-SHA-256',
    SCRAM_SHA_512 = 'SCRAM-SHA-512',
}

export type WorkflowNodeType =
    | TriggerNodeType
    | IntegrationNodeType
    | NotificationNodeType
    | TransformationNodeType
    | ControlFlowNodeType
    | ValidationNodeType;

export const ALL_NODE_TYPES: WorkflowNodeType[] = [
    ...Object.values(TriggerNodeType),
    ...Object.values(IntegrationNodeType),
    ...Object.values(NotificationNodeType),
    ...Object.values(TransformationNodeType),
    ...Object.values(ControlFlowNodeType),
    ...Object.values(ValidationNodeType),
];

export const isTriggerNode = (type: string): type is TriggerNodeType =>
    Object.values(TriggerNodeType).includes(type as TriggerNodeType);

export const isCronTrigger = (type: string): boolean =>
    type === TriggerNodeType.CRON;

import { Node } from 'reactflow';
import { KafkaSecurityProtocol, SaslMechanism, KafkaMode } from './workflow.enums';
export { KafkaSecurityProtocol, SaslMechanism, KafkaMode };

export interface User {
    id: string;
    email: string;
    name: string;
    createdAt?: string;
    updatedAt?: string;
    active: boolean;
}

export interface LoginRequest {
    email?: string;
    password?: string;
}

export interface RegisterRequest {
    name?: string;
    email?: string;
    password?: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface NodeConfig {
    [key: string]: any;
}

export interface HttpNodeConfig extends NodeConfig {
    url?: string;
    method?: string;
    headers?: { key: string; value: string }[];
    body?: string;
    params?: { key: string; value: string }[];
}

export interface KafkaNodeConfig extends NodeConfig {
    bootstrapServers?: string;
    securityProtocol?: KafkaSecurityProtocol;
    sslTruststoreLocation?: string;
    sslTruststorePassword?: string;
    sslKeystoreLocation?: string;
    sslKeystorePassword?: string;
    saslMechanism?: SaslMechanism;
    saslJaasConfig?: string;
    kafkaMode?: KafkaMode;
    topic?: string;
    message?: string;
    consumerGroup?: string;
    pollTimeoutMs?: number;
    autoOffsetReset?: 'latest' | 'earliest';
}

export interface ActiveMQNodeConfig extends NodeConfig {
    brokerUrl?: string;
    username?: string;
    password?: string;
    // SSL Config
    sslEnabled?: boolean;
    sslTrustStoreLocation?: string;
    sslTrustStorePassword?: string;
    sslKeyStoreLocation?: string;
    sslKeyStorePassword?: string;

    destinationType?: string;
    destinationName?: string;
    messageBody?: string;
    activeMQMode?: 'PRODUCER' | 'CONSUMER';
    consumerGroup?: string;
    pollTimeoutMs?: number;
    autoOffsetReset?: 'latest' | 'earliest';
}

export interface CronNodeConfig extends NodeConfig {
    cron?: string;
}

export interface WebhookNodeConfig extends NodeConfig {
    method?: string;
}

export interface EmailNodeConfig extends NodeConfig {
    to?: string;
    subject?: string;
    body?: string;
}

export interface NodeData {
    label: string;
    nodeType: string;
    config?: NodeConfig;
    onDuplicate?: (id: string) => void;
    [key: string]: unknown;
}

export type WorkflowNode = Node<NodeData>;

export interface WorkflowEdge {
    from: string;
    to: string;
    condition: string | null;
    sourceHandle?: string | null;
    targetHandle?: string | null;
}

export interface WorkflowNodeDefinition {
    id: string;
    nodeType: string;
    config: NodeConfig;
    metadata?: {
        position?: { x: number; y: number };
        label?: string;
    };
}

export interface Workflow {
    id: string | null;
    name: string;
    description: string;
    ownerId?: string;
    nodes: WorkflowNodeDefinition[];
    edges: WorkflowEdge[];
}

export interface ExecutionResult {
    executedNodeIds: string[];
    output: unknown;
    success: boolean;
}

export interface WorkflowSummary {
    id: string;
    name: string;
    description: string;
}

export interface HeaderState {
    workflowId: string | null;
    workflowName: string;
}

export interface HeaderExecution {
    isRunning: boolean;
    status: string;
    runWorkflow: () => void;
    stopWorkflow: () => void;
}

export interface WorkflowRun {
    id: string;
    workflowId: string;
    triggerType: 'MANUAL' | 'CRON' | 'WEBHOOK' | 'KAFKA';
    status: 'ACTIVE' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'STOPPED';
    startTime: string;
    endTime?: string;
    totalExecutions: number;
    failedExecutions: number;
}

export interface WorkflowExecution {
    id: string;
    workflowId: string;
    runId: string;
    status: 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
    startedAt: string;
    completedAt?: string;
    executedNodes: string[];
    result?: unknown;
    error?: string;
}

export interface HeaderPersistence {
    saveWorkflow: () => void;
    clearWorkflow: () => void;
}

export interface NodeExecutionResult {
    id: string;
    runId: string;
    executionId: string;
    nodeId: string;
    status: 'SUCCESS' | 'FAILURE' | 'SKIPPED';
    executionDetails: any;
    errorMessage?: string;
    startedAt: string;
    completedAt?: string;
    duration: number;
}

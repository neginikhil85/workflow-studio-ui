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

export interface NodeConfig {
    url?: string;
    method?: string;
    cron?: string;
    description?: string;
    to?: string;
    subject?: string;
    headers?: Record<string, string> | { key: string; value: string }[];
    body?: string;
    params?: { key: string; value: string }[];

    // Kafka configuration
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

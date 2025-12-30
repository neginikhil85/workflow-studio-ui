import { Node } from 'reactflow';

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
}

export interface NodeData {
    label: string;
    nodeType: string;
    config?: NodeConfig;
    onDuplicate?: (id: string) => void;
    [key: string]: any;
}

// Custom Node Type extending ReactFlow Node
export type WorkflowNode = Node<NodeData>;

export interface Workflow {
    id: string | null;
    name: string;
    description: string;
    nodes: {
        id: string;
        nodeType: string;
        config: NodeConfig;
    }[];
    edges: {
        from: string;
        to: string;
        condition: string | null;
    }[];
}

export interface ExecutionResult {
    executedNodeIds: string[];
    output: any;
    success: boolean;
}

export interface WorkflowSummary {
    id: string;
    name: string;
    description: string;
}

import { IntegrationNodeType, TriggerNodeType } from '../../types/workflow.enums';
import { NodeConfig, WorkflowNode } from '../../types/workflow.interfaces';

/** Node types that are always continuously running */
const CONTINUOUS_NODE_TYPES = new Set<string>([
    TriggerNodeType.CRON,
    TriggerNodeType.WEBHOOK,
]);

/** Node types that may be continuous based on config */
const CONDITIONAL_CONTINUOUS: Record<string, (config?: NodeConfig) => boolean> = {
    [IntegrationNodeType.KAFKA]: (config) => config?.kafkaMode === 'CONSUMER',
};

/** 
 * Check if a single node implies continuous execution 
 * (e.g. Cron trigger, Kafka Consumer)
 */
export const isContinuousNode = (nodeType: string, config?: NodeConfig): boolean => {
    // Simple check: is it in the always-continuous set?
    if (CONTINUOUS_NODE_TYPES.has(nodeType)) {
        return true;
    }
    // Config-based check
    const conditionalCheck = CONDITIONAL_CONTINUOUS[nodeType];
    return conditionalCheck ? conditionalCheck(config) : false;
};

/** 
 * Check if workflow has any continuous node.
 * If ANY node is continuous, the entire workflow is considered continuous.
 */
export const hasContinuousNode = (nodes: WorkflowNode[]): boolean =>
    nodes.some(n => isContinuousNode(n.data.nodeType, n.data.config));

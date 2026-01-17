
import { Edge, Node } from 'reactflow';
import { toast } from 'sonner';
import { useServices } from '../../contexts/ServiceContext';
import { WorkflowState } from './useWorkflowState';
import { isCronTrigger } from '../../types/workflow.enums';


export const useWorkflowPersistence = (
    state: WorkflowState,
    duplicateNode: (id: string) => void,
    setIsExecuting: (is: boolean) => void
) => {
    const { workflowService } = useServices();
    const {
        setWorkflowId,
        setWorkflowName,
        setNodes,
        setEdges,
        nodes,
        edges,
        workflowId,
        workflowName,
        workflowDescription,
        setWorkflowDescription
    } = state;

    const loadWorkflowById = async (id: string) => {
        try {
            const workflow = await workflowService.loadWorkflow(id);
            setWorkflowId(workflow.id);
            setWorkflowName(workflow.name || "My Workflow");
            setWorkflowDescription(workflow.description || "");

            const loadedNodes: Node[] = workflow.nodes.map((n: any) => ({
                id: n.id,
                type: n.nodeType,
                position: n.metadata?.position || { x: 0, y: 0 },
                data: {
                    nodeType: n.nodeType,
                    label: n.metadata?.label || n.nodeType,
                    config: n.config,
                    onDuplicate: duplicateNode
                }
            }));

            const loadedEdges: Edge[] = workflow.edges.map((e: any) => ({
                id: `e${e.from}-${e.to}`,
                source: e.from,
                target: e.to,
                type: 'smoothstep'
            }));

            setNodes(loadedNodes);
            setEdges(loadedEdges);


            // Sync execution status for CRON - If backend is running it, UI must show Stop
            if (loadedNodes.some(n => isCronTrigger(n.type || ''))) {
                const status = await workflowService.getWorkflowStatus(id);
                setIsExecuting(status.isRunning);
            } else {
                setIsExecuting(false);
            }
        } catch (error) {
            console.error("Failed to load workflow:", error);
            toast.error("Failed to load workflow");
        }
    };

    const saveCurrentWorkflow = async (): Promise<string | null> => {
        try {
            const targetIds = new Set(edges.map(e => e.target));
            const rootNodes = nodes.filter(n => !targetIds.has(n.id));
            const startNode = rootNodes.find(n => n.type?.startsWith('TriggerNodeType')) || rootNodes[0] || nodes[0];

            const payload = {
                id: workflowId,
                name: workflowName,
                description: workflowDescription,
                startNodeId: startNode?.id || null,
                nodes: nodes.map(n => ({
                    id: n.id,
                    nodeType: n.type || 'default',
                    config: n.data.config || {},
                    metadata: { position: n.position, label: n.data.label }
                })),
                edges: edges.map(e => ({ from: e.source, to: e.target, condition: null }))
            };

            const savedId = await workflowService.saveWorkflow(payload);
            setWorkflowId(savedId);
            localStorage.setItem('workflow-engine-active-id', savedId);
            toast.success('Workflow saved!');

            return savedId;
        } catch (error) {
            console.error("Failed to save workflow:", error);
            toast.error('Failed to save workflow');
            return null;
        }
    };

    const createBlankWorkflow = (name?: string, description?: string) => {
        setNodes([]);
        setEdges([]);
        setWorkflowId(null);
        setWorkflowName(name || `New Workflow ${new Date().toLocaleDateString()}`);
        setWorkflowDescription(description || "");
        setIsExecuting(false);
        localStorage.removeItem('workflow-engine-active-id');
    };

    const clearCanvas = () => {
        setNodes([]);
        setEdges([]);
        setIsExecuting(false);
        toast.info('Canvas cleared');
    };

    return {
        loadWorkflowById,
        saveCurrentWorkflow,
        createBlankWorkflow,
        clearCanvas
    };
};

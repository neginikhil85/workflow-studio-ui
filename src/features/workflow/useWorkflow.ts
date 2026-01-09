import { useState, useCallback, useEffect, useRef } from 'react';
import {
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    Edge,
    ReactFlowInstance,
    Node,
    XYPosition,
} from 'reactflow';
import { toast } from 'sonner';
import { useServices } from '../../contexts/ServiceContext';
import { WorkflowNode, NodeConfig } from '../../types/workflow';

export const useWorkflow = () => {
    const { workflowService } = useServices();
    const reactFlowWrapper = useRef<HTMLDivElement>(null);

    // React Flow State
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

    // Attributes
    const [workflowId, setWorkflowId] = useState<string | null>(null);
    const [workflowName, setWorkflowName] = useState<string>("My Workflow");

    // Modal State
    const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Execution State
    const [isRunning, setIsRunning] = useState(false);

    // --- HELPER: Duplicate Node ---
    const duplicateNode = useCallback((nodeId: string) => {
        setNodes((nds) => {
            const nodeToDuplicate = nds.find((n) => n.id === nodeId);
            if (!nodeToDuplicate) return nds;

            const newNode: WorkflowNode = {
                ...nodeToDuplicate,
                id: `node_${Date.now()}`,
                position: {
                    x: nodeToDuplicate.position.x + 50,
                    y: nodeToDuplicate.position.y + 50,
                },
                selected: false,
                data: {
                    ...nodeToDuplicate.data,
                    label: `${nodeToDuplicate.data.label} (Copy)`,
                    config: JSON.parse(JSON.stringify(nodeToDuplicate.data.config || {})),
                    onDuplicate: (id: string) => duplicateNode(id)
                },
            };

            return nds.concat(newNode);
        });
    }, [setNodes]);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    // --- ACTION: Load Workflow ---
    const loadWorkflow = async (id: string) => {
        try {
            const workflow = await workflowService.loadWorkflow(id);
            setWorkflowId(workflow.id);
            setWorkflowName(workflow.name || "My Workflow");

            // PRE-REFACTOR MAPPING: Directly Map to Node
            const flowNodes: Node[] = workflow.nodes.map((n: any) => {
                const type = n.nodeType;

                // We fallback to checking if it's a known type prefix if exact match fails? 
                // Actually in pre-refactor we trusted the type directly.

                return {
                    id: n.id,
                    type: type, // Use the ACTUAL type string (e.g. 'TriggerNodeType_WEBHOOK')
                    position: n.metadata?.position || { x: 0, y: 0 },
                    data: {
                        nodeType: type, // Pass type in data for CardNode
                        label: n.metadata?.label || type,
                        config: n.config,
                        onDuplicate: duplicateNode
                    }
                };
            });

            // Map Edges
            const flowEdges: Edge[] = workflow.edges.map(e => ({
                id: `e${e.from}-${e.to}`,
                source: e.from,
                target: e.to,
                type: 'smoothstep'
            }));

            setNodes(flowNodes);
            setEdges(flowEdges);

        } catch (e) {
            console.error("Failed to load workflow", e);
            toast.error("Failed to load workflow");
        }
    };

    // --- ACTION: Save Workflow ---
    const saveWorkflow = async (): Promise<string | null> => {
        try {
            const payload = {
                id: workflowId,
                name: workflowName,
                description: "Created via ReactFlow",
                nodes: nodes.map(n => ({
                    id: n.id,
                    nodeType: n.type || 'default', // React Flow Type IS the nodeType
                    config: n.data.config || {},
                    metadata: {
                        position: n.position,
                        label: n.data.label
                    }
                })),
                edges: edges.map(e => ({
                    from: e.source,
                    to: e.target,
                    condition: null
                }))
            };

            // Start Node Logic
            const targetNodeIds = new Set(edges.map(e => e.target));
            const rootNodes = nodes.filter(n => !targetNodeIds.has(n.id));
            const startNode = rootNodes.find(n => n.type?.startsWith('TriggerNodeType')) || rootNodes[0] || nodes[0];

            (payload as any).startNodeId = startNode ? startNode.id : null;

            const newId = await workflowService.saveWorkflow(payload);
            setWorkflowId(newId);
            localStorage.setItem('workflow-engine-active-id', newId);
            toast.success('Workflow saved!');
            return newId;
        } catch (e) {
            console.error(e);
            toast.error('Error saving workflow');
            return null;
        }
    };

    // --- ACTION: Run Workflow ---
    const runWorkflow = async () => {
        if (!workflowId) {
            toast.warning('Please save the workflow first');
            return;
        }

        setNodes(nds => nds.map(node => ({
            ...node,
            style: { ...node.style, border: 'none', boxShadow: 'none' }
        })));

        setIsRunning(true);
        try {
            const result = await workflowService.executeWorkflow(workflowId);
            if (result.success && result.executedNodeIds) {
                const executedIds = result.executedNodeIds;
                setNodes(nds => nds.map(node => {
                    if (executedIds.includes(node.id)) {
                        return {
                            ...node,
                            style: {
                                ...node.style,
                                border: '2px solid #22c55e',
                                boxShadow: '0 0 10px rgba(34, 197, 94, 0.5)',
                                transition: 'all 0.3s ease'
                            }
                        };
                    }
                    return node;
                }));
                toast.success('Execution Successful!');
            } else {
                toast.success('Execution Successful (No path returned)');
            }
        } catch (e: any) {
            console.error(e);
            toast.error(e.message || 'Execution failed');
        } finally {
            setIsRunning(false);
        }
    };

    // --- ACTION: Stop Workflow ---
    const stopWorkflow = async () => {
        if (!workflowId) return;

        try {
            await workflowService.stopWorkflow(workflowId);
            setIsRunning(false);
            toast.info('Workflow stopped');
        } catch (e: any) {
            console.error(e);
            toast.error(e.message || 'Failed to stop workflow');
        }
    };

    // --- ACTION: DnD Handler ---
    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            if (!reactFlowInstance || !reactFlowWrapper.current) {
                return;
            }

            const type = event.dataTransfer.getData('application/reactflow');
            // We expect type to be the FULL key e.g. 'TriggerNodeType_WEBHOOK'
            // If sidebar sends short key, this might need mapping, but assuming sidebar sends full key?
            // Actually, sidebar usually sends what's in the registry. 

            if (!type) return;

            const position: XYPosition = reactFlowInstance.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            const newNodeId = `node_${Date.now()}`;

            // Standard Node Creation (No Factory)
            const newNode: WorkflowNode = {
                id: newNodeId,
                type: type, // Direct Type
                position,
                data: {
                    label: type.split('_')[1] || 'Node',
                    nodeType: type, // Critical for CardNode
                    config: {},
                    onDuplicate: duplicateNode
                },
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [reactFlowInstance, setNodes, duplicateNode]
    );

    const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
        setSelectedNode(node as WorkflowNode);
        setIsModalOpen(true);
    }, []);

    const onSaveConfig = (nodeId: string, newConfig: NodeConfig) => {
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === nodeId) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            config: newConfig
                        }
                    };
                }
                return node;
            })
        );
    };

    // Auto-load
    useEffect(() => {
        const storedId = localStorage.getItem('workflow-engine-active-id');
        if (storedId) {
            loadWorkflow(storedId);
        }
    }, []);

    const createNewWorkflow = (name?: string) => {
        setNodes([]);
        setEdges([]);
        setWorkflowId(null);
        setWorkflowName(name || "My Workflow " + new Date().toISOString());
        localStorage.removeItem('workflow-engine-active-id');
    };



    return {
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        onConnect,
        onDragOver,
        onDrop,
        onNodeClick,
        reactFlowWrapper,
        setReactFlowInstance,
        selectedNode,
        isModalOpen,
        setIsModalOpen,
        onSaveConfig,
        saveWorkflow,
        runWorkflow,
        stopWorkflow,
        isRunning,
        clearWorkflow: createNewWorkflow,
        loadWorkflow,
        createNewWorkflow,
        workflowId,
        workflowName,
        setWorkflowName,
        duplicateNode
    };
};

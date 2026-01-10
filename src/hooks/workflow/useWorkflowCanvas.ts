import { useCallback } from 'react';
import { addEdge, Connection, Node, XYPosition } from 'reactflow';
import { WorkflowNode, NodeConfig } from '../../types/workflow.interfaces';
import { WorkflowState } from './useWorkflowState';

export const useWorkflowCanvas = (state: WorkflowState) => {
    const {
        setNodes,
        setEdges,
        flowInstance,
        canvasRef,
        setSelectedNode,
        setIsModalOpen
    } = state;

    const duplicateNode = useCallback((nodeId: string) => {
        setNodes(curr => {
            const src = curr.find(n => n.id === nodeId);
            if (!src) return curr;

            const copy: WorkflowNode = {
                ...src,
                id: `node_${Date.now()}`,
                position: { x: src.position.x + 50, y: src.position.y + 50 },
                selected: false,
                data: {
                    ...src.data,
                    label: src.data.label,
                    config: JSON.parse(JSON.stringify(src.data.config || {})),
                    onDuplicate: (id: string) => duplicateNode(id)
                },
            };
            return [...curr, copy];
        });
    }, [setNodes]);

    const handleConnect = useCallback(
        (connection: Connection) => setEdges(eds => addEdge(connection, eds)),
        [setEdges]
    );

    const handleDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const handleDrop = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        if (!flowInstance || !canvasRef.current) return;

        const type = event.dataTransfer.getData('application/reactflow');
        if (!type) return;

        const position: XYPosition = flowInstance.screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
        });

        const newNode: WorkflowNode = {
            id: `node_${Date.now()}`,
            type,
            position,
            data: {
                label: type.split('_')[1] || 'Node',
                nodeType: type,
                config: {},
                onDuplicate: duplicateNode
            },
        };

        setNodes(nds => [...nds, newNode]);
    }, [flowInstance, canvasRef, setNodes, duplicateNode]);

    const handleNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
        setSelectedNode(node as WorkflowNode);
        setIsModalOpen(true);
    }, [setSelectedNode, setIsModalOpen]);

    const updateNodeConfig = useCallback((nodeId: string, newConfig: NodeConfig) => {
        setNodes(nds => nds.map(n =>
            n.id === nodeId
                ? { ...n, data: { ...n.data, config: newConfig } }
                : n
        ));
    }, [setNodes]);

    return {
        handleConnect,
        handleDragOver,
        handleDrop,
        handleNodeClick,
        duplicateNode,
        updateNodeConfig
    };
};

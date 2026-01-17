import { useState, useRef } from 'react';
import { useNodesState, useEdgesState, ReactFlowInstance } from 'reactflow';
import { WorkflowNode } from '../../types/workflow.interfaces';

export const useWorkflowState = () => {
    // Canvas State
    const canvasRef = useRef<HTMLDivElement>(null);
    const [flowInstance, setFlowInstance] = useState<ReactFlowInstance | null>(null);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    // Workflow Identity
    const [workflowId, setWorkflowId] = useState<string | null>(null);
    const [workflowName, setWorkflowName] = useState("My Workflow");
    const [workflowDescription, setWorkflowDescription] = useState("");

    // UI/Modal State
    const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    return {
        canvasRef,
        flowInstance, setFlowInstance,
        nodes, setNodes, onNodesChange,
        edges, setEdges, onEdgesChange,
        workflowId, setWorkflowId,
        workflowName, setWorkflowName,
        workflowDescription, setWorkflowDescription,
        selectedNode, setSelectedNode,
        isModalOpen, setIsModalOpen
    };
};

export type WorkflowState = ReturnType<typeof useWorkflowState>;

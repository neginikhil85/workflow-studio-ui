import { useEffect } from 'react';
import { useWorkflowState } from './useWorkflowState';
import { useWorkflowCanvas } from './useWorkflowCanvas';
import { useWorkflowExecution } from './useWorkflowExecution';
import { useWorkflowPersistence } from './useWorkflowPersistence';

/**
 * Main Workflow Facade Hook
 * Composes focused hooks to provide a unified API for the Workflow feature.
 *
 * Responsibilities:
 * - Composition of State, Canvas, Persistence, and Execution logic
 * - Initialization (auto-load)
 * - Exposing a clean public API
 */
export const useWorkflow = () => {
    // 1. Core State
    const state = useWorkflowState();

    // 2. Capabilities
    const execution = useWorkflowExecution(state);
    const canvas = useWorkflowCanvas(state);
    const persistence = useWorkflowPersistence(state, canvas.duplicateNode, execution.setIsExecuting);

    // 3. Initialization
    useEffect(() => {
        const savedId = localStorage.getItem('workflow-engine-active-id');
        if (savedId) {
            persistence.loadWorkflowById(savedId);
        }
    }, []); // Run once on mount

    // 4. Public API
    // 4. Public API
    return {
        state: {
            nodes: state.nodes,
            edges: state.edges,
            workflowId: state.workflowId,
            workflowName: state.workflowName,
            selectedNode: state.selectedNode,
            isModalOpen: state.isModalOpen,
            isSettingsOpen: state.isSettingsOpen,
            reactFlowWrapper: state.canvasRef,
        },
        actions: {
            setWorkflowName: state.setWorkflowName,
            setIsModalOpen: state.setIsModalOpen,
            setIsSettingsOpen: state.setIsSettingsOpen,
            setReactFlowInstance: state.setFlowInstance,
            onNodesChange: state.onNodesChange,
            onEdgesChange: state.onEdgesChange,
            onConnect: canvas.handleConnect,
            onDragOver: canvas.handleDragOver,
            onDrop: canvas.handleDrop,
            onNodeClick: canvas.handleNodeClick,
            duplicateNode: canvas.duplicateNode,
            onSaveConfig: canvas.updateNodeConfig,
        },
        execution: {
            isRunning: execution.isExecuting,
            status: execution.status,
            runWorkflow: execution.executeWorkflow,
            stopWorkflow: execution.stopExecution,
        },
        persistence: {
            loadWorkflow: persistence.loadWorkflowById,
            saveWorkflow: persistence.saveCurrentWorkflow,
            clearWorkflow: persistence.clearCanvas,
            createNewWorkflow: persistence.createBlankWorkflow,
        }
    };
};

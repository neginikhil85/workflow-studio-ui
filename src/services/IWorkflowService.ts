import { Workflow, WorkflowSummary, ExecutionResult } from '../types/workflow';

/**
 * Contract for Workflow Service Operations.
 * Decouples the UI from the concrete storage/execution implementation (HTTP, WebSocket, Mock).
 */
export interface IWorkflowService {
    /**
     * Loads a full workflow definition by ID
     */
    loadWorkflow(id: string): Promise<Workflow>;

    /**
     * Saves or Updates a workflow
     */
    saveWorkflow(workflow: Workflow): Promise<string>;

    /**
     * Executes a workflow by ID
     */
    executeWorkflow(id: string): Promise<ExecutionResult>;

    /**
     * Deletes a workflow by ID
     */
    deleteWorkflow(id: string): Promise<void>;

    /**
     * Gets a summary list of all workflows
     */
    getWorkflowList(): Promise<WorkflowSummary[]>;

    /**
     * Stops a running workflow by ID
     */
    stopWorkflow(id: string): Promise<void>;

    /**
     * Checks if a workflow is currently running
     */
    getWorkflowStatus(id: string): Promise<{ isRunning: boolean }>;
}

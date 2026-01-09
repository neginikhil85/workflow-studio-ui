import axios from 'axios';
import { IWorkflowService } from './IWorkflowService';
import { Workflow, WorkflowSummary, ExecutionResult } from '../types/workflow';

/**
 * HTTP-based implementation of WorkflowService.
 * Communicates with the Spring Boot backend via REST.
 */
export class HttpWorkflowService implements IWorkflowService {

    private readonly baseUrl: string;

    constructor(baseUrl: string = '/api') {
        this.baseUrl = baseUrl;
    }

    async loadWorkflow(id: string): Promise<Workflow> {
        try {
            const response = await axios.get(`${this.baseUrl}/workflows/${id}`);
            return response.data;
        } catch (e: any) {
            console.error("Failed to load workflow", e);
            throw new Error(e.response?.data?.message || "Failed to load workflow");
        }
    }

    async saveWorkflow(workflow: Workflow): Promise<string> {
        try {
            let response;
            if (workflow.id) {
                response = await axios.put(`${this.baseUrl}/workflows/${workflow.id}`, workflow);
            } else {
                response = await axios.post(`${this.baseUrl}/workflows`, workflow);
            }
            return response.data.id;
        } catch (e: any) {
            console.error("Failed to save workflow", e);
            throw new Error(e.response?.data?.message || "Failed to save workflow");
        }
    }

    async executeWorkflow(id: string): Promise<ExecutionResult> {
        try {
            const response = await axios.post(`${this.baseUrl}/workflows/${id}/execute`, {});
            // Backend returns: { success: true, result: { executedNodes: [], output: ... } }
            // Mapping this nested structure to a clean ExecutionResult

            const serverResult = response.data.result;
            return {
                executedNodeIds: serverResult.executedNodes || [],
                output: serverResult.output,
                success: response.data.success !== false // Default true if field missing
            };
        } catch (e: any) {
            console.error("Failed to execute workflow", e);
            throw new Error(e.response?.data?.message || e.message || "Failed to execute workflow");
        }
    }

    async deleteWorkflow(id: string): Promise<void> {
        try {
            await axios.delete(`${this.baseUrl}/workflows/${id}`);
        } catch (e: any) {
            console.error("Failed to delete workflow", e);
            throw new Error(e.response?.data?.message || "Failed to delete workflow");
        }
    }

    async getWorkflowList(): Promise<WorkflowSummary[]> {
        try {
            const response = await axios.get(`${this.baseUrl}/workflows`);
            // Assuming backend returns list of full workflows or summaries.
            // If full workflows, we map to summary
            return response.data.map((w: any) => ({
                id: w.id,
                name: w.name,
                description: w.description
            }));
        } catch (e: any) {
            console.error("Failed to lists workflows", e);
            throw new Error(e.response?.data?.message || "Failed to get workflow list");
        }
    }

    async stopWorkflow(id: string): Promise<void> {
        try {
            await axios.post(`${this.baseUrl}/workflows/${id}/stop`);
        } catch (e: any) {
            console.error("Failed to stop workflow", e);
            throw new Error(e.response?.data?.message || "Failed to stop workflow");
        }
    }

    async getWorkflowStatus(id: string): Promise<{ isRunning: boolean }> {
        try {
            const response = await axios.get(`${this.baseUrl}/workflows/${id}/status`);
            return { isRunning: response.data.isRunning };
        } catch (e: any) {
            console.error("Failed to get workflow status", e);
            throw new Error(e.response?.data?.message || "Failed to get workflow status");
        }
    }
}

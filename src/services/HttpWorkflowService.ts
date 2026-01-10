import axios from 'axios';
import { IWorkflowService } from './IWorkflowService';
import { Workflow, WorkflowSummary, ExecutionResult } from '../types/workflow.interfaces';
import { ApiResponse } from '../types/api.interfaces';

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
            const response = await axios.get<ApiResponse<Workflow>>(`${this.baseUrl}/workflows/${id}`);
            return response.data.data;
        } catch (e: any) {
            console.error("Failed to load workflow", e);
            throw new Error(e.response?.data?.message || "Failed to load workflow");
        }
    }

    async saveWorkflow(workflow: Workflow): Promise<string> {
        try {
            let response;
            if (workflow.id) {
                response = await axios.put<ApiResponse<Workflow>>(`${this.baseUrl}/workflows/${workflow.id}`, workflow);
            } else {
                response = await axios.post<ApiResponse<Workflow>>(`${this.baseUrl}/workflows`, workflow);
            }
            return response.data.data.id!;
        } catch (e: any) {
            console.error("Failed to save workflow", e);
            throw new Error(e.response?.data?.message || "Failed to save workflow");
        }
    }

    async executeWorkflow(id: string): Promise<ExecutionResult> {
        try {
            const response = await axios.post<ApiResponse<any>>(`${this.baseUrl}/workflows/${id}/execute`, {});
            // Backend returns: ApiResponse<Map<String, Object>>
            // Data map keys: "executedNodes", "output", "runId"

            const resultData = response.data.data;
            return {
                executedNodeIds: resultData.executedNodes || [],
                output: resultData.output,
                success: response.data.success !== false
            };
        } catch (e: any) {
            console.error("Failed to execute workflow", e);
            throw new Error(e.response?.data?.message || e.message || "Failed to execute workflow");
        }
    }

    async deleteWorkflow(id: string): Promise<void> {
        try {
            await axios.delete<ApiResponse<void>>(`${this.baseUrl}/workflows/${id}`);
        } catch (e: any) {
            console.error("Failed to delete workflow", e);
            throw new Error(e.response?.data?.message || "Failed to delete workflow");
        }
    }

    async getWorkflowList(): Promise<WorkflowSummary[]> {
        try {
            const response = await axios.get<ApiResponse<Workflow[]>>(`${this.baseUrl}/workflows`);
            return response.data.data.map((w: any) => ({
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
            await axios.post<ApiResponse<void>>(`${this.baseUrl}/workflows/${id}/stop`);
        } catch (e: any) {
            console.error("Failed to stop workflow", e);
            throw new Error(e.response?.data?.message || "Failed to stop workflow");
        }
    }

    async getWorkflowStatus(id: string): Promise<{ isRunning: boolean; status: string }> {
        try {
            const response = await axios.get<ApiResponse<any>>(`${this.baseUrl}/workflows/${id}/status`);
            return {
                isRunning: response.data.data.isRunning,
                status: response.data.data.status || 'IDLE'
            };
        } catch (e: any) {
            console.error("Failed to get workflow status", e);
            throw new Error(e.response?.data?.message || "Failed to get workflow status");
        }
    }

    async getWorkflowRuns(id: string): Promise<import('../types/workflow.interfaces').WorkflowRun[]> {
        try {
            const response = await axios.get<ApiResponse<import('../types/workflow.interfaces').WorkflowRun[]>>(`${this.baseUrl}/workflows/${id}/runs`);
            return response.data.data;
        } catch (e: any) {
            console.error("Failed to get workflow runs", e);
            throw new Error(e.response?.data?.message || "Failed to get workflow runs");
        }
    }

    async getExecutionsForRun(runId: string): Promise<import('../types/workflow.interfaces').WorkflowExecution[]> {
        try {
            const response = await axios.get<ApiResponse<import('../types/workflow.interfaces').WorkflowExecution[]>>(`${this.baseUrl}/workflows/runs/${runId}/executions`);
            return response.data.data;
        } catch (e: any) {
            console.error("Failed to get executions for run", e);
            throw new Error(e.response?.data?.message || "Failed to get executions for run");
        }
    }
}

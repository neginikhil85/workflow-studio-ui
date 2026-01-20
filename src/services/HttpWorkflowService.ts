import axios from 'axios';
import { IWorkflowService } from './IWorkflowService';
import { Workflow, WorkflowSummary, ExecutionResult } from '../types/workflow.interfaces';
import { ApiResponse } from '../types/api.interfaces';
import { API_CONFIG } from '../config/api.config';

/**
 * HTTP-based implementation of WorkflowService.
 * Communicates with the Spring Boot backend via REST.
 */
export class HttpWorkflowService implements IWorkflowService {

    async loadWorkflow(id: string): Promise<Workflow> {
        try {
            const response = await axios.get<ApiResponse<Workflow>>(API_CONFIG.WORKFLOWS.GET_BY_ID(id));
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
                response = await axios.put<ApiResponse<Workflow>>(API_CONFIG.WORKFLOWS.GET_BY_ID(workflow.id), workflow);
            } else {
                response = await axios.post<ApiResponse<Workflow>>(API_CONFIG.WORKFLOWS.BASE, workflow);
            }
            return response.data.data.id!;
        } catch (e: any) {
            console.error("Failed to save workflow", e);
            throw new Error(e.response?.data?.message || "Failed to save workflow");
        }
    }

    async executeWorkflow(id: string): Promise<ExecutionResult> {
        try {
            const response = await axios.post<ApiResponse<any>>(API_CONFIG.WORKFLOWS.EXECUTE(id), {});
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
            await axios.delete<ApiResponse<void>>(API_CONFIG.WORKFLOWS.GET_BY_ID(id));
        } catch (e: any) {
            console.error("Failed to delete workflow", e);
            throw new Error(e.response?.data?.message || "Failed to delete workflow");
        }
    }

    async getWorkflowList(): Promise<WorkflowSummary[]> {
        try {
            const response = await axios.get<ApiResponse<Workflow[]>>(API_CONFIG.WORKFLOWS.BASE);
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
            await axios.post<ApiResponse<void>>(API_CONFIG.WORKFLOWS.STOP(id));
        } catch (e: any) {
            console.error("Failed to stop workflow", e);
            throw new Error(e.response?.data?.message || "Failed to stop workflow");
        }
    }

    async getWorkflowStatus(id: string): Promise<{ isRunning: boolean; status: string }> {
        try {
            const response = await axios.get<ApiResponse<any>>(API_CONFIG.WORKFLOWS.STATUS(id));
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
            const response = await axios.get<ApiResponse<import('../types/workflow.interfaces').WorkflowRun[]>>(API_CONFIG.WORKFLOWS.RUNS(id));
            return response.data.data;
        } catch (e: any) {
            console.error("Failed to get workflow runs", e);
            throw new Error(e.response?.data?.message || "Failed to get workflow runs");
        }
    }

    async getExecutionsForRun(runId: string): Promise<import('../types/workflow.interfaces').WorkflowExecution[]> {
        try {
            const response = await axios.get<ApiResponse<import('../types/workflow.interfaces').WorkflowExecution[]>>(API_CONFIG.WORKFLOWS.RUN_EXECUTIONS(runId));
            return response.data.data;
        } catch (e: any) {
            console.error("Failed to get executions for run", e);
            throw new Error(e.response?.data?.message || "Failed to get executions for run");
        }
    }

    async getRunNodeExecutions(runId: string): Promise<import('../types/workflow.interfaces').NodeExecutionResult[]> {
        try {
            const response = await axios.get<ApiResponse<import('../types/workflow.interfaces').NodeExecutionResult[]>>(API_CONFIG.WORKFLOWS.nodeExecutionResults(runId));
            return response.data.data;
        } catch (e: any) {
            console.error("Failed to get node executions", e);
            throw new Error(e.response?.data?.message || "Failed to get node executions");
        }
    }
}

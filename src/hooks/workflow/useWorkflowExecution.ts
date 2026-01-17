import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useServices } from '../../contexts/ServiceContext';

import { WorkflowState } from './useWorkflowState';
import { hasContinuousNode } from '../../config/nodes/node.classification';

export const useWorkflowExecution = (state: WorkflowState) => {
    const { workflowService } = useServices();
    const { workflowId, setNodes, nodes } = state;
    const [isExecuting, setIsExecuting] = useState(false);
    const [status, setStatus] = useState<string>('IDLE');

    // Poll for status
    useEffect(() => {
        if (!workflowId) return;

        const checkStatus = async () => {
            try {
                const s = await workflowService.getWorkflowStatus(workflowId);
                setIsExecuting(s.isRunning);
                setStatus(s.status);
            } catch (e) {
                // Silent failure for polling
                console.error(e);
            }
        };

        checkStatus();
        const interval = setInterval(checkStatus, 3000); // Poll every 3s
        return () => clearInterval(interval);
    }, [workflowId, workflowService]);

    const executeWorkflow = async () => {
        if (!workflowId) {
            toast.warning('Please save the workflow first');
            return;
        }

        const isContinuous = hasContinuousNode(nodes);

        // Reset styles
        setNodes(nds => nds.map(n => ({
            ...n,
            style: { ...n.style, border: 'none', boxShadow: 'none' }
        })));

        setIsExecuting(true);
        setStatus('RUNNING');

        // Immediate feedback for continuous workflows
        if (isContinuous) {
            toast.success('Execution started');
        }

        try {
            const result = await workflowService.executeWorkflow(workflowId);
            const executedIds = result.executedNodeIds || [];

            // Highlight executed nodes
            setNodes(nds => nds.map(n =>
                executedIds.includes(n.id)
                    ? {
                        ...n,
                        style: {
                            ...n.style,
                            border: '2px solid #22c55e',
                            boxShadow: '0 0 10px rgba(34,197,94,0.5)',
                            transition: 'all 0.3s ease'
                        }
                    }
                    : n
            ));

            // Only show completion message for one-time workflows
            if (!isContinuous) {
                toast.success('Execution completed!');
                setStatus('COMPLETED');
            }
        } catch (error: any) {
            console.error("Execution failed:", error);
            toast.error(error.message || 'Execution failed');
            setIsExecuting(false);
            setStatus('FAILED');
        }

        // Refresh status shortly after only for continuous workflows (to catch async updates like cron/kafka)
        if (isContinuous) {
            setTimeout(async () => {
                try {
                    const s = await workflowService.getWorkflowStatus(workflowId);
                    setIsExecuting(s.isRunning);
                    setStatus(s.status);
                } catch (e) { }
            }, 1000);
        } else {
            // For one-time workflows, ensure we stop executing state
            setIsExecuting(false);
        }
    };

    const stopExecution = async () => {
        if (!workflowId) return;

        try {
            await workflowService.stopWorkflow(workflowId);
            setIsExecuting(false);
            setStatus('STOPPED');
            toast.info('Execution stopped');
        } catch (error: any) {
            console.error("Failed to stop:", error);
            toast.error(error.message || 'Failed to stop');
        }
    };

    return {
        isExecuting,
        status,
        setIsExecuting,
        executeWorkflow,
        stopExecution
    };
};

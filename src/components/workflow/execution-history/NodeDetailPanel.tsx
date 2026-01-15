import React from 'react';
import { NodeExecutionResult, WorkflowNodeDefinition } from '../../../types/workflow.interfaces';
import { IntegrationNodeType, TriggerNodeType, NotificationNodeType } from '../../../types/workflow.enums';
import { HttpNodeView } from './details/HttpNodeView';
import { CronNodeView } from './details/CronNodeView';
import { ConsoleNodeView } from './details/ConsoleNodeView';
import { DefaultNodeView } from './details/DefaultNodeView';

interface NodeDetailPanelProps {
    result: NodeExecutionResult | null;
    nodeDef?: WorkflowNodeDefinition;
}

export const NodeDetailPanel: React.FC<NodeDetailPanelProps> = ({ result, nodeDef }) => {
    if (!result) {
        return (
            <div className="h-full flex items-center justify-center text-slate-400 text-sm bg-slate-50/50">
                Select a step to view details
            </div>
        );
    }

    const type = nodeDef?.nodeType || 'default';

    switch (type) {
        case IntegrationNodeType.HTTP_CALL:
            return <HttpNodeView result={result} />;

        case TriggerNodeType.CRON:
            return <CronNodeView result={result} />;

        case NotificationNodeType.CONSOLE:
            return <ConsoleNodeView result={result} />;

        case 'trigger': // Legacy fallback
            if (nodeDef?.config?.cron) {
                return <CronNodeView result={result} />;
            }
            return <DefaultNodeView result={result} />;

        default:
            // Fallback: check output structure if node definition is missing
            const output = result.executionDetails as any || {};
            if (output.trigger === 'cron') return <CronNodeView result={result} />;

            return <DefaultNodeView result={result} />;
    }
};

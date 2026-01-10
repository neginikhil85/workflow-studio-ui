import React from 'react';
import { HeaderState } from '../../../types/workflow.interfaces';

interface HeaderTitleProps {
    state: HeaderState;
}

export const HeaderTitle: React.FC<HeaderTitleProps> = ({ state }) => {
    return (
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-slate-500 hover:text-slate-700 cursor-pointer transition-colors">Workflows</span>
                <span className="text-slate-300">/</span>
                <span className="font-semibold text-slate-900">{state.workflowName || 'New Workflow'}</span>
                {state.workflowId && (
                    <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-[10px] font-bold text-indigo-700 border border-indigo-200 ml-1.5 uppercase tracking-wide shadow-sm">
                        WF-{state.workflowId}
                    </span>
                )}
            </div>
        </div>
    );
};

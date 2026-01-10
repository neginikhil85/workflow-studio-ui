import React, { useState } from 'react';
import Header from './header/Header';
import Sidebar from '../sidebar/Sidebar';
import Canvas from '../workflow/Canvas';
import ConfigModal from '../workflow/config-modal/ConfigModal';
import { useWorkflow } from '../../hooks/workflow/useWorkflow';
import WorkflowListModal from '../workflow/workflow-list-modal/WorkflowListModal';
import { Toaster } from 'sonner';
import { ExecutionHistoryModal } from '../workflow/execution-history/ExecutionHistoryModal';

const WorkflowLayout: React.FC = () => {
    const [isListOpen, setIsListOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const { state, actions, execution, persistence } = useWorkflow();

    return (
        <div className="w-screen h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
            <Toaster position="top-right" richColors duration={1000} />
            <Header
                state={state}
                execution={execution}
                persistence={persistence}
                onWorkflows={() => setIsListOpen(true)}
                onHistory={() => setIsHistoryOpen(true)}
            />

            <div className="flex-1 flex overflow-hidden">
                <Sidebar />

                <Canvas
                    state={state}
                    actions={actions}
                />

                <ConfigModal
                    node={state.selectedNode}
                    isOpen={state.isModalOpen}
                    onClose={() => actions.setIsModalOpen(false)}
                    onSave={actions.onSaveConfig}
                />

                <WorkflowListModal
                    isOpen={isListOpen}
                    onClose={() => setIsListOpen(false)}
                    onSelect={(wf) => {
                        persistence.loadWorkflow(wf.id!);
                        setIsListOpen(false);
                    }}
                    onDelete={async (id) => {
                        try {
                            const { default: axios } = await import('axios');
                            await axios.delete(`/api/workflows/${id}`);
                        } catch (e) { console.error(e) }
                    }}
                    onCreate={(name) => persistence.createNewWorkflow(name)}
                />

                <ExecutionHistoryModal
                    isOpen={isHistoryOpen}
                    onClose={() => setIsHistoryOpen(false)}
                    workflowId={state.workflowId}
                />
            </div>
        </div>
    );
};

export default WorkflowLayout;

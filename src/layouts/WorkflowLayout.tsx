import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/Sidebar';
import Canvas from '../features/workflow/Canvas';
import ConfigModal from '../components/ConfigModal';
import { useWorkflow } from '../features/workflow/useWorkflow';
import WorkflowListModal from '../components/WorkflowListModal';
import { Toaster } from 'sonner';

const WorkflowLayout: React.FC = () => {
    const [isListOpen, setIsListOpen] = useState(false);
    const {
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        onConnect,
        onDragOver,
        onDrop,
        onNodeClick,
        reactFlowWrapper,
        setReactFlowInstance,
        selectedNode,
        isModalOpen,
        setIsModalOpen,
        onSaveConfig,
        saveWorkflow,
        runWorkflow,
        stopWorkflow,
        isRunning,
        clearWorkflow,
        loadWorkflow,
        workflowId,
        workflowName,
        createNewWorkflow
    } = useWorkflow();

    return (
        <div className="w-screen h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
            <Toaster position="top-right" richColors duration={2000} />
            <Header
                onSave={saveWorkflow}
                onRun={runWorkflow}
                onStop={stopWorkflow}
                isRunning={isRunning}
                onClear={clearWorkflow}
                onWorkflows={() => setIsListOpen(true)}
                workflowId={workflowId}
                workflowName={workflowName}
            />

            <div className="flex-1 flex overflow-hidden">
                <Sidebar />

                <Canvas
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    onNodeClick={onNodeClick}
                    setReactFlowInstance={setReactFlowInstance}
                    reactFlowWrapper={reactFlowWrapper}
                />

                <ConfigModal
                    node={selectedNode}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={onSaveConfig}
                />

                <WorkflowListModal
                    isOpen={isListOpen}
                    onClose={() => setIsListOpen(false)}
                    onSelect={(wf) => {
                        loadWorkflow(wf.id!);
                        setIsListOpen(false);
                    }}
                    onDelete={async (id) => {
                        // handled inside modal or here? 
                        // Modal handles calling backend, but visual refresh is inner.
                        // Actually, Modal logic for delete needs axios call.
                        // Let's pass a handler that calls axios or let modal handle it?
                        // Modal implementation created previously has fetch logic.
                        // Ideally we pass a function that calls API.
                        try {
                            const { default: axios } = await import('axios');
                            await axios.delete(`/api/workflows/${id}`);
                        } catch (e) { console.error(e) }
                    }}
                    onCreate={(name) => createNewWorkflow(name)}
                />
            </div>
        </div>
    );
};

export default WorkflowLayout;

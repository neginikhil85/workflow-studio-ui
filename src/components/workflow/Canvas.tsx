import React from 'react';
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    ReactFlowInstance,
    Node,
    Edge,
    OnNodesChange,
    OnEdgesChange,
    OnConnect,
    BackgroundVariant,
    ConnectionLineType
} from 'reactflow';
import 'reactflow/dist/style.css';
import { NODE_TYPE_REGISTRY } from '../../config/nodes/node.registry';

interface CanvasState {
    nodes: Node[];
    edges: Edge[];
    reactFlowWrapper: React.RefObject<HTMLDivElement | null>;
}

interface CanvasActions {
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;
    onDrop: (event: React.DragEvent) => void;
    onDragOver: (event: React.DragEvent) => void;
    onNodeClick: (event: React.MouseEvent, node: Node) => void;
    setReactFlowInstance: (instance: ReactFlowInstance) => void;
}

interface CanvasProps {
    state: CanvasState;
    actions: CanvasActions;
}

const Canvas: React.FC<CanvasProps> = ({ state, actions }) => {
    return (
        <div className="flex-1 h-full bg-slate-80 relative" ref={state.reactFlowWrapper}>
            <ReactFlow
                nodes={state.nodes}
                edges={state.edges}
                onNodesChange={actions.onNodesChange}
                onEdgesChange={actions.onEdgesChange}
                onConnect={actions.onConnect}
                onInit={actions.setReactFlowInstance}
                onDrop={actions.onDrop}
                onDragOver={actions.onDragOver}
                onNodeClick={actions.onNodeClick}
                fitView
                fitViewOptions={{ maxZoom: 1, padding: 0.2 }}
                minZoom={0.1}
                maxZoom={1.5}
                attributionPosition="bottom-right"
                nodeTypes={NODE_TYPE_REGISTRY}
                proOptions={{ hideAttribution: true }}
                connectionLineType={ConnectionLineType.SmoothStep}
            >
                <Background color="#000000ff" gap={20} size={1} variant={BackgroundVariant.Dots} className="opacity-40" />
                <Controls className="!bg-white !border-slate-200 !shadow-xl !rounded-xl overflow-hidden [&>button]:!border-b-slate-100 [&>button]:!text-slate-600 hover:[&>button]:!bg-slate-50 !m-4" />
                <MiniMap
                    style={{ background: '#fff', height: 120, width: 200, borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    maskColor="rgba(241, 245, 249, 0.7)"
                    nodeColor={() => '#d7d7d7ff'}
                    className="!m-4"
                />
            </ReactFlow>
        </div>
    );
};

export default Canvas;

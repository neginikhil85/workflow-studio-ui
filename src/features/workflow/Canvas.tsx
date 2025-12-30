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
    BackgroundVariant
} from 'reactflow';
import 'reactflow/dist/style.css';
import CardNode from '../../nodes/CardNode';

// --- REVERT MAP: MAPPING ALL KEYS TO CARDNODE DIRECTLY ---
const nodeTypes = {
    // Triggers
    'TriggerNodeType_WEBHOOK': CardNode,
    'TriggerNodeType_CRON': CardNode,

    // Integration
    'IntegrationNodeType_HTTP_CALL': CardNode,
    'IntegrationNodeType_KAFKA': CardNode,
    'IntegrationNodeType_ARTEMIS_QUEUE': CardNode,
    'IntegrationNodeType_ACTIVE_MQ': CardNode,

    // Notification
    'NotificationNodeType_EMAIL': CardNode,
    'NotificationNodeType_LOG': CardNode,
    'NotificationNodeType_CONSOLE': CardNode,

    // Transformation
    'TransformationNodeType_JSON_MAPPER': CardNode,
    'TransformationNodeType_EXPRESSION': CardNode,

    // Control Flow
    'ControlFlowNodeType_IF': CardNode,
    'ControlFlowNodeType_SWITCH': CardNode,
    'ControlFlowNodeType_LOOP': CardNode,
    'ControlFlowNodeType_DELAY': CardNode,

    // Validation
    'ValidationNodeType_SCHEMA_CHECK': CardNode,
    'ValidationNodeType_BUSINESS_RULE': CardNode,
    'ValidationNodeType_REQUIRED_FIELDS': CardNode,

    // Default
    'default': CardNode
};

interface CanvasProps {
    nodes: Node[];
    edges: Edge[];
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;
    onDrop: (event: React.DragEvent) => void;
    onDragOver: (event: React.DragEvent) => void;
    onNodeClick: (event: React.MouseEvent, node: Node) => void;
    setReactFlowInstance: (instance: ReactFlowInstance) => void;
    reactFlowWrapper: React.RefObject<HTMLDivElement | null>;
}

const Canvas: React.FC<CanvasProps> = ({
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onDrop,
    onDragOver,
    onNodeClick,
    setReactFlowInstance,
    reactFlowWrapper
}) => {

    return (
        <div className="flex-1 h-full bg-slate-50 relative" ref={reactFlowWrapper}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onInit={setReactFlowInstance}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onNodeClick={onNodeClick}
                fitView
                fitViewOptions={{ maxZoom: 1, padding: 0.2 }}
                minZoom={0.1}
                maxZoom={1.5}
                attributionPosition="bottom-right"
                nodeTypes={nodeTypes}
                proOptions={{ hideAttribution: true }}
            >
                <Background color="#94a3b8" gap={20} size={1} variant={BackgroundVariant.Dots} className="opacity-40" />
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

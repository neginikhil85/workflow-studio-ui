import React from 'react';
import { mergeStyles } from '../../utils/styleUtils';
import { SidebarItem as SidebarItemType } from './sidebar.config';

interface DraggableNodeItemProps {
    item: SidebarItemType;
}

export const DraggableNodeItem: React.FC<DraggableNodeItemProps> = ({ item }) => {
    const handleDragStart = (event: React.DragEvent) => {
        event.dataTransfer.setData('application/reactflow', item.nodeType);
        event.dataTransfer.setData('nodeLabel', item.label);
        event.dataTransfer.effectAllowed = 'move';
    };

    const IconComponent = item.icon;

    return (
        <div
            className={mergeStyles(
                "flex items-center gap-3 px-3 py-2 mx-2 rounded-md cursor-grab transition-all duration-200 group select-none relative",
                "hover:bg-slate-100 hover:text-slate-900 text-slate-600"
            )}
            onDragStart={handleDragStart}
            draggable
        >
            <div className={mergeStyles("transition-colors", item.color || "text-slate-400 group-hover:text-primary-600")}>
                <IconComponent size={16} />
            </div>
            <span className="text-sm font-medium">{item.label}</span>
            <div className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
            </div>
        </div>
    );
};

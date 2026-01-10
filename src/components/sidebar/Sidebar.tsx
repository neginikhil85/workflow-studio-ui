import React, { useState } from 'react';
import { SIDEBAR_SECTIONS, SidebarItem as SidebarItemType } from './sidebar.config';
import { SidebarBranding } from './SidebarBranding';
import { SidebarSearch } from './SidebarSearch';
import { SidebarProfile } from './SidebarProfile';
import { DraggableNodeItem } from './DraggableNodeItem';

interface NodeCategorySectionProps {
    title: string;
    children: React.ReactNode;
}

const NodeCategorySection: React.FC<NodeCategorySectionProps> = ({ title, children }) => (
    <div className="mb-6">
        <h3 className="px-5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            {title}
        </h3>
        <div className="space-y-0.5">
            {children}
        </div>
    </div>
);

const Sidebar: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const isItemVisible = (label: string): boolean => {
        if (!searchQuery) return true;
        return label.toLowerCase().includes(searchQuery.toLowerCase());
    };

    const isSectionVisible = (items: SidebarItemType[]): boolean => {
        if (!searchQuery) return true;
        return items.some(item => isItemVisible(item.label));
    };

    return (
        <aside className="w-64 bg-slate-100 border-r border-slate-200 flex flex-col z-10 h-full shadow-subtle text-slate-900">
            <SidebarBranding />

            <SidebarSearch value={searchQuery} onChange={setSearchQuery} />

            <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
                {SIDEBAR_SECTIONS.map((section) => (
                    isSectionVisible(section.items) && (
                        <NodeCategorySection key={section.category} title={section.title}>
                            {section.items.map((item) => (
                                isItemVisible(item.label) && (
                                    <DraggableNodeItem key={item.nodeType} item={item} />
                                )
                            ))}
                        </NodeCategorySection>
                    )
                ))}
            </div>

            <SidebarProfile />
        </aside>
    );
};

export default Sidebar;

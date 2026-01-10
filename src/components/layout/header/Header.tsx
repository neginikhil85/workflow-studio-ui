import React from 'react';
import { HeaderState, HeaderExecution, HeaderPersistence } from '../../../types/workflow.interfaces';
import { HeaderTitle } from './HeaderTitle';
import { HeaderActions } from './HeaderActions';

interface HeaderProps {
    state: HeaderState;
    execution: HeaderExecution;
    persistence: HeaderPersistence;
    onWorkflows: () => void;
    onHistory: () => void;
}

const Header: React.FC<HeaderProps> = ({ state, execution, persistence, onWorkflows, onHistory }) => {
    return (
        <div className="h-14 bg-slate-100 border-b border-slate-200 flex items-center px-4 justify-between z-20 relative">
            <HeaderTitle state={state} />
            <HeaderActions
                execution={execution}
                persistence={persistence}
                onWorkflows={onWorkflows}
                onHistory={onHistory}
            />
        </div>
    );
};

export default Header;

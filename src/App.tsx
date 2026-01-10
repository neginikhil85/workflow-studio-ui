import React from 'react';
import { ReactFlowProvider } from 'reactflow';
import WorkflowLayout from './components/layout/WorkflowLayout';
import { ServiceProvider } from './contexts/ServiceContext';

import './index.css';

const App: React.FC = () => {

    return (
        <ServiceProvider>
            <ReactFlowProvider>
                <WorkflowLayout />
            </ReactFlowProvider>
        </ServiceProvider>
    );
};

export default App;

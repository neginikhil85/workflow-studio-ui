import React from 'react';
import { ReactFlowProvider } from 'reactflow';
import { BrowserRouter } from 'react-router-dom';
import { ServiceProvider } from './contexts/ServiceContext';
import { AuthProvider } from './contexts/AuthContext';
import { AppRoutes } from './AppRoutes';

import './index.css';

const App: React.FC = () => {
    return (
        <ServiceProvider>
            <AuthProvider>
                <ReactFlowProvider>
                    <BrowserRouter>
                        <AppRoutes />
                    </BrowserRouter>
                </ReactFlowProvider>
            </AuthProvider>
        </ServiceProvider>
    );
};

export default App;

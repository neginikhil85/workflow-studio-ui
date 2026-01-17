import React from 'react';
import { ReactFlowProvider } from 'reactflow';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WorkflowLayout from './components/layout/WorkflowLayout';
import { ServiceProvider } from './contexts/ServiceContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import AuthCallbackPage from './pages/AuthCallbackPage';

import './index.css';

const App: React.FC = () => {
    return (
        <ServiceProvider>
            <AuthProvider>
                <ReactFlowProvider>
                    <BrowserRouter>
                        <Routes>
                            {/* Public routes */}
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/auth/callback" element={<AuthCallbackPage />} />

                            {/* Protected routes */}
                            <Route path="/*" element={
                                <ProtectedRoute>
                                    <WorkflowLayout />
                                </ProtectedRoute>
                            } />
                        </Routes>
                    </BrowserRouter>
                </ReactFlowProvider>
            </AuthProvider>
        </ServiceProvider>
    );
};

export default App;

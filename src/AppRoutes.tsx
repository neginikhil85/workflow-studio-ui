import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import ProtectedRoute from './components/ProtectedRoute';
import WorkflowLayout from './components/layout/WorkflowLayout';

import { ROUTES } from './config/routes.config';

export const AppRoutes: React.FC = () => {
    return (
        <Routes>
            {/* Public routes */}
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.AUTH_CALLBACK} element={<AuthCallbackPage />} />

            {/* Protected routes */}
            <Route path="/*" element={
                <ProtectedRoute>
                    <WorkflowLayout />
                </ProtectedRoute>
            } />
        </Routes>
    );
};

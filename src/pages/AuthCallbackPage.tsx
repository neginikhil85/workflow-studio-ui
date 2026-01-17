import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../services/auth.service';

const AuthCallbackPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [error, setError] = useState(false);

    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            authService.setToken(token);
            navigate('/');
        } else {
            setError(true);
            setTimeout(() => navigate('/login'), 2000);
        }
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-white to-slate-50">
            <div className="text-center">
                {error ? (
                    <>
                        <div className="text-red-500 text-5xl mb-4">✕</div>
                        <div className="text-slate-600 text-lg">Authentication failed</div>
                        <div className="text-slate-400 text-sm mt-2">Redirecting to login...</div>
                    </>
                ) : (
                    <>
                        {/* Animated loader */}
                        <div className="relative w-16 h-16 mx-auto mb-6">
                            <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-slate-800 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <div className="text-slate-600 text-lg font-medium">Signing you in...</div>
                        <div className="text-slate-400 text-sm mt-2">Please wait</div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AuthCallbackPage;

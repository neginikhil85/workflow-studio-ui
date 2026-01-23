import React from 'react';
import { Link } from 'react-router-dom';
import AuthHeader from '../components/auth/AuthHeader';
import LoginForm from '../components/auth/LoginForm';
import OAuthButtons from '../components/auth/OAuthButtons';

const LoginPage: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/auth-bg.png"
                    alt="Background"
                    className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px]"></div>
            </div>

            {/* Login Card - Glassmorphism */}
            <div className="relative z-10 w-full max-w-sm mx-4">
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/20 ring-1 ring-slate-900/5 p-6">

                    <AuthHeader />

                    <LoginForm />

                    {/* Divider */}
                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="px-4 bg-white text-slate-500">Or continue with</span>
                        </div>
                    </div>

                    <OAuthButtons />

                    <div className="mt-6 pt-4 border-t border-slate-100">
                        <p className="text-center text-slate-500 text-xs">
                            Don't have an account? {' '}
                            <Link to="/signup" className="text-slate-900 font-semibold hover:text-blue-600 transition-colors">
                                Create account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

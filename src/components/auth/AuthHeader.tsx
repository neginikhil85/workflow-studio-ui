import React from 'react';

interface AuthHeaderProps {
    title?: string;
    subtitle?: string;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({
    title = "Workflow Studio",
    subtitle = "Build powerful workflows visually"
}) => {
    return (
        <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-xl mb-3 shadow-lg p-2.5">
                <img src="/logo.svg" alt="Workflow Studio" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">{title}</h1>
            <p className="text-slate-500 mt-1 text-sm">{subtitle}</p>
        </div>
    );
};

export default AuthHeader;

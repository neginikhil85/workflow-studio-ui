import React, { useState } from 'react';
import { ChevronDown, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const SidebarProfile: React.FC = () => {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    if (!user) return null;

    // Get initials from name
    const initials = user.name
        ? user.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
        : 'U';

    return (
        <div className="p-3 border-t border-slate-200 relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2.5 w-full p-1.5 hover:bg-slate-200/50 rounded-lg transition-colors text-left group"
            >
                <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600 border border-indigo-200">
                    {initials}
                </div>
                <div className="flex-1 overflow-hidden">
                    <p className="text-xs font-semibold text-slate-700 truncate">{user.name || 'User'}</p>
                    <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                </div>
                <ChevronDown size={14} className={`text-slate-400 group-hover:text-slate-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute bottom-full left-3 right-3 mb-2 bg-white rounded-xl shadow-lg shadow-slate-200/50 border border-slate-100 py-1 z-20 animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-3 py-2 border-b border-slate-100">
                            <p className="text-xs font-medium text-slate-900">Signed in as</p>
                            <p className="text-xs text-slate-500 truncate">{user.email}</p>
                        </div>

                        <button className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 transition-colors">
                            <UserIcon size={14} />
                            Profile
                        </button>

                        <button
                            onClick={() => {
                                logout();
                                setIsOpen(false);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors"
                        >
                            <LogOut size={14} />
                            Sign out
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/workflow.interfaces';
import { authService } from '../services/auth.service';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            if (authService.isLoggedIn()) {
                try {
                    const currentUser = await authService.getCurrentUser();
                    setUser(currentUser);
                } catch (error) {
                    authService.removeToken();
                }
            }
            setLoading(false);
        };

        loadUser();
    }, []);

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            isAuthenticated: !!user,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};

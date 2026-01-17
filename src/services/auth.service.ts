import axios from 'axios';
import { User } from '../types/workflow.interfaces';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Store token in localStorage
const TOKEN_KEY = 'workflow_studio_token';

export const authService = {
    // Get stored token
    getToken: () => localStorage.getItem(TOKEN_KEY),

    // Store token after OAuth callback
    setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),

    // Remove token on logout
    removeToken: () => localStorage.removeItem(TOKEN_KEY),

    // Check if user is logged in
    isLoggedIn: () => !!localStorage.getItem(TOKEN_KEY),

    // Get current user from token
    getCurrentUser: async (): Promise<User> => {
        const token = localStorage.getItem(TOKEN_KEY);
        const response = await axios.get(`${API_BASE}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.data;
    },

    // Validate token
    validateToken: async (token: string) => {
        const response = await axios.post(`${API_BASE}/auth/validate`, { token });
        return response.data.data;
    },

    // Refresh token
    refreshToken: async (): Promise<string> => {
        const token = localStorage.getItem(TOKEN_KEY);
        const response = await axios.post(`${API_BASE}/auth/refresh`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const newToken = response.data.data.token;
        localStorage.setItem(TOKEN_KEY, newToken);
        return newToken;
    },

    // OAuth login URLs
    getGoogleLoginUrl: () => `${API_BASE}/oauth2/authorization/google`,
    getGithubLoginUrl: () => `${API_BASE}/oauth2/authorization/github`,

    // Logout
    logout: () => {
        localStorage.removeItem(TOKEN_KEY);
        window.location.href = '/login';
    }
};

// Add auth header to all axios requests
axios.interceptors.request.use((config) => {
    const token = authService.getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

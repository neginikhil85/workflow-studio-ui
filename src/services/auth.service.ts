import axios from 'axios';
import { User } from '../types/workflow.interfaces';
import { API_CONFIG } from '../config/api.config';
import { ROUTES } from '../config/routes.config';

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
        const response = await axios.get(API_CONFIG.AUTH.ME, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.data;
    },

    // Validate token
    validateToken: async (token: string) => {
        const response = await axios.post(API_CONFIG.AUTH.VALIDATE, { token });
        return response.data.data;
    },

    // Refresh token
    refreshToken: async (): Promise<string> => {
        const token = localStorage.getItem(TOKEN_KEY);
        const response = await axios.post(API_CONFIG.AUTH.REFRESH, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const newToken = response.data.data.token;
        localStorage.setItem(TOKEN_KEY, newToken);
        return newToken;
    },

    // OAuth login URLs
    getGoogleLoginUrl: () => API_CONFIG.AUTH.LOGIN.GOOGLE,
    getGithubLoginUrl: () => API_CONFIG.AUTH.LOGIN.GITHUB,

    // Logout
    logout: () => {
        localStorage.removeItem(TOKEN_KEY);
        window.location.href = ROUTES.LOGIN;
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

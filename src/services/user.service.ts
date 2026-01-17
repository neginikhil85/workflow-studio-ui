import axios from 'axios';
import { User, Workflow } from '../types/workflow.interfaces';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const userApi = {
    getAll: () =>
        axios.get<{ data: User[] }>(`${API_BASE}/api/users`),

    getById: (id: string) =>
        axios.get<{ data: User }>(`${API_BASE}/api/users/${id}`),

    getByEmail: (email: string) =>
        axios.get<{ data: User }>(`${API_BASE}/api/users/email/${email}`),

    getWorkflows: (userId: string) =>
        axios.get<{ data: Workflow[] }>(`${API_BASE}/api/users/${userId}/workflows`),

    delete: (id: string) =>
        axios.delete(`${API_BASE}/api/users/${id}`),
};

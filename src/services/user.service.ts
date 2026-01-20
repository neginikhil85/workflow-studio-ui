import axios from 'axios';
import { User, Workflow } from '../types/workflow.interfaces';
import { API_CONFIG } from '../config/api.config';

export const userApi = {
    getAll: () =>
        axios.get<{ data: User[] }>(API_CONFIG.USERS.GET_ALL),

    getById: (id: string) =>
        axios.get<{ data: User }>(API_CONFIG.USERS.GET_BY_ID(id)),

    getByEmail: (email: string) =>
        axios.get<{ data: User }>(API_CONFIG.USERS.GET_BY_EMAIL(email)),

    getWorkflows: (userId: string) =>
        axios.get<{ data: Workflow[] }>(API_CONFIG.USERS.GET_WORKFLOWS(userId)),

    delete: (id: string) =>
        axios.delete(API_CONFIG.USERS.DELETE(id)),
};

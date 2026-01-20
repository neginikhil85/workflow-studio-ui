export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
export const API_PREFIX = '/api/v1';

const api = (path: string) => `${API_BASE_URL}${API_PREFIX}${path}`;

export const API_CONFIG = {
    BASE_URL: API_BASE_URL,
    AUTH: {
        ME: api('/auth/me'),
        VALIDATE: api('/auth/validate'),
        REFRESH: api('/auth/refresh'),
        LOGIN: {
            GOOGLE: `${API_BASE_URL}/oauth2/authorization/google`,
            GITHUB: `${API_BASE_URL}/oauth2/authorization/github`
        }
    },
    USERS: {
        GET_ALL: api('/users'),
        GET_BY_ID: (id: string) => api(`/users/${id}`),
        GET_BY_EMAIL: (email: string) => api(`/users/email/${email}`),
        GET_WORKFLOWS: (userId: string) => api(`/users/${userId}/workflows`),
        DELETE: (id: string) => api(`/users/${id}`)
    },
    WORKFLOWS: {
        BASE: api('/workflows'),
        GET_BY_ID: (id: string) => api(`/workflows/${id}`),
        DELETE: (id: string) => api(`/workflows/${id}`),
        EXECUTE: (id: string) => api(`/workflows/${id}/execute`),
        STOP: (id: string) => api(`/workflows/${id}/stop`),
        STATUS: (id: string) => api(`/workflows/${id}/status`),
        RUNS: (id: string) => api(`/workflows/${id}/runs`),
        RUN_EXECUTIONS: (runId: string) => api(`/workflows/runs/${runId}/executions`),
        nodeExecutionResults: (runId: string) => api(`/workflows/runs/${runId}/nodes`)
    },
    KAFKA: {
        TEST_CONNECTION: api('/kafka/test-connection'),
        TOPICS: api('/kafka/topics'),
        CREATE_TOPIC: api('/kafka/topics/create')
    }
};

export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    AUTH_CALLBACK: '/auth/callback',
    DASHBOARD: '/dashboard',
    WORKFLOWS: '/workflows',
    WORKFLOW_EDITOR: (id: string) => `/workflows/${id}`,
};

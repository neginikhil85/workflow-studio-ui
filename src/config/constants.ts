export const WORKFLOW_STATUS = {
    COMPLETED: 'COMPLETED',
    FAILED: 'FAILED',
    ACTIVE: 'ACTIVE',
    STOPPED: 'STOPPED',
    CANCELLED: 'CANCELLED',
    RUNNING: 'RUNNING',
    IDLE: 'IDLE'
} as const;

export const HTTP_METHODS = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE'
} as const;

export const NODE_STATUS = {
    SUCCESS: 'SUCCESS',
    FAILURE: 'FAILURE',
    PENDING: 'PENDING'
} as const;

export const TIME_MS = {
    SECOND: 1000,
    MINUTE: 60000
} as const;

export const STATUS_COLORS = {
    [WORKFLOW_STATUS.COMPLETED]: 'text-emerald-500',
    [WORKFLOW_STATUS.FAILED]: 'text-red-500',
    [WORKFLOW_STATUS.ACTIVE]: 'text-blue-500 animate-pulse',
    [WORKFLOW_STATUS.STOPPED]: 'text-slate-400',
    [WORKFLOW_STATUS.CANCELLED]: 'text-slate-400',
    DEFAULT: 'text-slate-400'
};

export const METHOD_COLORS = {
    [HTTP_METHODS.GET]: 'bg-blue-100 text-blue-700',
    [HTTP_METHODS.POST]: 'bg-green-100 text-green-700',
    [HTTP_METHODS.PUT]: 'bg-orange-100 text-orange-700',
    [HTTP_METHODS.DELETE]: 'bg-red-100 text-red-700',
    DEFAULT: 'bg-slate-100 text-slate-600'
};

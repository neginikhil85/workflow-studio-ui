import React, { createContext, useContext, ReactNode, useState } from 'react';
import { IWorkflowService } from '../services/IWorkflowService';
import { HttpWorkflowService } from '../services/HttpWorkflowService';

import { IEnvironmentService } from '../services/IEnvironmentService';
import { HttpEnvironmentService } from '../services/HttpEnvironmentService';

interface IServiceProvider {
    workflowService: IWorkflowService;
    environmentService: IEnvironmentService;
}

const ServiceContext = createContext<IServiceProvider | null>(null);

export const ServiceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {


    // For now, strict production implementation
    const [workflowService] = useState(() => new HttpWorkflowService());
    const [environmentService] = useState(() => new HttpEnvironmentService());

    return (
        <ServiceContext.Provider value={{ workflowService, environmentService }}>
            {children}
        </ServiceContext.Provider>
    );
};

export const useServices = () => {
    const context = useContext(ServiceContext);
    if (!context) {
        throw new Error("useServices must be used within a ServiceProvider");
    }
    return context;
};

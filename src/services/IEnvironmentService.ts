export interface EnvironmentVariable {
    id: string; // Key
    value: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface IEnvironmentService {
    getAllVariables(): Promise<EnvironmentVariable[]>;
    saveVariable(variable: EnvironmentVariable): Promise<EnvironmentVariable>;
    deleteVariable(id: string): Promise<void>;
}

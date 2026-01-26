import axios from 'axios';
import { EnvironmentVariable, IEnvironmentService } from './IEnvironmentService';

const API_BASE_URL = 'http://localhost:8080/api/v1/env';

export class HttpEnvironmentService implements IEnvironmentService {

    private cache: EnvironmentVariable[] | null = null;
    private lastFetchTime: number = 0;
    private CACHE_TTL = 30000; // 30 seconds

    async getAllVariables(): Promise<EnvironmentVariable[]> {
        const now = Date.now();
        if (this.cache && (now - this.lastFetchTime < this.CACHE_TTL)) {
            return this.cache;
        }

        const response = await axios.get<EnvironmentVariable[]>(API_BASE_URL);
        this.cache = response.data;
        this.lastFetchTime = now;
        return response.data;
    }

    async saveVariable(variable: EnvironmentVariable): Promise<EnvironmentVariable> {
        const response = await axios.post<EnvironmentVariable>(API_BASE_URL, variable);
        this.cache = null; // Invalidate cache
        return response.data;
    }

    async deleteVariable(id: string): Promise<void> {
        await axios.delete(`${API_BASE_URL}/${id}`);
        this.cache = null; // Invalidate cache
    }
}

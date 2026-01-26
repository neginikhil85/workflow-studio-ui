import axios from 'axios';
import { ActiveMQNodeConfig } from '../types/workflow.interfaces';
import { ApiResponse } from '../types/api.interfaces';
import { API_CONFIG } from '../config/api.config';

export class ActiveMQService {

    async testConnection(config: ActiveMQNodeConfig): Promise<{ success: boolean; message?: string }> {
        try {
            const response = await axios.post<ApiResponse<void>>(API_CONFIG.ACTIVEMQ.TEST_CONNECTION, config);
            if (response.data.success) {
                return { success: true };
            }
            return { success: false, message: response.data.message || 'Connection failed' };
        } catch (e: any) {
            console.error('Failed to test ActiveMQ connection', e);
            return { success: false, message: e.response?.data?.message || e.message || 'Connection failed' };
        }
    }

    async getDestinations(config: ActiveMQNodeConfig): Promise<string[]> {
        try {
            const response = await axios.post<ApiResponse<string[]>>(API_CONFIG.ACTIVEMQ.DESTINATIONS, config);
            if (response.data.success) {
                return response.data.data || [];
            }
            throw new Error(response.data.message || 'Failed to fetch destinations');
        } catch (e: any) {
            console.error('Failed to fetch destinations', e);
            // Default to empty array instead of throwing to avoid breaking UI if backend is down
            return [];
        }
    }

    async createDestination(config: ActiveMQNodeConfig, name: string, type: 'QUEUE' | 'TOPIC'): Promise<void> {
        try {
            const payload = { ...config, newDestination: name, newDestinationType: type };
            const response = await axios.put<ApiResponse<void>>(API_CONFIG.ACTIVEMQ.CREATE_DESTINATION, payload);

            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to create destination');
            }
        } catch (e: any) {
            console.error('Failed to create destination', e);
            throw new Error(e.response?.data?.message || e.message || 'Failed to create destination');
        }
    }
}

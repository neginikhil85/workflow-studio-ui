import axios from 'axios';
import { ApiResponse } from '../types/api.interfaces';
import { API_CONFIG } from '../config/api.config';

export interface KafkaClusterInfo {
    clusterId: string;
    brokers: string[];
}

export interface KafkaConnectionConfig {
    bootstrapServers: string;
    securityProtocol: string;
    sslTruststoreLocation?: string;
    sslTruststorePassword?: string;
    sslKeystoreLocation?: string;
    sslKeystorePassword?: string;
    saslMechanism?: string;
    saslJaasConfig?: string;
}

export interface CreateTopicRequest extends KafkaConnectionConfig {
    topicName: string;
    partitions: number;
    replicationFactor: number;
}

export class KafkaService {

    async testConnection(config: KafkaConnectionConfig): Promise<KafkaClusterInfo> {
        try {
            const response = await axios.post<ApiResponse<KafkaClusterInfo>>(API_CONFIG.KAFKA.TEST_CONNECTION, config);
            if (response.data.success && response.data.data) {
                return response.data.data;
            }
            throw new Error(response.data.message || 'Connection failed');
        } catch (e: any) {
            console.error('Failed to test Kafka connection', e);
            throw new Error(e.response?.data?.message || e.message || 'Connection failed');
        }
    }

    async getTopics(config: KafkaConnectionConfig): Promise<string[]> {
        try {
            const response = await axios.post<ApiResponse<string[]>>(API_CONFIG.KAFKA.TOPICS, config);
            if (response.data.success) {
                return response.data.data || [];
            }
            throw new Error(response.data.message || 'Failed to list topics');
        } catch (e: any) {
            console.error('Failed to load topics', e);
            throw new Error(e.response?.data?.message || e.message || 'Failed to load topics');
        }
    }

    async createTopic(request: CreateTopicRequest): Promise<void> {
        try {
            const response = await axios.post<ApiResponse<void>>(API_CONFIG.KAFKA.CREATE_TOPIC, request);
            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to create topic');
            }
        } catch (e: any) {
            console.error('Failed to create topic', e);
            throw new Error(e.response?.data?.message || e.message || 'Failed to create topic');
        }
    }
}

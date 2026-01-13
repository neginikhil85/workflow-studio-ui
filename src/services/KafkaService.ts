import axios from 'axios';
import { env } from '../config/env';
import { ApiResponse } from '../types/api.interfaces';

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
    private readonly baseUrl: string;

    constructor(baseUrl: string = env.API_BASE_URL) {
        this.baseUrl = baseUrl;
    }

    async testConnection(config: KafkaConnectionConfig): Promise<KafkaClusterInfo> {
        try {
            const response = await axios.post<ApiResponse<KafkaClusterInfo>>(`${this.baseUrl}/kafka/test-connection`, config);
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
            const response = await axios.post<ApiResponse<string[]>>(`${this.baseUrl}/kafka/topics`, config);
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
            const response = await axios.post<ApiResponse<void>>(`${this.baseUrl}/kafka/topics/create`, request);
            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to create topic');
            }
        } catch (e: any) {
            console.error('Failed to create topic', e);
            throw new Error(e.response?.data?.message || e.message || 'Failed to create topic');
        }
    }
}

import { apiClient } from './api';

export interface Stream {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStreamRequest {
  name: string;
  description?: string;
}

export interface UpdateStreamRequest {
  name?: string;
  description?: string;
}

export class StreamService {
  async getStreams(): Promise<Stream[]> {
    try {
      console.log('Fetching streams from API...');
      const response = await apiClient.get<Stream[]>('/packages/streams');
      console.log('API response type:', typeof response);
      console.log('API response is array:', Array.isArray(response));
      console.log('API response length:', response?.length);
      return response || [];
    } catch (error) {
      console.warn('Backend not available, using mock data for streams');
      // Return mock data when backend is not available
      const mockData = [
        {
          id: 'stream_1234567890_abcdef',
          name: 'Science Stream',
          description: 'Stream for science students',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'stream_1234567891_ghijkl',
          name: 'Commerce Stream',
          description: 'Stream for commerce students',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'stream_1234567892_mnopqr',
          name: 'Arts Stream',
          description: 'Stream for arts students',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      console.log('Returning mock data:', mockData);
      return mockData;
    }
  }

  async getStreamById(id: string): Promise<Stream> {
    const response = await apiClient.get<{success: boolean, data: Stream}>(`/packages/streams/${id}`);
    return response.data;
  }

  async createStream(data: CreateStreamRequest): Promise<Stream> {
    const response = await apiClient.post<{success: boolean, data: Stream}>('/packages/streams', data as unknown as Record<string, unknown>);
    return response.data;
  }

  async updateStream(id: string, data: UpdateStreamRequest): Promise<Stream> {
    const response = await apiClient.put<{success: boolean, data: Stream}>(`/packages/streams/${id}`, data as unknown as Record<string, unknown>);
    return response.data;
  }

  async deleteStream(id: string): Promise<void> {
    await apiClient.delete(`/packages/streams/${id}`);
  }
}

export const streamService = new StreamService();

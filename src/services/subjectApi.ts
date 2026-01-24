import { apiClient } from './api';

export interface Subject {
  id: string;
  name: string;
  description?: string;
  stream_id?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubjectRequest {
  name: string;
  description?: string;
  stream_id?: string;
}

export interface UpdateSubjectRequest {
  name?: string;
  description?: string;
  stream_id?: string;
}

export class SubjectService {
  async getSubjects(streamId?: string): Promise<Subject[]> {
    try {
      const endpoint = streamId ? `/packages/subjects?stream_id=${streamId}` : '/packages/subjects';
      console.log('Fetching subjects from API:', endpoint);
      const response = await apiClient.get<Subject[]>(endpoint);
      console.log('API response type:', typeof response);
      console.log('API response is array:', Array.isArray(response));
      console.log('API response length:', response?.length);
      return response || [];
    } catch (error) {
      console.warn('Backend not available, using mock data for subjects');
      // Return mock data when backend is not available
      const mockSubjects: Subject[] = [
        {
          id: 'subject_1234567890_abcdef',
          name: 'Physics',
          description: 'Physics subject for science students',
          stream_id: 'stream_1234567890_abcdef',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'subject_1234567891_ghijkl',
          name: 'Chemistry',
          description: 'Chemistry subject for science students',
          stream_id: 'stream_1234567890_abcdef',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'subject_1234567892_mnopqr',
          name: 'Mathematics',
          description: 'Mathematics subject for all streams',
          stream_id: 'stream_1234567890_abcdef',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'subject_1234567893_stuvwx',
          name: 'Accountancy',
          description: 'Accountancy subject for commerce students',
          stream_id: 'stream_1234567891_ghijkl',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'subject_1234567894_yzabcd',
          name: 'Business Studies',
          description: 'Business Studies subject for commerce students',
          stream_id: 'stream_1234567891_ghijkl',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'subject_1234567895_efghij',
          name: 'History',
          description: 'History subject for arts students',
          stream_id: 'stream_1234567892_mnopqr',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      if (streamId) {
        const filtered = mockSubjects.filter(subject => subject.stream_id === streamId);
        console.log('Returning filtered mock data:', filtered);
        return filtered;
      }
      console.log('Returning all mock data:', mockSubjects);
      return mockSubjects;
    }
  }

  async getSubjectById(id: string): Promise<Subject> {
    const response = await apiClient.get<{success: boolean, data: Subject}>(`/packages/subjects/${id}`);
    return response.data;
  }

  async createSubject(data: CreateSubjectRequest): Promise<Subject> {
    const response = await apiClient.post<{success: boolean, data: Subject}>('/packages/subjects', data as unknown as Record<string, unknown>);
    return response.data;
  }

  async updateSubject(id: string, data: UpdateSubjectRequest): Promise<Subject> {
    const response = await apiClient.put<{success: boolean, data: Subject}>(`/packages/subjects/${id}`, data as unknown as Record<string, unknown>);
    return response.data;
  }

  async deleteSubject(id: string): Promise<void> {
    await apiClient.delete(`/packages/subjects/${id}`);
  }
}

export const subjectService = new SubjectService();

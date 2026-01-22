import { apiClient } from './api';
import { mockClasses, mockStreams, mockSubjects, mockPackages } from './mockData';

export interface Package {
  id: number;
  package_name: string;
  package_type: 'class' | 'subject' | 'stream' | 'test_series' | 'chapter';
  description: string;
  price: number;
  duration_months: number;
  is_active: boolean;
  class_id?: number;
  stream_id?: number;
  subject_id?: number;
  chapter_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Class {
  id: number;
  name: string;
  is_active: boolean;
}

export interface Stream {
  id: number;
  name: string;
  class_id: number;
  is_active: boolean;
}

export interface Subject {
  id: number;
  name: string;
  stream_id: number;
  is_active: boolean;
}

export interface PackageFilters {
  package_type?: string;
  class_id?: number;
  stream_id?: number;
  subject_id?: number;
  is_active?: boolean;
  min_price?: number;
  max_price?: number;
}

export interface CreatePackageRequest {
  package_name: string;
  package_type: 'class' | 'subject' | 'stream' | 'test_series' | 'chapter';
  description: string;
  price: number;
  duration_months: number;
  class_id?: number;
  stream_id?: number;
  subject_id?: number;
  chapter_id?: number;
}

export interface UpdatePackageRequest {
  package_name?: string;
  description?: string;
  price?: number;
  duration_months?: number;
  is_active?: boolean;
}

export class PackageService {
  async getPackages(filters?: PackageFilters): Promise<Package[]> {
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString());
          }
        });
      }
      
      const endpoint = params.toString() ? `/packages?${params.toString()}` : '/packages';
      console.log('Calling API endpoint:', endpoint);
      const data = await apiClient.get<Package[]>(endpoint);
      console.log('Raw API response:', data);
      console.log('Is array?', Array.isArray(data));
      console.log('Data length:', Array.isArray(data) ? data.length : 'Not an array');
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.warn('Backend not available, using mock data for packages');
      // Return mock data when backend is not available
      let filteredPackages = mockPackages;
      
      if (filters) {
        filteredPackages = mockPackages.filter(pkg => {
          if (filters.package_type && pkg.package_type !== filters.package_type) return false;
          if (filters.class_id && pkg.class_id !== filters.class_id) return false;
          if (filters.stream_id && pkg.stream_id !== filters.stream_id) return false;
          if (filters.subject_id && pkg.subject_id !== filters.subject_id) return false;
          if (filters.is_active !== undefined && pkg.is_active !== filters.is_active) return false;
          if (filters.min_price && pkg.price < filters.min_price) return false;
          if (filters.max_price && pkg.price > filters.max_price) return false;
          return true;
        });
      }
      
      console.log('Returning mock packages:', filteredPackages);
      return filteredPackages;
    }
  }

  async getPackageById(id: number): Promise<Package> {
    try {
      const data = await apiClient.get<Package>(`/packages/${id}`);
      return data;
    } catch (error) {
      console.warn('Backend not available, using mock data for package');
      const pkg = mockPackages.find(p => p.id === id);
      if (!pkg) throw new Error('Package not found');
      return pkg;
    }
  }

  async createPackage(data: CreatePackageRequest): Promise<Package> {
    try {
      return await apiClient.post<Package>('/packages', data);
    } catch (error) {
      console.warn('Backend not available, simulating package creation');
      // Simulate package creation with mock data
      const newPackage: Package = {
        id: Math.max(...mockPackages.map(p => p.id)) + 1,
        ...data,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      mockPackages.push(newPackage);
      return newPackage;
    }
  }

  async updatePackage(id: number, data: UpdatePackageRequest): Promise<Package> {
    try {
      return await apiClient.put<Package>(`/packages/${id}`, data);
    } catch (error) {
      console.warn('Backend not available, simulating package update');
      const packageIndex = mockPackages.findIndex(p => p.id === id);
      if (packageIndex === -1) throw new Error('Package not found');
      
      mockPackages[packageIndex] = {
        ...mockPackages[packageIndex],
        ...data,
        updated_at: new Date().toISOString(),
      };
      return mockPackages[packageIndex];
    }
  }

  async deletePackage(id: number): Promise<void> {
    try {
      return await apiClient.delete<void>(`/packages/${id}`);
    } catch (error) {
      console.warn('Backend not available, simulating package deletion');
      const packageIndex = mockPackages.findIndex(p => p.id === id);
      if (packageIndex === -1) throw new Error('Package not found');
      mockPackages.splice(packageIndex, 1);
    }
  }

  async getClasses(): Promise<Class[]> {
    try {
      const data = await apiClient.get<Class[]>('/packages/classes/list');
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.warn('Backend not available, using mock data for classes');
      return mockClasses;
    }
  }

  async getStreams(): Promise<Stream[]> {
    try {
      const data = await apiClient.get<Stream[]>('/packages/streams/list');
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.warn('Backend not available, using mock data for streams');
      return mockStreams;
    }
  }

  async getSubjects(streamId?: number): Promise<Subject[]> {
    try {
      const endpoint = streamId ? `/packages/subjects/list?stream_id=${streamId}` : '/packages/subjects/list';
      const data = await apiClient.get<Subject[]>(endpoint);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.warn('Backend not available, using mock data for subjects');
      if (streamId) {
        const numericStreamId = parseInt(streamId.toString());
        console.log('Filtering subjects for stream_id:', numericStreamId, typeof numericStreamId);
        const filteredSubjects = mockSubjects.filter(subject => subject.stream_id === numericStreamId);
        console.log('Filtered subjects:', filteredSubjects);
        return filteredSubjects;
      }
      return mockSubjects;
    }
  }

  async getStudentPackages(studentId: number): Promise<Package[]> {
    try {
      const data = await apiClient.get<Package[]>(`/packages/student/${studentId}/packages`);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.warn('Backend not available, using mock data for student packages');
      // Return first 2 packages as purchased packages for demo
      return mockPackages.slice(0, 2);
    }
  }

  async checkStudentAccess(studentId: number, packageId: number): Promise<{ has_access: boolean }> {
    try {
      return await apiClient.get<{ has_access: boolean }>(`/packages/student/${studentId}/access/${packageId}`);
    } catch (error) {
      console.warn('Backend not available, using mock data for student access');
      // Simulate access check - first 2 packages have access
      return { has_access: packageId <= 2 };
    }
  }
}

export const packageService = new PackageService();

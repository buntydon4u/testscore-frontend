import { apiClient } from './api';

export interface StudentProfile {
  firstName: string;
  middleName?: string;
  lastName: string;
  displayName?: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  nationality?: string;
  religion?: string;
  category?: 'GENERAL' | 'OBC' | 'SC' | 'ST';
  primaryPhone?: string;
  secondaryPhone?: string;
  emergencyPhone?: string;
  currentStage?: 'SCHOOL' | 'INTERMEDIATE' | 'UNDERGRADUATE' | 'POSTGRADUATE' | 'PROFESSIONAL';
  currentClass?: string;
  academicYear?: string;
  rollNumber?: string;
  admissionNumber?: string;
  boardType?: 'CBSE' | 'ICSE' | 'STATE_BOARD' | 'IGCSE' | 'IB';
  schoolName?: string;
  avatar?: string;
  coverImage?: string;
  bio?: string;
  interests?: string[];
  languages?: string[];
}

export interface Student {
  id: string;
  username: string;
  email: string;
  role: 'STUDENT';
  status: 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'DELETED';
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
  lastLoginAt?: string;
  passwordChangedAt?: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  deletedAt?: string;
  deletedBy?: string;
  isActive: boolean;
  profile?: StudentProfile;
}

export interface StudentListResponse {
  data: Student[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateStudentData extends Record<string, unknown> {
  username: string;
  email: string;
  password: string;
  profile?: StudentProfile;
  status?: 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

export interface UpdateStudentData extends Record<string, unknown> {
  username?: string;
  email?: string;
  profile?: StudentProfile;
  status?: 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  isActive?: boolean;
}

export interface StudentFilters {
  search?: string;
  status?: 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  isActive?: boolean;
  page?: number;
  limit?: number;
  sort?: string;
}

export const studentApi = {
  // Get all students with pagination and filters
  getStudents: async (filters: StudentFilters = {}): Promise<StudentListResponse> => {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.isActive !== undefined) params.append('isActive', filters.isActive.toString());
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.sort) params.append('sort', filters.sort);
    
    return apiClient.get(`/students?${params.toString()}`);
  },

  // Get student by ID
  getStudentById: async (id: string): Promise<Student> => {
    return apiClient.get(`/students/${id}`);
  },

  // Create new student
  createStudent: async (data: CreateStudentData): Promise<Student> => {
    return apiClient.post('/students', data);
  },

  // Update student
  updateStudent: async (id: string, data: UpdateStudentData): Promise<Student> => {
    return apiClient.put(`/students/${id}`, data);
  },

  // Delete student (soft delete)
  deleteStudent: async (id: string): Promise<{ message: string }> => {
    return apiClient.delete(`/students/${id}`);
  },
};

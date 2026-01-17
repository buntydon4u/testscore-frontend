import { apiClient } from './api';

export interface ExamBoard {
  id: string;
  name: string;
  code: string;
}

export interface ExamSeries {
  id: string;
  name: string;
  boardId: string;
  year: number;
  board?: ExamBoard;
}

export interface Class {
  id: string;
  name: string;
  level: number;
  boardId: string;
  board?: {
    id: string;
    name: string;
  };
  description?: string;
  isActive: boolean;
}

export interface AcademicBoard {
  id: string;
  name: string;
  shortName: string;
  country: string;
  website?: string;
  isActive: boolean;
}

export interface ExamBlueprint {
  id: string;
  name: string;
  description?: string;
  classId?: string;
  createdAt: string;
}

export interface Exam {
  id: string;
  title: string;
  description?: string;
  classId?: string;
  boardId?: string;
  seriesId?: string;
  examType: 'PRACTICE' | 'MOCK' | 'FULL_TEST' | 'PARTIAL_TEST' | 'DIAGNOSTIC';
  deliveryType: 'ONLINE' | 'OFFLINE';
  duration: number; // in minutes
  totalMarks: number;
  isNegativeMarking: boolean;
  negativeMarkingValue?: number;
  isPracticeMode: boolean;
  blueprintId?: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  deletedAt?: string;
  deletedBy?: string;
  
  // Relations
  class?: Class;
  board?: ExamBoard;
  series?: ExamSeries;
  blueprint?: ExamBlueprint;
}

export interface ExamListResponse {
  data: Exam[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateExamData extends Record<string, unknown> {
  title: string;
  description?: string;
  classId?: string;
  boardId?: string;
  seriesId?: string;
  examType: 'PRACTICE' | 'MOCK' | 'FULL_TEST' | 'PARTIAL_TEST' | 'DIAGNOSTIC';
  deliveryType: 'ONLINE' | 'OFFLINE';
  duration: number;
  totalMarks: number;
  isNegativeMarking: boolean;
  negativeMarkingValue?: number;
  isPracticeMode: boolean;
  blueprintId?: string;
}

export interface UpdateExamData extends Record<string, unknown> {
  title?: string;
  description?: string;
  classId?: string;
  boardId?: string;
  seriesId?: string;
  examType?: 'PRACTICE' | 'MOCK' | 'FULL_TEST' | 'PARTIAL_TEST' | 'DIAGNOSTIC';
  deliveryType?: 'ONLINE' | 'OFFLINE';
  duration?: number;
  totalMarks?: number;
  isNegativeMarking?: boolean;
  negativeMarkingValue?: number;
  isPracticeMode?: boolean;
  blueprintId?: string;
}

export interface ExamFilters {
  search?: string;
  examType?: string;
  deliveryType?: string;
  classId?: string;
  boardId?: string;
  seriesId?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

export const examApi = {
  // Get all exams with pagination and filters
  getExams: async (filters: ExamFilters = {}): Promise<ExamListResponse> => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.examType) params.append('examType', filters.examType);
    if (filters.deliveryType) params.append('deliveryType', filters.deliveryType);
    if (filters.classId) params.append('classId', filters.classId);
    if (filters.boardId) params.append('boardId', filters.boardId);
    if (filters.seriesId) params.append('seriesId', filters.seriesId);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.sort) params.append('sort', filters.sort);
    
    return apiClient.get(`/exams?${params.toString()}`);
  },

  // Get exam by ID
  getExamById: async (id: string): Promise<Exam> => {
    return apiClient.get(`/exams/${id}`);
  },

  // Create new exam
  createExam: async (data: CreateExamData): Promise<Exam> => {
    return apiClient.post('/exams', data);
  },

  // Update exam
  updateExam: async (id: string, data: UpdateExamData): Promise<Exam> => {
    return apiClient.put(`/exams/${id}`, data);
  },

  // Delete exam (soft delete)
  deleteExam: async (id: string): Promise<{ message: string }> => {
    return apiClient.delete(`/exams/${id}`);
  },

  // Get dropdown data
  getBoards: async (): Promise<ExamBoard[]> => {
    return apiClient.get('/exams/dropdown/boards');
  },

  getSeries: async (boardId?: string): Promise<ExamSeries[]> => {
    const params = boardId ? `?boardId=${boardId}` : '';
    return apiClient.get(`/exams/dropdown/series${params}`);
  },

  getClasses: async (): Promise<Class[]> => {
    return apiClient.get('/exams/dropdown/classes');
  },

  getBlueprints: async (classId?: string): Promise<ExamBlueprint[]> => {
    const params = classId ? `?classId=${classId}` : '';
    return apiClient.get(`/exams/dropdown/blueprints${params}`);
  },

  getAcademicBoards: async (): Promise<AcademicBoard[]> => {
    return apiClient.get('/exams/dropdown/academic-boards');
  },

  // Create master data
  createBoard: async (data: { name: string; code: string }): Promise<ExamBoard> => {
    return apiClient.post('/exams/dropdown/boards', data);
  },

  createSeries: async (data: { name: string; boardId: string; year: number }): Promise<ExamSeries> => {
    return apiClient.post('/exams/dropdown/series', data);
  },

  createClass: async (data: { name: string; level: number; boardId: string }): Promise<Class> => {
    return apiClient.post('/exams/dropdown/classes', data);
  },

  createBlueprint: async (data: { name: string; description?: string; classId: string }): Promise<ExamBlueprint> => {
    return apiClient.post('/exams/dropdown/blueprints', data);
  },

  createAcademicBoard: async (data: { name: string; shortName: string; country?: string; website?: string }): Promise<AcademicBoard> => {
    return apiClient.post('/exams/dropdown/academic-boards', data);
  },
};

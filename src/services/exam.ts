import { apiClient } from './api';
import {
  Exam,
  ExamSchedule,
  Enrollment,
  ExamListResponse,
  ExamSearchParams,
  CreateExamDto,
  UpdateExamDto,
  CreateScheduleDto,
  Board,
  Series,
  ExamClass,
  Blueprint,
  AcademicBoard,
} from '../types/exam';

class ExamService {
  private baseUrl = '/exams';

  // Exam CRUD
  async listExams(params?: ExamSearchParams): Promise<ExamListResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) {
      const searchValue = typeof params.search === 'string' 
        ? params.search 
        : JSON.stringify(params.search);
      queryParams.append('search', searchValue);
    }

    const url = `${this.baseUrl}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.get<ExamListResponse>(url);
  }

  async getExamById(id: string): Promise<Exam> {
    return apiClient.get<Exam>(`${this.baseUrl}/${id}`);
  }

  async createExam(data: CreateExamDto): Promise<Exam> {
    return apiClient.post<Exam>(this.baseUrl, data as unknown as Record<string, unknown>);
  }

  async updateExam(id: string, data: UpdateExamDto): Promise<Exam> {
    return apiClient.put<Exam>(`${this.baseUrl}/${id}`, data as unknown as Record<string, unknown>);
  }

  async deleteExam(id: string): Promise<void> {
    return apiClient.delete(`${this.baseUrl}/${id}`);
  }

  // Exam Schedules
  async listSchedules(examId: string): Promise<ExamSchedule[]> {
    return apiClient.get<ExamSchedule[]>(`${this.baseUrl}/${examId}/schedules`);
  }

  async createSchedule(examId: string, data: CreateScheduleDto): Promise<ExamSchedule> {
    return apiClient.post<ExamSchedule>(`${this.baseUrl}/${examId}/schedules`, data as unknown as Record<string, unknown>);
  }

  // Student Enrollment
  async enrollInSchedule(examId: string, scheduleId: string): Promise<Enrollment> {
    return apiClient.post<Enrollment>(`${this.baseUrl}/${examId}/schedules/${scheduleId}/enroll`, {});
  }

  async cancelEnrollment(examId: string, scheduleId: string): Promise<void> {
    return apiClient.delete(`${this.baseUrl}/${examId}/schedules/${scheduleId}/enroll`);
  }

  async getMyEnrollments(): Promise<Enrollment[]> {
    return apiClient.get<Enrollment[]>(`${this.baseUrl}/my/enrollments`);
  }

  async getScheduleEnrollments(examId: string, scheduleId: string): Promise<Enrollment[]> {
    return apiClient.get<Enrollment[]>(`${this.baseUrl}/${examId}/schedules/${scheduleId}/enrollments`);
  }

  // Dropdown APIs
  async getBoards(): Promise<Board[]> {
    return apiClient.get<Board[]>(`${this.baseUrl}/dropdown/boards`);
  }

  async getSeries(boardId?: string): Promise<Series[]> {
    const url = boardId 
      ? `${this.baseUrl}/dropdown/series?boardId=${boardId}`
      : `${this.baseUrl}/dropdown/series`;
    return apiClient.get<Series[]>(url);
  }

  async getClasses(): Promise<ExamClass[]> {
    return apiClient.get<ExamClass[]>(`${this.baseUrl}/dropdown/classes`);
  }

  async getBlueprints(classId?: string): Promise<Blueprint[]> {
    const url = classId 
      ? `${this.baseUrl}/dropdown/blueprints?classId=${classId}`
      : `${this.baseUrl}/dropdown/blueprints`;
    return apiClient.get<Blueprint[]>(url);
  }

  async getAcademicBoards(): Promise<AcademicBoard[]> {
    return apiClient.get<AcademicBoard[]>(`${this.baseUrl}/dropdown/academic-boards`);
  }

  // Create Master Data
  async createBoard(data: { name: string; code: string }): Promise<Board> {
    return apiClient.post<Board>(`${this.baseUrl}/dropdown/boards`, data);
  }

  async createSeries(data: { name: string; boardId: string; year: number }): Promise<Series> {
    return apiClient.post<Series>(`${this.baseUrl}/dropdown/series`, data);
  }

  async createClass(data: { name: string; level: number; boardId: string }): Promise<ExamClass> {
    return apiClient.post<ExamClass>(`${this.baseUrl}/dropdown/classes`, data);
  }

  async createBlueprint(data: { name: string; description: string; classId: string }): Promise<Blueprint> {
    return apiClient.post<Blueprint>(`${this.baseUrl}/dropdown/blueprints`, data);
  }

  async createAcademicBoard(data: { 
    name: string; 
    shortName: string; 
    country: string; 
    website: string 
  }): Promise<AcademicBoard> {
    return apiClient.post<AcademicBoard>(`${this.baseUrl}/dropdown/academic-boards`, data);
  }
}

export const examService = new ExamService();

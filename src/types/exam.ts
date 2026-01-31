export enum ExamType {
  PRACTICE = 'PRACTICE',
  MOCK = 'MOCK',
  FULL_TEST = 'FULL_TEST',
  PARTIAL_TEST = 'PARTIAL_TEST',
  DIAGNOSTIC = 'DIAGNOSTIC',
}

export enum DeliveryType {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  HYBRID = 'HYBRID',
}

export enum EnrollmentStatus {
  ENROLLED = 'ENROLLED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  classId: string | null;
  boardId: string | null;
  seriesId: string | null;
  examType: ExamType;
  deliveryType: DeliveryType;
  duration: number;
  totalMarks: number;
  isNegativeMarking: boolean;
  negativeMarkingValue: number;
  isPracticeMode: boolean;
  blueprintId: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  createdBy?: string;
  class?: ExamClass;
  board?: Board;
  series?: Series;
  blueprint?: Blueprint;
  schedules?: ExamSchedule[];
}

export interface ExamSchedule {
  id: string;
  examId: string;
  startDateTime: string;
  endDateTime: string;
  capacity: number;
  enrolledCount?: number;
  createdAt: string;
  updatedAt: string;
  exam?: Exam;
  enrollments?: Enrollment[];
}

export interface Enrollment {
  id: string;
  studentId: string;
  examId: string;
  scheduleId: string;
  status: EnrollmentStatus;
  enrolledAt: string;
  cancelledAt: string | null;
  completedAt: string | null;
  exam?: Exam;
  schedule?: ExamSchedule;
  student?: {
    id: string;
    username: string;
    email: string;
  };
}

export interface Board {
  id: string;
  name: string;
  code: string;
  createdAt: string;
  updatedAt: string;
}

export interface Series {
  id: string;
  name: string;
  boardId: string;
  year: number;
  createdAt: string;
  updatedAt: string;
  board?: Board;
}

export interface ExamClass {
  id: string;
  name: string;
  level: number;
  boardId: string;
  createdAt: string;
  updatedAt: string;
  board?: AcademicBoard;
}

export interface Blueprint {
  id: string;
  name: string;
  description: string;
  classId: string;
  createdAt: string;
  updatedAt: string;
  class?: ExamClass;
}

export interface AcademicBoard {
  id: string;
  name: string;
  shortName: string;
  country: string;
  website: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExamDto {
  title: string;
  description: string;
  classId?: string | null;
  boardId?: string | null;
  seriesId?: string | null;
  examType: ExamType;
  deliveryType: DeliveryType;
  duration: number;
  totalMarks: number;
  isNegativeMarking: boolean;
  negativeMarkingValue: number;
  isPracticeMode: boolean;
  blueprintId?: string | null;
}

export interface UpdateExamDto {
  title?: string;
  description?: string;
  classId?: string | null;
  boardId?: string | null;
  seriesId?: string | null;
  examType?: ExamType;
  deliveryType?: DeliveryType;
  duration?: number;
  totalMarks?: number;
  isNegativeMarking?: boolean;
  negativeMarkingValue?: number;
  isPracticeMode?: boolean;
  blueprintId?: string | null;
}

export interface CreateScheduleDto {
  startDateTime: string;
  endDateTime: string;
  capacity: number;
}

export interface ExamListResponse {
  data: Exam[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ExamSearchParams {
  page?: number;
  limit?: number;
  search?: string | object;
}

export interface DropdownOption {
  id: string;
  name: string;
  [key: string]: any;
}

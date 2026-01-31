import { Calendar, Clock, Award, BookOpen } from 'lucide-react';
import { Exam, ExamType } from '../../types/exam';

interface ExamCardProps {
  exam: Exam;
  onViewDetails?: (exam: Exam) => void;
  onEnroll?: (exam: Exam) => void;
  showEnrollButton?: boolean;
  isEnrolled?: boolean;
}

const examTypeColors: Record<ExamType, string> = {
  [ExamType.PRACTICE]: 'bg-blue-100 text-blue-800',
  [ExamType.MOCK]: 'bg-purple-100 text-purple-800',
  [ExamType.FULL_TEST]: 'bg-green-100 text-green-800',
  [ExamType.PARTIAL_TEST]: 'bg-yellow-100 text-yellow-800',
  [ExamType.DIAGNOSTIC]: 'bg-orange-100 text-orange-800',
};

export const ExamCard = ({ 
  exam, 
  onViewDetails, 
  onEnroll, 
  showEnrollButton = false,
  isEnrolled = false 
}: ExamCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{exam.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{exam.description}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${examTypeColors[exam.examType]}`}>
          {exam.examType}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{exam.duration} mins</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Award className="w-4 h-4" />
          <span>{exam.totalMarks} marks</span>
        </div>
        {exam.class && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <BookOpen className="w-4 h-4" />
            <span>{exam.class.name}</span>
          </div>
        )}
        {exam.isNegativeMarking && (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <span className="text-xs">-{exam.negativeMarkingValue} per wrong</span>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {onViewDetails && (
          <button
            onClick={() => onViewDetails(exam)}
            className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors text-sm font-medium"
          >
            View Details
          </button>
        )}
        {showEnrollButton && onEnroll && !isEnrolled && (
          <button
            onClick={() => onEnroll(exam)}
            className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Enroll Now
          </button>
        )}
        {isEnrolled && (
          <div className="flex-1 px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-medium text-center">
            Enrolled
          </div>
        )}
      </div>
    </div>
  );
};

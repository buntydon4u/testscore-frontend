import { Edit, Trash2, Calendar, Eye } from 'lucide-react';
import { Exam, ExamType } from '../../types/exam';
import { useNavigate } from 'react-router-dom';

interface ExamListTableProps {
  exams: Exam[];
  onDelete?: (exam: Exam) => void;
  onEdit?: (exam: Exam) => void;
  showActions?: boolean;
  baseRoute: string;
}

const examTypeColors: Record<ExamType, string> = {
  [ExamType.PRACTICE]: 'bg-blue-100 text-blue-800',
  [ExamType.MOCK]: 'bg-purple-100 text-purple-800',
  [ExamType.FULL_TEST]: 'bg-green-100 text-green-800',
  [ExamType.PARTIAL_TEST]: 'bg-yellow-100 text-yellow-800',
  [ExamType.DIAGNOSTIC]: 'bg-orange-100 text-orange-800',
};

export const ExamListTable = ({ 
  exams, 
  onDelete, 
  onEdit, 
  showActions = true,
  baseRoute 
}: ExamListTableProps) => {
  const navigate = useNavigate();

  const handleView = (exam: Exam) => {
    navigate(`${baseRoute}/exam/${exam.id}`);
  };

  const handleManageSchedules = (exam: Exam) => {
    navigate(`${baseRoute}/exam/${exam.id}/schedules`);
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Exam Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Marks
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Class
              </th>
              {showActions && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {exams.length === 0 ? (
              <tr>
                <td colSpan={showActions ? 6 : 5} className="px-6 py-12 text-center text-gray-500">
                  No exams found
                </td>
              </tr>
            ) : (
              exams.map((exam) => (
                <tr key={exam.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{exam.title}</div>
                    <div className="text-sm text-gray-500 line-clamp-1">{exam.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${examTypeColors[exam.examType]}`}>
                      {exam.examType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {exam.duration} mins
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {exam.totalMarks}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {exam.class?.name || '-'}
                  </td>
                  {showActions && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleView(exam)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleManageSchedules(exam)}
                          className="text-green-600 hover:text-green-900"
                          title="Manage Schedules"
                        >
                          <Calendar className="w-5 h-5" />
                        </button>
                        {onEdit && (
                          <button
                            onClick={() => onEdit(exam)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Edit Exam"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(exam)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete Exam"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

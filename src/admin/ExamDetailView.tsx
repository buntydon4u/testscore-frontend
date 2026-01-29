import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Award, BookOpen, AlertCircle, Calendar, Edit } from 'lucide-react';
import { examService } from '../services/exam';
import { Exam, ExamSchedule } from '../types/exam';
import { ScheduleCard } from '../components/exam/ScheduleCard';

export const ExamDetailView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [exam, setExam] = useState<Exam | null>(null);
  const [schedules, setSchedules] = useState<ExamSchedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadExamDetails();
      loadSchedules();
    }
  }, [id]);

  const loadExamDetails = async () => {
    try {
      const data = await examService.getExamById(id!);
      setExam(data);
    } catch (error) {
      console.error('Failed to load exam details:', error);
    }
  };

  const loadSchedules = async () => {
    try {
      const data = await examService.listSchedules(id!);
      setSchedules(data);
    } catch (error) {
      console.error('Failed to load schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !exam) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <button
          onClick={() => navigate(`/admin/exam/${id}/edit`)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors"
        >
          <Edit className="w-5 h-5" />
          Edit Exam
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{exam.title}</h1>
            <p className="text-gray-600">{exam.description}</p>
          </div>
          <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
            {exam.examType}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Duration</p>
              <p className="text-lg font-semibold text-gray-900">{exam.duration} mins</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <Award className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Marks</p>
              <p className="text-lg font-semibold text-gray-900">{exam.totalMarks}</p>
            </div>
          </div>

          {exam.class && (
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Class</p>
                <p className="text-lg font-semibold text-gray-900">{exam.class.name}</p>
              </div>
            </div>
          )}

          {exam.isNegativeMarking && (
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Negative Marking</p>
                <p className="text-lg font-semibold text-gray-900">-{exam.negativeMarkingValue}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-gray-700" />
            <h2 className="text-xl font-bold text-gray-900">Schedules</h2>
          </div>
          <button
            onClick={() => navigate(`/admin/exam/${id}/schedules`)}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Manage Schedules
          </button>
        </div>

        {schedules.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No schedules created yet</p>
            <button
              onClick={() => navigate(`/admin/exam/${id}/schedules`)}
              className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
            >
              Create Schedule
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {schedules.map((schedule) => (
              <ScheduleCard
                key={schedule.id}
                schedule={schedule}
                showActions={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

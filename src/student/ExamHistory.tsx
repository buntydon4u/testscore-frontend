import { useState, useEffect } from 'react';
import { Calendar, Clock, Award, CheckCircle } from 'lucide-react';
import { examService } from '../services/exam';
import { Enrollment, EnrollmentStatus } from '../types/exam';
import { format, isPast } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export const ExamHistory = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await examService.getMyEnrollments();
      
      // Filter only past enrollments with valid exam and schedule data
      const history = data.filter(enrollment => {
        if (!enrollment.schedule || !enrollment.exam) return false;
        const endDate = new Date(enrollment.schedule.endDateTime);
        return isPast(endDate);
      });

      // Sort by end date (most recent first)
      history.sort((a, b) => {
        const dateA = new Date(a.schedule!.endDateTime);
        const dateB = new Date(b.schedule!.endDateTime);
        return dateB.getTime() - dateA.getTime();
      });

      setEnrollments(history);
    } catch (error) {
      console.error('Failed to load exam history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: EnrollmentStatus) => {
    const badges = {
      [EnrollmentStatus.COMPLETED]: 'bg-green-100 text-green-800',
      [EnrollmentStatus.ENROLLED]: 'bg-blue-100 text-blue-800',
      [EnrollmentStatus.CANCELLED]: 'bg-red-100 text-red-800',
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Exam History</h1>
        <p className="text-gray-600">Your past exams and results</p>
      </div>

      {enrollments.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No exam history yet</p>
          <button
            onClick={() => navigate('/student/available-exams')}
            className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
          >
            Browse Available Exams
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {enrollments.map((enrollment) => {
            // Safety checks
            if (!enrollment.schedule || !enrollment.exam) return null;
            
            const schedule = enrollment.schedule;
            const exam = enrollment.exam;
            const startDate = new Date(schedule.startDateTime);

            return (
              <div
                key={enrollment.id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {exam.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(enrollment.status)}`}>
                        {enrollment.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{exam.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{format(startDate, 'MMM dd, yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{exam.duration} mins</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Award className="w-4 h-4" />
                        <span>{exam.totalMarks} marks</span>
                      </div>
                      {enrollment.status === EnrollmentStatus.COMPLETED && (
                        <div className="flex items-center gap-2 text-sm text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span>Completed</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => navigate(`/student/exam/${exam.id}`)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors text-sm font-medium"
                  >
                    View Exam Details
                  </button>
                  {enrollment.status === EnrollmentStatus.COMPLETED && (
                    <button
                      onClick={() => navigate(`/student/exam-results/${enrollment.id}`)}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                      View Results
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

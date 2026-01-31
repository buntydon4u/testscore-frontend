import { useState, useEffect } from 'react';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { examService } from '../services/exam';
import { Enrollment } from '../types/exam';
import { format, isPast, isFuture, isToday } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const UpcomingExams = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadEnrollments();
  }, []);

  const loadEnrollments = async () => {
    try {
      setLoading(true);
      const data = await examService.getMyEnrollments();
      console.log('Raw enrollments data:', data);
      
      // Filter only upcoming enrollments with valid schedule and exam data
      const upcoming = data.filter(enrollment => {
        if (!enrollment.schedule || !enrollment.schedule.exam) {
          console.warn('Enrollment missing schedule or exam:', enrollment.id);
          return false;
        }
        
        // Skip cancelled enrollments
        if (enrollment.status === 'CANCELLED') {
          console.log(`Enrollment ${enrollment.id}: status=CANCELLED, skipping`);
          return false;
        }
        
        const startDate = new Date(enrollment.schedule.startDateTime);
        const isUpcoming = isFuture(startDate) || isToday(startDate);
        console.log(`Enrollment ${enrollment.id}: start=${startDate.toISOString()}, isUpcoming=${isUpcoming}, status=${enrollment.status}`);
        return isUpcoming;
      });

      // Sort by start date
      upcoming.sort((a, b) => {
        const dateA = new Date(a.schedule!.startDateTime);
        const dateB = new Date(b.schedule!.startDateTime);
        return dateA.getTime() - dateB.getTime();
      });

      setEnrollments(upcoming);
    } catch (error: any) {
      console.error('Failed to load enrollments:', error);
      toast.error(error.message || 'Failed to load enrollments');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEnrollment = async (enrollment: Enrollment) => {
    if (!confirm('Are you sure you want to cancel this enrollment?')) return;

    try {
      if (!enrollment.schedule) {
        toast.error('Schedule data not available');
        return;
      }
      await examService.cancelEnrollment(enrollment.schedule.examId, enrollment.scheduleId);
      loadEnrollments();
      toast.success('Enrollment cancelled successfully');
    } catch (error: any) {
      console.error('Failed to cancel enrollment:', error);
      toast.error(error.message || 'Failed to cancel enrollment. Please try again.');
    }
  };

  const handleStartExam = (enrollment: Enrollment) => {
    navigate(`/student/exam/${enrollment.examId}/start`);
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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Upcoming Exams</h1>
        <p className="text-gray-600">Your scheduled exams</p>
      </div>
      
      {enrollments.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No upcoming exams</p>
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
            if (!enrollment.schedule || !enrollment.schedule.exam) return null;
            
            const schedule = enrollment.schedule;
            const exam = enrollment.schedule.exam;
            const startDate = new Date(schedule.startDateTime);
            const endDate = new Date(schedule.endDateTime);
            const isStartingSoon = isToday(startDate);

            return (
              <div
                key={enrollment.id}
                className={`bg-white rounded-lg shadow p-6 border-l-4 ${
                  isStartingSoon ? 'border-orange-500' : 'border-blue-500'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {exam.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">{exam.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{format(startDate, 'MMM dd, yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{format(startDate, 'hh:mm a')} - {format(endDate, 'hh:mm a')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-medium">{exam.duration} mins</span>
                        <span>•</span>
                        <span>{exam.totalMarks} marks</span>
                      </div>
                    </div>
                  </div>

                  {isStartingSoon && (
                    <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Today
                    </span>
                  )}
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => navigate(`/student/exam/${exam.id}`)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors text-sm font-medium"
                  >
                    View Details
                  </button>
                  {isStartingSoon && (
                    <button
                      onClick={() => handleStartExam(enrollment)}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                      Start Exam
                    </button>
                  )}
                  <button
                    onClick={() => handleCancelEnrollment(enrollment)}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm font-medium ml-auto"
                  >
                    Cancel Enrollment
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

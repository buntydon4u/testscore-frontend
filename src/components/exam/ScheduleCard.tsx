import { Calendar, Clock, Users } from 'lucide-react';
import { ExamSchedule } from '../../types/exam';
import { format } from 'date-fns';

interface ScheduleCardProps {
  schedule: ExamSchedule;
  onEnroll?: (schedule: ExamSchedule) => void;
  onCancel?: (schedule: ExamSchedule) => void;
  isEnrolled?: boolean;
  showActions?: boolean;
}

export const ScheduleCard = ({ 
  schedule, 
  onEnroll, 
  onCancel,
  isEnrolled = false,
  showActions = true 
}: ScheduleCardProps) => {
  const startDate = new Date(schedule.startDateTime);
  const endDate = new Date(schedule.endDateTime);
  const now = new Date();
  const isPast = endDate < now;
  const isOngoing = startDate <= now && endDate >= now;
  const isFull = (schedule.enrolledCount || 0) >= schedule.capacity;

  return (
    <div className={`bg-white rounded-lg shadow p-4 border-l-4 ${
      isPast ? 'border-gray-300' : isOngoing ? 'border-green-500' : 'border-blue-500'
    }`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-900">
              {format(startDate, 'MMM dd, yyyy')}
            </span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-600">
              {format(startDate, 'hh:mm a')} - {format(endDate, 'hh:mm a')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-600">
              {schedule.enrolledCount || 0} / {schedule.capacity} enrolled
            </span>
          </div>
        </div>
        
        {isOngoing && (
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
            Ongoing
          </span>
        )}
        {isPast && (
          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">
            Completed
          </span>
        )}
        {isFull && !isPast && !isOngoing && (
          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
            Full
          </span>
        )}
      </div>

      {showActions && !isPast && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          {!isEnrolled && !isFull && onEnroll && (
            <button
              onClick={() => onEnroll(schedule)}
              className="w-full px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors text-sm font-medium"
            >
              Enroll in this schedule
            </button>
          )}
          {isEnrolled && onCancel && (
            <button
              onClick={() => onCancel(schedule)}
              className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm font-medium"
            >
              Cancel Enrollment
            </button>
          )}
          {isFull && !isEnrolled && (
            <div className="w-full px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium text-center">
              Schedule Full
            </div>
          )}
        </div>
      )}
    </div>
  );
};

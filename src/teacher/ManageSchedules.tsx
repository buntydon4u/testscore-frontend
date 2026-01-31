import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Calendar } from 'lucide-react';
import { examService } from '../services/exam';
import { Exam, ExamSchedule, CreateScheduleDto } from '../types/exam';
import { ScheduleCard } from '../components/exam/ScheduleCard';

export const ManageSchedules = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [exam, setExam] = useState<Exam | null>(null);
  const [schedules, setSchedules] = useState<ExamSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState<CreateScheduleDto>({
    startDateTime: '',
    endDateTime: '',
    capacity: 100,
  });

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

  const handleCreateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.startDateTime || !formData.endDateTime) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      // Convert datetime-local format to ISO 8601 with timezone
      const scheduleData = {
        startDateTime: new Date(formData.startDateTime).toISOString(),
        endDateTime: new Date(formData.endDateTime).toISOString(),
        capacity: formData.capacity,
      };
      
      await examService.createSchedule(id!, scheduleData);
      alert('Schedule created successfully!');
      setShowCreateForm(false);
      setFormData({ startDateTime: '', endDateTime: '', capacity: 100 });
      loadSchedules();
    } catch (error) {
      console.error('Failed to create schedule:', error);
      alert('Failed to create schedule. Please try again.');
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
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{exam.title}</h1>
        <p className="text-gray-600">Manage schedules for this exam</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-gray-700" />
            <h2 className="text-xl font-bold text-gray-900">Schedules</h2>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            {showCreateForm ? 'Cancel' : 'Create Schedule'}
          </button>
        </div>

        {showCreateForm && (
          <form onSubmit={handleCreateSchedule} className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Schedule</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date & Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={formData.startDateTime}
                  onChange={(e) => setFormData({ ...formData, startDateTime: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date & Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={formData.endDateTime}
                  onChange={(e) => setFormData({ ...formData, endDateTime: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Capacity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                  required
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="mt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
              >
                Create Schedule
              </button>
            </div>
          </form>
        )}

        {schedules.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No schedules created yet</p>
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

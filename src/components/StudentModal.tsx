import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Student, StudentProfile, CreateStudentData, UpdateStudentData } from '../services/studentApi';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateStudentData | UpdateStudentData) => Promise<void>;
  student?: Student | null;
  isEditing?: boolean;
}

export const StudentModal = ({ isOpen, onClose, onSubmit, student, isEditing = false }: StudentModalProps) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    profile: {
      firstName: '',
      middleName: '',
      lastName: '',
      displayName: '',
      dateOfBirth: '',
      gender: 'MALE' as 'MALE' | 'FEMALE' | 'OTHER',
      nationality: '',
      religion: '',
      category: 'GENERAL' as 'GENERAL' | 'OBC' | 'SC' | 'ST',
      primaryPhone: '',
      secondaryPhone: '',
      emergencyPhone: '',
      currentStage: 'SCHOOL' as 'SCHOOL' | 'INTERMEDIATE' | 'UNDERGRADUATE' | 'POSTGRADUATE' | 'PROFESSIONAL',
      currentClass: '',
      academicYear: '',
      rollNumber: '',
      admissionNumber: '',
      boardType: 'CBSE' as 'CBSE' | 'ICSE' | 'STATE_BOARD' | 'IGCSE' | 'IB',
      schoolName: '',
      bio: '',
      interests: [] as string[],
      languages: [] as string[],
    } as StudentProfile,
    status: 'ACTIVE' as 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'SUSPENDED',
    isActive: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing && student) {
      setFormData({
        username: student.username || '',
        email: student.email || '',
        password: '',
        profile: {
          firstName: student.profile?.firstName || '',
          middleName: student.profile?.middleName || '',
          lastName: student.profile?.lastName || '',
          displayName: student.profile?.displayName || '',
          dateOfBirth: student.profile?.dateOfBirth || '',
          gender: student.profile?.gender || 'MALE',
          nationality: student.profile?.nationality || '',
          religion: student.profile?.religion || '',
          category: student.profile?.category || 'GENERAL',
          primaryPhone: student.profile?.primaryPhone || '',
          secondaryPhone: student.profile?.secondaryPhone || '',
          emergencyPhone: student.profile?.emergencyPhone || '',
          currentStage: student.profile?.currentStage || 'SCHOOL',
          currentClass: student.profile?.currentClass || '',
          academicYear: student.profile?.academicYear || '',
          rollNumber: student.profile?.rollNumber || '',
          admissionNumber: student.profile?.admissionNumber || '',
          boardType: student.profile?.boardType || 'CBSE',
          schoolName: student.profile?.schoolName || '',
          bio: student.profile?.bio || '',
          interests: student.profile?.interests || [],
          languages: student.profile?.languages || [],
        },
        status: (student.status === 'DELETED' ? 'ACTIVE' : student.status) || 'ACTIVE',
        isActive: student.isActive !== undefined ? student.isActive : true,
      });
    } else {
      setFormData({
        username: '',
        email: '',
        password: '',
        profile: {
          firstName: '',
          middleName: '',
          lastName: '',
          displayName: '',
          dateOfBirth: '',
          gender: 'MALE',
          nationality: '',
          religion: '',
          category: 'GENERAL',
          primaryPhone: '',
          secondaryPhone: '',
          emergencyPhone: '',
          currentStage: 'SCHOOL',
          currentClass: '',
          academicYear: '',
          rollNumber: '',
          admissionNumber: '',
          boardType: 'CBSE',
          schoolName: '',
          bio: '',
          interests: [],
          languages: [],
        },
        status: 'ACTIVE',
        isActive: true,
      });
    }
    setError('');
  }, [isOpen, isEditing, student]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const submitData: CreateStudentData | UpdateStudentData = {
        username: formData.username,
        email: formData.email,
        profile: formData.profile,
        status: formData.status,
        isActive: formData.isActive,
      };

      if (!isEditing) {
        (submitData as CreateStudentData).password = formData.password;
      }

      await onSubmit(submitData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save student');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any, isProfile = false) => {
    if (isProfile) {
      setFormData(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          [field]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {isEditing ? 'Edit Student' : 'Add New Student'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username *
              </label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                disabled={loading}
              />
            </div>

            {!isEditing && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  disabled={loading}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <input
                type="text"
                required
                value={formData.profile.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value, true)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Middle Name
              </label>
              <input
                type="text"
                value={formData.profile.middleName || ''}
                onChange={(e) => handleInputChange('middleName', e.target.value, true)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                required
                value={formData.profile.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value, true)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={formData.profile.displayName || ''}
                onChange={(e) => handleInputChange('displayName', e.target.value, true)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                value={formData.profile.dateOfBirth || ''}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value, true)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                value={formData.profile.gender || ''}
                onChange={(e) => handleInputChange('gender', e.target.value, true)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                disabled={loading}
              >
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nationality
              </label>
              <input
                type="text"
                value={formData.profile.nationality || ''}
                onChange={(e) => handleInputChange('nationality', e.target.value, true)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Religion
              </label>
              <input
                type="text"
                value={formData.profile.religion || ''}
                onChange={(e) => handleInputChange('religion', e.target.value, true)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Social Category
              </label>
              <select
                value={formData.profile.category || ''}
                onChange={(e) => handleInputChange('category', e.target.value, true)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                disabled={loading}
              >
                <option value="">Select Category</option>
                <option value="GENERAL">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Primary Phone
              </label>
              <input
                type="tel"
                value={formData.profile.primaryPhone || ''}
                onChange={(e) => handleInputChange('primaryPhone', e.target.value, true)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Secondary Phone
              </label>
              <input
                type="tel"
                value={formData.profile.secondaryPhone || ''}
                onChange={(e) => handleInputChange('secondaryPhone', e.target.value, true)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Emergency Phone
              </label>
              <input
                type="tel"
                value={formData.profile.emergencyPhone || ''}
                onChange={(e) => handleInputChange('emergencyPhone', e.target.value, true)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Educational Stage
              </label>
              <select
                value={formData.profile.currentStage || ''}
                onChange={(e) => handleInputChange('currentStage', e.target.value, true)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                disabled={loading}
              >
                <option value="">Select Stage</option>
                <option value="SCHOOL">School</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="UNDERGRADUATE">Undergraduate</option>
                <option value="POSTGRADUATE">Postgraduate</option>
                <option value="PROFESSIONAL">Professional</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Class
              </label>
              <input
                type="text"
                value={formData.profile.currentClass || ''}
                onChange={(e) => handleInputChange('currentClass', e.target.value, true)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Academic Year
              </label>
              <input
                type="text"
                value={formData.profile.academicYear || ''}
                onChange={(e) => handleInputChange('academicYear', e.target.value, true)}
                placeholder="e.g., 2023-24"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Roll Number
              </label>
              <input
                type="text"
                value={formData.profile.rollNumber || ''}
                onChange={(e) => handleInputChange('rollNumber', e.target.value, true)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Admission Number
              </label>
              <input
                type="text"
                value={formData.profile.admissionNumber || ''}
                onChange={(e) => handleInputChange('admissionNumber', e.target.value, true)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Board Type
              </label>
              <select
                value={formData.profile.boardType || ''}
                onChange={(e) => handleInputChange('boardType', e.target.value, true)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                disabled={loading}
              >
                <option value="">Select Board</option>
                <option value="CBSE">CBSE</option>
                <option value="ICSE">ICSE</option>
                <option value="STATE_BOARD">State Board</option>
                <option value="IGCSE">IGCSE</option>
                <option value="IB">IB</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                School Name
              </label>
              <input
                type="text"
                value={formData.profile.schoolName || ''}
                onChange={(e) => handleInputChange('schoolName', e.target.value, true)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                disabled={loading}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                value={formData.profile.bio || ''}
                onChange={(e) => handleInputChange('bio', e.target.value, true)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                disabled={loading}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Interests (comma separated)
              </label>
              <input
                type="text"
                value={(formData.profile.interests || []).join(', ')}
                onChange={(e) => handleInputChange('interests', e.target.value.split(',').map(s => s.trim()).filter(s => s), true)}
                placeholder="e.g., Reading, Sports, Music"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                disabled={loading}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Languages (comma separated)
              </label>
              <input
                type="text"
                value={(formData.profile.languages || []).join(', ')}
                onChange={(e) => handleInputChange('languages', e.target.value.split(',').map(s => s.trim()).filter(s => s), true)}
                placeholder="e.g., English, Hindi, French"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                disabled={loading}
              />
            </div>

            {isEditing && (
              <div className="md:col-span-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => handleInputChange('isActive', e.target.checked)}
                    className="mr-2 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    disabled={loading}
                  />
                  <span className="text-sm font-medium text-gray-700">Active</span>
                </label>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Saving...' : isEditing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useCallback } from 'react';
import { packageService, Package, CreatePackageRequest, UpdatePackageRequest, Class, Stream, Subject } from '../../services/packageApi';
import { XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface PackageFormProps {
  package?: Package;
  onClose: () => void;
  onSave: (pkg: Package) => void;
}

export const PackageForm: React.FC<PackageFormProps> = ({ package: pkg, onClose, onSave }) => {
  const [formData, setFormData] = useState<CreatePackageRequest>({
    package_name: '',
    package_type: 'subject',
    description: '',
    price: 0,
    duration_months: 12,
  });
  const [classes, setClasses] = useState<Class[]>([]);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    loadFilterData();
    if (pkg) {
      setIsEdit(true);
      setFormData({
        package_name: pkg.package_name,
        package_type: pkg.package_type,
        description: pkg.description,
        price: pkg.price,
        duration_months: pkg.duration_months,
        class_id: pkg.class_id,
        stream_id: pkg.stream_id,
        subject_id: pkg.subject_id,
        chapter_id: pkg.chapter_id,
      });
    }
  }, [pkg]);

  const loadStreams = useCallback(async (classId: number) => {
    try {
      const streamsData = await packageService.getStreams();
      const filteredStreams = streamsData.filter(s => s.class_id === parseInt(classId.toString()));
      setStreams(Array.isArray(filteredStreams) ? filteredStreams : []);
    } catch (error) {
      console.error('Failed to load streams:', error);
      setStreams([]);
    }
  }, []);

  const loadSubjects = useCallback(async (streamId: number) => {
    try {
      const subjectsData = await packageService.getSubjects(streamId);
      setSubjects(Array.isArray(subjectsData) ? subjectsData : []);
    } catch (error) {
      console.error('Failed to load subjects:', error);
      setSubjects([]);
    }
  }, []);

  useEffect(() => {
    if (formData.class_id) {
      loadStreams(formData.class_id);
    } else {
      setStreams([]);
      setSubjects([]);
    }
  }, [formData.class_id, loadStreams]);

  useEffect(() => {
    if (formData.stream_id) {
      loadSubjects(formData.stream_id);
    } else {
      setSubjects([]);
    }
  }, [formData.stream_id, loadSubjects]);

  const loadFilterData = async () => {
    try {
      const [classesData, streamsData, subjectsData] = await Promise.all([
        packageService.getClasses(),
        packageService.getStreams(),
        packageService.getSubjects()
      ]);
      setClasses(Array.isArray(classesData) ? classesData : []);
      setStreams(Array.isArray(streamsData) ? streamsData : []);
      setSubjects(Array.isArray(subjectsData) ? subjectsData : []);
    } catch (error) {
      console.error('Failed to load filter data:', error);
      toast.error('Failed to load filter data. Backend server may not be running.');
      setClasses([]);
      setStreams([]);
      setSubjects([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result: Package;
      
      if (isEdit && pkg) {
        const updateData: UpdatePackageRequest = {
          package_name: formData.package_name,
          description: formData.description,
          price: formData.price,
          duration_months: formData.duration_months,
        };
        result = await packageService.updatePackage(pkg.id, updateData);
        toast.success('Package updated successfully');
      } else {
        result = await packageService.createPackage(formData);
        toast.success('Package created successfully');
      }
      
      onSave(result);
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save package');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const getRequiredFields = () => {
    switch (formData.package_type) {
      case 'class':
        return ['class_id'];
      case 'stream':
        return ['class_id', 'stream_id'];
      case 'subject':
        return ['class_id', 'stream_id', 'subject_id'];
      case 'test_series':
        return [];
      case 'chapter':
        return ['class_id', 'stream_id', 'subject_id', 'chapter_id'];
      default:
        return [];
    }
  };

  const isFieldRequired = (fieldName: string) => {
    return getRequiredFields().includes(fieldName);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {isEdit ? 'Edit Package' : 'Create New Package'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Package Name *
            </label>
            <input
              type="text"
              name="package_name"
              value={formData.package_name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Package Type *
            </label>
            <select
              name="package_type"
              value={formData.package_type}
              onChange={handleChange}
              required
              disabled={isEdit}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="class">Class</option>
              <option value="stream">Stream</option>
              <option value="subject">Subject</option>
              <option value="test_series">Test Series</option>
              <option value="chapter">Chapter</option>
            </select>
            {isEdit && (
              <p className="text-xs text-gray-500 mt-1">Package type cannot be changed after creation</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (₹) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (Months) *
              </label>
              <input
                type="number"
                name="duration_months"
                value={formData.duration_months}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Conditional fields based on package type */}
          {formData.package_type !== 'test_series' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Class {isFieldRequired('class_id') && '*'}
                </label>
                <select
                  name="class_id"
                  value={formData.class_id || ''}
                  onChange={(e) => {
                    handleChange(e);
                    setFormData(prev => ({ ...prev, stream_id: undefined, subject_id: undefined }));
                  }}
                  required={isFieldRequired('class_id')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Class</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                  ))}
                </select>
                <div className="text-xs text-gray-500 mt-1">
                  Available classes: {classes.length}
                </div>
              </div>

              {['stream', 'subject', 'chapter'].includes(formData.package_type) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stream {isFieldRequired('stream_id') && '*'}
                  </label>
                  <select
                    name="stream_id"
                    value={formData.stream_id || ''}
                    onChange={(e) => {
                      handleChange(e);
                      setFormData(prev => ({ ...prev, subject_id: undefined }));
                    }}
                    required={isFieldRequired('stream_id')}
                    disabled={!formData.class_id}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  >
                    <option value="">Select Stream</option>
                    {streams.map(stream => (
                      <option key={stream.id} value={stream.id}>{stream.name}</option>
                    ))}
                  </select>
                  <div className="text-xs text-gray-500 mt-1">
                    Available streams: {streams.length} (for class {formData.class_id})
                  </div>
                </div>
              )}

              {['subject', 'chapter'].includes(formData.package_type) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject {isFieldRequired('subject_id') && '*'}
                  </label>
                  <select
                    name="subject_id"
                    value={formData.subject_id || ''}
                    onChange={handleChange}
                    required={isFieldRequired('subject_id')}
                    disabled={!formData.stream_id}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  >
                    <option value="">Select Subject</option>
                    {subjects.map(subject => (
                      <option key={subject.id} value={subject.id}>{subject.name}</option>
                    ))}
                  </select>
                  <div className="text-xs text-gray-500 mt-1">
                    Available subjects: {subjects.length} (for stream {formData.stream_id})
                  </div>
                </div>
              )}

              {formData.package_type === 'chapter' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chapter {isFieldRequired('chapter_id') && '*'}
                  </label>
                  <input
                    type="number"
                    name="chapter_id"
                    value={formData.chapter_id || ''}
                    onChange={handleChange}
                    required={isFieldRequired('chapter_id')}
                    placeholder="Enter Chapter ID"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
            >
              {loading ? 'Saving...' : (isEdit ? 'Update Package' : 'Create Package')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

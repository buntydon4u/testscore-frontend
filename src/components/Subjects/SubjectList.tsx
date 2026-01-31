import React, { useState, useEffect } from 'react';
import { subjectService, Subject } from '../../services/subjectApi';
import { streamService, Stream } from '../../services/streamApi';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface SubjectListProps {
  onEdit?: (subject: Subject) => void;
  onCreate?: () => void;
}

export const SubjectList: React.FC<SubjectListProps> = ({ onEdit, onCreate }) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStream, setFilterStream] = useState<string>('');

  useEffect(() => {
    console.log('SubjectList component mounted');
    loadData();
  }, [filterStream]);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('Loading subjects...');
      const [subjectsData, streamsData] = await Promise.all([
        subjectService.getSubjects(filterStream || undefined),
        streamService.getStreams()
      ]);
      console.log('Subjects loaded:', subjectsData);
      console.log('Streams loaded:', streamsData);
      setSubjects(subjectsData);
      setStreams(streamsData);
    } catch (error) {
      console.error('Failed to load data:', error);
      toast.error('Failed to load subjects');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subject?')) return;
    
    try {
      await subjectService.deleteSubject(id);
      toast.success('Subject deleted successfully');
      loadData();
    } catch (error) {
      toast.error('Failed to delete subject');
    }
  };

  const getStreamName = (streamId?: string) => {
    if (!streamId) return '-';
    const stream = streams.find(s => s.id === streamId);
    return stream ? stream.name : 'Unknown';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Subjects</h2>
        <button
          onClick={onCreate}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Subject
        </button>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Filter by Stream:</label>
          <select
            value={filterStream}
            onChange={(e) => setFilterStream(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Streams</option>
            {streams.map(stream => (
              <option key={stream.id} value={stream.id}>{stream.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stream
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {subjects.map((subject) => (
              <tr key={subject.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{subject.name}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500">{subject.description || '-'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{getStreamName(subject.stream_id)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {new Date(subject.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onEdit?.(subject)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(subject.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {subjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No subjects found</p>
            <button
              onClick={onCreate}
              className="mt-2 text-blue-600 hover:text-blue-500"
            >
              Create your first subject
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

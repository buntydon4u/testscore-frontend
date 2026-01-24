import React, { useState, useEffect } from 'react';
import { streamService, Stream } from '../../services/streamApi';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface StreamListProps {
  onEdit?: (stream: Stream) => void;
  onCreate?: () => void;
}

export const StreamList: React.FC<StreamListProps> = ({ onEdit, onCreate }) => {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('StreamList component mounted');
    loadStreams();
  }, []);

  const loadStreams = async () => {
    try {
      setLoading(true);
      console.log('Loading streams...');
      const data = await streamService.getStreams();
      console.log('Streams loaded:', data);
      setStreams(data);
    } catch (error) {
      console.error('Failed to load streams:', error);
      toast.error('Failed to load streams');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this stream?')) return;
    
    try {
      await streamService.deleteStream(id);
      toast.success('Stream deleted successfully');
      loadStreams();
    } catch (error) {
      toast.error('Failed to delete stream');
    }
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
        <h2 className="text-2xl font-bold text-gray-900">Streams</h2>
        <button
          onClick={onCreate}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Stream
        </button>
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
                Created At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {streams.map((stream) => (
              <tr key={stream.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{stream.name}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500">{stream.description || '-'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {new Date(stream.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onEdit?.(stream)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(stream.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {streams.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No streams found</p>
            <button
              onClick={onCreate}
              className="mt-2 text-blue-600 hover:text-blue-500"
            >
              Create your first stream
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

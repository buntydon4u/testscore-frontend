import React, { useState, useEffect, useCallback } from 'react';
import { packageService, Package, PackageFilters, Class, Stream, Subject } from '../../services/packageApi';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface PackageListProps {
  onEdit?: (pkg: Package) => void;
  onView?: (pkg: Package) => void;
  onCreate?: () => void;
}

export const PackageList: React.FC<PackageListProps> = ({ onEdit, onView, onCreate }) => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<PackageFilters>({});

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Loading packages with filters:', filters);
      const data = await packageService.getPackages(filters);
      console.log('Packages loaded:', data);
      setPackages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load packages:', error);
      toast.error('Failed to load packages. Please check if the backend server is running.');
      setPackages([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const loadFilters = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    loadData();
    loadFilters();
  }, [loadData, loadFilters]);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this package?')) return;
    
    try {
      await packageService.deletePackage(id);
      toast.success('Package deleted successfully');
      loadData();
    } catch (error) {
      toast.error('Failed to delete package');
    }
  };

  const handleFilterChange = (key: keyof PackageFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === '' ? undefined : value
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const getPackageTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      class: 'Class',
      subject: 'Subject',
      stream: 'Stream',
      test_series: 'Test Series',
      chapter: 'Chapter'
    };
    return labels[type] || type;
  };

  const getRelatedInfo = (pkg: Package) => {
    if (pkg.class_id && classes.length > 0) {
      const classInfo = classes.find(c => c.id === pkg.class_id);
      if (classInfo) return `Class: ${classInfo.name}`;
    }
    if (pkg.stream_id && streams.length > 0) {
      const streamInfo = streams.find(s => s.id === pkg.stream_id);
      if (streamInfo) return `Stream: ${streamInfo.name}`;
    }
    if (pkg.subject_id && subjects.length > 0) {
      const subjectInfo = subjects.find(s => s.id === pkg.subject_id);
      if (subjectInfo) return `Subject: ${subjectInfo.name}`;
    }
    return '';
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
      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Package Type
            </label>
            <select
              value={filters.package_type || ''}
              onChange={(e) => handleFilterChange('package_type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="class">Class</option>
              <option value="subject">Subject</option>
              <option value="stream">Stream</option>
              <option value="test_series">Test Series</option>
              <option value="chapter">Chapter</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filters.is_active?.toString() || ''}
              onChange={(e) => handleFilterChange('is_active', e.target.value === 'true' ? true : e.target.value === 'false' ? false : undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Price
            </label>
            <input
              type="number"
              value={filters.min_price || ''}
              onChange={(e) => handleFilterChange('min_price', e.target.value ? Number(e.target.value) : undefined)}
              placeholder="Min price"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Price
            </label>
            <input
              type="number"
              value={filters.max_price || ''}
              onChange={(e) => handleFilterChange('max_price', e.target.value ? Number(e.target.value) : undefined)}
              placeholder="Max price"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            Clear Filters
          </button>
          {onCreate && (
            <button
              onClick={onCreate}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md flex items-center gap-2"
            >
              <PlusIcon className="h-4 w-4" />
              Create Package
            </button>
          )}
        </div>
      </div>

      {/* Package List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Package Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Related To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {packages.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{pkg.package_name}</div>
                      <div className="text-sm text-gray-500">{pkg.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {getPackageTypeLabel(pkg.package_type)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getRelatedInfo(pkg)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{pkg.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {pkg.duration_months} months
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      pkg.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {pkg.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {onView && (
                      <button
                        onClick={() => onView(pkg)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                    )}
                    {onEdit && (
                      <button
                        onClick={() => onEdit(pkg)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(pkg.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {packages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No packages found</p>
          </div>
        )}
      </div>
    </div>
  );
};

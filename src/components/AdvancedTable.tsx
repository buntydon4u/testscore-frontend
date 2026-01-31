import { useState } from 'react';
import { ChevronUpIcon, ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
  width?: string;
}

interface AdvancedTableProps<T> {
  data: T[];
  columns: Column[];
  loading?: boolean;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    onPageChange: (page: number) => void;
  };
  sorting?: {
    field: string;
    order: 'asc' | 'desc';
    onSort: (field: string) => void;
  };
  filtering?: {
    filters: Record<string, string>;
    onFilterChange: (field: string, value: string) => void;
  };
  actions?: {
    label: string;
    onClick: (item: T) => void;
    icon?: React.ReactNode;
    className?: string;
  }[];
  emptyMessage?: string;
  className?: string;
}

export function AdvancedTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  error,
  pagination,
  sorting,
  filtering,
  actions = [],
  emptyMessage = 'No data available',
  className = '',
}: AdvancedTableProps<T>) {
  const [localFilters, setLocalFilters] = useState<Record<string, string>>(filtering?.filters || {});

  const handleFilterChange = (field: string, value: string) => {
    setLocalFilters(prev => ({ ...prev, [field]: value }));
    filtering?.onFilterChange(field, value);
  };

  const renderSortIcon = (column: Column) => {
    if (!column.sortable || !sorting) return null;
    
    if (sorting.field === column.key) {
      return sorting.order === 'asc' ? (
        <ChevronUpIcon className="w-4 h-4 inline ml-1" />
      ) : (
        <ChevronDownIcon className="w-4 h-4 inline ml-1" />
      );
    }
    return <ChevronUpIcon className="w-4 h-4 inline ml-1 opacity-30" />;
  };

  return (
    <div className={`bg-white rounded-lg shadow overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.width ? column.width : ''
                  }`}
                >
                  <div className="space-y-2">
                    {column.sortable && sorting ? (
                      <button
                        onClick={() => sorting.onSort(column.key)}
                        className="font-medium text-gray-900 hover:text-gray-700 transition-colors flex items-center"
                      >
                        {column.label}
                        {renderSortIcon(column)}
                      </button>
                    ) : (
                      <span className="font-medium text-gray-900">{column.label}</span>
                    )}
                    
                    {column.filterable && filtering && (
                      <div className="relative">
                        <input
                          type="text"
                          placeholder={`Search ${column.label}`}
                          value={localFilters[column.key] || ''}
                          onChange={(e) => handleFilterChange(column.key, e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                        <MagnifyingGlassIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                      </div>
                    )}
                  </div>
                </th>
              ))}
              {actions.length > 0 && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={columns.length + (actions.length > 0 ? 1 : 0)} className="px-6 py-12 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500"></div>
                    <span className="ml-2 text-gray-500">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={columns.length + (actions.length > 0 ? 1 : 0)} className="px-6 py-12 text-center">
                  <span className="text-red-500">{error}</span>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions.length > 0 ? 1 : 0)} className="px-6 py-12 text-center">
                  <span className="text-gray-500">{emptyMessage}</span>
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr key={row.id || index} className="hover:bg-gray-50 transition-colors">
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm">
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </td>
                  ))}
                  {actions.length > 0 && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        {actions.map((action, actionIndex) => (
                          <button
                            key={actionIndex}
                            onClick={() => action.onClick(row)}
                            className={action.className || 'text-emerald-600 hover:text-emerald-900'}
                            title={action.label}
                          >
                            {action.icon}
                          </button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && pagination.total > pagination.limit && (
        <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-700">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total} results
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.ceil(pagination.total / pagination.limit) }, (_, i) => i + 1)
                .filter(
                  (page) =>
                    page === 1 ||
                    page === Math.ceil(pagination.total / pagination.limit) ||
                    Math.abs(page - pagination.page) <= 1
                )
                .map((page, index, array) => {
                  if (index > 0 && array[index - 1] !== page - 1) {
                    return (
                      <span key={`ellipsis-${page}`} className="px-2 text-gray-400">
                        ...
                      </span>
                    );
                  }
                  return (
                    <button
                      key={page}
                      onClick={() => pagination.onPageChange(page)}
                      className={`px-3 py-1 text-sm border rounded-md transition-colors ${
                        page === pagination.page
                          ? 'bg-emerald-500 text-white border-emerald-500'
                          : 'border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
            </div>
            
            <button
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page * pagination.limit >= pagination.total}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { orderService, Order, CreateOrderRequest } from '../../services/orderApi';
import { packageService, Package } from '../../services/packageApi';
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface CreateOrderProps {
  studentId: number;
  onClose: () => void;
  onSave: (order: Order) => void;
}

export const CreateOrder: React.FC<CreateOrderProps> = ({ studentId, onClose, onSave }) => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedPackages, setSelectedPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      setLoadingPackages(true);
      const data = await packageService.getPackages({ is_active: true });
      setPackages(data);
    } catch (error) {
      toast.error('Failed to load packages');
    } finally {
      setLoadingPackages(false);
    }
  };

  const handleAddPackage = (pkg: Package) => {
    if (!selectedPackages.find(p => p.id === pkg.id)) {
      setSelectedPackages([...selectedPackages, pkg]);
    }
  };

  const handleRemovePackage = (packageId: number) => {
    setSelectedPackages(selectedPackages.filter(p => p.id !== packageId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedPackages.length === 0) {
      toast.error('Please select at least one package');
      return;
    }

    setLoading(true);
    try {
      const orderData: CreateOrderRequest = {
        package_ids: selectedPackages.map(p => p.id)
      };
      
      const order = await orderService.createOrder(orderData);
      toast.success('Order created successfully');
      onSave(order);
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return selectedPackages.reduce((total, pkg) => total + pkg.price, 0);
  };

  const filteredPackages = packages.filter(pkg =>
    pkg.package_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 shadow-lg rounded-md bg-white max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">
            Create New Order
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Available Packages */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">Available Packages</h4>
            
            {/* Search */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search packages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Package List */}
            <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-md">
              {loadingPackages ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              ) : filteredPackages.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No packages found
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredPackages.map((pkg) => {
                    const isSelected = selectedPackages.find(p => p.id === pkg.id);
                    return (
                      <div
                        key={pkg.id}
                        className={`p-4 hover:bg-gray-50 cursor-pointer ${
                          isSelected ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <h5 className="text-sm font-medium text-gray-900">
                                {pkg.package_name}
                              </h5>
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                {getPackageTypeLabel(pkg.package_type)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">{pkg.description}</p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                              <span>Duration: {pkg.duration_months} months</span>
                              <span className="font-medium text-gray-900">₹{pkg.price.toLocaleString()}</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleAddPackage(pkg)}
                            disabled={!!isSelected}
                            className={`p-2 rounded-md ${
                              isSelected
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                            }`}
                          >
                            <PlusIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Selected Packages */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">
              Selected Packages ({selectedPackages.length})
            </h4>
            
            {selectedPackages.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-md text-gray-500">
                No packages selected
              </div>
            ) : (
              <div className="space-y-3">
                {selectedPackages.map((pkg) => (
                  <div key={pkg.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h5 className="text-sm font-medium text-gray-900">
                          {pkg.package_name}
                        </h5>
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {getPackageTypeLabel(pkg.package_type)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                        <span>Duration: {pkg.duration_months} months</span>
                        <span className="font-medium text-gray-900">₹{pkg.price.toLocaleString()}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemovePackage(pkg.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-md"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order Summary */}
          {selectedPackages.length > 0 && (
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-lg font-medium text-gray-900">Order Summary</h4>
                  <p className="text-sm text-gray-500">
                    {selectedPackages.length} package{selectedPackages.length > 1 ? 's' : ''}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{calculateTotal().toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || selectedPackages.length === 0}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

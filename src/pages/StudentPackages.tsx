import React, { useState, useEffect } from 'react';
import { packageService, Package } from '../services/packageApi';
import { orderService, Order } from '../services/orderApi';
import { authService } from '../services/auth';
import { ShoppingBagIcon, PlusIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export const StudentPackages: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [availablePackages, setAvailablePackages] = useState<Package[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'purchased' | 'available'>('purchased');

  const user = authService.getUser();
  const studentId = user?.id ? parseInt(user.id) : undefined;

  useEffect(() => {
    if (studentId) {
      loadData();
    }
  }, [studentId]);

  const loadData = async () => {
    if (!studentId) return;

    try {
      setLoading(true);
      const [purchasedData, availableData, ordersData] = await Promise.all([
        packageService.getStudentPackages(studentId),
        packageService.getPackages({ is_active: true }),
        orderService.getStudentOrders(studentId, { limit: 50 })
      ]);

      setPackages(purchasedData);
      setAvailablePackages(availableData);
      setOrders(ordersData);
    } catch (error) {
      toast.error('Failed to load packages');
    } finally {
      setLoading(false);
    }
  };

  const getPackageAccessStatus = (pkg: Package) => {
    const hasAccess = packages.some(p => p.id === pkg.id);
    const hasOrder = orders.some(order => 
      order.order_items.some(item => item.package_id === pkg.id)
    );

    if (hasAccess) {
      return { hasAccess: true, status: 'active' };
    } else if (hasOrder) {
      const order = orders.find(order => 
        order.order_items.some(item => item.package_id === pkg.id)
      );
      return { hasAccess: false, status: order?.status || 'pending' };
    }
    return { hasAccess: false, status: 'not_purchased' };
  };

  const handlePurchasePackage = async (pkg: Package) => {
    if (!studentId) {
      toast.error('Student ID is required');
      return;
    }

    try {
      const order = await orderService.createOrder({
        package_ids: [pkg.id]
      });
      toast.success('Order created successfully! Please complete the payment.');
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create order');
    }
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paid':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'paid':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'pending':
        return <ClockIcon className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const filteredAvailablePackages = availablePackages.filter(pkg => {
    const accessStatus = getPackageAccessStatus(pkg);
    return !accessStatus.hasAccess;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Packages</h1>
        <p className="mt-2 text-gray-600">Manage your educational packages and access</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('purchased')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'purchased'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Packages ({packages.length})
          </button>
          <button
            onClick={() => setActiveTab('available')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'available'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Available Packages ({filteredAvailablePackages.length})
          </button>
        </nav>
      </div>

      {/* Purchased Packages */}
      {activeTab === 'purchased' && (
        <div className="space-y-6">
          {packages.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <ShoppingBagIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No packages purchased</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by purchasing a package from the available packages.</p>
              <div className="mt-6">
                <button
                  onClick={() => setActiveTab('available')}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Browse Packages
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => {
                const accessStatus = getPackageAccessStatus(pkg);
                return (
                  <div key={pkg.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {getPackageTypeLabel(pkg.package_type)}
                        </span>
                        <span className={`px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${getStatusColor(accessStatus.status)}`}>
                          {getStatusIcon(accessStatus.status)}
                          <span className="ml-1 capitalize">{accessStatus.status.replace('_', ' ')}</span>
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-medium text-gray-900 mb-2">{pkg.package_name}</h3>
                      <p className="text-sm text-gray-500 mb-4">{pkg.description}</p>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Duration:</span>
                          <span className="font-medium">{pkg.duration_months} months</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Price:</span>
                          <span className="font-medium">₹{pkg.price.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t">
                        <button
                          className={`w-full px-4 py-2 text-sm font-medium rounded-md ${
                            accessStatus.hasAccess
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                          disabled={!accessStatus.hasAccess}
                        >
                          {accessStatus.hasAccess ? 'Access Package' : 'Payment Pending'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Available Packages */}
      {activeTab === 'available' && (
        <div className="space-y-6">
          {filteredAvailablePackages.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <ShoppingBagIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No available packages</h3>
              <p className="mt-1 text-sm text-gray-500">All packages have been purchased or are currently unavailable.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAvailablePackages.map((pkg) => (
                <div key={pkg.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {getPackageTypeLabel(pkg.package_type)}
                      </span>
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Available
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{pkg.package_name}</h3>
                    <p className="text-sm text-gray-500 mb-4">{pkg.description}</p>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span className="font-medium">{pkg.duration_months} months</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Price:</span>
                        <span className="font-medium text-lg text-blue-600">₹{pkg.price.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <button
                        onClick={() => handlePurchasePackage(pkg)}
                        className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md flex items-center justify-center"
                      >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Purchase Package
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

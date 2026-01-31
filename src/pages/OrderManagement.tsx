import React, { useState } from 'react';
import { OrderList } from '../components/Orders/OrderList';
import { CreateOrder } from '../components/Orders/CreateOrder';
import { Order } from '../services/orderApi';
import { authService } from '../services/auth';
import toast from 'react-hot-toast';

export const OrderManagement: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [viewingOrder, setViewingOrder] = useState<Order | undefined>();

  const user = authService.getUser();
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
  const studentId = user?.role === 'STUDENT' ? parseInt(user.id) : undefined;

  const handleCreateOrder = () => {
    if (!studentId) {
      toast.error('Student ID is required to create an order');
      return;
    }
    setShowCreateForm(true);
  };

  const handleViewOrder = (order: Order) => {
    setViewingOrder(order);
    // You could implement a detail modal or navigate to detail page
    toast.success(`Viewing order #${order.id}`);
  };

  const handleUpdateStatus = (order: Order) => {
    // This would typically open a modal for status update
    toast.info(`Update status for order #${order.id}`);
  };

  const handleSaveOrder = (order: Order) => {
    setShowCreateForm(false);
    setRefreshKey(prev => prev + 1); // Trigger refresh
  };

  const handleCloseCreateForm = () => {
    setShowCreateForm(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
        <p className="mt-2 text-gray-600">
          {isAdmin ? 'Manage all orders and payment status' : 'View and manage your orders'}
        </p>
      </div>

      <OrderList
        key={refreshKey}
        studentId={studentId}
        isAdmin={isAdmin}
        onView={handleViewOrder}
        onUpdateStatus={handleUpdateStatus}
      />

      {!isAdmin && (
        <div className="mt-6 text-center">
          <button
            onClick={handleCreateOrder}
            className="px-6 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
          >
            Create New Order
          </button>
        </div>
      )}

      {showCreateForm && studentId && (
        <CreateOrder
          studentId={studentId}
          onSave={handleSaveOrder}
          onClose={handleCloseCreateForm}
        />
      )}
    </div>
  );
};

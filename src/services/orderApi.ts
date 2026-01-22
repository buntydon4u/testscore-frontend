import { apiClient } from './api';
import { mockOrders } from './mockData';

export interface Order {
  id: number;
  student_id: number;
  total_amount: number;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  transaction_id?: string;
  payment_gateway?: string;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  package_id: number;
  price: number;
  package: {
    id: number;
    package_name: string;
    package_type: string;
    description: string;
  };
}

export interface CreateOrderRequest {
  package_ids: number[];
}

export interface UpdatePaymentStatusRequest {
  status: 'pending' | 'paid' | 'failed' | 'refunded';
}

export interface PaymentWebhookRequest {
  order_id: number;
  payment_status: 'paid' | 'failed' | 'refunded';
  transaction_id: string;
  payment_gateway: string;
}

export interface OrderStatistics {
  total_orders: number;
  total_revenue: number;
  paid_orders: number;
  pending_orders: number;
  failed_orders: number;
  refunded_orders: number;
  orders_by_date: Array<{
    date: string;
    orders: number;
    revenue: number;
  }>;
}

export interface OrderFilters {
  limit?: number;
  offset?: number;
  status?: string;
  start_date?: string;
  end_date?: string;
}

export class OrderService {
  async createOrder(data: CreateOrderRequest): Promise<Order> {
    try {
      return await apiClient.post<Order>('/orders', data);
    } catch (error) {
      console.warn('Backend not available, simulating order creation');
      // Simulate order creation with mock data
      const newOrder: Order = {
        id: Math.max(...mockOrders.map(o => o.id)) + 1,
        student_id: 456, // Mock student ID
        total_amount: data.package_ids.reduce((sum, id) => sum + 1999, 0), // Mock pricing
        status: 'pending',
        payment_status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        order_items: data.package_ids.map(packageId => ({
          id: Math.random(),
          order_id: Math.max(...mockOrders.map(o => o.id)) + 1,
          package_id: packageId,
          price: 1999, // Mock price
          package: {
            id: packageId,
            package_name: `Package ${packageId}`,
            package_type: 'subject',
            description: 'Mock package description',
          },
        })),
      };
      mockOrders.push(newOrder);
      return newOrder;
    }
  }

  async getOrderById(id: number): Promise<Order> {
    try {
      return await apiClient.get<Order>(`/orders/${id}`);
    } catch (error) {
      console.warn('Backend not available, using mock data for order');
      const order = mockOrders.find(o => o.id === id);
      if (!order) throw new Error('Order not found');
      return order;
    }
  }

  async getStudentOrders(studentId: number, filters?: OrderFilters): Promise<Order[]> {
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString());
          }
        });
      }
      
      const endpoint = params.toString() ? `/orders/student/${studentId}?${params.toString()}` : `/orders/student/${studentId}`;
      const data = await apiClient.get<Order[]>(endpoint);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.warn('Backend not available, using mock data for student orders');
      let filteredOrders = mockOrders.filter(order => order.student_id === studentId);
      
      if (filters) {
        if (filters.status) {
          filteredOrders = filteredOrders.filter(order => order.status === filters.status);
        }
        if (filters.limit) {
          filteredOrders = filteredOrders.slice(filters.offset || 0, (filters.offset || 0) + filters.limit);
        }
      }
      
      return filteredOrders;
    }
  }

  async updatePaymentStatus(orderId: number, data: UpdatePaymentStatusRequest): Promise<Order> {
    try {
      return await apiClient.put<Order>(`/orders/${orderId}/payment`, data);
    } catch (error) {
      console.warn('Backend not available, simulating payment status update');
      const orderIndex = mockOrders.findIndex(o => o.id === orderId);
      if (orderIndex === -1) throw new Error('Order not found');
      
      mockOrders[orderIndex] = {
        ...mockOrders[orderIndex],
        status: data.status,
        payment_status: data.status,
        updated_at: new Date().toISOString(),
      };
      return mockOrders[orderIndex];
    }
  }

  async processPaymentWebhook(data: PaymentWebhookRequest): Promise<void> {
    try {
      return await apiClient.post<void>('/orders/webhook/payment', data);
    } catch (error) {
      console.warn('Backend not available, simulating payment webhook processing');
      // Mock webhook processing - just log the data
      console.log('Payment webhook processed:', data);
    }
  }

  async getOrderStatistics(filters?: { startDate?: string; endDate?: string }): Promise<OrderStatistics> {
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString());
          }
        });
      }
      
      const endpoint = params.toString() ? `/orders/stats/admin?${params.toString()}` : '/orders/stats/admin';
      return await apiClient.get<OrderStatistics>(endpoint);
    } catch (error) {
      console.warn('Backend not available, using mock data for order statistics');
      // Return mock statistics
      return {
        total_orders: mockOrders.length,
        total_revenue: mockOrders.reduce((sum, order) => sum + order.total_amount, 0),
        paid_orders: mockOrders.filter(o => o.status === 'paid').length,
        pending_orders: mockOrders.filter(o => o.status === 'pending').length,
        failed_orders: mockOrders.filter(o => o.status === 'failed').length,
        refunded_orders: mockOrders.filter(o => o.status === 'refunded').length,
        orders_by_date: [
          {
            date: new Date().toISOString().split('T')[0],
            orders: 2,
            revenue: 3998,
          },
          {
            date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
            orders: 1,
            revenue: 1999,
          },
        ],
      };
    }
  }
}

export const orderService = new OrderService();

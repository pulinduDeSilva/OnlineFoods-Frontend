import api from './api';
import type { Order, OrderStatus } from '../types/models';

export const orderService = {
  async checkout(userId: string): Promise<Order> {
    const response = await api.post<Order>(`/orders/checkout/${userId}`);
    return response.data;
  },

  async getUserOrders(userId: string): Promise<Order[]> {
    const response = await api.get<Order[]>(`/orders/users/${userId}`);
    return response.data;
  },

  async getAllOrders(): Promise<Order[]> {
    const response = await api.get<Order[]>('/orders');
    return response.data;
  },

  async updateStatus(orderId: number, status: OrderStatus): Promise<Order> {
    const response = await api.patch<Order>(`/orders/${orderId}/status`, undefined, {
      params: { status },
    });
    return response.data;
  },
};

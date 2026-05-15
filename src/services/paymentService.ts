import api from './api';
import type { Payment, PaymentStatus } from '../types/models';

export const paymentService = {
  async getByOrder(orderId: number): Promise<Payment> {
    const response = await api.get<Payment>(`/payments/orders/${orderId}`);
    return response.data;
  },

  async createPending(orderId: number): Promise<Payment> {
    const response = await api.post<Payment>(`/payments/orders/${orderId}`);
    return response.data;
  },

  async updateStatus(paymentId: number, status: PaymentStatus): Promise<Payment> {
    const response = await api.patch<Payment>(`/payments/${paymentId}/status`, undefined, {
      params: { status },
    });
    return response.data;
  },
};

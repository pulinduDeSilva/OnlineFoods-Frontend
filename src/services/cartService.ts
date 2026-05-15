import api from './api';
import type { Cart } from '../types/models';

export const cartService = {
  async getByUser(userId: string): Promise<Cart> {
    const response = await api.get<Cart>(`/carts/${userId}`);
    return response.data;
  },

  async addItem(userId: string, foodItemId: number, quantity: number): Promise<Cart> {
    const response = await api.post<Cart>(`/carts/${userId}/items`, {
      foodItemId,
      quantity,
    });
    return response.data;
  },

  async updateQuantity(userId: string, cartItemId: number, quantity: number): Promise<Cart> {
    const response = await api.put<Cart>(`/carts/${userId}/items/${cartItemId}`, {
      quantity,
    });
    return response.data;
  },

  async removeItem(userId: string, cartItemId: number): Promise<Cart> {
    const response = await api.delete<Cart>(`/carts/${userId}/items/${cartItemId}`);
    return response.data;
  },

  async clear(userId: string): Promise<Cart> {
    const response = await api.delete<Cart>(`/carts/${userId}/items`);
    return response.data;
  },
};

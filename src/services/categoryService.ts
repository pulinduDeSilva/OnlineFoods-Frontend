import api from './api';
import type { Category } from '../types/models';

export const categoryService = {
  async getAll(): Promise<Category[]> {
    const response = await api.get<Category[]>('/categories');
    return response.data;
  },

  async create(payload: { name: string }): Promise<Category> {
    const response = await api.post<Category>('/categories', payload);
    return response.data;
  },

  async update(id: number, payload: { name: string }): Promise<Category> {
    const response = await api.put<Category>(`/categories/${id}`, payload);
    return response.data;
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/categories/${id}`);
  },
};

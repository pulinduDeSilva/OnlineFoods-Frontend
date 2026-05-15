import api from './api';
import type { Food } from '../types/models';

type FoodCreatePayload = {
  name: string;
  description?: string;
  price: number;
  stockQuantity: number;
  category: {
    id: number;
  };
};

export const foodService = {
  async getAll(categoryId?: number): Promise<Food[]> {
    const response = await api.get<Food[]>('/foods', {
      params: categoryId ? { categoryId } : undefined,
    });
    return response.data;
  },

  async create(payload: FoodCreatePayload): Promise<Food> {
    const response = await api.post<Food>('/foods', payload);
    return response.data;
  },
};
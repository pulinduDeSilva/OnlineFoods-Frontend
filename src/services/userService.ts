import api from './api';
import type { UserProfile } from '../types/models';

export const userService = {
  async getAllUsers(): Promise<UserProfile[]> {
    const response = await api.get<UserProfile[]>('/users');
    return response.data;
  },

  async findUserByEmail(email: string): Promise<UserProfile | null> {
    const users = await api.get<UserProfile[]>('/users');
    return users.data.find((user) => user.email === email) ?? null;
  },
};

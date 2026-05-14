import api from './api';
import type { AuthResponse, LoginCredentials, SignCredentials } from '../types/auth';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials, {
        headers: {
            // This manually pulls it for this specific call
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
    console.log(credentials)

    // Store token securely on successful login
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  signup: async (credentials: SignCredentials): Promise<AuthResponse> => {

    const response = await api.post<AuthResponse>('/auth/signup', credentials);
    console.log(credentials)
    // Store token securely on successful signup
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  }
};
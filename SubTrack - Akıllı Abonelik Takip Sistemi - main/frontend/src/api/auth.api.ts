import apiClient from './client';
import { AuthResponse, User } from '../types';

export const authApi = {
  register: async (email: string, password: string, name: string): Promise<AuthResponse> => {
    const { data } = await apiClient.post('/auth/register', { email, password, name });
    return data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const { data } = await apiClient.post('/auth/login', { email, password });
    return data;
  },

  getProfile: async (): Promise<User> => {
    const { data } = await apiClient.get('/auth/me');
    return data;
  },

  updateProfile: async (profileData: { name?: string; email?: string }): Promise<User> => {
    const { data } = await apiClient.put('/auth/profile', profileData);
    return data;
  },
};

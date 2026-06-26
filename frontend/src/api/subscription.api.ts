import apiClient from './client';
import {
  Subscription,
  SubscriptionStats,
  CreateSubscriptionData,
  UpdateSubscriptionData,
  Category,
} from '../types';

export const subscriptionApi = {
  getAll: async (filters?: Record<string, string>): Promise<Subscription[]> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });
    }
    const { data } = await apiClient.get(`/subscriptions?${params.toString()}`);
    return data;
  },

  getById: async (id: string): Promise<Subscription> => {
    const { data } = await apiClient.get(`/subscriptions/${id}`);
    return data;
  },

  create: async (subscriptionData: CreateSubscriptionData): Promise<Subscription> => {
    const { data } = await apiClient.post('/subscriptions', subscriptionData);
    return data;
  },

  update: async (id: string, subscriptionData: UpdateSubscriptionData): Promise<Subscription> => {
    const { data } = await apiClient.put(`/subscriptions/${id}`, subscriptionData);
    return data;
  },

  cancel: async (id: string): Promise<Subscription> => {
    const { data } = await apiClient.patch(`/subscriptions/${id}/cancel`);
    return data;
  },

  getStats: async (): Promise<SubscriptionStats> => {
    const { data } = await apiClient.get('/subscriptions/stats');
    return data;
  },

  // Categories
  getCategories: async (): Promise<Category[]> => {
    const { data } = await apiClient.get('/categories');
    return data;
  },

  createCategory: async (categoryData: { name: string; color?: string; icon?: string }): Promise<Category> => {
    const { data } = await apiClient.post('/categories', categoryData);
    return data;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await apiClient.delete(`/categories/${id}`);
  },
};

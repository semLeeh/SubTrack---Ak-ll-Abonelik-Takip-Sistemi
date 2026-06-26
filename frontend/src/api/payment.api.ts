import apiClient from './client';
import { PaginatedResponse, Payment, PaymentSummary } from '../types';

export const paymentApi = {
  getAll: async (page: number = 1, limit: number = 20, status?: string): Promise<PaginatedResponse<Payment>> => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (status && status !== 'all') params.set('status', status);
    const { data } = await apiClient.get(`/payments?${params.toString()}`);
    return data;
  },

  getSummary: async (): Promise<PaymentSummary> => {
    const { data } = await apiClient.get('/payments/summary');
    return data;
  },

  create: async (paymentData: {
    subscriptionId: string;
    amount: number;
    currency?: string;
    status?: string;
  }): Promise<Payment> => {
    const { data } = await apiClient.post('/payments', paymentData);
    return data;
  },
};

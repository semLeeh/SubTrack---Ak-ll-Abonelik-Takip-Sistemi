import apiClient from './client';
import {
  RevenueDataPoint,
  CategoryDistribution,
  NotificationResponse,
} from '../types';

export const reportApi = {
  getRevenue: async (months: number = 12): Promise<RevenueDataPoint[]> => {
    const { data } = await apiClient.get(`/reports/revenue?months=${months}`);
    return data;
  },

  getCategoryDistribution: async (): Promise<CategoryDistribution[]> => {
    const { data } = await apiClient.get('/reports/categories');
    return data;
  },

  exportSubscriptionsCSV: async (): Promise<void> => {
    const response = await apiClient.get('/reports/export/subscriptions', {
      responseType: 'blob',
    });
    downloadBlob(response.data, 'abonelikler.csv');
  },

  exportPaymentsCSV: async (): Promise<void> => {
    const response = await apiClient.get('/reports/export/payments', {
      responseType: 'blob',
    });
    downloadBlob(response.data, 'odemeler.csv');
  },

  // Notifications
  getNotifications: async (unreadOnly?: boolean): Promise<NotificationResponse> => {
    const params = unreadOnly ? '?unreadOnly=true' : '';
    const { data } = await apiClient.get(`/notifications${params}`);
    return data;
  },

  markNotificationRead: async (id: string): Promise<void> => {
    await apiClient.patch(`/notifications/${id}/read`);
  },

  markAllNotificationsRead: async (): Promise<void> => {
    await apiClient.patch('/notifications/read-all');
  },
};

function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

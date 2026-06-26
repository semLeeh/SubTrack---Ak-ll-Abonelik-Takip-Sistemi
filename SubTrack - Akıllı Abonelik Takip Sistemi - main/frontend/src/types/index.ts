// Frontend types matching backend API responses

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  _count?: {
    subscriptions: number;
  };
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Subscription {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  billingCycle: 'weekly' | 'monthly' | 'yearly';
  status: 'active' | 'paused' | 'cancelled' | 'expired';
  startDate: string;
  nextBillingDate: string;
  cancelledAt: string | null;
  provider: string | null;
  providerUrl: string | null;
  color: string | null;
  icon: string | null;
  createdAt: string;
  updatedAt: string;
  categories: SubscriptionCategory[];
  _count?: {
    payments: number;
  };
  payments?: Payment[];
}

export interface SubscriptionCategory {
  subscriptionId: string;
  categoryId: string;
  category: Category;
}

export interface Category {
  id: string;
  userId: string;
  name: string;
  color: string;
  icon: string;
  _count?: {
    subscriptions: number;
  };
}

export interface Payment {
  id: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed' | 'refunded';
  paidAt: string;
  invoiceUrl: string | null;
  createdAt: string;
  subscription?: {
    id: string;
    name: string;
    provider: string | null;
    icon: string | null;
    color: string | null;
  };
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'renewal' | 'payment' | 'cancellation' | 'info';
  isRead: boolean;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  payments: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SubscriptionStats {
  totalSubscriptions: number;
  activeSubscriptions: number;
  cancelledSubscriptions: number;
  pausedSubscriptions: number;
  totalMonthly: number;
  totalYearly: number;
  upcomingRenewals: number;
}

export interface PaymentSummary {
  totalSpent: number;
  thisMonth: number;
  lastMonth: number;
  changePercent: number;
  totalPayments: number;
  recentPayments: Payment[];
}

export interface RevenueDataPoint {
  month: string;
  revenue: number;
  count: number;
}

export interface CategoryDistribution {
  category: string;
  color: string;
  total: number;
  count: number;
}

export interface NotificationResponse {
  notifications: Notification[];
  unreadCount: number;
}

export interface CreateSubscriptionData {
  name: string;
  description?: string;
  price: number;
  currency?: string;
  billingCycle: string;
  startDate?: string;
  nextBillingDate: string;
  provider?: string;
  providerUrl?: string;
  color?: string;
  icon?: string;
  categoryIds?: string[];
}

export type UpdateSubscriptionData = Partial<CreateSubscriptionData> & {
  status?: string;
};

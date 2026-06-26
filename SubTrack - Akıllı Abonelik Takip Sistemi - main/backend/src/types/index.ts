import { Request } from 'express';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
}

export interface SubscriptionFilters {
  status?: string;
  search?: string;
  categoryId?: string;
  billingCycle?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateSubscriptionInput {
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

export interface UpdateSubscriptionInput extends Partial<CreateSubscriptionInput> {
  status?: string;
}

export interface CreatePaymentInput {
  subscriptionId: string;
  amount: number;
  currency?: string;
  status?: string;
  paidAt?: string;
}

export interface CreateCategoryInput {
  name: string;
  color?: string;
  icon?: string;
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

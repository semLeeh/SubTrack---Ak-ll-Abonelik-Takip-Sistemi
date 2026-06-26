import { useState, useCallback, useEffect } from 'react';
import { Subscription, SubscriptionStats, Category, CreateSubscriptionData, UpdateSubscriptionData } from '../types';
import { subscriptionApi } from '../api/subscription.api';

export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [stats, setStats] = useState<SubscriptionStats | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscriptions = useCallback(async (filters?: Record<string, string>) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await subscriptionApi.getAll(filters);
      setSubscriptions(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Abonelikler yüklenemedi');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const data = await subscriptionApi.getStats();
      setStats(data);
    } catch (err: any) {
      console.error('Stats error:', err);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await subscriptionApi.getCategories();
      setCategories(data);
    } catch (err: any) {
      console.error('Categories error:', err);
    }
  }, []);

  const createSubscription = useCallback(async (data: CreateSubscriptionData) => {
    const newSub = await subscriptionApi.create(data);
    setSubscriptions(prev => [newSub, ...prev]);
    return newSub;
  }, []);

  const updateSubscription = useCallback(async (id: string, data: UpdateSubscriptionData) => {
    const updated = await subscriptionApi.update(id, data);
    setSubscriptions(prev => prev.map(s => (s.id === id ? updated : s)));
    return updated;
  }, []);

  const cancelSubscription = useCallback(async (id: string) => {
    const cancelled = await subscriptionApi.cancel(id);
    setSubscriptions(prev => prev.map(s => (s.id === id ? cancelled : s)));
    return cancelled;
  }, []);

  return {
    subscriptions,
    stats,
    categories,
    isLoading,
    error,
    fetchSubscriptions,
    fetchStats,
    fetchCategories,
    createSubscription,
    updateSubscription,
    cancelSubscription,
  };
}

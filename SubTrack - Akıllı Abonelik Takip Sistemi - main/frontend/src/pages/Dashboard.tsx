import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Layers, TrendingUp, DollarSign, CalendarClock,
  ArrowUpRight, ArrowDownRight,
} from 'lucide-react';
import { StatCard } from '../components/ui/Card';
import Card from '../components/ui/Card';
import RevenueChart from '../components/charts/RevenueChart';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import Badge, { getStatusBadgeVariant } from '../components/ui/Badge';
import { subscriptionApi } from '../api/subscription.api';
import { paymentApi } from '../api/payment.api';
import { reportApi } from '../api/report.api';
import { SubscriptionStats, PaymentSummary, RevenueDataPoint, CategoryDistribution, Subscription } from '../types';
import { formatCurrency, formatRelativeDate, getStatusLabel, getBillingCycleLabel } from '../utils/formatters';

export default function Dashboard() {
  const [stats, setStats] = useState<SubscriptionStats | null>(null);
  const [summary, setSummary] = useState<PaymentSummary | null>(null);
  const [revenue, setRevenue] = useState<RevenueDataPoint[]>([]);
  const [categories, setCategories] = useState<CategoryDistribution[]>([]);
  const [recentSubs, setRecentSubs] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, summaryData, revenueData, categoryData, subsData] = await Promise.all([
          subscriptionApi.getStats(),
          paymentApi.getSummary(),
          reportApi.getRevenue(12),
          reportApi.getCategoryDistribution(),
          subscriptionApi.getAll({ sortBy: 'nextBillingDate', sortOrder: 'asc', status: 'active' }),
        ]);
        setStats(statsData);
        setSummary(summaryData);
        setRevenue(revenueData);
        setCategories(categoryData);
        setRecentSubs(subsData.slice(0, 5));
      } catch (error) {
        console.error('Dashboard data load error:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-32 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="skeleton h-80 rounded-2xl lg:col-span-2" />
          <div className="skeleton h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Aktif Abonelik"
          value={stats?.activeSubscriptions || 0}
          subtitle={`${stats?.totalSubscriptions || 0} toplam`}
          icon={<Layers className="w-5 h-5" />}
          color="#6366f1"
          delay={0}
        />
        <StatCard
          title="Aylık Harcama"
          value={formatCurrency(stats?.totalMonthly || 0)}
          subtitle="Tahmini aylık maliyet"
          icon={<DollarSign className="w-5 h-5" />}
          color="#10b981"
          trend={summary?.changePercent}
          delay={0.05}
        />
        <StatCard
          title="Yıllık Harcama"
          value={formatCurrency(stats?.totalYearly || 0)}
          subtitle="Tahmini yıllık maliyet"
          icon={<TrendingUp className="w-5 h-5" />}
          color="#f59e0b"
          delay={0.1}
        />
        <StatCard
          title="Yaklaşan Yenileme"
          value={stats?.upcomingRenewals || 0}
          subtitle="Önümüzdeki 7 gün"
          icon={<CalendarClock className="w-5 h-5" />}
          color="#06b6d4"
          delay={0.15}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  Harcama Trendi
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Son 12 ay</p>
              </div>
              {summary && (
                <div className="text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Bu ay</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {formatCurrency(summary.thisMonth)}
                  </p>
                </div>
              )}
            </div>
            {revenue.length > 0 ? (
              <RevenueChart data={revenue} />
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-400">
                Henüz veri yok
              </div>
            )}
          </Card>
        </motion.div>

        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card className="h-full">
            <div className="mb-4">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                Kategori Dağılımı
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Aylık bazda</p>
            </div>
            {categories.length > 0 ? (
              <CategoryPieChart data={categories} />
            ) : (
              <div className="h-[200px] flex items-center justify-center text-gray-400">
                Henüz veri yok
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      {/* Upcoming Renewals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                Yaklaşan Yenilemeler
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Aktif abonelikler, faturalama tarihine göre sıralı
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {recentSubs.length > 0 ? recentSubs.map((sub, i) => (
              <motion.div
                key={sub.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.05 }}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-surface-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: sub.color || '#6366f1' }}
                  >
                    {sub.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{sub.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {getBillingCycleLabel(sub.billingCycle)} · {sub.provider || ''}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(sub.price, sub.currency)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatRelativeDate(sub.nextBillingDate)}
                  </p>
                </div>
              </motion.div>
            )) : (
              <p className="text-center text-sm text-gray-400 py-8">Aktif abonelik yok</p>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

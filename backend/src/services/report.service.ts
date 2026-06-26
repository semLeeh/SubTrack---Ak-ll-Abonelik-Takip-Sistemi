import { PrismaClient } from '@prisma/client';
import { RevenueDataPoint, CategoryDistribution } from '../types';
import { subscriptionsToCSV, paymentsToCSV } from '../utils/csv';

const prisma = new PrismaClient();

export class ReportService {
  async getRevenueData(userId: string, months: number = 12): Promise<RevenueDataPoint[]> {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - months + 1, 1);

    const payments = await prisma.payment.findMany({
      where: {
        subscription: { userId },
        status: 'paid',
        paidAt: { gte: startDate },
      },
      orderBy: { paidAt: 'asc' },
    });

    const monthlyData: Map<string, { revenue: number; count: number }> = new Map();

    // Initialize all months
    for (let i = 0; i < months; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - months + 1 + i, 1);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyData.set(key, { revenue: 0, count: 0 });
    }

    // Fill with actual data
    for (const payment of payments) {
      const date = new Date(payment.paidAt);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const existing = monthlyData.get(key);
      if (existing) {
        existing.revenue += payment.amount;
        existing.count += 1;
      }
    }

    return Array.from(monthlyData.entries()).map(([month, data]) => ({
      month,
      revenue: Math.round(data.revenue * 100) / 100,
      count: data.count,
    }));
  }

  async getCategoryDistribution(userId: string): Promise<CategoryDistribution[]> {
    const categories = await prisma.category.findMany({
      where: { userId },
      include: {
        subscriptions: {
          include: {
            subscription: {
              select: { price: true, billingCycle: true, status: true },
            },
          },
        },
      },
    });

    return categories
      .map(cat => {
        const activeSubscriptions = cat.subscriptions
          .map(sc => sc.subscription)
          .filter(s => s.status === 'active');

        const total = activeSubscriptions.reduce((sum, s) => {
          switch (s.billingCycle) {
            case 'weekly': return sum + s.price * 4.33;
            case 'yearly': return sum + s.price / 12;
            default: return sum + s.price;
          }
        }, 0);

        return {
          category: cat.name,
          color: cat.color,
          total: Math.round(total * 100) / 100,
          count: activeSubscriptions.length,
        };
      })
      .filter(c => c.count > 0)
      .sort((a, b) => b.total - a.total);
  }

  async exportSubscriptionsCSV(userId: string): Promise<string> {
    const subscriptions = await prisma.subscription.findMany({
      where: { userId },
      include: {
        categories: {
          include: { category: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    return subscriptionsToCSV(subscriptions);
  }

  async exportPaymentsCSV(userId: string): Promise<string> {
    const payments = await prisma.payment.findMany({
      where: { subscription: { userId } },
      include: {
        subscription: {
          select: { name: true, provider: true },
        },
      },
      orderBy: { paidAt: 'desc' },
    });

    return paymentsToCSV(payments);
  }
}

export const reportService = new ReportService();

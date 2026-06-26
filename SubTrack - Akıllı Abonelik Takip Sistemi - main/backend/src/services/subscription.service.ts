import { PrismaClient, Prisma } from '@prisma/client';
import { SubscriptionFilters, CreateSubscriptionInput, UpdateSubscriptionInput } from '../types';

const prisma = new PrismaClient();

export class SubscriptionService {
  async findAll(userId: string, filters: SubscriptionFilters) {
    const where: Prisma.SubscriptionWhereInput = { userId };

    if (filters.status && filters.status !== 'all') {
      where.status = filters.status;
    }

    if (filters.billingCycle && filters.billingCycle !== 'all') {
      where.billingCycle = filters.billingCycle;
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search } },
        { provider: { contains: filters.search } },
        { description: { contains: filters.search } },
      ];
    }

    if (filters.categoryId) {
      where.categories = {
        some: { categoryId: filters.categoryId },
      };
    }

    const orderBy: Prisma.SubscriptionOrderByWithRelationInput = {};
    const sortBy = filters.sortBy || 'createdAt';
    const sortOrder = filters.sortOrder || 'desc';
    (orderBy as any)[sortBy] = sortOrder;

    const subscriptions = await prisma.subscription.findMany({
      where,
      orderBy,
      include: {
        categories: {
          include: { category: true },
        },
        _count: { select: { payments: true } },
      },
    });

    return subscriptions;
  }

  async findById(userId: string, id: string) {
    const subscription = await prisma.subscription.findFirst({
      where: { id, userId },
      include: {
        categories: {
          include: { category: true },
        },
        payments: {
          orderBy: { paidAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!subscription) {
      throw Object.assign(new Error('Abonelik bulunamadı'), { statusCode: 404 });
    }

    return subscription;
  }

  async create(userId: string, data: CreateSubscriptionInput) {
    const { categoryIds, ...subscriptionData } = data;

    const subscription = await prisma.subscription.create({
      data: {
        ...subscriptionData,
        userId,
        startDate: data.startDate ? new Date(data.startDate) : new Date(),
        nextBillingDate: new Date(data.nextBillingDate),
        categories: categoryIds?.length
          ? {
              create: categoryIds.map(categoryId => ({ categoryId })),
            }
          : undefined,
      },
      include: {
        categories: {
          include: { category: true },
        },
      },
    });

    return subscription;
  }

  async update(userId: string, id: string, data: UpdateSubscriptionInput) {
    // Verify ownership
    const existing = await prisma.subscription.findFirst({ where: { id, userId } });
    if (!existing) {
      throw Object.assign(new Error('Abonelik bulunamadı'), { statusCode: 404 });
    }

    const { categoryIds, ...updateData } = data;

    // Update category associations if provided
    if (categoryIds !== undefined) {
      await prisma.subscriptionCategory.deleteMany({
        where: { subscriptionId: id },
      });

      if (categoryIds.length > 0) {
        await prisma.subscriptionCategory.createMany({
          data: categoryIds.map(categoryId => ({
            subscriptionId: id,
            categoryId,
          })),
        });
      }
    }

    const subscription = await prisma.subscription.update({
      where: { id },
      data: {
        ...updateData,
        nextBillingDate: updateData.nextBillingDate
          ? new Date(updateData.nextBillingDate)
          : undefined,
        startDate: updateData.startDate
          ? new Date(updateData.startDate)
          : undefined,
      },
      include: {
        categories: {
          include: { category: true },
        },
      },
    });

    return subscription;
  }

  async cancel(userId: string, id: string) {
    const existing = await prisma.subscription.findFirst({ where: { id, userId } });
    if (!existing) {
      throw Object.assign(new Error('Abonelik bulunamadı'), { statusCode: 404 });
    }

    const subscription = await prisma.subscription.update({
      where: { id },
      data: {
        status: 'cancelled',
        cancelledAt: new Date(),
      },
      include: {
        categories: {
          include: { category: true },
        },
      },
    });

    // Create notification for cancellation
    await prisma.notification.create({
      data: {
        userId,
        title: 'Abonelik İptal Edildi',
        message: `${subscription.name} aboneliğiniz iptal edildi.`,
        type: 'cancellation',
      },
    });

    return subscription;
  }

  async getStats(userId: string) {
    const subscriptions = await prisma.subscription.findMany({
      where: { userId },
    });

    const active = subscriptions.filter(s => s.status === 'active');
    const totalMonthly = active.reduce((sum, s) => {
      switch (s.billingCycle) {
        case 'weekly': return sum + s.price * 4.33;
        case 'monthly': return sum + s.price;
        case 'yearly': return sum + s.price / 12;
        default: return sum + s.price;
      }
    }, 0);

    const totalYearly = totalMonthly * 12;

    const upcoming = active
      .filter(s => {
        const days = Math.ceil(
          (new Date(s.nextBillingDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        );
        return days >= 0 && days <= 7;
      })
      .length;

    return {
      totalSubscriptions: subscriptions.length,
      activeSubscriptions: active.length,
      cancelledSubscriptions: subscriptions.filter(s => s.status === 'cancelled').length,
      pausedSubscriptions: subscriptions.filter(s => s.status === 'paused').length,
      totalMonthly: Math.round(totalMonthly * 100) / 100,
      totalYearly: Math.round(totalYearly * 100) / 100,
      upcomingRenewals: upcoming,
    };
  }
}

export const subscriptionService = new SubscriptionService();

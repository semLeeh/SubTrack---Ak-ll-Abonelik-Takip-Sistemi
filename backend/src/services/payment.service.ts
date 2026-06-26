import { PrismaClient } from '@prisma/client';
import { CreatePaymentInput } from '../types';
import { generateInvoiceNumber } from '../utils/helpers';

const prisma = new PrismaClient();

export class PaymentService {
  async findAll(userId: string, page: number = 1, limit: number = 20, status?: string) {
    const where: any = {
      subscription: { userId },
    };

    if (status && status !== 'all') {
      where.status = status;
    }

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        orderBy: { paidAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          subscription: {
            select: { id: true, name: true, provider: true, icon: true, color: true },
          },
        },
      }),
      prisma.payment.count({ where }),
    ]);

    return {
      payments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async create(userId: string, data: CreatePaymentInput) {
    // Verify subscription ownership
    const subscription = await prisma.subscription.findFirst({
      where: { id: data.subscriptionId, userId },
    });

    if (!subscription) {
      throw Object.assign(new Error('Abonelik bulunamadı'), { statusCode: 404 });
    }

    const payment = await prisma.payment.create({
      data: {
        subscriptionId: data.subscriptionId,
        amount: data.amount,
        currency: data.currency || subscription.currency,
        status: data.status || 'paid',
        paidAt: data.paidAt ? new Date(data.paidAt) : new Date(),
        invoiceUrl: generateInvoiceNumber(),
      },
      include: {
        subscription: {
          select: { id: true, name: true, provider: true },
        },
      },
    });

    // Create payment notification
    await prisma.notification.create({
      data: {
        userId,
        title: 'Ödeme Kaydedildi',
        message: `${subscription.name} için ${data.amount} ${data.currency || subscription.currency} ödeme kaydedildi.`,
        type: 'payment',
      },
    });

    return payment;
  }

  async getSummary(userId: string) {
    const payments = await prisma.payment.findMany({
      where: {
        subscription: { userId },
        status: 'paid',
      },
      include: {
        subscription: {
          select: { name: true, billingCycle: true },
          },
      },
      orderBy: { paidAt: 'desc' },
    });

    const now = new Date();
    const thisMonth = payments.filter(p => {
      const d = new Date(p.paidAt);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });

    const lastMonth = payments.filter(p => {
      const d = new Date(p.paidAt);
      const last = new Date(now.getFullYear(), now.getMonth() - 1);
      return d.getMonth() === last.getMonth() && d.getFullYear() === last.getFullYear();
    });

    const totalSpent = payments.reduce((sum, p) => sum + p.amount, 0);
    const thisMonthTotal = thisMonth.reduce((sum, p) => sum + p.amount, 0);
    const lastMonthTotal = lastMonth.reduce((sum, p) => sum + p.amount, 0);

    return {
      totalSpent: Math.round(totalSpent * 100) / 100,
      thisMonth: Math.round(thisMonthTotal * 100) / 100,
      lastMonth: Math.round(lastMonthTotal * 100) / 100,
      changePercent: lastMonthTotal > 0
        ? Math.round(((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100)
        : 0,
      totalPayments: payments.length,
      recentPayments: payments.slice(0, 5),
    };
  }

  async getAllForExport(userId: string) {
    return prisma.payment.findMany({
      where: { subscription: { userId } },
      include: {
        subscription: {
          select: { name: true, provider: true },
        },
      },
      orderBy: { paidAt: 'desc' },
    });
  }
}

export const paymentService = new PaymentService();

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class NotificationService {
  async findAll(userId: string, unreadOnly: boolean = false) {
    const where: any = { userId };
    if (unreadOnly) {
      where.isRead = false;
    }

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const unreadCount = await prisma.notification.count({
      where: { userId, isRead: false },
    });

    return { notifications, unreadCount };
  }

  async markAsRead(userId: string, id: string) {
    const notification = await prisma.notification.findFirst({
      where: { id, userId },
    });

    if (!notification) {
      throw Object.assign(new Error('Bildirim bulunamadı'), { statusCode: 404 });
    }

    return prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });

    return { message: 'Tüm bildirimler okundu olarak işaretlendi' };
  }

  async create(userId: string, title: string, message: string, type: string = 'info') {
    return prisma.notification.create({
      data: { userId, title, message, type },
    });
  }

  async checkRenewals() {
    const now = new Date();
    const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    const upcomingRenewals = await prisma.subscription.findMany({
      where: {
        status: 'active',
        nextBillingDate: {
          gte: now,
          lte: threeDaysLater,
        },
      },
      include: { user: { select: { id: true } } },
    });

    for (const sub of upcomingRenewals) {
      const days = Math.ceil(
        (new Date(sub.nextBillingDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Check if notification already exists for this renewal period
      const existing = await prisma.notification.findFirst({
        where: {
          userId: sub.userId,
          type: 'renewal',
          message: { contains: sub.name },
          createdAt: { gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) },
        },
      });

      if (!existing) {
        await prisma.notification.create({
          data: {
            userId: sub.userId,
            title: 'Yenileme Hatırlatması',
            message: `${sub.name} aboneliğiniz ${days} gün içinde yenilenecek. Tutar: ${sub.price} ${sub.currency}`,
            type: 'renewal',
          },
        });
      }
    }

    return { checked: upcomingRenewals.length };
  }
}

export const notificationService = new NotificationService();

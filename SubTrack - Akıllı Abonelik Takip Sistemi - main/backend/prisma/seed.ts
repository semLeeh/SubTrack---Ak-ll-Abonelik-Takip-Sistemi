import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seed verisi oluşturuluyor...');

  // Clean existing data
  await prisma.subscriptionCategory.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Create demo user
  const passwordHash = await bcrypt.hash('password123', 12);
  const user = await prisma.user.create({
    data: {
      email: 'demo@subtracker.com',
      name: 'Demo Kullanıcı',
      passwordHash,
    },
  });
  console.log(`✅ Demo kullanıcı oluşturuldu: ${user.email}`);

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({ data: { userId: user.id, name: 'Eğlence', color: '#8b5cf6', icon: 'tv' } }),
    prisma.category.create({ data: { userId: user.id, name: 'İş', color: '#3b82f6', icon: 'briefcase' } }),
    prisma.category.create({ data: { userId: user.id, name: 'Bulut', color: '#06b6d4', icon: 'cloud' } }),
    prisma.category.create({ data: { userId: user.id, name: 'Eğitim', color: '#10b981', icon: 'graduation-cap' } }),
    prisma.category.create({ data: { userId: user.id, name: 'Müzik', color: '#ec4899', icon: 'music' } }),
    prisma.category.create({ data: { userId: user.id, name: 'Sağlık', color: '#f59e0b', icon: 'heart-pulse' } }),
    prisma.category.create({ data: { userId: user.id, name: 'Diğer', color: '#6b7280', icon: 'tag' } }),
  ]);
  console.log(`✅ ${categories.length} kategori oluşturuldu`);

  // Create subscriptions
  const now = new Date();
  const subscriptions = await Promise.all([
    prisma.subscription.create({
      data: {
        userId: user.id,
        name: 'Netflix',
        description: 'Premium plan - 4K Ultra HD',
        price: 149.99,
        currency: 'TRY',
        billingCycle: 'monthly',
        status: 'active',
        startDate: new Date(2024, 0, 15),
        nextBillingDate: new Date(now.getFullYear(), now.getMonth() + 1, 15),
        provider: 'Netflix',
        providerUrl: 'https://netflix.com',
        color: '#E50914',
        icon: 'tv',
        categories: { create: [{ categoryId: categories[0].id }] },
      },
    }),
    prisma.subscription.create({
      data: {
        userId: user.id,
        name: 'Spotify Premium',
        description: 'Bireysel plan',
        price: 59.99,
        currency: 'TRY',
        billingCycle: 'monthly',
        status: 'active',
        startDate: new Date(2023, 5, 1),
        nextBillingDate: new Date(now.getFullYear(), now.getMonth() + 1, 1),
        provider: 'Spotify',
        providerUrl: 'https://spotify.com',
        color: '#1DB954',
        icon: 'music',
        categories: { create: [{ categoryId: categories[4].id }] },
      },
    }),
    prisma.subscription.create({
      data: {
        userId: user.id,
        name: 'AWS',
        description: 'EC2 + S3 + RDS servisleri',
        price: 450.00,
        currency: 'TRY',
        billingCycle: 'monthly',
        status: 'active',
        startDate: new Date(2023, 8, 1),
        nextBillingDate: new Date(now.getFullYear(), now.getMonth() + 1, 1),
        provider: 'Amazon Web Services',
        providerUrl: 'https://aws.amazon.com',
        color: '#FF9900',
        icon: 'cloud',
        categories: { create: [{ categoryId: categories[2].id }, { categoryId: categories[1].id }] },
      },
    }),
    prisma.subscription.create({
      data: {
        userId: user.id,
        name: 'Udemy Business',
        description: 'Takım eğitim lisansı',
        price: 1200.00,
        currency: 'TRY',
        billingCycle: 'yearly',
        status: 'active',
        startDate: new Date(2024, 2, 1),
        nextBillingDate: new Date(2026, 2, 1),
        provider: 'Udemy',
        providerUrl: 'https://udemy.com',
        color: '#A435F0',
        icon: 'graduation-cap',
        categories: { create: [{ categoryId: categories[3].id }] },
      },
    }),
    prisma.subscription.create({
      data: {
        userId: user.id,
        name: 'GitHub Pro',
        description: 'Geliştirici araçları',
        price: 4.00,
        currency: 'USD',
        billingCycle: 'monthly',
        status: 'active',
        startDate: new Date(2023, 0, 1),
        nextBillingDate: new Date(now.getFullYear(), now.getMonth() + 1, 1),
        provider: 'GitHub',
        providerUrl: 'https://github.com',
        color: '#333333',
        icon: 'code',
        categories: { create: [{ categoryId: categories[1].id }] },
      },
    }),
    prisma.subscription.create({
      data: {
        userId: user.id,
        name: 'Adobe Creative Cloud',
        description: 'Tüm uygulamalar planı',
        price: 1050.00,
        currency: 'TRY',
        billingCycle: 'monthly',
        status: 'cancelled',
        startDate: new Date(2023, 3, 15),
        nextBillingDate: new Date(2025, 6, 15),
        cancelledAt: new Date(2025, 5, 1),
        provider: 'Adobe',
        providerUrl: 'https://adobe.com',
        color: '#FF0000',
        icon: 'palette',
        categories: { create: [{ categoryId: categories[1].id }] },
      },
    }),
    prisma.subscription.create({
      data: {
        userId: user.id,
        name: 'YouTube Premium',
        description: 'Aile planı',
        price: 79.99,
        currency: 'TRY',
        billingCycle: 'monthly',
        status: 'active',
        startDate: new Date(2024, 1, 1),
        nextBillingDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3),
        provider: 'Google',
        providerUrl: 'https://youtube.com',
        color: '#FF0000',
        icon: 'play',
        categories: { create: [{ categoryId: categories[0].id }] },
      },
    }),
    prisma.subscription.create({
      data: {
        userId: user.id,
        name: 'Figma',
        description: 'Professional plan',
        price: 12.00,
        currency: 'USD',
        billingCycle: 'monthly',
        status: 'active',
        startDate: new Date(2024, 4, 1),
        nextBillingDate: new Date(now.getFullYear(), now.getMonth() + 1, 1),
        provider: 'Figma',
        providerUrl: 'https://figma.com',
        color: '#A259FF',
        icon: 'pen-tool',
        categories: { create: [{ categoryId: categories[1].id }] },
      },
    }),
  ]);
  console.log(`✅ ${subscriptions.length} abonelik oluşturuldu`);

  // Create payment history (last 6 months)
  const paymentData: any[] = [];
  for (let monthOffset = 5; monthOffset >= 0; monthOffset--) {
    const payDate = new Date(now.getFullYear(), now.getMonth() - monthOffset, 15);

    for (const sub of subscriptions) {
      if (sub.status === 'cancelled' && sub.cancelledAt && payDate > sub.cancelledAt) continue;
      if (sub.billingCycle === 'yearly' && monthOffset !== 0) continue;

      paymentData.push({
        subscriptionId: sub.id,
        amount: sub.price,
        currency: sub.currency,
        status: 'paid',
        paidAt: payDate,
        invoiceUrl: `INV-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      });
    }
  }

  await prisma.payment.createMany({ data: paymentData });
  console.log(`✅ ${paymentData.length} ödeme kaydı oluşturuldu`);

  // Create notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: user.id,
        title: 'Hoş Geldiniz!',
        message: 'SubTracker\'a hoş geldiniz. Aboneliklerinizi kolayca yönetmeye başlayın.',
        type: 'info',
        isRead: true,
      },
      {
        userId: user.id,
        title: 'Yenileme Hatırlatması',
        message: 'YouTube Premium aboneliğiniz 3 gün içinde yenilenecek. Tutar: 79.99 TRY',
        type: 'renewal',
        isRead: false,
      },
      {
        userId: user.id,
        title: 'Ödeme Başarılı',
        message: 'Netflix için 149.99 TRY ödeme başarıyla kaydedildi.',
        type: 'payment',
        isRead: false,
      },
      {
        userId: user.id,
        title: 'Abonelik İptal Edildi',
        message: 'Adobe Creative Cloud aboneliğiniz iptal edildi.',
        type: 'cancellation',
        isRead: true,
      },
    ],
  });
  console.log('✅ Bildirimler oluşturuldu');

  console.log('\n🎉 Seed tamamlandı!');
  console.log('📧 Demo giriş: demo@subtracker.com / password123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

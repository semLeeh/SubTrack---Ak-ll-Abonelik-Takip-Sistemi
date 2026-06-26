import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt';

const prisma = new PrismaClient();

export class AuthService {
  async register(email: string, password: string, name: string) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw Object.assign(new Error('Bu e-posta adresi zaten kayıtlı'), { statusCode: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { email, name, passwordHash },
      select: { id: true, email: true, name: true, createdAt: true },
    });

    // Create default categories for new user
    await prisma.category.createMany({
      data: [
        { userId: user.id, name: 'Eğlence', color: '#8b5cf6', icon: 'tv' },
        { userId: user.id, name: 'İş', color: '#3b82f6', icon: 'briefcase' },
        { userId: user.id, name: 'Bulut', color: '#06b6d4', icon: 'cloud' },
        { userId: user.id, name: 'Eğitim', color: '#10b981', icon: 'graduation-cap' },
        { userId: user.id, name: 'Sağlık', color: '#f59e0b', icon: 'heart-pulse' },
        { userId: user.id, name: 'Müzik', color: '#ec4899', icon: 'music' },
        { userId: user.id, name: 'Diğer', color: '#6b7280', icon: 'tag' },
      ],
    });

    const token = generateToken({ id: user.id, email: user.email, name: user.name });

    return { user, token };
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw Object.assign(new Error('Geçersiz e-posta veya şifre'), { statusCode: 401 });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw Object.assign(new Error('Geçersiz e-posta veya şifre'), { statusCode: 401 });
    }

    const token = generateToken({ id: user.id, email: user.email, name: user.name });

    return {
      user: { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt },
      token,
    };
  }

  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        _count: { select: { subscriptions: true } },
      },
    });

    if (!user) {
      throw Object.assign(new Error('Kullanıcı bulunamadı'), { statusCode: 404 });
    }

    return user;
  }

  async updateProfile(userId: string, data: { name?: string; email?: string }) {
    if (data.email) {
      const existing = await prisma.user.findFirst({
        where: { email: data.email, NOT: { id: userId } },
      });
      if (existing) {
        throw Object.assign(new Error('Bu e-posta adresi zaten kullanılıyor'), { statusCode: 409 });
      }
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: { id: true, email: true, name: true, createdAt: true },
    });

    return user;
  }
}

export const authService = new AuthService();

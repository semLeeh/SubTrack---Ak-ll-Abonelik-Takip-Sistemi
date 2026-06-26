import { PrismaClient } from '@prisma/client';
import { CreateCategoryInput } from '../types';

const prisma = new PrismaClient();

export class CategoryService {
  async findAll(userId: string) {
    const categories = await prisma.category.findMany({
      where: { userId },
      include: {
        _count: { select: { subscriptions: true } },
      },
      orderBy: { name: 'asc' },
    });

    return categories;
  }

  async create(userId: string, data: CreateCategoryInput) {
    const category = await prisma.category.create({
      data: {
        userId,
        name: data.name,
        color: data.color || '#6366f1',
        icon: data.icon || 'tag',
      },
    });

    return category;
  }

  async update(userId: string, id: string, data: Partial<CreateCategoryInput>) {
    const existing = await prisma.category.findFirst({ where: { id, userId } });
    if (!existing) {
      throw Object.assign(new Error('Kategori bulunamadı'), { statusCode: 404 });
    }

    const category = await prisma.category.update({
      where: { id },
      data,
    });

    return category;
  }

  async delete(userId: string, id: string) {
    const existing = await prisma.category.findFirst({ where: { id, userId } });
    if (!existing) {
      throw Object.assign(new Error('Kategori bulunamadı'), { statusCode: 404 });
    }

    await prisma.category.delete({ where: { id } });
    return { message: 'Kategori silindi' };
  }
}

export const categoryService = new CategoryService();

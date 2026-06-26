import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  console.error('Unhandled Error:', err);

  if (err.name === 'ZodError') {
    res.status(400).json({
      error: 'Geçersiz istek verisi',
      details: (err as any).errors,
    });
    return;
  }

  if (err.name === 'PrismaClientKnownRequestError') {
    const prismaError = err as any;
    if (prismaError.code === 'P2002') {
      res.status(409).json({
        error: 'Bu kayıt zaten mevcut',
        field: prismaError.meta?.target,
      });
      return;
    }
    if (prismaError.code === 'P2025') {
      res.status(404).json({ error: 'Kayıt bulunamadı' });
      return;
    }
  }

  res.status(500).json({
    error: 'Sunucu hatası',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
}

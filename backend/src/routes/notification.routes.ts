import { Router, Response } from 'express';
import { notificationService } from '../services/notification.service';
import { authMiddleware } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = Router();

router.use(authMiddleware);

// GET /api/notifications
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const unreadOnly = req.query.unreadOnly === 'true';
    const result = await notificationService.findAll(req.user!.id, unreadOnly);
    res.json(result);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

// PATCH /api/notifications/:id/read
router.patch('/:id/read', async (req: AuthRequest, res: Response) => {
  try {
    const notification = await notificationService.markAsRead(req.user!.id, req.params.id);
    res.json(notification);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

// PATCH /api/notifications/read-all
router.patch('/read-all', async (req: AuthRequest, res: Response) => {
  try {
    const result = await notificationService.markAllAsRead(req.user!.id);
    res.json(result);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

export default router;

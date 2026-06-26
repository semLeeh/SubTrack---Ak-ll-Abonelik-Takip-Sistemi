import { Router, Response } from 'express';
import { z } from 'zod';
import { subscriptionService } from '../services/subscription.service';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { AuthRequest } from '../types';

const router = Router();

const createSchema = z.object({
  name: z.string().min(1, 'Abonelik adı gereklidir'),
  description: z.string().optional(),
  price: z.number().positive('Fiyat pozitif olmalıdır'),
  currency: z.string().default('TRY'),
  billingCycle: z.enum(['weekly', 'monthly', 'yearly']),
  startDate: z.string().optional(),
  nextBillingDate: z.string(),
  provider: z.string().optional(),
  providerUrl: z.string().url().optional().or(z.literal('')),
  color: z.string().optional(),
  icon: z.string().optional(),
  categoryIds: z.array(z.string()).optional(),
});

const updateSchema = createSchema.partial();

// All routes require authentication
router.use(authMiddleware);

// GET /api/subscriptions/stats
router.get('/stats', async (req: AuthRequest, res: Response) => {
  try {
    const stats = await subscriptionService.getStats(req.user!.id);
    res.json(stats);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

// GET /api/subscriptions
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const filters = {
      status: req.query.status as string,
      search: req.query.search as string,
      categoryId: req.query.categoryId as string,
      billingCycle: req.query.billingCycle as string,
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as 'asc' | 'desc',
    };
    const subscriptions = await subscriptionService.findAll(req.user!.id, filters);
    res.json(subscriptions);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

// GET /api/subscriptions/:id
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const subscription = await subscriptionService.findById(req.user!.id, req.params.id);
    res.json(subscription);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

// POST /api/subscriptions
router.post('/', validate(createSchema), async (req: AuthRequest, res: Response) => {
  try {
    const subscription = await subscriptionService.create(req.user!.id, req.body);
    res.status(201).json(subscription);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

// PUT /api/subscriptions/:id
router.put('/:id', validate(updateSchema), async (req: AuthRequest, res: Response) => {
  try {
    const subscription = await subscriptionService.update(req.user!.id, req.params.id, req.body);
    res.json(subscription);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

// PATCH /api/subscriptions/:id/cancel
router.patch('/:id/cancel', async (req: AuthRequest, res: Response) => {
  try {
    const subscription = await subscriptionService.cancel(req.user!.id, req.params.id);
    res.json(subscription);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

export default router;

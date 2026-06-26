import { Router, Response } from 'express';
import { z } from 'zod';
import { paymentService } from '../services/payment.service';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { AuthRequest } from '../types';

const router = Router();

const createPaymentSchema = z.object({
  subscriptionId: z.string().min(1),
  amount: z.number().positive(),
  currency: z.string().optional(),
  status: z.enum(['paid', 'pending', 'failed', 'refunded']).optional(),
  paidAt: z.string().optional(),
});

router.use(authMiddleware);

// GET /api/payments
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string;
    const result = await paymentService.findAll(req.user!.id, page, limit, status);
    res.json(result);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

// GET /api/payments/summary
router.get('/summary', async (req: AuthRequest, res: Response) => {
  try {
    const summary = await paymentService.getSummary(req.user!.id);
    res.json(summary);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

// POST /api/payments
router.post('/', validate(createPaymentSchema), async (req: AuthRequest, res: Response) => {
  try {
    const payment = await paymentService.create(req.user!.id, req.body);
    res.status(201).json(payment);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

export default router;

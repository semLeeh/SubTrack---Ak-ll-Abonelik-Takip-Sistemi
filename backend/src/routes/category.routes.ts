import { Router, Response } from 'express';
import { z } from 'zod';
import { categoryService } from '../services/category.service';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { AuthRequest } from '../types';

const router = Router();

const categorySchema = z.object({
  name: z.string().min(1, 'Kategori adı gereklidir'),
  color: z.string().optional(),
  icon: z.string().optional(),
});

router.use(authMiddleware);

// GET /api/categories
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const categories = await categoryService.findAll(req.user!.id);
    res.json(categories);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

// POST /api/categories
router.post('/', validate(categorySchema), async (req: AuthRequest, res: Response) => {
  try {
    const category = await categoryService.create(req.user!.id, req.body);
    res.status(201).json(category);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

// PUT /api/categories/:id
router.put('/:id', validate(categorySchema.partial()), async (req: AuthRequest, res: Response) => {
  try {
    const category = await categoryService.update(req.user!.id, req.params.id, req.body);
    res.json(category);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

// DELETE /api/categories/:id
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const result = await categoryService.delete(req.user!.id, req.params.id);
    res.json(result);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

export default router;

import { Router, Response } from 'express';
import { reportService } from '../services/report.service';
import { authMiddleware } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = Router();

router.use(authMiddleware);

// GET /api/reports/revenue
router.get('/revenue', async (req: AuthRequest, res: Response) => {
  try {
    const months = parseInt(req.query.months as string) || 12;
    const data = await reportService.getRevenueData(req.user!.id, months);
    res.json(data);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

// GET /api/reports/categories
router.get('/categories', async (req: AuthRequest, res: Response) => {
  try {
    const data = await reportService.getCategoryDistribution(req.user!.id);
    res.json(data);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

// GET /api/reports/export/subscriptions
router.get('/export/subscriptions', async (req: AuthRequest, res: Response) => {
  try {
    const csv = await reportService.exportSubscriptionsCSV(req.user!.id);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="abonelikler.csv"');
    // Add BOM for Turkish characters in Excel
    res.send('\uFEFF' + csv);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

// GET /api/reports/export/payments
router.get('/export/payments', async (req: AuthRequest, res: Response) => {
  try {
    const csv = await reportService.exportPaymentsCSV(req.user!.id);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="odemeler.csv"');
    res.send('\uFEFF' + csv);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

export default router;

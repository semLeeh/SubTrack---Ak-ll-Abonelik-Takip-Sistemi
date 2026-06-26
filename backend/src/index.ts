import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth.routes';
import subscriptionRoutes from './routes/subscription.routes';
import paymentRoutes from './routes/payment.routes';
import categoryRoutes from './routes/category.routes';
import notificationRoutes from './routes/notification.routes';
import reportRoutes from './routes/report.routes';

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reports', reportRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

// Start server
app.listen(config.port, () => {
  console.log(`🚀 SubTracker API sunucusu port ${config.port}'de çalışıyor`);
  console.log(`📡 CORS origin: ${config.corsOrigin}`);
  console.log(`🔧 Environment: ${config.nodeEnv}`);
});

export default app;

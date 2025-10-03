import express from 'express';
import type { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import timeout from 'connect-timeout';

import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import apiRoutes from './routes';
import { config } from './config';
  
const app: Express = express();

app.use(helmet());
app.use(cors(config.cors));
app.use(compression());
app.use(morgan('combined'));
app.use(timeout('30s'));

const limiter = rateLimit(config.rateLimit);
app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
});
});

// API routes
app.use('/api/v1', apiRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

export default app;
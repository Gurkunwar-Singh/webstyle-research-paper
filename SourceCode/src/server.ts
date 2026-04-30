/* eslint-disable no-unused-vars */
import express from 'express';
import routes from './routes/route';
import logger from './utils/logger';
import cors from 'cors';
import { browserPool } from './puppeteer/BrowserPool';
const app = express();
const allowedOrigins = [
  'http://localhost:3001',
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL || 'https://webstyle-analyzer.vercel.app',
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        console.log('Origin not allowed:', origin);
        callback(null, true); // Allow all in production for testing
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/', routes);
app.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    logger.info('Initializing browser pool...');
    await browserPool.initialize();
    logger.info('Browser pool ready');

    app.listen(PORT, () => {
      logger.info(`Theme Extraction API Server listening on port ${PORT}`);
      logger.info(`Health check: http://localhost:${PORT}/health`);
    });
  } catch (err) {
    logger.error('Failed to initialize browser pool on startup:', err);
    process.exit(1);
  }
}

startServer();

export default app;

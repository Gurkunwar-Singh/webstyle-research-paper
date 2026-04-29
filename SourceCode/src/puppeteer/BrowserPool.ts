// src/utils/browserPool.ts
import dotenv from 'dotenv';
import puppeteer, { Browser } from 'puppeteer';
import { BrowserPoolItem } from '../type';
import logger from '../utils/logger';

dotenv.config();

const BROWSER_INSTANCES = parseInt(process.env.BROWSER_INSTANCES || '2');
let BROWSER_INSTANCE_DEBUG_PORT_STARTING = parseInt(
  process.env.BROWSER_INSTANCE_DEBUG_PORT || '1001'
);
const ENVIRONMENT = process.env.ENVIRONMENT || 'production';
const PROXIES = process.env.PROXIES ? process.env.PROXIES.split(',') : [];

class BrowserPool {
  private pool: BrowserPoolItem[] = [];
  private maxPoolSize: number;
  private isInitialized = false;

  constructor(maxPoolSize = 2) {
    this.maxPoolSize = maxPoolSize;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    logger.info(`Initializing browser pool with ${this.maxPoolSize} instances`);
    
    for (let i = 0; i < this.maxPoolSize; i++) {
      let launchArgs: string[] = [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
        '--window-size=1920,1080',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-extensions'
      ];

      let linkedPort: number | undefined;

      if (ENVIRONMENT === 'development') {
        linkedPort = BROWSER_INSTANCE_DEBUG_PORT_STARTING++;
        launchArgs.push(`--remote-debugging-port=${linkedPort}`);
      }

      // Add proxy if available
      if (PROXIES.length > i && PROXIES[i]) {
        launchArgs.push(`--proxy-server=${PROXIES[i]}`);
        logger.info(`Using proxy for browser ${i}: ${PROXIES[i]}`);
      }

      try {
        // Try multiple possible Chrome paths on Render
        const chromePaths = [
          '/usr/bin/google-chrome',
          '/usr/bin/chromium',
          '/usr/bin/chromium-browser',
          process.env.PUPPETEER_EXECUTABLE_PATH
        ].filter(Boolean);

        let browser: Browser | null = null;
        
        // Try each Chrome path
        for (const chromePath of chromePaths) {
          try {
            browser = await puppeteer.launch({
              headless: true,
              executablePath: chromePath as string,
              args: launchArgs,
            });
            logger.info(`Successfully launched Chrome at: ${chromePath}`);
            break;
          } catch (err) {
            logger.warn(`Failed to launch Chrome at ${chromePath}:`, err);
          }
        }

        // If no Chrome found, let puppeteer download its own
        if (!browser) {
          logger.info('Falling back to puppeteer-managed Chrome');
          browser = await puppeteer.launch({
            headless: true,
            args: launchArgs,
          });
        }

        this.pool.push({
          browser,
          linkedPort,
        });
        
        logger.info(`Browser instance ${i + 1}/${this.maxPoolSize} initialized`);
      } catch (error) {
        logger.error(`Failed to launch browser instance ${i}:`, error);
        throw error;
      }
    }

    this.isInitialized = true;
    logger.info('Browser pool initialized successfully');
  }

  async getBrowser(): Promise<BrowserPoolItem> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    if (this.pool.length === 0) {
      throw new Error('No browsers available in pool');
    }
    
    const browser = this.pool.shift()!;
    this.pool.push(browser);
    return browser;
  }

  async closeAll() {
    logger.info('Closing all browser instances...');
    await Promise.all(this.pool.map(item => item.browser.close()));
    this.pool = [];
    this.isInitialized = false;
    logger.info('All browser instances closed');
  }
}

export const browserPool = new BrowserPool(BROWSER_INSTANCES);

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, closing browser pool...');
  await browserPool.closeAll();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, closing browser pool...');
  await browserPool.closeAll();
  process.exit(0);
});
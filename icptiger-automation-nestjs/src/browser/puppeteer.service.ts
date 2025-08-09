import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Browser, Page } from 'puppeteer';

puppeteer.use(StealthPlugin());

interface BrowserConfig {
  executablePath?: string;
  headless: boolean;
  defaultViewport: {
    width: number;
    height: number;
  };
}

@Injectable()
export class PuppeteerService implements OnModuleInit {
  private readonly logger = new Logger(PuppeteerService.name);
  private browser: Browser | null = null;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.logger.log('Puppeteer service initialized');
  }

  async launchBrowser(): Promise<Browser> {
    try {
      const config = this.configService.get<BrowserConfig>('browser');

      if (!config) {
        throw new Error('Browser configuration not found');
      }

      const browserOptions = {
        headless: false,
        executablePath: config.executablePath,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu',
          '--disable-software-rasterizer',
          '--disable-background-timer-throttling',
          '--disable-backgrounding-occluded-windows',
          '--disable-renderer-backgrounding',
          `--window-size=${config.defaultViewport.width},${config.defaultViewport.height}`,
          '--start-maximized',
          '--disable-web-security',
          '--disable-features=VizDisplayCompositor',
        ],
        defaultViewport: {
          width: config.defaultViewport.width,
          height: config.defaultViewport.height,
          deviceScaleFactor: 1,
        },
      };

      this.browser = await puppeteer.launch(browserOptions);
      this.logger.log('Browser launched successfully');

      return this.browser;
    } catch (error) {
      this.logger.error('Failed to launch browser:', error);
      throw error;
    }
  }

  async createPage(browser?: Browser): Promise<Page> {
    try {
      const targetBrowser = browser || this.browser;

      if (!targetBrowser) {
        throw new Error('No browser instance available');
      }

      const config = this.configService.get<BrowserConfig>('browser');

      if (!config) {
        throw new Error('Browser configuration not found');
      }

      const page = await targetBrowser.newPage();

      // Set proper viewport size from configuration
      await page.setViewport({
        width: config.defaultViewport.width,
        height: config.defaultViewport.height,
        deviceScaleFactor: 1,
      });

      // Set user agent
      await page.setUserAgent(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      );

      // Set extra headers for better compatibility
      await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      });

      return page;
    } catch (error) {
      this.logger.error('Failed to create page:', error);
      throw error;
    }
  }

  async closeBrowser(): Promise<void> {
    try {
      if (this.browser) {
        await this.browser.close();
        this.browser = null;
        this.logger.log('Browser closed successfully');
      }
    } catch (error) {
      this.logger.error('Failed to close browser:', error);
    }
  }

  getBrowser(): Browser | null {
    return this.browser;
  }
}

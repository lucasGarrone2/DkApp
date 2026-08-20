import puppeteer from 'puppeteer';
import { Browser, Page } from 'puppeteer';

// Identifiable bot User-Agent for legal compliance
// References a public page explaining the bot's purpose and offering opt-out
const BOT_USER_AGENT = 'DkApp-Bot/1.0 (+https://dk-app-woad.vercel.app/bot-info; rental-aggregator; contact: lucasgarrone4@gmail.com)';

/**
 * Creates and configures a Puppeteer browser instance.
 * Uses an identifiable User-Agent instead of stealth/spoofing for legal compliance.
 */
export async function createBrowser(): Promise<Browser> {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--window-size=1920,1080',
    ],
  });
  return browser;
}

/**
 * Creates a new page with identifiable bot User-Agent and resource blocking for performance.
 * Blocks fonts, stylesheets, media, and images (we don't store images for legal compliance).
 */
export async function createPage(browser: Browser): Promise<Page> {
  const page = await browser.newPage();

  // Set identifiable bot User-Agent
  await page.setUserAgent(BOT_USER_AGENT);

  // Set viewport
  await page.setViewport({ width: 1920, height: 1080 });

  // Intercept network requests to block unnecessary resources
  await page.setRequestInterception(true);

  page.on('request', (request) => {
    const resourceType = request.resourceType();

    // Block heavy resources we don't need — including images (legal compliance: no thumbnails)
    if (['font', 'stylesheet', 'media', 'image'].includes(resourceType)) {
      request.abort();
    } else {
      request.continue();
    }
  });

  return page;
}

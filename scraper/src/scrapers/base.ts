import { randomDelay } from '../utils/delay';
import { ListingInput } from '../types';
import { checkRobotsPermission } from '../utils/robotsTxt';
import { sanitizePersonalData } from '../utils/sanitize';
import crypto from 'crypto';

/**
 * Base scraper class defining common structure and utilities.
 * Includes legal compliance: robots.txt verification, data sanitization,
 * and respectful crawl delays.
 */
export abstract class BaseScraper {
  abstract name: string;

  /**
   * Main method to scrape listings from the target platform
   */
  abstract scrape(): Promise<ListingInput[]>;

  /**
   * Generates a deterministic ID for a listing based on its URL
   */
  protected generateExternalId(url: string): string {
    return crypto.createHash('sha256').update(url).digest('hex');
  }

  /**
   * Adds a random delay between actions.
   * Increased to 4-8 seconds for respectful crawling (legal compliance).
   */
  protected async delay(min = 4000, max = 8000): Promise<void> {
    await randomDelay(min, max);
  }

  /**
   * Logs a message with scraper name prefix
   */
  protected log(message: string): void {
    console.log(`[${this.name}] ${message}`);
  }

  /**
   * Sanitizes text by removing personal data (GDPR compliance).
   */
  protected sanitize(text: string): string {
    return sanitizePersonalData(text);
  }

  /**
   * Checks robots.txt before scraping a URL.
   * Returns true if scraping is allowed, false otherwise.
   * Also adjusts crawl delay if specified in robots.txt.
   */
  protected async isScrapingAllowed(url: string): Promise<boolean> {
    const { allowed, crawlDelay } = await checkRobotsPermission(url);

    if (!allowed) {
      this.log(`🚫 BLOCKED by robots.txt: ${url} — Skipping this URL.`);
      return false;
    }

    if (crawlDelay && crawlDelay > 0) {
      this.log(`⏱️ robots.txt requests crawl-delay of ${crawlDelay}s`);
      await new Promise((resolve) => setTimeout(resolve, crawlDelay * 1000));
    }

    this.log(`✅ robots.txt allows scraping: ${url}`);
    return true;
  }
}

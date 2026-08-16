import { randomDelay } from '../utils/delay';
import { ListingInput } from '../types';
import crypto from 'crypto';

/**
 * Base scraper class defining common structure and utilities
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
   * Adds a random delay between actions
   */
  protected async delay(min = 2000, max = 5000): Promise<void> {
    await randomDelay(min, max);
  }

  /**
   * Logs a message with scraper name prefix
   */
  protected log(message: string): void {
    console.log(`[${this.name}] ${message}`);
  }
}

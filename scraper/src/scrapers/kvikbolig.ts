import { BaseScraper } from './base';
import { ListingInput } from '../types';
import { Browser, Page } from 'puppeteer';
import { createPage } from '../utils/browser';
import {
  cleanText,
  parsePrice,
  parseRooms,
  parseSize,
  parseCprAllowed,
  parseFurnished,
  parseRentalPeriod,
  parsePrepaidRent,
  isRealRentalListing,
} from '../utils/parser';
import { normalizeLocation } from '../utils/location';
import { config } from '../config';

interface RawKvikItem {
  url: string;
  fullText: string;
  imgUrl: string;
}

export class KvikboligScraper extends BaseScraper {
  name = 'Kvikbolig.dk';
  private browser: Browser;

  private targetUrls = [
    'https://kvikbolig.dk/rental-property/copenhagen',
    'https://kvikbolig.dk/rental-property/storkobenhavn',
    'https://kvikbolig.dk/rental-property/amager',
    'https://kvikbolig.dk/rental-property/vesterbro',
    'https://kvikbolig.dk/rental-property/indre-by-kobenhavn',
  ];

  constructor(browser: Browser) {
    super();
    this.browser = browser;
  }

  async scrape(): Promise<ListingInput[]> {
    const listings: ListingInput[] = [];
    const page = await createPage(this.browser);

    try {
      // 1. Authenticate to unlock full rental details
      await this.login(page);

      // 2. Iterate search areas in Copenhagen
      for (const url of this.targetUrls) {
        this.log(`🕵️ Scraping Kvikbolig: ${url}`);

        try {
          await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 35000 });
          await this.delay(2500, 4000);

          const rawItems = await this.extractRawItems(page);
          const transformed = this.transformRawItems(rawItems);
          this.log(`✅ Extracted ${transformed.length} rental properties from ${url}`);
          listings.push(...transformed);
        } catch (subErr) {
          this.log(`⚠️ Error scraping ${url}: ${(subErr as Error).message}`);
        }

        await this.delay(1500, 3000);
      }
    } catch (error) {
      this.log(`❌ Error scraping Kvikbolig: ${(error as Error).message}`);
    } finally {
      await page.close();
    }

    return listings;
  }

  private async login(page: Page): Promise<void> {
    if (!config.kvikboligEmail || !config.kvikboligPassword) {
      this.log('⚠️ No Kvikbolig credentials provided, proceeding anonymously.');
      return;
    }

    try {
      this.log('🔑 Logging into Kvikbolig account...');
      await page.goto('https://kvikbolig.dk/users/sign_in?locale=en', {
        waitUntil: 'domcontentloaded',
        timeout: 30000,
      });
      await this.delay(1500, 2500);

      // Accept cookies banner if present
      try {
        const cookieBtn = await page.$('button[id*="accept"], button[class*="accept"], #cookies-necessary');
        if (cookieBtn) await cookieBtn.click();
      } catch (_) {}

      // Fill credentials
      await page.type('#user_email', config.kvikboligEmail, { delay: 30 });
      await page.type('#user_password', config.kvikboligPassword, { delay: 30 });
      await this.delay(400, 800);

      // Submit
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {}),
        page.click('input[name="commit"], button[type="submit"]'),
      ]);

      this.log('✅ Kvikbolig login successful!');
      await this.delay(1500, 2500);
    } catch (err) {
      this.log(`⚠️ Login attempt failed: ${(err as Error).message}`);
    }
  }

  private async extractRawItems(page: Page): Promise<RawKvikItem[]> {
    return page.evaluate(() => {
      const items: any[] = [];
      const cardEls = Array.from(document.querySelectorAll('div.property-item, div[class*="property-card"], article'));
      const seen = new Set<string>();

      cardEls.forEach((card) => {
        try {
          const linkEl = card.tagName === 'A' ? (card as HTMLAnchorElement) : (card.querySelector('a') as HTMLAnchorElement);
          if (!linkEl || !linkEl.href) return;
          const url = linkEl.href;
          if (seen.has(url)) return;
          seen.add(url);

          const fullText = card.textContent || '';
          const imgEl = card.querySelector('img');
          const imgUrl = imgEl ? (imgEl as HTMLImageElement).src || imgEl.getAttribute('data-src') || '' : '';

          items.push({
            url,
            fullText: fullText.replace(/\s+/g, ' ').trim(),
            imgUrl,
          });
        } catch (_) {}
      });

      return items;
    });
  }

  private transformRawItems(rawItems: RawKvikItem[]): ListingInput[] {
    const uniqueMap = new Map<string, RawKvikItem>();
    rawItems.forEach((item) => {
      if (item.url && !uniqueMap.has(item.url)) {
        uniqueMap.set(item.url, item);
      }
    });

    return Array.from(uniqueMap.values())
      .map((item) => {
        try {
          const rawText = cleanText(item.fullText);
          const price = parsePrice(rawText);
          const size = parseSize(rawText);
          const rooms = parseRooms(rawText);

          let postalCode: string | null = null;
          const postalMatch = rawText.match(/\b(1\d{3}|2\d{3})\b/);
          if (postalMatch) postalCode = postalMatch[1];

          const locationName = normalizeLocation(rawText, postalCode || undefined);

          let title = '';
          const titleMatch = rawText.match(/^([^k•]+?)(?:kr|\d+\s*Rooms|\d+\s*m²)/i);
          if (titleMatch && titleMatch[1].trim().length > 5) {
            title = titleMatch[1].trim();
          } else {
            const parts: string[] = [];
            if (rooms) parts.push(`${rooms} rum`);
            parts.push('lejlighed');
            if (locationName) parts.push(`i ${locationName}`);
            title = parts.join(' ');
          }

          if (!price || !isRealRentalListing(title + ' ' + rawText, price, true)) {
            return null;
          }

          const cprAllowed = parseCprAllowed(rawText);
          const isFurnished = parseFurnished(rawText);
          const rentalPeriodType = parseRentalPeriod(rawText);
          const prepaidRentDkk = parsePrepaidRent(rawText, price);

          const listing: ListingInput = {
            external_id: this.generateExternalId(item.url),
            source_platform: 'Other',
            title: `Kvikbolig: ${title}`,
            url: item.url,
            price_dkk: price,
            deposit_dkk: Math.round(price * 3), // Standard Danish deposit
            rooms,
            size_m2: size,
            location_name: locationName,
            postal_code: postalCode,
            images: item.imgUrl ? [item.imgUrl] : [],
            cpr_allowed: cprAllowed ?? true,
            is_furnished: isFurnished,
            rental_period_type: rentalPeriodType,
            prepaid_rent_dkk: prepaidRentDkk,
          };

          return listing;
        } catch (_) {
          return null;
        }
      })
      .filter((item): item is ListingInput => item !== null && Boolean(item.url));
  }
}

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
} from '../utils/parser';
import { normalizeLocation } from '../utils/location';

interface RawEdcItem {
  url: string;
  fullText: string;
  imgUrl: string;
}

export class EdcScraper extends BaseScraper {
  name = 'EDC.dk';
  private browser: Browser;
  private maxPages = 3;

  constructor(browser: Browser) {
    super();
    this.browser = browser;
  }

  async scrape(): Promise<ListingInput[]> {
    const listings: ListingInput[] = [];
    const page = await createPage(this.browser);

    try {
      for (let pageNum = 1; pageNum <= this.maxPages; pageNum++) {
        const url = pageNum === 1
          ? 'https://www.edc.dk/lejebolig/koebenhavn/'
          : `https://www.edc.dk/lejebolig/koebenhavn/?side=${pageNum}`;

        this.log(`🕵️ Scraping EDC page ${pageNum}: ${url}`);
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await this.delay(2500, 4000);

        try {
          const cookieBtn = await page.$('#coiPage-1 .coi-banner__accept, button[id*="accept"], button[class*="accept"]');
          if (cookieBtn) {
            await cookieBtn.click();
            await this.delay(1000);
          }
        } catch (_) {}

        const rawItems = await this.extractRawItems(page);
        const pageListings = this.transformRawItems(rawItems);
        this.log(`✅ Extracted ${pageListings.length} real rental apartments from page ${pageNum}`);
        listings.push(...pageListings);

        if (pageNum < this.maxPages && pageListings.length > 0) {
          await this.delay(2500, 4500);
        } else if (pageListings.length === 0) {
          break;
        }
      }
    } catch (error) {
      this.log(`❌ Error scraping EDC: ${(error as Error).message}`);
    } finally {
      await page.close();
    }

    return listings;
  }

  private async extractRawItems(page: Page): Promise<RawEdcItem[]> {
    return page.evaluate(() => {
      const items: any[] = [];
      const linkEls = Array.from(document.querySelectorAll('a[href*="/sag/"], a[href*="/leje/lejlighed/"]'));
      const seen = new Set<string>();

      linkEls.forEach((link) => {
        try {
          const url = (link as HTMLAnchorElement).href;
          if (!url || seen.has(url)) return;
          seen.add(url);

          const container = link.closest('article, div[class*="card"], li') || link.parentElement;
          const fullText = container ? container.textContent : link.textContent;
          const imgEl = container ? container.querySelector('img') : null;
          const imgUrl = imgEl ? (imgEl as HTMLImageElement).src || imgEl.getAttribute('data-src') || '' : '';

          items.push({
            url,
            fullText: fullText ? fullText.replace(/\s+/g, ' ').trim() : '',
            imgUrl,
          });
        } catch (_) {}
      });

      return items;
    });
  }

  private transformRawItems(rawItems: RawEdcItem[]): ListingInput[] {
    const uniqueMap = new Map<string, RawEdcItem>();
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
          const addressMatch = rawText.match(/([A-ZÆØÅ][a-zæøåA-ZÆØÅ0-9\.\s\-]+,\s*\d+\.?\s*[a-z0-9]*|\b[A-ZÆØÅ][a-zæøåA-ZÆØÅ0-9\.\s\-]+\s+\d+\b)/);
          if (addressMatch && addressMatch[1].length > 5) {
            title = addressMatch[1].trim();
          } else {
            const parts: string[] = [];
            if (rooms) parts.push(`${rooms} rum`);
            parts.push('lejlighed');
            if (locationName) parts.push(`i ${locationName}`);
            title = parts.join(' ');
          }

          if (!price || price < 3000 || price > 55000) {
            return null;
          }

          // Phase 2 extractions
          const cprAllowed = parseCprAllowed(rawText);
          const isFurnished = parseFurnished(rawText);
          const rentalPeriodType = parseRentalPeriod(rawText);
          const prepaidRentDkk = parsePrepaidRent(rawText, price);

          const listing: ListingInput = {
            external_id: this.generateExternalId(item.url),
            source_platform: 'Other',
            title: `EDC: ${title}`,
            url: item.url,
            price_dkk: price,
            deposit_dkk: Math.round(price * 3), // EDC deposit standard is 3 months
            rooms,
            size_m2: size,
            location_name: locationName,
            postal_code: postalCode,
            images: item.imgUrl ? [item.imgUrl] : [],
            cpr_allowed: cprAllowed ?? true, // EDC commercial rentals almost always allow CPR
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

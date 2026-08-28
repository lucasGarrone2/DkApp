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

interface RawHAItem {
  url: string;
  fullText: string;
  imgUrl: string;
}

export class HousingAnywhereScraper extends BaseScraper {
  name = 'HousingAnywhere';
  private browser: Browser;

  // Comprehensive neighborhood & category endpoints across Copenhagen
  private targetUrls = [
    'https://housinganywhere.com/s/Copenhagen--Denmark',
    'https://housinganywhere.com/s/Copenhagen--Denmark?categories=apartment',
    'https://housinganywhere.com/s/Copenhagen--Denmark?categories=room',
    'https://housinganywhere.com/s/Copenhagen--Denmark?categories=studio',
    'https://housinganywhere.com/s/Frederiksberg--Denmark',
    'https://housinganywhere.com/s/Amager--Denmark',
    'https://housinganywhere.com/s/Valby--Denmark',
    'https://housinganywhere.com/s/Vesterbro--Denmark',
    'https://housinganywhere.com/s/N%C3%B8rrebro--Denmark',
    'https://housinganywhere.com/s/Østerbro--Denmark',
  ];

  constructor(browser: Browser) {
    super();
    this.browser = browser;
  }

  async scrape(): Promise<ListingInput[]> {
    const listings: ListingInput[] = [];
    const page = await createPage(this.browser);

    try {
      // Legal compliance: check robots.txt before scraping
      const firstUrl = this.targetUrls[0];
      if (!(await this.isScrapingAllowed(firstUrl))) {
        this.log('⛔ HousingAnywhere has blocked our bot via robots.txt. Skipping entirely.');
        return listings;
      }

      for (const url of this.targetUrls) {
        this.log(`🕵️ Scraping HousingAnywhere: ${url}`);

        try {
          await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 35000 });
          await this.delay(4000, 7000);

          try {
            const cookieBtn = await page.$('button[id*="accept"], button[class*="accept"]');
            if (cookieBtn) {
              await cookieBtn.click();
              await this.delay(1000);
            }
          } catch (_) {}

          const rawItems = await this.extractRawItems(page);
          const transformed = this.transformRawItems(rawItems);
          this.log(`✅ Extracted ${transformed.length} real rental apartments from ${url}`);
          listings.push(...transformed);
        } catch (subErr) {
          this.log(`⚠️ Error on URL ${url}: ${(subErr as Error).message}`);
        }

        await this.delay(3000, 6000);
      }
    } catch (error) {
      this.log(`❌ Error scraping HousingAnywhere: ${(error as Error).message}`);
    } finally {
      await page.close();
    }

    return listings;
  }

  private async extractRawItems(page: Page): Promise<RawHAItem[]> {
    return page.evaluate(() => {
      const items: any[] = [];
      const linkEls = Array.from(document.querySelectorAll('a[href*="/room/"], a[href*="/apartment/"]'));
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

  private transformRawItems(rawItems: RawHAItem[]): ListingInput[] {
    const uniqueMap = new Map<string, RawHAItem>();
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

          let postalCode: string | null = null;
          const postalMatch = rawText.match(/\b(1\d{3}|2\d{3})\b/);
          if (postalMatch) postalCode = postalMatch[1];

          const locationName = normalizeLocation(rawText, postalCode || undefined);

          let title = '';
          const titleMatch = rawText.match(
            /(Apartment in [^0-9\.\,\•]+|Studio in [^0-9\.\,\•]+|Room in [^0-9\.\,\•]+)/i
          );
          if (titleMatch) {
            title = titleMatch[1].trim();
          } else {
            title = `Lejlighed i ${locationName}`;
          }

          title = this.sanitize(title);

          const isRoomOffer =
            title.toLowerCase().includes('room in') ||
            title.toLowerCase().includes('private room') ||
            rawText.toLowerCase().includes('private room') ||
            rawText.toLowerCase().includes('shared room') ||
            item.url.includes('/room/');

          const rooms = isRoomOffer ? 1 : (parseRooms(rawText, title) || 1);

          if (!price || price < 3000 || price > 55000) {
            return null;
          }

          // Phase 2 extractions
          const cprAllowed = parseCprAllowed(rawText);
          const isFurnished = parseFurnished(rawText) || true; // HousingAnywhere listings are predominantly furnished
          const rentalPeriodType = parseRentalPeriod(rawText, 'temporary');
          const prepaidRentDkk = parsePrepaidRent(rawText, price);

          const listing: ListingInput = {
            external_id: this.generateExternalId(item.url),
            source_platform: 'Other',
            title: `HousingAnywhere: ${title}`,
            url: item.url,
            price_dkk: price,
            deposit_dkk: price,
            rooms,
            size_m2: size,
            location_name: locationName,
            postal_code: postalCode,
            images: [], // Legal compliance: no image storage
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

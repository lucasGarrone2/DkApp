import { BaseScraper } from './base';
import { ListingInput } from '../types';
import { Browser, Page } from 'puppeteer';
import { createPage } from '../utils/browser';
import { cleanText, parsePrice, parseRooms, parseSize } from '../utils/parser';
import { normalizeLocation } from '../utils/location';

interface RawLejeboligItem {
  url: string;
  title: string;
  priceText: string;
  locationText: string;
  imgUrl: string;
  sizeText: string;
  roomsText: string;
}

export class LejeboligScraper extends BaseScraper {
  name = 'Lejebolig.dk';
  private browser: Browser;

  constructor(browser: Browser) {
    super();
    this.browser = browser;
  }

  async scrape(): Promise<ListingInput[]> {
    const listings: ListingInput[] = [];
    const page = await createPage(this.browser);

    try {
      const url = 'https://www.lejebolig.dk/lejligheder/k%C3%B8benhavn';
      this.log(`🕵️ Scraping: ${url}`);

      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

      // Handle cookie consent if present
      try {
        const cookieBtn = await page.$(
          '#coiPage-1 .coi-banner__accept, [data-action="accept"], button[class*="accept"], .coi-consent-banner__agree-btn'
        );
        if (cookieBtn) {
          this.log('🍪 Accepting cookies');
          await cookieBtn.click();
          await this.delay(1000);
        }
      } catch (_) {}

      // Wait up to 10s for listing cards or links to load via JS
      try {
        await page.waitForSelector('article, [class*="ListItem"], [class*="card"], a[href*="/bolig/"]', {
          timeout: 10000,
        });
      } catch (_) {
        this.log('⚠️ Selector timeout, reading DOM state as-is...');
      }

      await this.delay(3000, 4000);

      const rawItems = await this.extractRawItems(page);
      const transformed = this.transformRawItems(rawItems);
      this.log(`✅ Extracted ${transformed.length} valid listings`);
      listings.push(...transformed);
    } catch (error) {
      this.log(`❌ Error scraping Lejebolig: ${(error as Error).message}`);
    } finally {
      await page.close();
    }

    return listings;
  }

  private async extractRawItems(page: Page): Promise<RawLejeboligItem[]> {
    return page.evaluate(() => {
      const items: any[] = [];
      
      // Match links to rental properties or card containers
      const cards = document.querySelectorAll('article, [class*="ListItem"], [class*="card"], div[class*="property"], li');
      const seenUrls = new Set<string>();

      cards.forEach((card) => {
        try {
          const linkEl = card.querySelector('a[href*="/bolig/"], a[href*="/lejlighed"], a[href*="/leje/"]') || 
                         (card.tagName === 'A' ? (card as HTMLAnchorElement) : null);
          if (!linkEl) return;

          const url = (linkEl as HTMLAnchorElement).href;
          if (!url || seenUrls.has(url) || url === window.location.href) return;
          seenUrls.add(url);

          const title = linkEl.textContent?.trim() || card.querySelector('h2, h3, [class*="title"]')?.textContent?.trim() || '';
          const priceEl = card.querySelector('[class*="price"], [class*="rent"], [class*="husleje"]');
          const locationEl = card.querySelector('[class*="location"], [class*="address"], [class*="city"]');
          const imgEl = card.querySelector('img');

          const containerText = card.textContent || '';

          items.push({
            url,
            title,
            priceText: priceEl?.textContent?.trim() || containerText,
            locationText: locationEl?.textContent?.trim() || containerText,
            imgUrl: imgEl ? (imgEl as HTMLImageElement).src || imgEl.getAttribute('data-src') || '' : '',
            sizeText: containerText,
            roomsText: containerText,
          });
        } catch (_) {}
      });

      // Fallback: search all links if card search was empty
      if (items.length === 0) {
        const allLinks = document.querySelectorAll('a[href*="/bolig/"], a[href*="/lejlighed"]');
        allLinks.forEach((link) => {
          try {
            const url = (link as HTMLAnchorElement).href;
            if (!url || seenUrls.has(url) || url === window.location.href) return;
            seenUrls.add(url);

            items.push({
              url,
              title: link.textContent?.trim() || '',
              priceText: link.parentElement?.textContent || '',
              locationText: link.parentElement?.textContent || '',
              imgUrl: '',
              sizeText: link.parentElement?.textContent || '',
              roomsText: link.parentElement?.textContent || '',
            });
          } catch (_) {}
        });
      }

      return items;
    });
  }

  private transformRawItems(rawItems: RawLejeboligItem[]): ListingInput[] {
    const uniqueMap = new Map<string, RawLejeboligItem>();
    rawItems.forEach((item) => {
      if (item.url && !uniqueMap.has(item.url)) {
        uniqueMap.set(item.url, item);
      }
    });

    return Array.from(uniqueMap.values())
      .map((item) => {
        try {
          const price = parsePrice(item.priceText);
          const size = parseSize(item.sizeText || item.title);
          const rooms = parseRooms(item.roomsText || item.title);

          let postalCode: string | null = null;
          const allText = `${item.locationText} ${item.title}`;
          const postalMatch = allText.match(/\b(1\d{3}|2\d{3})\b/);
          if (postalMatch) postalCode = postalMatch[1];

          const locationName = normalizeLocation(
            item.locationText || item.title || 'København',
            postalCode || undefined
          );

          let title = cleanText(item.title);
          if (!title || title.length < 5) {
            const parts: string[] = [];
            if (rooms) parts.push(`${rooms} vær.`);
            parts.push('Lejlighed');
            if (locationName) parts.push(`i ${locationName}`);
            title = parts.join(' ');
          }

          const listing: ListingInput = {
            external_id: this.generateExternalId(item.url),
            source_platform: 'Lejebolig',
            title,
            url: item.url,
            price_dkk: price ?? 0,
            deposit_dkk: null,
            rooms,
            size_m2: size,
            location_name: locationName,
            postal_code: postalCode,
            images: item.imgUrl ? [item.imgUrl] : [],
          };
          return listing;
        } catch (_) {
          return null;
        }
      })
      .filter((item): item is ListingInput => item !== null && Boolean(item.url));
  }
}

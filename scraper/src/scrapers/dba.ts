import { BaseScraper } from './base';
import { ListingInput } from '../types';
import { Browser, Page } from 'puppeteer';
import { createPage } from '../utils/browser';
import { cleanText, parsePrice, parseRooms, parseSize, isRealRentalListing } from '../utils/parser';
import { normalizeLocation } from '../utils/location';

interface RawDbaItem {
  url: string;
  title: string;
  priceText: string;
  locationText: string;
  imgUrl: string;
  rawSize: string;
  rawRooms: string;
}

export class DbaScraper extends BaseScraper {
  name = 'DBA.dk';
  private browser: Browser;
  private maxPages = 4;

  constructor(browser: Browser) {
    super();
    this.browser = browser;
  }

  async scrape(): Promise<ListingInput[]> {
    const listings: ListingInput[] = [];
    const page = await createPage(this.browser);

    try {
      for (let pageNum = 1; pageNum <= this.maxPages; pageNum++) {
        const url =
          pageNum === 1
            ? 'https://www.dba.dk/boliger/lejebolig/lejlighed/koebenhavn/'
            : `https://www.dba.dk/boliger/lejebolig/lejlighed/koebenhavn/side-${pageNum}/`;

        this.log(`🕵️ Scraping DBA page ${pageNum}: ${url}`);

        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 35000 });
        await this.delay(2500, 4000);

        try {
          const cookieBtn = await page.$('button#onetrust-accept-btn-handler, button[class*="accept"]');
          if (cookieBtn) {
            await cookieBtn.click();
            await this.delay(1000);
          }
        } catch (_) {}

        const rawItems = await this.extractRawItems(page);
        const pageListings = this.transformRawItems(rawItems);
        this.log(`✅ Extracted ${pageListings.length} real apartment listings from DBA page ${pageNum}`);
        listings.push(...pageListings);

        if (pageNum < this.maxPages && pageListings.length > 0) {
          await this.delay(2500, 4500);
        } else if (pageListings.length === 0) {
          break;
        }
      }
    } catch (error) {
      this.log(`❌ Error scraping DBA: ${(error as Error).message}`);
    } finally {
      await page.close();
    }

    return listings;
  }

  private async extractRawItems(page: Page): Promise<RawDbaItem[]> {
    return page.evaluate(() => {
      const items: any[] = [];

      const tableRows = document.querySelectorAll('tr.dbaListing');
      if (tableRows.length > 0) {
        tableRows.forEach((row) => {
          try {
            const linkEl = row.querySelector('td.mainContent a.listingLink, a.listingLink');
            if (!linkEl) return;
            const url = (linkEl as HTMLAnchorElement).href;
            const title = linkEl.textContent?.trim() || '';
            const priceEl = row.querySelector('td.price');
            const locationEl = row.querySelector('td.location');
            const imgEl = row.querySelector('td.image img');
            const matrixText = row.querySelector('td.matrixData, .expandable-box')?.textContent || '';

            items.push({
              url,
              title,
              priceText: priceEl?.textContent?.trim() || '',
              locationText: locationEl?.textContent?.trim() || '',
              imgUrl: imgEl ? (imgEl as HTMLImageElement).src || imgEl.getAttribute('data-src') || '' : '',
              rawSize: matrixText || title,
              rawRooms: matrixText || title,
            });
          } catch (_) {}
        });
      }

      if (items.length === 0) {
        const linkElements = document.querySelectorAll(
          'a[href*="/item/"], a[href*="/annonce/"], article a[href*="/bolig/"], a[href*="/lejebolig/"]'
        );
        const seenUrls = new Set<string>();

        linkElements.forEach((link) => {
          try {
            const url = (link as HTMLAnchorElement).href;
            if (!url || seenUrls.has(url)) return;
            seenUrls.add(url);

            const container = link.closest('article, tr, div[class*="card"], li') || link.parentElement;
            const title = link.textContent?.trim() || container?.querySelector('h2, h3')?.textContent?.trim() || '';
            const priceEl = container?.querySelector('[class*="price"], span[title*="Pris"]');
            const locationEl = container?.querySelector('[class*="location"], [class*="address"]');
            const imgEl = container?.querySelector('img');

            items.push({
              url,
              title,
              priceText: priceEl?.textContent?.trim() || container?.textContent || '',
              locationText: locationEl?.textContent?.trim() || container?.textContent || '',
              imgUrl: imgEl ? (imgEl as HTMLImageElement).src || imgEl.getAttribute('data-src') || '' : '',
              rawSize: container?.textContent || title,
              rawRooms: container?.textContent || title,
            });
          } catch (_) {}
        });
      }

      return items;
    });
  }

  private transformRawItems(rawItems: RawDbaItem[]): ListingInput[] {
    const uniqueMap = new Map<string, RawDbaItem>();
    rawItems.forEach((item) => {
      if (item.url && !uniqueMap.has(item.url)) {
        uniqueMap.set(item.url, item);
      }
    });

    return Array.from(uniqueMap.values())
      .map((item) => {
        try {
          const title = cleanText(item.title);
          const priceDkk = parsePrice(item.priceText);

          // Combined text validation
          const fullContext = `${title} ${item.locationText} ${item.rawSize}`;

          if (!priceDkk || !isRealRentalListing(fullContext, priceDkk, false)) {
            return null;
          }

          const url = item.url;
          let postalCode: string | null = null;
          const postalMatch = item.locationText.match(/\b(1\d{3}|2\d{3})\b/);
          if (postalMatch) postalCode = postalMatch[1];

          const locationName = normalizeLocation(item.locationText || 'København', postalCode || undefined);
          const sizeM2 = parseSize(item.rawSize);
          const rooms = parseRooms(item.rawRooms);

          const listing: ListingInput = {
            external_id: this.generateExternalId(url),
            source_platform: 'DBA',
            title: title || 'Lejlighed til leje i København',
            url,
            price_dkk: priceDkk,
            deposit_dkk: null,
            rooms,
            size_m2: sizeM2,
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

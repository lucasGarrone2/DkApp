const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

function isRealRentalListing(title, priceDkk) {
  if (!title) return false;
  const t = title.toLowerCase();

  const nonHousingKeywords = [
    'crosstrainer', 'cykel', 'sko', 'støvler', 'kalender', 'puslespil',
    'stof', 'kjole', 'jakke', 'dragt', 'quooker', 'porcelæn', 'vhs',
    'poker', 'hjelm', 'badestol', 'stumtjener', 'rygsæk', 'kuglegrill',
    'mærker', 'fælge', 'dæk', 'kopper', 'sengegavl', 'sneakers',
    'model', 'manga', 'postkort', 'krus', 'bakke', 'skål', 'højttaler', 'jeans'
  ];

  if (nonHousingKeywords.some(word => t.includes(word))) {
    return false;
  }

  if (priceDkk !== null && (priceDkk < 3000 || priceDkk > 45000)) {
    return false;
  }

  const housingKeywords = ['lejlighed', 'lejebolig', 'værelse', 'bolig', 'fremleje', 'til leje', 'leje', 'vær', 'm²', 'kvm', 'room', 'apartment'];
  return housingKeywords.some(word => t.includes(word));
}

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
  
  // Search specifically for rental apartments in Copenhagen on DBA
  const targetUrl = 'https://www.dba.dk/soeg/?soeg=lejlighed+til+leje+k%C3%B8benhavn';
  console.log('Searching DBA:', targetUrl);
  await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 3000));

  const items = await page.evaluate(() => {
    const linkEls = Array.from(document.querySelectorAll('a[href*="/item/"], a[href*="/annonce/"], tr.dbaListing a'));
    const seen = new Set();
    const result = [];

    linkEls.forEach(link => {
      const url = link.href;
      if (!url || seen.has(url)) return;
      seen.add(url);

      const card = link.closest('article, tr, div[class*="card"], li') || link.parentElement;
      const text = card?.textContent || link.textContent || '';
      
      // Extract price from text
      const priceMatch = text.match(/([\d\.]+)\s*kr/i);
      let price = null;
      if (priceMatch) {
        price = parseInt(priceMatch[1].replace(/\./g, ''), 10);
      }

      const title = link.textContent?.trim() || card?.querySelector('h2, h3')?.textContent?.trim() || '';

      result.push({ url, title, price, rawText: text.replace(/\s+/g, ' ').trim() });
    });

    return result;
  });

  const validRentals = items.filter(item => isRealRentalListing(item.title || item.rawText, item.price));

  console.log(`Total extracted: ${items.length}, Valid rentals: ${validRentals.length}`);
  console.log('Sample valid rentals:', validRentals.slice(0, 5));

  await browser.close();
})();

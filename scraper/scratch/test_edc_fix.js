const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
  
  await page.goto('https://www.edc.dk/leje/lejlighed/koebenhavn/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  const items = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a[href*="/leje/"], a[href*="/sag/"]'));
    const seen = new Set();
    const res = [];

    links.forEach(link => {
      const url = link.href;
      if (!url || seen.has(url) || url === 'https://www.edc.dk/leje/lejlighed/koebenhavn/') return;
      seen.add(url);

      const container = link.closest('article, div[class*="card"], li') || link.parentElement;
      const text = container ? container.textContent : link.textContent;
      const img = container ? container.querySelector('img') : null;

      res.push({
        url,
        text: text ? text.replace(/\s+/g, ' ').trim() : '',
        imgUrl: img ? img.src || img.getAttribute('data-src') || '' : ''
      });
    });

    return res;
  });

  console.log(`EDC Links count: ${items.length}`);
  console.log('Sample:', items.slice(0, 5));

  await browser.close();
})();

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
  
  await page.goto('https://www.edc.dk/lejebolig/koebenhavn/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  const items = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('a[href*="/leje/"], article, .property-item'));
    return cards.map(c => ({
      url: c.href || c.querySelector('a')?.href,
      text: c.textContent ? c.textContent.replace(/\s+/g, ' ').trim() : '',
      imgUrl: c.querySelector('img')?.src || ''
    })).filter(x => x.url && x.text.length > 10);
  });

  console.log(`EDC Links count: ${items.length}`);
  console.log('Sample:', items.slice(0, 5));

  await browser.close();
})();

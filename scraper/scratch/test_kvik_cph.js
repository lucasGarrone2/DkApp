const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  const url = 'https://kvikbolig.dk/rental-property/kobenhavn';
  console.log('Visiting:', url);
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 4000));
  
  const items = await page.evaluate(() => {
    const cards = [];
    const elements = document.querySelectorAll('a[href*="/property/"], a[href*="/bolig/"], a[href*="/rental-property/"], div[class*="property"], div[class*="card"]');
    elements.forEach(el => {
      const link = el.tagName === 'A' ? el.href : el.querySelector('a')?.href;
      const text = el.textContent.replace(/\s+/g, ' ').trim();
      if (link && text && !cards.some(c => c.link === link)) {
        cards.push({ link, text: text.slice(0, 150) });
      }
    });
    return cards.slice(0, 10);
  });
  console.log('Found on Kvikbolig:', items.length, items);

  await browser.close();
})();

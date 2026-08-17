const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  const url = 'https://kvikbolig.dk/rental-property/vesterbro';
  console.log('Visiting:', url);
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 4000));
  
  const items = await page.evaluate(() => {
    const list = [];
    const elements = document.querySelectorAll('a[href*="/property/"], a[href*="/bolig/"], div[class*="listing"], article');
    elements.forEach(el => {
      const a = el.tagName === 'A' ? el : el.querySelector('a');
      if (a && a.href && a.textContent.trim().length > 10) {
        list.push({ href: a.href, text: a.textContent.replace(/\s+/g, ' ').trim() });
      }
    });
    return list;
  });
  console.log('Found on Vesterbro:', items.length, items);

  await browser.close();
})();

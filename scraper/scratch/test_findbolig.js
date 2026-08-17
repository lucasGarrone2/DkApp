const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  try {
    const url = 'https://findbolig.nu/da-dk/lejeboliger/koebenhavn';
    console.log('Testing FindBolig.nu:', url);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise(r => setTimeout(r, 4000));
    
    const items = await page.evaluate(() => {
      const results = [];
      const links = document.querySelectorAll('a[href*="/da-dk/boliger/"], a[href*="/ejendomme/"], div[class*="property-card"]');
      links.forEach(l => {
        results.push({
          href: l.href || '',
          text: l.textContent ? l.textContent.replace(/\s+/g, ' ').trim() : ''
        });
      });
      return results.slice(0, 10);
    });
    console.log('Found FindBolig items:', items.length, items);
  } catch (e) {
    console.log('Error testing FindBolig:', e.message);
  } finally {
    await browser.close();
  }
})();

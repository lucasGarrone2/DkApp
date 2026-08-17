const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  try {
    const url = 'https://home.dk/boligkatalog/koebenhavn/lejebolig/';
    console.log('Testing Home.dk:', url);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise(r => setTimeout(r, 4000));
    
    const items = await page.evaluate(() => {
      const results = [];
      const cards = document.querySelectorAll('a[href*="/sag/"], div[class*="estate-card"], article');
      cards.forEach(c => {
        results.push(c.textContent.replace(/\s+/g, ' ').trim());
      });
      return results.slice(0, 5);
    });
    console.log('Found Home.dk items:', items.length, items);
  } catch (e) {
    console.log('Error testing Home.dk:', e.message);
  } finally {
    await browser.close();
  }
})();

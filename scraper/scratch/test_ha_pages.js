const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  const urls = [
    'https://housinganywhere.com/s/Copenhagen--Denmark',
    'https://housinganywhere.com/s/Copenhagen--Denmark?categories=apartment',
    'https://housinganywhere.com/s/Copenhagen--Denmark?categories=room',
    'https://housinganywhere.com/s/Frederiksberg--Denmark'
  ];

  for (const u of urls) {
    try {
      console.log('Testing HA:', u);
      await page.goto(u, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await new Promise(r => setTimeout(r, 3500));
      
      const count = await page.evaluate(() => {
        return document.querySelectorAll('a[href*="/room/"], a[href*="/apartment/"]').length;
      });
      console.log('Found on', u, ':', count);
    } catch (e) {
      console.log('Error:', e.message);
    }
  }

  await browser.close();
})();

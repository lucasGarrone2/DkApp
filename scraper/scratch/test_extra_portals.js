const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
  });
  const page = await browser.newPage();
  
  const portals = [
    { name: 'Boligsurf', url: 'https://www.boligsurf.dk/lejebolig/koebenhavn/' },
    { name: 'Danbolig', url: 'https://danbolig.dk/boligsogning/lejebolig/koebenhavn' },
    { name: 'Akutbolig', url: 'https://www.akutbolig.dk/lejebolig/koebenhavn' }
  ];

  for (const p of portals) {
    try {
      console.log('Testing', p.name, ':', p.url);
      const res = await page.goto(p.url, { waitUntil: 'domcontentloaded', timeout: 25000 });
      console.log('Status:', res ? res.status() : 'null', 'Final URL:', page.url());
      await new Promise(r => setTimeout(r, 3000));
      
      const count = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a[href*="/bolig/"], a[href*="/sag/"], a[href*="/lejebolig/"]'));
        return links.length;
      });
      console.log('Found on', p.name, ':', count);
    } catch (e) {
      console.log('Error on', p.name, ':', e.message);
    }
  }

  await browser.close();
})();

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  const testUrls = [
    'https://kvikbolig.dk/lejeboliger',
    'https://kvikbolig.dk/boligsogning',
    'https://boligzonen.dk/lejeboliger',
    'https://boligzonen.dk/lejeboliger/storkoebenhavn',
    'https://boligzonen.dk/lejeboliger/koebenhavn'
  ];

  for (const u of testUrls) {
    try {
      console.log('Testing URL:', u);
      const res = await page.goto(u, { waitUntil: 'domcontentloaded', timeout: 20000 });
      console.log('Status:', res ? res.status() : 'null', 'Final URL:', page.url());
      await new Promise(r => setTimeout(r, 2000));
      
      const cards = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a'))
          .filter(a => a.href && (a.href.includes('/bolig/') || a.href.includes('/annonce/') || a.href.includes('/lejebolig/')));
        return links.map(l => ({ href: l.href, text: l.textContent.replace(/\s+/g, ' ').trim().slice(0, 80) }));
      });
      console.log('Found cards:', cards.length, cards.slice(0, 3));
    } catch (e) {
      console.log('Error on', u, ':', e.message);
    }
  }

  await browser.close();
})();

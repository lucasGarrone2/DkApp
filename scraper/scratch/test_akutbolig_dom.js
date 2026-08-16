const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
  
  await page.goto('https://www.akutbolig.dk/lejebolig/koebenhavn', { waitUntil: 'networkidle2', timeout: 30000 });
  
  const items = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a[href*="/bolig/"], a[href*="/lejebolig/"]'));
    return links.map(a => ({
      url: a.href,
      text: a.textContent ? a.textContent.replace(/\s+/g, ' ').trim() : ''
    })).filter(x => x.url && x.text.length > 5);
  });
  
  console.log('Akutbolig links:', items.length);
  console.log('Sample:', items.slice(0, 10));
  await browser.close();
})();

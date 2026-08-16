const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
  
  // Test Akutbolig.dk
  console.log('Testing Akutbolig.dk...');
  await page.goto('https://www.akutbolig.dk/lejebolig/koebenhavn', { waitUntil: 'domcontentloaded', timeout: 20000 });
  await new Promise(r => setTimeout(r, 2000));
  
  const akutTitle = await page.title();
  console.log('Akutbolig title:', akutTitle);
  const akutItems = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('a[href*="/bolig/"], .property-item, article, [class*="card"]'));
    return cards.map(c => ({
      url: (c.href || c.querySelector('a')?.href),
      text: c.textContent?.replace(/\s+/g, ' ').trim().slice(0, 100)
    })).filter(x => x.url && x.text && x.text.length > 15);
  });
  console.log('Akutbolig items count:', akutItems.length);
  console.log('Akutbolig sample:', akutItems.slice(0, 3));

  // Test BoligZonen.dk
  console.log('\nTesting BoligZonen.dk...');
  await page.goto('https://www.boligzonen.dk/lejebolig/k%C3%B8benhavn', { waitUntil: 'domcontentloaded', timeout: 20000 });
  await new Promise(r => setTimeout(r, 2000));
  console.log('BoligZonen title:', await page.title());

  await browser.close();
})();

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36');

  console.log('--- 1. Testing Kvikbolig.dk ---');
  try {
    const url1 = 'https://kvikbolig.dk/find-bolig/koebenhavn';
    console.log('Navigating to:', url1);
    await page.goto(url1, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise(r => setTimeout(r, 4000));
    console.log('Current URL:', page.url());

    const kvikData = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a[href*="/bolig/"], a[href*="/lejebolig/"], a[href*="/annonce/"], article a, div[class*="card"] a'));
      return links.slice(0, 5).map(l => ({
        href: l.href,
        text: l.textContent ? l.textContent.replace(/\s+/g, ' ').trim() : ''
      }));
    });
    console.log('Kvikbolig sample items:', kvikData.length, kvikData);
  } catch (e) {
    console.log('Kvikbolig error:', e.message);
  }

  console.log('\n--- 2. Testing Boligzonen.dk ---');
  try {
    const url2 = 'https://boligzonen.dk/lejebolig/koebenhavn';
    console.log('Navigating to:', url2);
    await page.goto(url2, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise(r => setTimeout(r, 4000));
    console.log('Current URL:', page.url());

    const bzData = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a[href*="/bolig/"], a[href*="/lejebolig/"], a[href*="/leje/"], article, div[class*="property"], div[class*="listing"]'));
      return links.slice(0, 5).map(l => ({
        href: l.tagName === 'A' ? l.href : (l.querySelector('a')?.href || ''),
        text: l.textContent ? l.textContent.replace(/\s+/g, ' ').trim() : ''
      }));
    });
    console.log('Boligzonen sample items:', bzData.length, bzData);
  } catch (e) {
    console.log('Boligzonen error:', e.message);
  }

  await browser.close();
})();

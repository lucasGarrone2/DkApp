const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36');
  
  // Test 1: Lejebolig.dk
  console.log('Testing Lejebolig.dk...');
  await page.goto('https://www.lejebolig.dk/lejligheder/k%C3%B8benhavn', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 4000));
  
  const lejeItems = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('a[href*="/bolig/"], a[href*="/lejlighed"], div[class*="Listings"] a'));
    return cards.map(a => ({
      url: a.href,
      text: a.textContent ? a.textContent.replace(/\s+/g, ' ').trim() : ''
    })).filter(x => x.url && x.text.length > 10);
  });
  console.log('Lejebolig.dk items:', lejeItems.length, lejeItems.slice(0, 3));

  // Test 2: Findbolig.nu
  console.log('\nTesting Findbolig.nu...');
  await page.goto('https://www.findbolig.nu/findbolig-web/search/list?location=K%C3%B8benhavn', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 4000));
  
  const findItems = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a[href*="bolig"], a[href*="detail"], tr, article'));
    return links.map(el => ({
      url: el.href || el.querySelector('a')?.href,
      text: el.textContent ? el.textContent.replace(/\s+/g, ' ').trim().slice(0, 100) : ''
    })).filter(x => x.url);
  });
  console.log('Findbolig items:', findItems.length, findItems.slice(0, 3));

  await browser.close();
})();

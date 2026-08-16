const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36');
  
  // Test search query for rental apartments in Copenhagen
  const targetUrl = 'https://www.dba.dk/recommerce/forsale/search?q=lejlighed+til+leje+k%C3%B8benhavn';
  console.log('Navigating to:', targetUrl);
  await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout ? page.waitForTimeout(3000) : new Promise(r => setTimeout(r, 3000));
  
  console.log('Final URL:', page.url());
  console.log('Page Title:', await page.title());
  
  const results = await page.evaluate(() => {
    const items = [];
    const linkEls = document.querySelectorAll('a[href*="/item/"]');
    const seen = new Set();

    linkEls.forEach(link => {
      const url = link.href;
      if (seen.has(url)) return;
      seen.add(url);

      const card = link.closest('article, div[class*="card"], li') || link.parentElement;
      const text = card ? card.textContent : link.textContent;
      
      items.push({ url, text: text ? text.replace(/\s+/g, ' ').trim().slice(0, 150) : '' });
    });

    return items;
  });

  console.log(`Found ${results.length} search results:`);
  console.log(results.slice(0, 5));

  await browser.close();
})();

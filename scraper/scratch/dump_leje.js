const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36');
  
  await page.goto('https://www.lejebolig.dk/lejligheder/k%C3%B8benhavn', { waitUntil: 'networkidle0', timeout: 30000 });
  
  const content = await page.content();
  fs.writeFileSync('scratch/lejebolig_page.html', content);
  console.log('Saved html length:', content.length);
  
  await browser.close();
})();

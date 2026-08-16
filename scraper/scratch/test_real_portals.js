const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
  
  // Test 1: HousingAnywhere Copenhagen rentals
  console.log('Testing HousingAnywhere...');
  await page.goto('https://housinganywhere.com/s/Copenhagen--Denmark', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 3000));
  
  const haTitle = await page.title();
  console.log('HA Title:', haTitle);
  const haItems = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('a[href*="/room/"], a[href*="/apartment/"], [class*="ListingCard"] a'));
    return cards.map(a => ({
      url: a.href,
      text: a.textContent ? a.textContent.replace(/\s+/g, ' ').trim().slice(0, 120) : ''
    })).filter(x => x.url && x.text.length > 5);
  });
  console.log('HA items count:', haItems.length);
  console.log('HA sample:', haItems.slice(0, 3));

  // Test 2: EDC.dk Copenhagen rentals
  console.log('\nTesting EDC.dk...');
  await page.goto('https://www.edc.dk/lejebolig/koebenhavn/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 3000));
  
  console.log('EDC Title:', await page.title());
  const edcItems = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('a[href*="/sag/"], article, .property-item'));
    return cards.map(c => ({
      url: c.href || c.querySelector('a')?.href,
      text: c.textContent ? c.textContent.replace(/\s+/g, ' ').trim().slice(0, 120) : ''
    })).filter(x => x.url && x.text.length > 10);
  });
  console.log('EDC items count:', edcItems.length);
  console.log('EDC sample:', edcItems.slice(0, 3));

  await browser.close();
})();

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  console.log('=== 1. Checking kvikbolig.dk ===');
  try {
    await page.goto('https://kvikbolig.dk/', { waitUntil: 'networkidle2', timeout: 30000 });
    const links = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a'))
        .map(a => ({ href: a.href, text: a.textContent.trim() }))
        .filter(a => a.href.includes('bolig') || a.href.includes('leje') || a.href.includes('kobenhavn') || a.href.includes('copenhagen'));
    });
    console.log('Kvikbolig links found:', links.slice(0, 10));
  } catch (e) {
    console.log('Kvikbolig error:', e.message);
  }

  console.log('=== 2. Checking boligzonen.dk ===');
  try {
    await page.goto('https://boligzonen.dk/lejebolig', { waitUntil: 'networkidle2', timeout: 30000 });
    const bzLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a'))
        .map(a => ({ href: a.href, text: a.textContent.trim() }))
        .filter(a => a.href.includes('bolig') || a.href.includes('leje') || a.href.includes('kobenhavn') || a.href.includes('copenhagen'));
    });
    console.log('Boligzonen links found:', bzLinks.slice(0, 10));
  } catch (e) {
    console.log('Boligzonen error:', e.message);
  }

  await browser.close();
})();

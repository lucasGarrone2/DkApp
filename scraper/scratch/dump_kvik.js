const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  await page.goto('https://kvikbolig.dk/?locale=en', { waitUntil: 'networkidle2' });
  const formAction = await page.evaluate(() => {
    const forms = Array.from(document.querySelectorAll('form')).map(f => ({ action: f.action, method: f.method, inputs: Array.from(f.querySelectorAll('input, select')).map(i => i.name) }));
    const links = Array.from(document.querySelectorAll('a')).map(a => a.href);
    return { forms, links: links.slice(0, 20) };
  });
  console.log('Kvikbolig form & links:', JSON.stringify(formAction, null, 2));

  await browser.close();
})();

@echo off
cd /d "c:\Users\lucas\Desktop\DkApp\scraper"
echo [%date% %time%] Running Copenhagen rental scraper...
npm run scrape
echo [%date% %time%] Finished scraping pipeline!

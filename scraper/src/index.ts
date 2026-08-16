import { createBrowser } from './utils/browser';
import { EdcScraper } from './scrapers/edc';
import { HousingAnywhereScraper } from './scrapers/housinganywhere';
import { DbaScraper } from './scrapers/dba';
import { LejeboligScraper } from './scrapers/lejebolig';
import { upsertListings } from './supabase';
import { ListingInput } from './types';

async function main() {
  const isDryRun = process.argv.includes('--dry-run');
  console.log(`🚀 Starting Copenhagen rental scraper pipeline... ${isDryRun ? '(DRY RUN)' : ''}`);

  const browser = await createBrowser();
  const allListings: ListingInput[] = [];

  try {
    // 1. Run EDC Scraper (Largest DK real estate network, ~1.800 rentals in Copenhagen)
    const edc = new EdcScraper(browser);
    const edcListings = await edc.scrape();
    allListings.push(...edcListings);

    // 2. Run HousingAnywhere Scraper (Verified apartments & Working Holiday rentals in CPH)
    const ha = new HousingAnywhereScraper(browser);
    const haListings = await ha.scrape();
    allListings.push(...haListings);

    // 3. Run DBA Scraper
    const dba = new DbaScraper(browser);
    const dbaListings = await dba.scrape();
    allListings.push(...dbaListings);

    // 4. Run Lejebolig Scraper
    const leje = new LejeboligScraper(browser);
    const lejeListings = await leje.scrape();
    allListings.push(...lejeListings);

    console.log(`\n📊 Scraping Summary:`);
    console.log(`- EDC.dk: ${edcListings.length} listings`);
    console.log(`- HousingAnywhere: ${haListings.length} listings`);
    console.log(`- DBA.dk: ${dbaListings.length} listings`);
    console.log(`- Lejebolig.dk: ${lejeListings.length} listings`);
    console.log(`- Total Extracted: ${allListings.length} listings`);

    if (isDryRun) {
      console.log('\n👀 Dry Run Sample Results:');
      console.log(JSON.stringify(allListings.slice(0, 5), null, 2));
    } else {
      console.log('\n💾 Saving real rental apartments to Supabase...');
      await upsertListings(allListings);
    }
    
    console.log('\n🎉 Scraper pipeline finished successfully!');
  } catch (error) {
    console.error('💥 Fatal error in pipeline:', error);
  } finally {
    await browser.close();
    process.exit(0);
  }
}

main();

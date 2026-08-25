import Link from 'next/link';

export const metadata = {
  title: 'Bot Information — DK Rentals',
  description: 'Information about the DkApp-Bot web crawler used by DK Rentals.',
};

export default function BotInfoPage() {
  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-[#080d1a]">
      <div className="container mx-auto px-4 sm:px-6 py-12 max-w-3xl">
        <Link href="/" className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold mb-6 inline-block">← Back to Home</Link>
        
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">DkApp-Bot Information</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-8">Information about our web crawler · User-Agent: DkApp-Bot/1.0</p>

        <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
          
          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">What is DkApp-Bot?</h2>
            <p>
              DkApp-Bot is an automated web crawler operated by DK Rentals, a non-commercial personal project created solely to help community members search for housing in Copenhagen, Denmark. The bot collects only factual metadata (price, size, rooms, location) and provides a direct link back to the original listing.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">User-Agent String</h2>
            <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-xl font-mono text-xs break-all">
              DkApp-Bot/1.0 (+https://dk-app-woad.vercel.app/bot-info; rental-aggregator; contact: lucasgarrone4@gmail.com)
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">What we collect</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Monthly rent price (DKK)</li>
              <li>Apartment size (m²) and number of rooms</li>
              <li>Neighborhood / postal code</li>
              <li>Contract conditions (period type, furnished, CPR registration)</li>
              <li>Direct URL to the original listing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">What we do NOT collect</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>❌ Photographs or images</li>
              <li>❌ Personal contact information (names, phone numbers, emails)</li>
              <li>❌ Full listing descriptions or copyrighted text</li>
              <li>❌ Data behind login walls or paywalls</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Our crawling practices</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>✅ We respect <code>robots.txt</code> directives and <code>Crawl-delay</code> headers</li>
              <li>✅ We identify ourselves with a clear User-Agent string</li>
              <li>✅ We crawl at low frequency (1-2 times per day maximum)</li>
              <li>✅ We add delays of 4-8 seconds between requests</li>
              <li>✅ We always link back to the original listing page</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Opt-out / Block our bot</h2>
            <p>To block DkApp-Bot from crawling your website, add the following to your <code>robots.txt</code>:</p>
            <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-xl font-mono text-xs">
              User-agent: DkApp-Bot<br />
              Disallow: /
            </div>
            <p className="mt-2">
              Alternatively, you can contact us directly at{' '}
              <a href="mailto:lucasgarrone4@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
                lucasgarrone4@gmail.com
              </a>{' '}
              and we will remove your listings within 72 hours.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Contact</h2>
            <p>
              Operator: Lucas Garrone (Personal Community Project)<br />
              Email: <a href="mailto:lucasgarrone4@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">lucasgarrone4@gmail.com</a><br />
              Website: <a href="https://dk-app-woad.vercel.app" className="text-blue-600 dark:text-blue-400 hover:underline">dk-app-woad.vercel.app</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

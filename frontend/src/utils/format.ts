export const DKK_TO_USD_RATE = 6.90; // Approx 1 USD = 6.90 DKK (1 DKK ≈ 0.145 USD)

export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return `Hace ${diffInSeconds} seg`;

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `Hace ${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'}`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `Hace ${diffInDays} ${diffInDays === 1 ? 'día' : 'días'}`;

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) return `Hace ${diffInWeeks} ${diffInWeeks === 1 ? 'semana' : 'semanas'}`;

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `Hace ${diffInMonths} ${diffInMonths === 1 ? 'mes' : 'meses'}`;

  const diffInYears = Math.floor(diffInDays / 365);
  return `Hace ${diffInYears} ${diffInYears === 1 ? 'año' : 'años'}`;
}

/**
 * Cleans long repeated scraped strings from titles
 */
export function cleanDisplayTitle(rawTitle: string | null | undefined): string {
  if (!rawTitle) return 'Alquiler en Copenhague';
  let t = rawTitle.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();

  // If title has repeated blocks (e.g. "25 m² room in Copenhagen 25 m² room...")
  const parts = t.split(/(?=kr\d|\d+\s*m²|Property type|Rooms \d)/i);
  if (parts.length > 1 && parts[0].trim().length > 5) {
    t = parts[0].trim();
  }

  // Limit max length
  if (t.length > 75) {
    t = t.substring(0, 72) + '...';
  }

  return t;
}

const KNOWN_CPH_AREAS = [
  'Indre By', 'Vesterbro', 'Nørrebro', 'Østerbro', 'Frederiksberg', 'Amager',
  'Valby', 'Vanløse', 'Nordvest', 'Sydhavn', 'Christianshavn', 'Gentofte',
  'Hellerup', 'Lyngby', 'Virum', 'Farum', 'Brønshøj', 'Rødovre', 'Hvidovre',
  'Glostrup', 'Ballerup', 'Herlev', 'Kastrup', 'Tårnby', 'Roskilde', 'Risø',
  'Aarhus'
];

/**
 * Extracts a valid geocodable neighborhood / city name for Google Maps
 */
export function cleanLocationName(location: string | null | undefined): string {
  if (!location) return 'Copenhagen';
  const text = location.trim();

  if (/\baarhus\b/i.test(text)) {
    return 'Aarhus, Denmark';
  }

  if (/\b(roskilde|risø)\b/i.test(text)) {
    return 'Roskilde, Denmark';
  }

  for (const area of KNOWN_CPH_AREAS) {
    if (new RegExp(`\\b${area}\\b`, 'i').test(text)) {
      return `${area}, Denmark`;
    }
  }

  // Check for postal codes
  const postMatch = text.match(/\b(1\d{3}|2\d{3}|4\d{3}|8\d{3})\b/);
  if (postMatch) {
    return `${postMatch[1]} Denmark`;
  }

  return 'Copenhagen, Denmark';
}

/**
 * Formats DKK prices with inline USD approximation:
 * Example: 10.000 DKK (~$1.450 USD)
 */
export function formatPrice(dkk: number | null): string {
  if (dkk === null || dkk === undefined || dkk <= 0) return '–';

  const dkkFormatted = new Intl.NumberFormat('da-DK').format(dkk);
  const usdApprox = Math.round(dkk / DKK_TO_USD_RATE);
  const usdFormatted = new Intl.NumberFormat('en-US').format(usdApprox);

  return `${dkkFormatted} DKK (~$${usdFormatted} USD)`;
}

/**
 * Formats DKK price per m² with inline USD approximation:
 */
export function formatPricePerM2(price: number | null, size: number | null): string {
  if (!price || !size || size === 0) return '–';
  const dkkPerM2 = Math.round(price / size);
  const usdPerM2 = Math.round(dkkPerM2 / DKK_TO_USD_RATE);

  return `${new Intl.NumberFormat('da-DK').format(dkkPerM2)} DKK/m² (~$${usdPerM2} USD/m²)`;
}

export function calculateMoveInCost(
  monthlyRent: number | null,
  deposit: number | null,
  prepaidRent: number | null
): number {
  const rent = monthlyRent || 0;
  const dep = deposit || 0;
  const prep = prepaidRent || 0;
  return rent + dep + prep;
}

export function calculateCostPerPerson(amount: number | null, peopleCount: number = 1): number {
  if (!amount || amount <= 0) return 0;
  return Math.round(amount / peopleCount);
}

/**
 * Generates Google Maps bicycle route to Central Station (København H or Aarhus H)
 * using clean geocodable location origins.
 */
export function generateGoogleMapsRouteUrl(locationName: string | null, postalCode: string | null): string {
  const isAarhus = locationName?.toLowerCase().includes('aarhus') || (postalCode && parseInt(postalCode, 10) >= 8000 && parseInt(postalCode, 10) <= 8999);
  const destination = isAarhus ? 'Aarhus H, Denmark' : 'København H, Denmark';
  let origin = cleanLocationName(locationName);

  if (postalCode) {
    origin = `${postalCode} Denmark`;
  }

  return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=bicycling`;
}

/**
 * Generates a clean, professional rental inquiry template suitable for any applicant.
 */
export function generateQuickApplyText(title: string, location: string | null): string {
  const cleanTitle = cleanDisplayTitle(title);
  const cleanLoc = cleanLocationName(location);

  return `Hello!

I am writing to express my strong interest in your rental listing: "${cleanTitle}"${cleanLoc ? ` in ${cleanLoc}` : ''}.

I am a reliable, non-smoking young professional currently living and working in Copenhagen. I am a tidy, quiet, and respectful tenant with stable finances, looking for a smooth move-in.

Would it be possible to arrange a viewing? I am flexible with dates and happy to provide any references, work contract, or documentation needed.

Thank you very much for your time and consideration!

Best regards,
[Your Name]
Phone: +45 [Your Phone]
Email: [Your Email]`;
}

/**
 * Generates a clear, readable WhatsApp summary message.
 */
export function generateWhatsAppShareText(
  title: string,
  url: string,
  priceDkk: number | null,
  moveInCostDkk: number,
  score: number,
  peopleCount: number = 1
): string {
  const cleanTitle = cleanDisplayTitle(title);
  const dkkPrice = priceDkk ? `${new Intl.NumberFormat('da-DK').format(priceDkk)} DKK` : 'Consultar';
  const usdPrice = priceDkk ? `~$${Math.round(priceDkk / DKK_TO_USD_RATE)} USD` : '';
  
  let costSection = `💰 *Alquiler mensual:* ${dkkPrice} ${usdPrice ? `(${usdPrice})` : ''}`;
  if (peopleCount > 1 && priceDkk) {
    const perPersonDkk = Math.round(priceDkk / peopleCount);
    const perPersonUsd = Math.round(perPersonDkk / DKK_TO_USD_RATE);
    costSection += `\n👥 *Por persona (÷ ${peopleCount}):* ${new Intl.NumberFormat('da-DK').format(perPersonDkk)} DKK (~$${perPersonUsd} USD)`;
  }

  const moveInDkk = `${new Intl.NumberFormat('da-DK').format(moveInCostDkk)} DKK`;

  return `🏠 *Alquiler en Copenhague*
📍 *${cleanTitle}*
🎯 Score: *${score}%*

${costSection}
🔑 *Costo de entrada (Move-in):* ${moveInDkk}

🔗 *Ver publicación:* ${url}`;
}

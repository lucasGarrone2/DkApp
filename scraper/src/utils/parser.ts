/**
 * Cleans up and normalizes text by trimming whitespace and removing line breaks
 */
export function cleanText(text: string | null | undefined): string {
  if (!text) return '';
  return text
    .replace(/[\r\n]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Parses a Danish/International price string into a number.
 * Handles Danish (12.000 kr, 12000 DKK) and English (kr4,500, kr24,500, 4,500 kr)
 */
export function parsePrice(text: string | null | undefined): number | null {
  if (!text) return null;
  const cleaned = cleanText(text);

  // Match: kr4,500 / kr 12.000 / DKK 15,000 / 12.000 kr / 4,500 dkk
  const patterns = [
    /(?:dkk|kr\.?)\s*([\d\.\,]+)/i,
    /([\d\.\,]+)\s*(?:kr|dkk)/i,
  ];

  for (const pattern of patterns) {
    const match = cleaned.match(pattern);
    if (match && match[1]) {
      let raw = match[1].trim();

      // If comma is followed by 3 digits at the end (e.g. 4,500 or 24,500), it's thousands separator
      if (/,\d{3}(?!\d)/.test(raw)) {
        raw = raw.replace(/,/g, '');
      }
      // If dot is followed by 3 digits at the end (e.g. 4.500 or 24.000), it's thousands separator
      if (/\.\d{3}(?!\d)/.test(raw)) {
        raw = raw.replace(/\./g, '');
      }
      // Remove any remaining spaces and replace commas with dots
      raw = raw.replace(/[\s\.]/g, '').replace(/,/g, '.');

      const price = parseInt(raw, 10);
      if (!isNaN(price) && price >= 3000 && price <= 65000) {
        return price;
      }
    }
  }

  // Fallback: extract digits if short string
  if (cleaned.length < 15) {
    const digitsOnly = cleaned.replace(/[^0-9]/g, '');
    if (digitsOnly) {
      const price = parseInt(digitsOnly, 10);
      if (!isNaN(price) && price >= 3000 && price <= 65000) return price;
    }
  }

  return null;
}

/**
 * Parses a size string into a number.
 */
export function parseSize(text: string | null | undefined): number | null {
  if (!text) return null;
  const cleaned = cleanText(text).toLowerCase();

  const match = cleaned.match(/(\d+)\s*(m²|m2|kvm)/);
  if (match && match[1]) {
    const size = parseInt(match[1], 10);
    if (!isNaN(size) && size >= 10 && size <= 600) return size;
  }

  return null;
}

/**
 * Parses rooms string into a number.
 * If the listing is a single room offer ("room in...", "private room", "værelse"),
 * it guarantees rooms = 1.
 */
export function parseRooms(text: string | null | undefined, title?: string): number | null {
  if (title) {
    const t = title.toLowerCase();
    if (
      t.includes('room in') ||
      t.includes('private room') ||
      t.includes('single room') ||
      t.includes('værelse') ||
      t.includes('shared room')
    ) {
      return 1;
    }
  }

  if (!text) return null;
  const cleaned = cleanText(text).toLowerCase();

  if (
    cleaned.includes('room in') ||
    cleaned.includes('private room') ||
    cleaned.includes('single room') ||
    cleaned.includes('eget værelse')
  ) {
    return 1;
  }

  // Pattern 1: "2 rooms", "1 room", "3 værelser", "2 bed"
  const match1 = cleaned.match(/\b(\d+)\s*(?:vær|værelser|rooms?|bedrooms?|rum)\b/i);
  if (match1 && match1[1]) {
    const rooms = parseInt(match1[1], 10);
    if (!isNaN(rooms) && rooms > 0 && rooms <= 15) return rooms;
  }

  // Pattern 2: "Rooms 2", "Værelser: 3"
  const match2 = cleaned.match(/\b(?:rooms?|værelser?|rum)\s*:?\s*(\d+)\b/i);
  if (match2 && match2[1]) {
    const rooms = parseInt(match2[1], 10);
    if (!isNaN(rooms) && rooms > 0 && rooms <= 15) return rooms;
  }

  return null;
}

/**
 * PHASE 2: Detects CPR registration availability from text
 */
export function parseCprAllowed(text: string | null | undefined): boolean | null {
  if (!text) return null;
  const t = text.toLowerCase();

  if (
    t.includes('ingen cpr') ||
    t.includes('uden cpr') ||
    t.includes('no cpr') ||
    t.includes('cpr ikke muligt') ||
    t.includes('ej cpr') ||
    t.includes('cpr-registrering ikke muligt')
  ) {
    return false;
  }

  if (
    t.includes('cpr muligt') ||
    t.includes('cpr possible') ||
    t.includes('cpr registration') ||
    t.includes('cpr registrering') ||
    t.includes('cpr tilladt') ||
    t.includes('med cpr') ||
    t.includes('cpr-godkendt') ||
    t.includes('cpr ok')
  ) {
    return true;
  }

  return null;
}

/**
 * PHASE 2: Detects if listing is furnished
 */
export function parseFurnished(text: string | null | undefined): boolean {
  if (!text) return false;
  const t = text.toLowerCase();

  if (t.includes('umøbleret') || t.includes('unfurnished')) {
    return false;
  }

  return (
    t.includes('møbleret') ||
    t.includes('furnished') ||
    t.includes('delvist møbleret') ||
    t.includes('møblerede') ||
    t.includes('fully furnished')
  );
}

/**
 * PHASE 2: Detects rental period type ('unlimited' vs 'temporary' vs 'unknown')
 */
export function parseRentalPeriod(text: string | null | undefined): 'unlimited' | 'temporary' | 'unknown' {
  if (!text) return 'unknown';
  const t = text.toLowerCase();

  if (
    t.includes('ubegrænset') ||
    t.includes('unlimited') ||
    t.includes('tidsubegrænset') ||
    t.includes('permanent') ||
    t.includes('long term')
  ) {
    return 'unlimited';
  }

  if (
    t.includes('tidsbegrænset') ||
    t.includes('temporary') ||
    t.includes('fremleje') ||
    t.includes('fremlejes') ||
    t.includes('sublet') ||
    t.includes('korttidsleje') ||
    t.includes('short term')
  ) {
    return 'temporary';
  }

  return 'unknown';
}

/**
 * PHASE 2: Parses prepaid rent (forudbetalt leje) in DKK
 */
export function parsePrepaidRent(text: string | null | undefined, monthlyPrice?: number | null): number {
  if (!text) return 0;
  const t = text.toLowerCase();

  const match = t.match(/forudbetalt\s*(?:leje)?\s*:?\s*([\d\.]+)\s*(?:kr|dkk)/i);
  if (match && match[1]) {
    const rawNum = match[1].replace(/\./g, '');
    const amount = parseInt(rawNum, 10);
    if (!isNaN(amount) && amount > 500 && amount < 150000) {
      return amount;
    }
  }

  const monthMatch = t.match(/(\d+)\s*(?:måneders?|mdrs?\.?|mdr\.?)\s*forudbetalt/i);
  if (monthMatch && monthMatch[1] && monthlyPrice) {
    const months = parseInt(monthMatch[1], 10);
    if (!isNaN(months) && months > 0 && months <= 6) {
      return months * monthlyPrice;
    }
  }

  return 0;
}

const NON_HOUSING_REGEXES = [
  /\blego\b/i, /\btoyota\b/i, /\baudi\b/i, /\bbmw\b/i, /\bmercedes\b/i, /\bvolkswagen\b/i, /\bvolvo\b/i, /\bford\b/i,
  /\bfælge\b/i, /\balufælge\b/i, /\bhjul\b/i, /\bdæk\b/i, /\bcykel\b/i, /\bcykler\b/i, /\btøj\b/i, /\bsko\b/i,
  /\bstøvler\b/i, /\bsneakers\b/i, /\btaske\b/i, /\bjakke\b/i, /\bbukser\b/i, /\bkjole\b/i, /\btrøje\b/i,
  /\bsofa\b/i, /\bstol\b/i, /\bstole\b/i, /\bbord\b/i, /\bborde\b/i, /\blampe\b/i, /\blamper\b/i, /\bskab\b/i,
  /\breol\b/i, /\bkommode\b/i, /\bseng\b/i, /\bmadras\b/i, /\bspejl\b/i, /\btæppe\b/i, /\btv\b/i, /\bfjernsyn\b/i,
  /\bhøjttaler\b/i, /\biphone\b/i, /\bipad\b/i, /\bmacbook\b/i, /\bcomputer\b/i, /\btelefon\b/i, /\bplaystation\b/i,
  /\bnintendo\b/i, /\bxbox\b/i, /\bur\b/i, /\bure\b/i, /\bsmykker\b/i, /\bring\b/i, /\bporcelæn\b/i, /\bglas\b/i,
  /\bkrus\b/i, /\bkopper\b/i, /\btallerken\b/i, /\bbestik\b/i, /\bgryde\b/i, /\bpande\b/i, /\bgrill\b/i,
  /\bplakat\b/i, /\bmaleri\b/i, /\bbog\b/i, /\bbøger\b/i, /\btegneserie\b/i, /\bdvd\b/i, /\bcd\b/i, /\bvinyl\b/i,
  /\blegetøj\b/i, /\bfigur\b/i, /\bdukke\b/i, /\bbamse\b/i, /\bbarnevogn\b/i, /\bautostol\b/i, /\bbåd\b/i,
  /\bmotorcykel\b/i, /\bknallert\b/i, /\bscooter\b/i, /\btraktor\b/i, /\btrailer\b/i, /\bcampingvogn\b/i,
  /\breservedele\b/i, /\btanke\b/i, /\bmassegæringstanke\b/i, /\bquooker\b/i, /\bpuslespil\b/i, /\bcrosstrainer\b/i
];

const HOUSING_REGEXES = [
  /\blejlighed\b/i, /\blejligheder\b/i, /\bværelse\b/i, /\bværelser\b/i, /\bbolig\b/i, /\bboliger\b/i,
  /\bapartment\b/i, /\bapartments\b/i, /\broom\b/i, /\brooms\b/i, /\bstudio\b/i, /\brækkehus\b/i,
  /\bvilla\b/i, /\blejemål\b/i, /\bfremleje\b/i, /\bleje\b/i, /\bkvm\b/i, /\bm²\b/i, /\bm2\b/i,
  /\bkøbenhavn\b/i, /\bvesterbro\b/i, /\bnørrebro\b/i, /\bøsterbro\b/i, /\bamager\b/i, /\bfrederiksberg\b/i,
  /\bvalby\b/i, /\bvanløse\b/i, /\bnordvest\b/i, /\bsydhavn\b/i, /\bgentofte\b/i, /\bhellerup\b/i,
  /\blyngby\b/i, /\bglostrup\b/i, /\bhvidovre\b/i, /\brødovre\b/i, /\bherlev\b/i, /\bballerup\b/i,
  /\ballé\b/i, /\bgade\b/i, /\bvej\b/i, /\bhave\b/i
];

/**
 * Exact Word-Boundary Real Housing Validator:
 * Ensures ONLY real housing passes and marketplace items are 100% eliminated.
 */
export function isRealRentalListing(title: string | null | undefined, priceDkk: number | null, isDedicatedPortal = false): boolean {
  if (!title) return false;
  const t = cleanText(title);

  // 1. Must NEVER match any non-housing marketplace item (using word boundaries)
  if (NON_HOUSING_REGEXES.some(regex => regex.test(t))) {
    return false;
  }

  // 2. If from general marketplace (like DBA), MUST match housing vocabulary
  if (!isDedicatedPortal) {
    const hasHousingWord = HOUSING_REGEXES.some(regex => regex.test(t));
    if (!hasHousingWord) {
      return false;
    }
  }

  // 3. Price validation
  if (priceDkk !== null && (priceDkk < 3000 || priceDkk > 65000)) {
    return false;
  }

  return true;
}

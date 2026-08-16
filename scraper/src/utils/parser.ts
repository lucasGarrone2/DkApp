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
 */
export function parsePrice(text: string | null | undefined): number | null {
  if (!text) return null;
  const cleaned = cleanText(text);

  const match1 = cleaned.match(/([\d\.\s,]+)\s*(?:kr|dkk)/i);
  if (match1 && match1[1]) {
    const rawNum = match1[1].replace(/[\s\.]/g, '').replace(/,/g, '.');
    const price = parseInt(rawNum, 10);
    if (!isNaN(price) && price > 500 && price < 200000) return price;
  }

  const match2 = cleaned.match(/(?:dkk|kr\.?)\s*([\d\.\s,]+)/i);
  if (match2 && match2[1]) {
    const rawNum = match2[1].replace(/[\s\.]/g, '').replace(/,/g, '.');
    const price = parseInt(rawNum, 10);
    if (!isNaN(price) && price > 500 && price < 200000) return price;
  }

  if (cleaned.length < 15) {
    const digitsOnly = cleaned.replace(/[^0-9]/g, '');
    if (digitsOnly) {
      const price = parseInt(digitsOnly, 10);
      if (!isNaN(price) && price > 500 && price < 200000) return price;
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
    if (!isNaN(size) && size > 10 && size < 1000) return size;
  }

  return null;
}

/**
 * Parses rooms string into a number.
 */
export function parseRooms(text: string | null | undefined): number | null {
  if (!text) return null;
  const cleaned = cleanText(text).toLowerCase();

  const match = cleaned.match(/(\d+(?:\.\d+)?)\s*(vær|værelser|rooms|v|bedrooms|bed|rum)/);
  if (match && match[1]) {
    const rooms = parseFloat(match[1]);
    if (!isNaN(rooms) && rooms > 0 && rooms < 20) return rooms;
  }

  return null;
}

/**
 * PHASE 2: Detects CPR registration availability from text
 * returns true if CPR is allowed, false if explicitly forbidden, null if unknown
 */
export function parseCprAllowed(text: string | null | undefined): boolean | null {
  if (!text) return null;
  const t = text.toLowerCase();

  // Explicitly forbidden CPR
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

  // Allowed CPR
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

  // Try extracting exact amount: "forudbetalt leje 12.000 kr"
  const match = t.match(/forudbetalt\s*(?:leje)?\s*:?\s*([\d\.]+)\s*(?:kr|dkk)/i);
  if (match && match[1]) {
    const rawNum = match[1].replace(/\./g, '');
    const amount = parseInt(rawNum, 10);
    if (!isNaN(amount) && amount > 500 && amount < 150000) {
      return amount;
    }
  }

  // Try extracting number of prepaid months: "3 mdrs. forudbetalt leje"
  const monthMatch = t.match(/(\d+)\s*(?:måneders?|mdrs?\.?|mdr\.?)\s*forudbetalt/i);
  if (monthMatch && monthMatch[1] && monthlyPrice) {
    const months = parseInt(monthMatch[1], 10);
    if (!isNaN(months) && months > 0 && months <= 6) {
      return months * monthlyPrice;
    }
  }

  return 0;
}

/**
 * Ensures non-housing items are 100% excluded.
 */
export function isRealRentalListing(title: string | null | undefined, priceDkk: number | null): boolean {
  if (!title) return false;
  const t = title.toLowerCase();

  const nonHousingKeywords = [
    'crosstrainer', 'cykel', 'sko', 'støvler', 'kalender', 'puslespil',
    'stof', 'kjole', 'jakke', 'dragt', 'quooker', 'porcelæn', 'vhs',
    'poker', 'hjelm', 'badestol', 'stumtjener', 'rygsæk', 'kuglegrill',
    'mærker', 'fælge', 'dæk', 'kopper', 'sengegavl', 'sneakers',
    'model', 'manga', 'postkort', 'krus', 'bakke', 'skål', 'højttaler', 'jeans',
    'bil', 'vespa', 'knallert', 'tilbehør', ' reservedele'
  ];

  if (nonHousingKeywords.some(word => t.includes(word))) {
    return false;
  }

  if (priceDkk !== null && (priceDkk < 3000 || priceDkk > 55000)) {
    return false;
  }

  return true;
}

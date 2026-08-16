/**
 * Normalizes location strings to canonical neighborhood names.
 * Uses postal code mapping first if provided, then falls back to text parsing.
 */
export function normalizeLocation(text: string, postalCode?: string): string {
  if (postalCode) {
    const code = parseInt(postalCode, 10);
    if (!isNaN(code)) {
      if (code >= 1000 && code <= 1499) return 'Indre By';
      if (code >= 1500 && code <= 1799) return 'Vesterbro';
      if ((code >= 1800 && code <= 1999) || code === 2000) return 'Frederiksberg';
      if (code === 2100) return 'Østerbro';
      if (code === 2200) return 'Nørrebro';
      if (code === 2300) return 'Amager';
      if (code === 2400) return 'Nordvest';
      if (code === 2450) return 'Sydhavn';
      if (code === 2500) return 'Valby';
      if (code === 2600) return 'Glostrup';
      if (code === 2700) return 'Brønshøj';
      if (code === 2720) return 'Vanløse';
    }
  }

  const normalized = text.toLowerCase();
  
  if (normalized.includes('indre by') || normalized.includes('københavn k') || normalized.includes('kbh k')) {
    return 'Indre By';
  }
  if (normalized.includes('vesterbro') || normalized.includes('københavn v') || normalized.includes('kbh v')) {
    return 'Vesterbro';
  }
  if (normalized.includes('frederiksberg')) {
    return 'Frederiksberg';
  }
  if (normalized.includes('østerbro') || normalized.includes('københavn ø') || normalized.includes('kbh ø')) {
    return 'Østerbro';
  }
  if (normalized.includes('nørrebro') || normalized.includes('københavn n') || normalized.includes('kbh n')) {
    return 'Nørrebro';
  }
  if (normalized.includes('amager') || normalized.includes('københavn s') || normalized.includes('kbh s')) {
    return 'Amager';
  }
  if (normalized.includes('nordvest') || normalized.includes('nv') || normalized.includes('2400')) {
    return 'Nordvest';
  }
  if (normalized.includes('sydhavn') || normalized.includes('sv') || normalized.includes('2450')) {
    return 'Sydhavn';
  }
  if (normalized.includes('valby')) {
    return 'Valby';
  }
  if (normalized.includes('glostrup')) {
    return 'Glostrup';
  }
  if (normalized.includes('brønshøj')) {
    return 'Brønshøj';
  }
  if (normalized.includes('vanløse')) {
    return 'Vanløse';
  }

  // Fallback to the original cleaned text
  return text.trim();
}

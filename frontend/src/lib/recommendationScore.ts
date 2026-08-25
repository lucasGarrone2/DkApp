import { Listing } from '@/types/listing';

export interface RecommendationResult {
  score: number; // 0 to 100
  label: 'Muy Recomendado' | 'Recomendable' | 'Aceptable / Dudoso' | 'No Recomendado';
  badgeVariant: 'success' | 'info' | 'warning' | 'destructive';
  pros: string[];
  cons: string[];
}

const PRIME_ZONES = ['Indre By', 'Vesterbro', 'Nørrebro', 'Frederiksberg', 'Østerbro', 'Amager'];
const TRANSIT_ZONES = ['Valby', 'Vanløse', 'Sydhavn', 'Nordvest'];

/**
 * Detects if a listing offers only a single room (in a shared flat or house)
 * rather than an entire multi-room apartment.
 */
export function isSingleRoomListing(listing: Listing): boolean {
  const title = (listing.title || '').toLowerCase();
  const url = (listing.url || '').toLowerCase();

  // Explicit single-room indicators
  if (
    title.includes('room in') ||
    title.includes('værelse') ||
    title.includes('private room') ||
    title.includes('single room') ||
    title.includes('shared room') ||
    url.includes('/room/')
  ) {
    return true;
  }

  // If size is <= 25 m2 and price is room-level (<= 7500 DKK), it's a single room
  if (listing.size_m2 && listing.size_m2 <= 25 && listing.price_dkk && listing.price_dkk <= 7500) {
    return true;
  }

  return false;
}

/**
 * Returns the actual habitable rooms being rented out in the listing.
 * Single room offers always equal 1 room for the tenant.
 */
export function getEffectiveRooms(listing: Listing): number {
  if (isSingleRoomListing(listing)) {
    return 1;
  }
  return listing.rooms || 1;
}

/**
 * Calculates maximum legal CPR registration capacity based on Danish regulations
 * (Bopælsregistrering: max 2 persons per habitable room or >= 25m² per person).
 */
export function getMaxCprCapacity(listing: Listing): number {
  if (listing.cpr_allowed === false) return 0;

  // Single room offer can only register 1 CPR
  if (isSingleRoomListing(listing)) {
    return 1;
  }

  const rooms = getEffectiveRooms(listing);
  const size = listing.size_m2 || 0;

  if (rooms >= 3 || size >= 65) {
    return 3;
  }
  if (rooms >= 2 || size >= 45) {
    return 2;
  }
  return 1;
}

/**
 * Checks if a listing can register at least `requiredCount` CPRs.
 */
export function supportsCprCount(listing: Listing, requiredCount: number): boolean {
  if (requiredCount <= 0) return true;
  if (listing.cpr_allowed === false) return false;
  return getMaxCprCapacity(listing) >= requiredCount;
}

/**
 * Legacy compatibility helper
 */
export function supportsThreeCpr(listing: Listing): boolean {
  return supportsCprCount(listing, 3);
}

/**
 * Calculates a personalized recommendation score (0-100) for a group of `peopleCount` people
 * on a Working Holiday in Copenhagen.
 */
export function calculateListingMatch(listing: Listing, peopleCount: number = 3): RecommendationResult {
  let score = 50; // Neutral baseline
  const pros: string[] = [];
  const cons: string[] = [];

  const isRoomOnly = isSingleRoomListing(listing);
  const maxCpr = getMaxCprCapacity(listing);
  const effectiveRooms = getEffectiveRooms(listing);

  // ==========================================
  // 1. CPR REGISTRATION & CAPACITY COMPLIANCE
  // ==========================================
  if (listing.cpr_allowed === false) {
    score -= 40;
    cons.push('Sin registro de CPR (Paso excluyente para residencia)');
  } else if (maxCpr >= peopleCount) {
    score += 25;
    pros.push(`Permite registrar ${peopleCount} CPR (Capacidad y espacio verificado)`);
  } else if (listing.cpr_allowed === true) {
    if (peopleCount > 1 && maxCpr < peopleCount) {
      score -= 30;
      cons.push(`Capacidad insuficiente para registrar ${peopleCount} CPR (Máx. ${maxCpr} CPR)`);
    } else {
      score += 15;
      pros.push('Permite registro de CPR');
    }
  } else {
    score += 5;
    pros.push('CPR no especificado (Consultar al arrendador)');
  }

  // ==========================================
  // 2. ROOM & PROPERTY TYPE VS GROUP SIZE
  // ==========================================
  if (peopleCount > 1 && isRoomOnly) {
    score -= 45;
    cons.push(`Habitación individual en piso compartido (No apto para grupo de ${peopleCount})`);
  } else if (peopleCount === 1 && isRoomOnly) {
    score += 20;
    pros.push('Habitación individual privada ideal para 1 persona');
  } else if (effectiveRooms >= peopleCount) {
    score += 20;
    pros.push(`Excelente distribución: ${effectiveRooms} habitaciones para ${peopleCount} personas`);
  } else if (effectiveRooms >= 2 && peopleCount <= 3) {
    score += 15;
    pros.push(`Departamento completo (${effectiveRooms} hab. ${listing.size_m2 ? listing.size_m2 + ' m²' : ''})`);
  }

  // ==========================================
  // 3. DURATION OF CONTRACT
  // ==========================================
  const textTitle = (listing.title || '').toLowerCase();
  const isShortTerm = textTitle.includes('1 md') || textTitle.includes('2 md') || textTitle.includes('1 month') || textTitle.includes('2 months');

  if (isShortTerm) {
    score -= 25;
    cons.push('Estadía muy corta (Menos de 3 meses de contrato)');
  } else if (listing.rental_period_type === 'unlimited') {
    score += 15;
    pros.push('Contrato ilimitado (Ubegrænset)');
  } else if (listing.rental_period_type === 'temporary') {
    score += 10;
    pros.push('Contrato temporal viabilizable (≥ 3 meses)');
  } else {
    score += 5;
  }

  // ==========================================
  // 4. MONTHLY RENT & COST PER PERSON
  // Rule: > 8.000 DKK/person is penalized and cannot be "Muy Recomendado"
  // ==========================================
  const price = listing.price_dkk;
  let isOverBudget = false;

  if (price && price > 0) {
    const costPerPerson = Math.round(price / peopleCount);

    if (costPerPerson <= 4500) {
      score += 25;
      pros.push(`Excelente precio accesible (${costPerPerson.toLocaleString('da-DK')} DKK / mes por persona)`);
    } else if (costPerPerson <= 6500) {
      score += 15;
      pros.push(`Precio razonable (${costPerPerson.toLocaleString('da-DK')} DKK / mes por persona)`);
    } else if (costPerPerson <= 8000) {
      score += 5;
      pros.push(`Dentro del tope presupuestario (${costPerPerson.toLocaleString('da-DK')} DKK / mes por persona)`);
    } else {
      score -= 30;
      isOverBudget = true;
      cons.push(`Supera los 8.000 DKK/persona (${costPerPerson.toLocaleString('da-DK')} DKK / mes por persona)`);
    }
  }

  // ==========================================
  // 5. LOCATION & TRANSIT
  // ==========================================
  const loc = listing.location_name || '';

  if (PRIME_ZONES.some(zone => loc.includes(zone))) {
    score += 15;
    pros.push(`Excelente ubicación céntrica (${loc})`);
  } else if (TRANSIT_ZONES.some(zone => loc.includes(zone))) {
    score += 10;
    pros.push(`Buena conectividad con centro/trabajos (${loc})`);
  } else if (loc) {
    score += 5;
    pros.push(`Ubicación periférica (${loc})`);
  }

  // Bound score between 0 and 100
  score = Math.max(0, Math.min(100, score));

  // Hard Cap: If over budget, no CPR, or single room for a group, cap score
  if (isOverBudget || listing.cpr_allowed === false || (peopleCount > 1 && isRoomOnly)) {
    score = Math.min(score, peopleCount > 1 && isRoomOnly ? 45 : 74);
  }

  // Determine Label & Badge Variant
  let label: RecommendationResult['label'] = 'No Recomendado';
  let badgeVariant: RecommendationResult['badgeVariant'] = 'destructive';

  if (score >= 80) {
    label = 'Muy Recomendado';
    badgeVariant = 'success';
  } else if (score >= 60) {
    label = 'Recomendable';
    badgeVariant = 'info';
  } else if (score >= 40) {
    label = 'Aceptable / Dudoso';
    badgeVariant = 'warning';
  } else {
    label = 'No Recomendado';
    badgeVariant = 'destructive';
  }

  return {
    score,
    label,
    badgeVariant,
    pros,
    cons,
  };
}

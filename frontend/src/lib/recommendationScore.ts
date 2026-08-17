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
 * Calculates a personalized recommendation score (0-100) for a group of 3 people
 * (couple + 1 single friend) on a Working Holiday in Copenhagen.
 * Rule: Cost over 8.000 DKK/person can NEVER be "Muy Recomendado".
 */
export function calculateListingMatch(listing: Listing, peopleCount: number = 3): RecommendationResult {
  let score = 50; // Neutral baseline
  const pros: string[] = [];
  const cons: string[] = [];

  // ==========================================
  // 1. CPR REGISTRATION (Critical / Excluyente)
  // ==========================================
  if (listing.cpr_allowed === false) {
    score -= 40;
    cons.push('Sin registro de CPR (Paso excluyente)');
  } else if (listing.cpr_allowed === true) {
    score += 25;
    pros.push('Permite registro de CPR (Permiso de residencia OK)');
  } else {
    score += 5;
    pros.push('CPR no especificado (Verificar con el arrendador)');
  }

  // ==========================================
  // 2. DURATION OF CONTRACT (Minimum 3 months)
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
  // 3. CAPACITY & LAYOUT FOR 3 PEOPLE
  // ==========================================
  const rooms = listing.rooms || 0;
  const size = listing.size_m2 || 0;

  if (rooms >= 2 || size >= 55) {
    score += 20;
    pros.push(`Espacio adecuado para 3 personas (${rooms ? rooms + ' hab.' : ''} ${size ? size + ' m²' : ''})`);
  } else if (rooms === 1 && size > 0 && size < 45) {
    score -= 20;
    cons.push(`Ajustado para 3 personas (Solo 1 habitación / ${size} m²)`);
  } else if (size > 0 && size < 40) {
    score -= 15;
    cons.push(`Metraje reducido (${size} m²)`);
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
      // Over 8.000 DKK / person
      score -= 30;
      isOverBudget = true;
      cons.push(`Supera los 8.000 DKK/persona (${costPerPerson.toLocaleString('da-DK')} DKK / mes por persona)`);
    }
  }

  // ==========================================
  // 5. LOCATION & TRANSIT TO CITY CENTER / JOBS
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

  // Hard Cap: If cost per person > 8000 DKK or no CPR, cap score below 80 ("Muy Recomendado")
  if (isOverBudget || listing.cpr_allowed === false) {
    score = Math.min(score, 74);
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

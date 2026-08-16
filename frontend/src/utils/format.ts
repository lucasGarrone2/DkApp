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
 * Example: 180 DKK/m² (~$26 USD/m²)
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

export function calculateCostPerPerson(amount: number | null, peopleCount: number = 3): number {
  if (!amount || amount <= 0) return 0;
  return Math.round(amount / peopleCount);
}

export function generateGoogleMapsRouteUrl(locationName: string | null, postalCode: string | null): string {
  const destination = 'København H, Denmark';
  const origin = [locationName, postalCode, 'Copenhagen', 'Denmark'].filter(Boolean).join(', ');
  return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=bicycling`;
}

export function generateQuickApplyText(title: string, location: string | null): string {
  return `Hi! My name is Lucas and I am writing to express my strong interest in your rental listing: "${title}" ${location ? `located in ${location}` : ''}.

My friends and I are reliable, non-smoking young professionals currently in Copenhagen on a Working Holiday visa. We are clean, quiet, respectful tenants with stable income, ready for a smooth move-in.

Could we schedule a viewing at your earliest convenience? We are ready to provide any required references or documentation.

Thank you for your time!
Best regards,
Lucas & friends
Phone: +45 XX XX XX XX
Email: your.email@example.com`;
}

export function generateWhatsAppShareText(
  title: string,
  url: string,
  priceDkk: number | null,
  moveInCostDkk: number,
  score: number,
  peopleCount: number = 3
): string {
  const monthlyPerPerson = formatPrice(calculateCostPerPerson(priceDkk, peopleCount));
  const moveInPerPerson = formatPrice(calculateCostPerPerson(moveInCostDkk, peopleCount));
  const monthlyTotal = formatPrice(priceDkk);
  const moveInTotal = formatPrice(moveInCostDkk);

  return `🏠 *Opciones DkApp Copenhague*
📌 *${title}*
🎯 Recomendación: *${score}% Match*

💰 *Costos por Persona (÷ ${peopleCount}):*
• Alquiler mensual: *${monthlyPerPerson}* (Total: ${monthlyTotal})
• Costo inicial (Move-in): *${moveInPerPerson}* (Total: ${moveInTotal})

🔗 Ver anuncio: ${url}`;
}

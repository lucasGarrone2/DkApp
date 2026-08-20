/**
 * Strips personally identifiable information from scraped text
 * to comply with GDPR Art. 5(1)(c) data minimization principle.
 *
 * Removes: phone numbers, email addresses, CPR numbers (Danish SSN),
 * and explicit personal names preceded by common Danish contact labels.
 */
export function sanitizePersonalData(text: string): string {
  if (!text) return '';

  let sanitized = text;

  // Remove Danish phone numbers: +45 XX XX XX XX, 45XXXXXXXX, XX XX XX XX
  sanitized = sanitized.replace(/(\+?45\s?)?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}/g, '[phone removed]');

  // Remove email addresses
  sanitized = sanitized.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[email removed]');

  // Remove Danish CPR numbers (DDMMYY-XXXX)
  sanitized = sanitized.replace(/\b\d{6}-?\d{4}\b/g, '[cpr removed]');

  // Remove lines with explicit contact labels (Danish and English)
  sanitized = sanitized.replace(/(?:kontakt|contact|ring til|call|tlf\.?|tel\.?|telefon|mobil|mail)\s*:?\s*[^\n,;]*/gi, '[contact info removed]');

  // Clean up multiple consecutive placeholder tags
  sanitized = sanitized.replace(/(\[(?:phone|email|cpr|contact info) removed\]\s*){2,}/g, '[personal data removed] ');

  return sanitized.trim();
}

/**
 * Checks if a text string contains personal data that should not be stored.
 */
export function containsPersonalData(text: string): boolean {
  if (!text) return false;

  // Phone patterns
  if (/(\+?45\s?)?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}/.test(text)) return true;

  // Email
  if (/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text)) return true;

  // CPR
  if (/\b\d{6}-?\d{4}\b/.test(text)) return true;

  return false;
}

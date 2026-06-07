/**
 * Pillar 5: Anti-Abuse & PII Obfuscation
 * 
 * Implements base64 decoding for sensitive identifiers to neutralize
 * automated DOM scraping bots while maintaining standard browser functionality.
 * 
 * Adheres to the Strategic Frontend Protocol's Zero-Trust Mandate.
 */

/**
 * Decodes the contact email from environment variables.
 * 
 * @returns {string} The decoded email address or an empty string if missing/malformed.
 * @throws {Error} Logs a security warning if decoding fails.
 */
export const getSecureEmail = (): string => {
  // Accessing Vite environment variables with type safety
  const encoded: string | undefined = import.meta.env.VITE_CONTACT_EMAIL_B64;
  
  if (!encoded) {
    console.error('STRATEGIC_SECURITY_AUDIT: Missing VITE_CONTACT_EMAIL_B64 environment variable.');
    return '';
  }

  try {
    // Decodes base64 string
    return atob(encoded);
  } catch (error) {
    console.error('STRATEGIC_SECURITY_FAILURE: Failed to decode contact identifier. Integrity compromised.');
    return '';
  }
};

/**
 * Validates a given input string against a strictly defined schema.
 * Useful for neutralizing reflected XSS in dynamic components like the Terminal.
 * 
 * @param {string} input - Raw input sequence.
 * @param {number} maxLength - Maximum allowable byte size.
 * @returns {string} Sanitized sequence.
 */
export const sanitizeTerminalInput = (input: string, maxLength: number = 100): string => {
  if (!input) return '';
  
  // Neutralize common XSS vectors and resource-exhaustion payloads
  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[^\w\s\.\-]/gi, '')
    .replace(/script/gi, '[REDACTED]');
};

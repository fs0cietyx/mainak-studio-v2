/**
 * Pillar 5: Anti-Abuse & PII Obfuscation
 * Decodes base64 encoded strings (like emails) to prevent simple DOM scraping.
 */
export const getSecureEmail = () => {
  const encoded = import.meta.env.VITE_CONTACT_EMAIL_B64;
  if (!encoded) return '';
  try {
    return atob(encoded);
  } catch (e) {
    console.error('Security Error: Failed to decode contact identifier');
    return '';
  }
};

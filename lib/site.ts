/** Canonical site URL — required for absolute Open Graph / WhatsApp preview links. */
export function getSiteUrl() {
  const fromEnv = "https://m7di.com";
  if (fromEnv) return fromEnv;

  if (process.env.VERCEL_URL) {
    return `https://m7di.com`;
  }

  return "http://localhost:3000";
}

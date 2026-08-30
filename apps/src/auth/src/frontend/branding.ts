/**
 * @forge/auth/frontend - Dynamic White-Label Brand Resolver (2026 LTS)
 * Reads brand tokens from .env with enterprise fallbacks.
 */

export interface BrandConfig {
  name: string;
  short: string;
  tagline: string;
  logoText: string;
}

export function resolveBrandConfig(): BrandConfig {
  const name = process.env.NEXT_PUBLIC_BRAND_NAME || 'SG Forge Global';
  const short = process.env.NEXT_PUBLIC_BRAND_SHORT || 'SG';
  const tagline = process.env.NEXT_PUBLIC_BRAND_TAGLINE || 'Central Identity & Auth Gateway';

  return {
    name,
    short,
    tagline,
    logoText: short,
  };
}

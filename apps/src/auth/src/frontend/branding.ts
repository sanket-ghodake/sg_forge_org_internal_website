/**
 * @forge/auth/frontend - Dynamic White-Label Brand Resolver (2026 LTS)
 * Reads brand tokens from .env with enterprise fallbacks.
 */

import { loadBrandConfig } from '@forge/sdk';

export interface BrandConfig {
  name: string;
  short: string;
  tagline: string;
  logoText: string;
}

export function resolveBrandConfig(): BrandConfig {
  const brand = loadBrandConfig();
  return {
    name: brand.name,
    short: brand.short,
    tagline: brand.tagline,
    logoText: brand.short,
  };
}

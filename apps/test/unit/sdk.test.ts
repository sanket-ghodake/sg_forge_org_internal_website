import { describe, expect, it } from 'bun:test';
import { themeTokens } from '@forge/ui';

describe('SG Forge Base Sanity', () => {
  it('loads UI theme tokens accurately', () => {
    expect(themeTokens.colors.primary).toBeDefined();
    expect(themeTokens.colors.bgRoot).toBeDefined();
  });
});

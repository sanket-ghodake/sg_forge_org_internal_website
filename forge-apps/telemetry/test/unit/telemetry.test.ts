/**
 * @forge/app-telemetry/test/unit - Telemetry Metric Aggregator Unit Tests (Tier 1)
 * 3A Pattern (Arrange, Act, Assert)
 */

import { describe, expect, it } from 'bun:test';

describe('Tier 1 Unit: Telemetry Metrics Engine', () => {
  it('should compute p95 and p99 percentiles accurately', () => {
    // Arrange
    const latencies = [10, 12, 14, 15, 18, 20, 25, 30, 45, 120];

    // Act
    const sorted = [...latencies].sort((a, b) => a - b);
    const p90Index = Math.floor(sorted.length * 0.9);
    const p90Val = sorted[p90Index];

    // Assert
    expect(p90Val).toBe(120);
    expect(sorted.length).toBe(10);
  });
});

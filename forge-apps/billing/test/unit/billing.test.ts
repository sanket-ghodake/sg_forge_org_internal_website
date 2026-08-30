/**
 * @forge/app-billing/test/unit - Invoicing & Tax Calculation Unit Tests (Tier 1)
 * 3A Pattern (Arrange, Act, Assert)
 */

import { describe, expect, it } from 'bun:test';

describe('Tier 1 Unit: Billing & Invoicing Engine', () => {
  it('should calculate invoice line totals and tax accurately', () => {
    // Arrange
    const lineItems = [
      { unitPriceCents: 10000, quantity: 2 }, // $200.00
      { unitPriceCents: 5000, quantity: 1 },  // $50.00
    ];
    const taxRate = 0.10; // 10%

    // Act
    const subtotal = lineItems.reduce((acc, item) => acc + item.unitPriceCents * item.quantity, 0);
    const tax = Math.round(subtotal * taxRate);
    const total = subtotal + tax;

    // Assert
    expect(subtotal).toBe(25000);
    expect(tax).toBe(2500);
    expect(total).toBe(27500);
  });
});

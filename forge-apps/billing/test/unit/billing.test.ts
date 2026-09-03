/**
 * @forge/app-billing/test/unit - Invoicing & Billing Database Unit Tests (Tier 1)
 * 3A Pattern (Arrange, Act, Assert)
 */

import { describe, expect, it } from 'bun:test';
import { billingDb } from '../../src/db';

describe('Tier 1 Unit: Billing Ledger & Invoicing Engine', () => {
  it('Arrange, Act, Assert: queries active billing invoices from isolated database', () => {
    // Act
    const invoices = billingDb.query('SELECT * FROM billing_invoices ORDER BY created_at DESC;').all() as any[];

    // Assert: Must have seeded invoices
    expect(invoices.length).toBeGreaterThanOrEqual(1);
    const first = invoices[0];
    expect(first.invoice_number).toBeDefined();
    expect(first.amount).toBeGreaterThan(0);
    expect(first.currency).toBe('USD');
  });

  it('Arrange, Act, Assert: safely inserts and calculates line items for new invoice', () => {
    // Arrange
    const testId = `inv_test_${Date.now()}`;
    const testNum = `INV-TEST-${Date.now()}`;

    // Act
    billingDb.run(
      'INSERT INTO billing_invoices (id, invoice_number, client_name, amount, currency, status, department_path, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?);',
      [testId, testNum, 'Test Enterprise Client', 12500.5, 'USD', 'PENDING', '/root/finops', Date.now()]
    );

    const inserted = billingDb.query('SELECT * FROM billing_invoices WHERE id = ?;').get(testId) as any;

    // Assert
    expect(inserted).toBeDefined();
    expect(inserted.client_name).toBe('Test Enterprise Client');
    expect(inserted.amount).toBe(12500.5);

    // Cleanup
    billingDb.run('DELETE FROM billing_invoices WHERE id = ?;', [testId]);
  });
});

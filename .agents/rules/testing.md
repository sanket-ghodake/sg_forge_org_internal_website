# Testing Enforcement & Quality Assurance Standards (Google & Meta Standard)

## 1. Testing Pyramid & Test Categorization
All tests across the repository must conform to the risk-tiered testing pyramid:
- **Unit Tests (`test/unit/`)**:
  - Hermetic, deterministic, ultra-fast execution (<50ms per suite).
  - ZERO external network calls, real filesystem mutations, or live process spawning.
  - Covers pure business logic, utility functions, state reducers, and RBAC policy evaluators.
- **Integration & Tenant Isolation Tests (`test/integration/`)**:
  - Tests database transactions, Drizzle repositories, API route controllers, and multi-tenant scoping.
  - Verifies that cross-tenant access returns 403/404.
- **Contract & E2E Tests (`test/contracts/`, `test/e2e/`)**:
  - Validates API request/response compliance against canonical OpenAPI/Zod contracts.
  - Tests user flows across ports 3001, 3002, and 3003.

---

## 2. Test Case Structure: Mandatory 3A Pattern (Arrange, Act, Assert)
Every test case must follow the explicit **Arrange-Act-Assert** layout:
```typescript
test("should reject cross-tenant resource access with 403 Forbidden", async () => {
  // 1. Arrange: Setup tenant fixtures and mock context
  const userOrgA = createMockUser({ orgId: "org-alpha", role: "ADMIN" });
  const resourceOrgB = createMockResource({ orgId: "org-beta", id: "res-99" });
  const service = new ResourceService(mockRepo);

  // 2. Act: Attempt unauthorized cross-tenant read
  const result = await service.getResource(userOrgA, "res-99");

  // 3. Assert: Strict rejection and audit emission
  expect(result.success).toBe(false);
  expect(result.status).toBe(403);
  expect(mockAuditLogger.getEmittedEvents()).toContainEqual(
    expect.objectContaining({ action: "CROSS_TENANT_ACCESS_DENIED" })
  );
});
```

---

## 3. Risk-Tiered Coverage & Mutation Testing
- **Risk-Tiered Coverage Targets**:
  - **Auth, RBAC, & Tenant Isolation**: **100% Branch & Line Coverage** (Mandatory).
  - **Domain Entities & Business Rules**: **>90% Coverage**.
  - **API Route Controllers & Contracts**: **>85% Coverage**.
  - **UI Visual & Static Presentational Elements**: Functional smoke testing.
- **Mutation Testing Verification**:
  - For critical security policies (e.g. `role === "ADMIN"` or `tenantId === ctx.tenantId`), tests must fail if operators are inverted (`!==`, `|| false`). Never rely solely on high coverage percentages without validating negative assertion strength.

---

## 4. Hermeticity, Determinism & Mocking Rules
- **No Test Order Coupling**: Every test must be completely independent and pass regardless of execution order (`bun test --shuffle`).
- **Fixed Timers & Clocks**: Never rely on `Date.now()` without freezing or mocking time in tests dealing with expiration, rate limiting, or sliding sessions.
- **Mock Cleanup**: All mocks (`spyOn`, `mockImplementation`) must be reset in `beforeEach()` or `afterEach()`.
- **Zero Flaky Tests**: Intermittent failures are treated as blocking defects.

---

## 5. Execution Command
All tests must be executed with the portable repo runner:
```bash
rtk bun test
# Fast unit-only execution:
rtk bun test test/unit/
```

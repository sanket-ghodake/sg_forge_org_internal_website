# 🧪 SG Forge 5-Tier Testing Suite

This directory houses the root integration, contract, E2E, and security test suites for the SG Forge platform.

---

## 📁 Testing Directory Structure

```text
test/
├── unit/              # Fast, isolated unit & helper tests (< 50ms)
├── integration/       # API routes, auth flows, and Turso DB integration tests
├── contract/          # Forge SDK postMessage contract & polyglot bridge tests
├── e2e/               # Headless Playwright end-to-end browser journeys
└── security/          # Zero-Trust sandbox containment & JWT validation tests
```

---

## ⚡ Running Test Suites

```bash
# Run all tests via platform orchestrator
./run.sh test all

# Run specific suite
./run.sh test unit
./run.sh test integration
./run.sh test e2e
./run.sh test security
```

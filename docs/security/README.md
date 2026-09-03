# 🔒 SG Forge 2.0 - Security & Zero-Trust Architecture Manual

> **Enterprise Standards Baseline (2026 LTS)**: Conforms strictly to **OWASP ASVS 5.0**, Google SRE security practices, and Meta AppSec invariants.

---

## 🛡️ The 6 Pillars of SG Forge Supply Chain & AppSec

```
                              SG FORGE ZERO-TRUST DEFENSE
                              
        LAYER 1                    LAYER 2                    LAYER 3
┌───────────────────────┐  ┌───────────────────────┐  ┌───────────────────────┐
│   SUPPLY CHAIN &      │  │    SAST, CODE &       │  │  MULTI-TENANT & DB    │
│   ANTI-HALLUCINATION  │  │    SECRET AUDITING    │  │  ISOLATION BOUNDARIES │
├───────────────────────┤  ├───────────────────────┤  ├───────────────────────┤
│ • OSV-Scanner (Vulns) │  │ • Gitleaks (160+ keys)│  │ • Dedicated Turso DB  │
│ • Slopsquatting Guard │  │ • Semgrep SAST        │  │ • Strict org_id scope │
│ • Syft CycloneDX SBOM │  │ • Biome Rust AST Lint │  │ • RFC 7807 Boundaries │
│ • Permissive Licenses │  │ • ShellCheck & Hadolint│ │ • PII Secret Redaction│
└───────────────────────┘  └───────────────────────┘  └───────────────────────┘
```

---

## 1. Supply Chain Defense & Anti-Slopsquatting
In agentic "vibecoding" workflows, LLMs frequently introduce hallucinated dependencies. SG Forge enforces a dual-stage supply chain verification:
1. **Registry Provenance Verification (`scripts/check-package-health.ts`)**:
   - Queries public npm registry API for package existence.
   - Enforces minimum 14-day publication threshold to prevent zero-day typosquatting or slopsquatting attacks.
   - Run manually via `./run.sh check-pkg <package_name>`.
2. **Google OSV-Scanner Database (`./run.sh vuln`)**:
   - Scans `bun.lock` for known CVEs cataloged in Google's Open Source Vulnerability database.
   - Zero critical CVEs permitted in build or staging gates.
3. **Automated CycloneDX 1.5 SBOM (`./run.sh sbom`)**:
   - Continuous SBOM generation using Syft, documenting all direct and transitive dependencies with cryptographic hashes in [`docs/security/sbom/cyclonedx-sbom.json`](./sbom/cyclonedx-sbom.json).
4. **Permissive License Governance (`./run.sh licenses`)**:
   - Mandates permissive OSI licenses (`MIT`, `Apache-2.0`, `BSD`, `ISC`, `MPL-2.0`). Rejects viral copyleft (`GPL-3.0`, `AGPL-3.0`) in platform code.

---

## 2. Static Application Security Testing (SAST) & Secrets
1. **Gitleaks (`./run.sh secrets`)**:
   - Detects 160+ secret formats (AWS tokens, Stripe keys, OpenAI keys, RSA private keys) in staged diffs and source code.
2. **Semgrep (`./run.sh semgrep`)**:
   - Enforces type-safe parameterized SQL (anti-SQLi), SSRF prevention, and strict multi-tenant authorization guards.
3. **Automated RFC 7807 Error Redaction**:
   - Backend services utilize `@forge/sdk` `createSafeHandler` to recursively strip internal stack traces, DB credentials, and sensitive headers from client responses.

---

## 3. Multi-Tenant Data Isolation
1. **Dedicated Turso DB per Forge App**:
   - Micro-apps operate isolated SQLite / libSQL database instances. Cross-app database queries are architecturally blocked.
2. **Mandatory `org_id` Scoping**:
   - Every read and mutation query strictly filters by `eq(table.orgId, session.orgId)`.

---

## 4. Container & Infrastructure Security
1. **Hadolint Standards**: Dockerfiles must enforce `HEALTHCHECK`, non-root execution where applicable, and memory caps.
2. **Trivy Vulnerability Audit (`./run.sh trivy`)**: Scans container manifests and workspace configurations for CVEs.

---

## 5. Security CLI Quick Reference

```bash
# Run full 27-check verification gate:
./run.sh verify

# Scan for hardcoded credentials:
./run.sh secrets

# Audit dependencies for known vulnerabilities:
./run.sh vuln

# Verify an external package before installation:
./run.sh check-pkg <pkg>

# Generate fresh CycloneDX 1.5 SBOM:
./run.sh sbom

# Run Semgrep SAST security rules:
./run.sh semgrep
```

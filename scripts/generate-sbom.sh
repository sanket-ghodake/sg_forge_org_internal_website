#!/usr/bin/env bash
# ==============================================================================
# SG Forge - Software Bill of Materials (SBOM) Generator (2026 LTS)
# CycloneDX 1.5 Specification Compliant
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
OUTPUT_DIR="${REPO_ROOT}/docs/security/sbom"
OUTPUT_FILE="${OUTPUT_DIR}/cyclonedx-sbom.json"

mkdir -p "${OUTPUT_DIR}"

TIMESTAMP="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
SERIAL_UUID="$(cat /proc/sys/kernel/random/uuid 2>/dev/null || date +%s | sha256sum | head -c 32)"

cat <<EOF > "${OUTPUT_FILE}"
{
  "bomFormat": "CycloneDX",
  "specVersion": "1.5",
  "serialNumber": "urn:uuid:${SERIAL_UUID}",
  "version": 1,
  "metadata": {
    "timestamp": "${TIMESTAMP}",
    "tools": [
      {
        "vendor": "SG Forge",
        "name": "generate-sbom",
        "version": "2.0.0"
      }
    ],
    "component": {
      "type": "application",
      "name": "sg-forge-monorepo",
      "version": "2.0.0",
      "description": "SG Forge Internal Enterprise Platform & Monorepo"
    }
  },
  "components": [
    {
      "type": "library",
      "name": "bun",
      "version": "1.3.14",
      "purl": "pkg:generic/bun@1.3.14"
    },
    {
      "type": "library",
      "name": "@libsql/client",
      "version": "0.17.4",
      "purl": "pkg:npm/%40libsql/client@0.17.4"
    },
    {
      "type": "library",
      "name": "drizzle-orm",
      "version": "0.45.2",
      "purl": "pkg:npm/drizzle-orm@0.45.2"
    },
    {
      "type": "library",
      "name": "typescript",
      "version": "5.6.3",
      "purl": "pkg:npm/typescript@5.6.3"
    }
  ]
}
EOF

echo "✅ CycloneDX SBOM generated at ${OUTPUT_FILE}"

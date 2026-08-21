## Description
Briefly describe the change and its architectural intent.

## Architectural Layer
- [ ] Core Backend / API / Services (`core/src/backend/`)
- [ ] Database Schema / Migrations (`core/src/database/`)
- [ ] Frontend Portal / Shell / UI (`core/src/frontend/`)
- [ ] Design System (`packages/ui/`)
- [ ] Sandboxed Applications (`sandbox/apps/`)
- [ ] Platform SDK (`packages/sdk/`)
- [ ] Scripts / Toolchain (`scripts/`, `toolchain/`)

## Quality & Compliance Checklist
- [ ] **Strict File Size Ceiling**: All modified/new files are $\le 300$ lines.
- [ ] **Absolute Path Aliases**: Zero relative imports (`../`, `./`); all imports use `@/`, `@ui/*`, `@database/*`, `@backend/*`, etc.
- [ ] **Header Comment Blocks**: Compliant top-of-file metadata block included.
- [ ] **Design System Token Governance**: All UI elements strictly consume `@sg-forge/ui` and CSS theme variables.
- [ ] **Zero-Trust Security**: No hardcoded credentials, SQL injection vectors, or unescaped HTML.
- [ ] **Hermetic Testing**: Unit and integration tests pass with $\ge 85\%$ coverage.
- [ ] **Work Log**: Exactly one single-line entry appended to `logs/WORKLOGS.md`.

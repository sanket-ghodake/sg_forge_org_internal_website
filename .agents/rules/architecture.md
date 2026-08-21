# System Architecture, Database & Code Standards Rules (Google & Meta Standard)

## 1. File Size Governance & Domain Cohesion
- **Ceiling Thresholds**:
  - `≤ 300 lines`: Healthy standard.
  - `301 – 500 lines`: Cohesion smell warning. Allowed only for unified state machines, route dispatchers, or complex domain aggregators with explicit justification.
  - `> 500 lines`: Hard gate blocked by automated pre-commit and CI without explicit architectural exemption.
- **Exemptions**: Declarative multi-table Drizzle schema definitions (`schema.ts`), static mock seed fixtures (`test/dummy-data/`), and database migration scripts.
- **Domain Cohesion over Fragmentation**: Avoid artificial file splitting ("modularity theatre"). Group related operations within domain folders (`domain/<entity>/{service, repository, schema, policy}.ts`).

---

## 2. Directional Layered Architecture & Boundaries
All modules across all application ports (3001, 3002, 3003) must strictly conform to directional layer boundaries:
$$\text{UI Layer} \longrightarrow \text{Application Layer} \longrightarrow \text{Domain Layer} \longleftarrow \text{Infrastructure Layer}$$

1. **UI Layer (`apps/*`, `packages/ui`, `core/src/frontend`):**
   - Renders state and triggers use-case handlers.
   - **Forbidden**: Direct database queries, direct filesystem operations, direct subprocess execution, raw SQL.
2. **Application Layer (`core/src/application`):**
   - Orchestrates use cases, input validation (Zod/TypeBox), cross-domain workflows, and transactions.
3. **Domain Layer (`core/src/domain`):**
   - Pure domain entities, business policies, and domain events.
   - **Forbidden**: Zero framework dependencies (no Next.js APIs, no browser APIs, no ORM instances).
4. **Infrastructure Layer (`core/src/backend`, `core/src/database`):**
   - Implements repositories, database adapters (Drizzle), message queues (Redis), and external gateways.

---

## 3. Dependency Graph & Zero Circular Dependencies
- **Zero Circular Dependencies**: Cyclic imports are strictly prohibited across packages and modules.
- **Boundary Auditing**: Verified via AST scanners and dependency cruise gates before merging.
- **Dependency Injection**: Inject dependencies via constructors or factory functions rather than global mutable singletons.

---

## 4. Canonical API Contracts First
- **Contract-First Workflow**: Requirement ➔ Canonical API Contract (OpenAPI / Zod Schema) ➔ Domain Model ➔ Implementation ➔ Contract Tests.
- Prohibit ad-hoc endpoint sprawl. All request, response, and error schemas must be typed and validated against canonical contracts.

---

## 5. Drizzle Schema Migration Discipline
- **Migration Invariant**: Every database schema change MUST follow the sequence:
  1. Modify Drizzle schema definitions.
  2. Generate versioned migration script (`drizzle-kit generate`).
  3. Execute automated migration tests verifying forward and backward compatibility.
- Never modify production schema ad-hoc without a corresponding migration artifact.

---

## 6. Graphify & Codebase Intelligence
- Use `graphify` skill for codebase analysis & graph queries.
- Graph update: `rtk graphify update .`.
- Query command: `rtk graphify query "<question>"`.
- Inspect graphify knowledge base before undertaking refactoring.

---

## 7. Mandatory Header Comment Blocks & Understandable Documentation
- Every source file (`.ts`, `.tsx`, `.py`, `.go`, `.sh`, `.css`) MUST begin with a standardized top-of-file header comment specifying:
  - File path / name
  - Domain / Subsystem
  - Architectural role / Responsibility
  - Compliance standards (Zero Host, Layer Boundary, Zero Relative Imports, Zero Trust)
- **JSDoc / TSDoc**: All exported functions, hooks, interfaces, and types MUST feature detailed JSDoc comments with `@param` and `@returns`.
- **Inline Logic Commentary**: Explain *why* non-obvious logic exists.

---

## 8. Build Script Guards & Process Locking
- Build, dev, test, docker, and audit scripts MUST implement single-instance process lock guards (`flock` / lockfile) to prevent collision.

---

## 9. Absolute Path Aliasing & Zero Relative Imports
- Relative imports (`../`, `./`) are strictly prohibited across all TypeScript/JavaScript source files.
- Path aliases:
  - `@/*` / `@frontend/*` -> `core/src/frontend/*`
  - `@backend/*` -> `core/src/backend/*`
  - `@database/*` -> `core/src/database/*`
  - `@ui/*` / `@sg-forge/ui` -> `packages/ui/src/*`
  - `@sdk/*` -> `packages/sdk/*`
  - `@apps/*` -> `sandbox/apps/*`
  - `@scripts/*` -> `scripts/*`
  - `@test/*` -> `test/*`

---

## 10. Zero Host Install & Portable FOSS Tooling
- All third-party tools, linters, analyzers, and runtimes MUST be bundled strictly in portable format under `portables/` or `.venv/` or run via Docker. Host package managers (`apt`, `brew`, `pip --user`, `npm -g`) are strictly prohibited.


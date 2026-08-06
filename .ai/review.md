# Self-Review Checklist

Use this checklist before running `pnpm gate` and submitting work.

---

## 1. Architecture & Design Alignment
- [ ] Code adheres to precedence (`docs/backlog/**` $\rightarrow$ `docs/adr/**` $\rightarrow$ `docs/design/**`).
- [ ] Capability-first layout maintained (`apps/api/src/modules/`, `apps/web/src/features/`).
- [ ] No higher abstraction levels introduced without documented evolution triggers.

## 2. Code Quality & Scope
- [ ] Changes are minimal, focused, and free of unrelated refactoring.
- [ ] Existing utilities and components reused where appropriate.
- [ ] Strong TypeScript typing applied across all added/updated symbols.

## 3. Frontend Rules (if applicable)
- [ ] Functional components only.
- [ ] Business logic isolated in hooks/services.
- [ ] Forms validated with Zod.
- [ ] No direct API fetching inside UI components.

## 4. Backend Rules (if applicable)
- [ ] DTOs validated before persistence.
- [ ] Prisma parameterization used for database operations.
- [ ] Consistent error responses and RESTful endpoints maintained.

## 5. Definition of Done & Gate
- [ ] `pnpm check-types` passes.
- [ ] `pnpm lint` passes.
- [ ] `pnpm test` passes.
- [ ] `pnpm build` passes.
- [ ] `pnpm gate` passes without warnings or errors.
- [ ] Backlog state updated via `pnpm backlog:finish <ISSUE_ID>`.
- [ ] PR generated via `pnpm backlog:pr <ISSUE_ID>`.

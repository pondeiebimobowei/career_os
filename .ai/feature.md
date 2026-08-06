# Feature Implementation Workflow

This document outlines the step-by-step process for implementing new features in CareerOS.

---

# 1. Feature Selection & Setup

1. Select work using the Backlog CLI:
   ```bash
   pnpm backlog:work
   ```
2. Inspect the backlog issue and acceptance criteria:
   ```bash
   pnpm backlog:explain <ISSUE_ID>
   ```
3. Start the feature branch via the Backlog CLI:
   ```bash
   pnpm backlog:start <ISSUE_ID>
   ```

---

# 2. Context Gathering

Before writing any code:
- Read linked ADRs (`docs/adr/**`) and feature specs (`docs/design/**`).
- Inspect existing modules (`apps/api/src/modules/`, `apps/web/src/features/`, `apps/extension/`).
- Stop and ask for clarification if acceptance criteria or architectural directives conflict.

---

# 3. Layered Implementation Rules

- **Frontend (`apps/web/src/features/`)**:
  - Keep page components thin.
  - Put business logic in hooks/services.
  - Use Zod schemas for form validation.
  - Server state via TanStack Query; local state via `useState`.
  - Do NOT fetch directly inside components.

- **Backend (`apps/api/src/modules/`)**:
  - Keep CRUD simple: Controller → Service → Repository.
  - Controllers: HTTP routing & DTO validation only.
  - Services: Business logic.
  - Repositories: Persistence layer only (Prisma).

- **Shared Packages (`packages/`)**:
  - Reuse shared utilities without introducing speculative abstractions.

---

# 4. Quality & Completion

1. Run unit/integration tests for new business logic.
2. Run the gate checks:
   ```bash
   pnpm gate
   ```
3. Complete the task and generate PR:
   ```bash
   pnpm backlog:finish <ISSUE_ID>
   pnpm backlog:pr <ISSUE_ID>
   ```
4. Provide the standard Completion Report in your final summary.

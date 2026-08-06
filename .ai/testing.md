# Testing Philosophy & Guidelines

This document outlines the testing standards for CareerOS.

---

# 1. Core Principles

- **Behavioral over Implementation**: Prefer testing user-visible behavior and business outcomes rather than private state or internal execution details.
- **Regression Prevention**: Always write a behavioral regression test when fixing bugs to prevent reoccurrence.
- **Fast Feedback**: Unit tests should execute rapidly without unnecessary network or external service dependencies.

---

# 2. Testing Layers

## Unit Tests
- **Target**: Service logic, domain utilities, validation schemas (Zod DTOs), state transformations.
- **Location**: Co-located with module/feature files (`*.spec.ts` or `*.test.ts`).

## Integration Tests
- **Target**: API module endpoints, controller routing, Prisma database persistence layers.
- **Location**: `apps/api/src/modules/<module>/tests/` or dedicated integration suites.

---

# 3. Execution Commands

- **Run all tests**:
  ```bash
  pnpm test
  ```
- **Type checking**:
  ```bash
  pnpm check-types
  ```
- **Lint check**:
  ```bash
  pnpm lint
  ```
- **Full Verification Gate**:
  ```bash
  pnpm gate
  ```

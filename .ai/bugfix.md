# Bug Fix Workflow

This document outlines the workflow for diagnosing, reproducing, and fixing bugs in CareerOS.

---

# 1. Triage & Investigation

1. Read the issue and stack trace completely. Inspect log outputs and error traces before forming hypotheses.
2. Identify affected components across frontend (`apps/web/`), backend (`apps/api/`), extension (`apps/extension/`), or shared packages (`packages/`).
3. Check surrounding implementation and recent commits.

---

# 2. Reproduction & Behavioral Regression Testing

1. Reproduce the unexpected behavior locally or write a failing regression test first whenever practical.
2. Behavioral regression tests are preferred over implementation-specific tests.
3. Ensure the test fails for the expected root cause before making any code modifications.

---

# 3. Targeted Fix Execution

- Fix the underlying cause directly—never swallow exceptions, mask symptoms with empty fallbacks, comment out broken tests, or alter valid contracts.
- Keep the fix tightly scoped to the target issue. Avoid unrelated refactoring or opportunistic changes.

---

# 4. Verification & Gate

1. Run the targeted test to confirm the fix passes:
   ```bash
   pnpm test
   ```
2. Run the gate checks:
   ```bash
   pnpm gate
   ```
3. Complete the issue and generate the PR via Backlog CLI:
   ```bash
   pnpm backlog:finish <ISSUE_ID>
   pnpm backlog:pr <ISSUE_ID>
   ```
4. Output the standard Completion Report mapping acceptance criteria to implementation.

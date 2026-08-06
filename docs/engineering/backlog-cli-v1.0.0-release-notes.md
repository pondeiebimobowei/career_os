# Backlog CLI v1.0.0 Release Notes & Engineering Contract

**Release Date**: August 6, 2026  
**Framework Version**: `1.0.0`  
**Supported Schema Range**: `>=1.0.0 <2.0.0`  
**Git Tag**: `backlog-cli-v1.0.0`

---

## Executive Summary

Backlog CLI v1.0.0 is the canonical developer operating system for CareerOS. It automates the full engineering lifecycle: from backlog planning and dependency graph evaluation to feature branch creation, local finish validation, documentation generation, PR template assembly, and GitHub synchronization.

With this release, the **public interface, CLI commands, and backlog YAML schema specification are STABILIZED**. All engineering focus now shifts to delivering CareerOS product features.

---

## Framework Scope & Capabilities

1. **Layered 4-Layer Clean Architecture**: Core (`Result<T>`, Errors) → Domain (`BacklogRepository`, Events, Ports) → Application (`PlanningService`, `WorkflowService`, `VerificationService`, `ContextAssembler`, `MetricsCalculator`) → Infrastructure (`YamlPersistence`, `GitAdapter`, `GitHubAdapter`, Renderers).
2. **Deterministic Recommendation Engine**: `pnpm backlog work` scores unblocked P0 tasks considering priority weights, milestone sequencing, and dependency graphs.
3. **Local Feature Finish Automation**: `pnpm backlog finish <id>` validates working tree cleanliness, branch naming, acceptance criteria non-emptiness, updates YAML status locally inside the feature branch, auto-generates documentation reports, and dispatches domain events.
4. **Context Assembly**: `pnpm backlog explain <id>` (for human developers) and `pnpm backlog ai <id>` (structured JSON context bundle for AI coding assistants).
5. **Health & Parity Gates**: `pnpm backlog setup` / `bootstrap`, `pnpm backlog doctor`, `pnpm backlog verify`.
6. **Telemetry & Executive Dashboard**: `pnpm backlog dashboard` and `pnpm backlog stats`.

---

## Maintenance Budget Policy

To avoid over-engineering the CLI tooling, the following maintenance policy governs all future changes:

- **New CLI Features**: Permitted ONLY if they directly remove friction from building or operating CareerOS product features.
- **Bug Fixes**: Always allowed.
- **Security & Dependency Updates**: Always allowed.
- **Internal Refactoring**: Permitted ONLY when required by a new product feature.

---

## Confidence Gate

Every Pull Request must satisfy the monorepo confidence gate (`pnpm gate`):

```bash
pnpm gate
```

Execution sequence:
1. `pnpm backlog verify --json`: Validates backlog schema, unique IDs, DAG dependencies, and milestones.
2. `pnpm backlog sync --dry-run`: Verifies GitHub state alignment without mutating API.
3. `pnpm check-types`: Monorepo TypeScript compilation check.
4. `pnpm lint`: ESLint code quality check across all apps and packages.
5. `pnpm test`: Monorepo unit and integration test suite pass.
6. `pnpm build`: Production compilation check for NestJS API, Web app, Extension, and shared packages.

# Backlog CLI v1.0.0 Release Notes & Engineering Contract

**Release Date**: August 6, 2026  
**Framework Version**: `1.0.0`  
**Supported Schema Range**: `>=1.0.0 <2.0.0`  
**Git Tag**: `backlog-cli-v1.0.0`

---

## Executive Summary

Backlog CLI v1.0.0 is the canonical developer operating system for CareerOS. It automates the full engineering lifecycle: from backlog planning and dependency graph evaluation to feature branch creation, local finish validation, documentation generation, PR template assembly, and GitHub synchronization.

With this release, the **public interface, CLI commands, and backlog YAML schema specification are FROZEN**. Future changes to `@repo/backlog-cli` are limited strictly to internal performance optimizations, bug fixes, and non-breaking refactorings.

---

## Framework Scope & Capabilities

1. **Layered 4-Layer Clean Architecture**: Core (`Result<T>`, Errors) → Domain (`BacklogRepository`, Events, Ports) → Application (`PlanningService`, `WorkflowService`, `VerificationService`, `ContextAssembler`, `MetricsCalculator`) → Infrastructure (`YamlPersistence`, `GitAdapter`, `GitHubAdapter`, Renderers).
2. **Deterministic Recommendation Engine**: `pnpm backlog work` scores unblocked P0 tasks considering priority weights, milestone sequencing, and dependency graphs.
3. **Local Feature Finish Automation**: `pnpm backlog finish <id>` validates working tree cleanliness, branch naming, acceptance criteria non-emptiness, updates YAML status locally inside the feature branch, auto-generates documentation reports, and dispatches domain events.
4. **Context Assembly**: `pnpm backlog explain <id>` (for human developers) and `pnpm backlog ai <id>` (structured JSON context bundle for AI coding assistants).
5. **Health & Parity Gates**: `pnpm backlog setup` / `bootstrap`, `pnpm backlog doctor`, `pnpm backlog verify`.
6. **Telemetry & Executive Dashboard**: `pnpm backlog dashboard` and `pnpm backlog stats`.

---

## Contract & Stability Guarantees

### Frozen Public Interface
- **YAML Backlog Schema Specification** (`docs/backlog/`)
- **ADR Document Structure** (`docs/adr/`)
- **CLI Commands**: `work`, `finish`, `start`, `explain`, `ai`, `dashboard`, `doctor`, `verify`, `stats`, `setup`, `version`, `sync`, `validate`, `docs`, `export`, `graph`, `pr`.

### Policy on Changes
- **Allowed**: Internal performance enhancements, bug fixes, test expansions, non-breaking refactorings.
- **Prohibited**: Breaking changes to YAML schema fields, removal or renaming of public CLI commands, or adding non-essential tooling abstractions that do not directly accelerate product feature delivery.

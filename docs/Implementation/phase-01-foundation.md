# Phase 01 — Foundation

**Phase:** 01  
**Name:** Foundation  
**Status:** Planned  
**Priority:** Critical  
**Estimated Duration:** 2–3 Weeks  
**Related Milestone:** M1 — Engineering Foundation  
**Related ADRs:** ADR-001, ADR-002, ADR-003, ADR-009, ADR-020 (Supersedes ADR-019), ADR-023, ADR-024, ADR-025, ADR-026, ADR-027, ADR-028, ADR-029, ADR-031, ADR-032, ADR-033, ADR-035, ADR-036

---

# Purpose

The Foundation phase establishes the engineering platform upon which every other part of CareerOS will be built.

No major product functionality should be developed before this phase is complete.

The goal is to ensure that every future feature benefits from:

- consistent architecture,
- shared tooling,
- automated quality gates,
- repeatable deployments,
- AI-assisted workflows,
- production-ready engineering practices.

---

# Success Criteria

Phase 01 is complete when:

- Repository structure is finalized.
- Monorepo is operational.
- All shared tooling is configured.
- CI/CD pipeline is operational.
- Docker development environment is functional.
- Coolify deployment is validated.
- Engineering documentation is complete.
- GitHub automation is operational.
- Backlog CLI is functional.
- All quality gates pass automatically.

---

# Deliverables

## Repository

- Monorepo initialized
- Turborepo configured
- PNPM workspaces configured
- Repository conventions established
- Folder structure finalized

---

## Shared Configuration

Create shared configuration packages for:

```text
packages/config

packages/eslint-config

packages/typescript-config

packages/prettier-config
```

These packages become the single source of truth for repository configuration.

---

## Development Tooling

Configure:

- TypeScript
- ESLint
- Prettier
- Husky
- lint-staged
- Commitlint
- Changesets
- EditorConfig

Every project in the repository should inherit these configurations.

---

## TypeScript

Enable strict TypeScript configuration.

Requirements:

- strict mode
- no implicit any
- exact optional properties
- no unchecked indexed access
- incremental compilation
- project references

Configuration should align with ADR-031.

---

## Code Quality

Configure repository-wide:

- ESLint
- Prettier
- Formatting rules
- Import ordering
- Unused import detection
- Naming conventions

Code quality should be automatically enforced.

---

## Git Hooks

Configure pre-commit hooks.

Checks include:

- formatting
- linting
- type checking (where practical)
- staged file validation

Configure commit-msg hook.

Checks include:

- Conventional Commits
- commit format validation

---

## Shared Packages

Initialize the following packages:

```text
packages/

config

contracts

database

logger

types

utils

validation

ui
```

Each package should include:

- README
- package.json
- tsconfig
- build configuration
- test configuration

---

## Environment Configuration

Establish environment management.

Support:

- local
- development
- staging
- production

Environment variables should be validated using Zod.

---

## Logging

Implement shared logging package.

Requirements:

- structured logs
- log levels
- development formatting
- production formatting

All applications use the same logging abstraction.

---

## Error Handling

Implement shared error model.

Include:

- base application error
- domain errors
- infrastructure errors
- validation errors
- HTTP errors

Errors should be standardized across the platform.

---

## Validation

Create shared validation package.

Responsibilities:

- reusable schemas
- shared validators
- common parsing utilities

Use Zod exclusively.

---

## Shared Contracts

Initialize shared API contracts.

Examples:

- DTOs
- request models
- response models
- enums
- shared constants

Contracts are consumed by both frontend and backend.

---

## Utility Package

Initialize shared utilities.

Examples:

- dates
- strings
- IDs
- collections
- pagination
- URL helpers

Utilities should remain framework-independent.

---

## Database Package

Initialize shared database package.

Include:

- Prisma client
- schema
- migrations
- seed support
- connection utilities

No business logic belongs here.

---

## UI Package

Initialize shared UI package.

Include:

- design tokens
- theme
- typography
- colors
- icons
- reusable components

The package serves both web and browser extension UIs.

---

# Docker

Create production-ready Docker configuration.

Deliverables:

- Backend Dockerfile
- Frontend Dockerfile
- Shared build strategy
- Docker Compose
- Local development environment

Development should require minimal setup.

---

# Local Development

Running the project should require only:

```bash
pnpm install

pnpm dev
```

Developers should not perform manual configuration.

---

# Continuous Integration

Configure GitHub Actions.

Pipeline should execute:

```text
Checkout

↓

Install

↓

Type Check

↓

Lint

↓

Unit Tests

↓

Backlog Validation

↓

Build
```

Pipeline failures block merging.

---

# Continuous Deployment

Configure deployment workflow.

Verify:

- Docker image builds
- Coolify integration
- Environment variables
- Health checks

Deployment automation should be operational.

---

# Repository Automation

Configure:

- Issue templates
- Pull request template
- CODEOWNERS
- Branch protection
- Labels
- Milestones
- GitHub Project

Automation should minimize manual repository management.

---

# Backlog CLI

Backlog CLI should support:

- validation
- synchronization
- documentation generation
- issue recommendation
- branch generation
- PR generation
- release notes

CLI becomes the primary engineering assistant.

---

# Documentation

Complete documentation:

- README
- Engineering Playbook
- AI Operational Manual
- Branching Strategy
- Code Review Guide
- ADRs
- Contribution Guide

Documentation should be version-controlled.

---

# Testing Infrastructure

Configure:

- Vitest
- test utilities
- coverage
- shared mocks
- fixtures

Testing should be operational before feature development begins.

---

# Browser Extension Foundation

Initialize:

```text
apps/browser-extension
```

Include:

- WXT
- React
- TypeScript
- Tailwind CSS
- Manifest
- Background
- Content
- Popup
- Options

No parser implementation yet.

---

# Backend Foundation

Initialize:

```text
apps/api
```

Include:

- NestJS
- modules, controllers, and services
- middleware / guards
- health endpoint
- configuration
- logging

Business features begin in Phase 03.

---

# Web Application Foundation

Initialize:

```text
apps/web
```

Include:

- React
- Vite
- Tailwind CSS
- TanStack Router
- TanStack Query
- authentication scaffolding
- layout

No feature implementation yet.

---

# Project Structure

Expected repository structure:

```text
apps/
    api/
    web/
    browser-extension/

packages/
    config/
    contracts/
    database/
    logger/
    types/
    ui/
    utils/
    validation/

tooling/
    backlog/

docs/
```

---

# Dependencies

No implementation phase depends on Phase 01.

All remaining phases depend on it.

---

# Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Poor project structure | High | Finalize architecture before implementation |
| Inconsistent tooling | High | Shared configuration packages |
| Weak CI | High | Mandatory quality gates |
| Technical debt | High | Enforce engineering playbook |
| Environment inconsistency | Medium | Docker development environment |

---

# Out of Scope

This phase does **not** include:

- Authentication
- User management
- Resume management
- Applications
- Browser parsers
- Analytics
- Dashboards
- Business logic
- API endpoints beyond health checks

---

# Definition of Done

The Foundation phase is complete when:

- Repository structure is finalized.
- All shared packages compile successfully.
- Docker development environment works.
- CI pipeline passes.
- CD pipeline deploys successfully.
- Backlog CLI is operational.
- Documentation is complete.
- Browser extension scaffolding builds.
- Backend scaffolding builds.
- Web application scaffolding builds.
- All tests pass.
- Type checking passes.
- Linting passes.
- Branch protection is enabled.
- GitHub automation is configured.
- The `main` branch remains continuously deployable.

---

# Exit Criteria

Before Phase 02 begins:

- Every engineer can clone the repository and start development with minimal setup.
- CI validates every pull request automatically.
- Deployments are repeatable.
- Shared packages are available for reuse.
- Engineering standards are fully enforced.
- AI assistants can safely contribute within the established architecture.

Completion of this phase establishes the engineering foundation upon which the remainder of CareerOS will be built.
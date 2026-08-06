# AGENTS.md

# CareerOS AI Engineering Contract

This document defines the operating contract for all AI coding assistants (Antigravity, Codex, Claude Code, Cursor, GitHub Copilot) and human contributors.

The objective is to ship product features quickly while preserving the architecture, engineering standards, and development workflow of CareerOS.

---

# Mission

You are an engineering contributor on CareerOS.

Your responsibility is to execute the canonical backlog—not invent new work.

Optimize for:

- Shipping working product
- Small incremental changes
- Maintainability
- Predictability
- Documentation fidelity

---

# Source of Truth

When information conflicts, use this precedence:

1. `docs/backlog/**`
   - Canonical product backlog
   - Acceptance criteria
   - Dependencies
   - Milestones
   - Issue status

2. `docs/adr/**`
   - Architecture Decision Records

3. `docs/design/**`
   - Feature architecture
   - UX flows
   - API contracts
   - Technical specifications

4. Existing implementation

5. User prompt

Never silently resolve conflicting documentation.

Stop and explain the conflict.

---

# Engineering Workflow

## Selecting Work

Never choose work manually.

Unless an issue ID is explicitly provided, begin with:

```bash
pnpm backlog:work
```

To understand a task:

```bash
pnpm backlog:explain <ISSUE_ID>
```

---

## Starting Work

Always begin work with:

```bash
pnpm backlog:start <ISSUE_ID>
```

Never create feature branches manually.

---

## Before Writing Code

Read and understand:

- backlog issue
- acceptance criteria
- dependencies
- linked ADRs
- relevant design documents
- surrounding implementation

If requirements are ambiguous,

STOP.

Explain the ambiguity instead of making assumptions.

---

## During Implementation

Implement only the requested feature.

Avoid unrelated refactoring.

Avoid speculative improvements.

Do not implement future backlog items.

Reuse existing code whenever appropriate.

Working code is not a refactoring candidate solely because a "better" architecture exists.

---

## Completing Work

Before considering work complete run:

```bash
pnpm gate
```

All checks must pass.

Then:

```bash
pnpm backlog:finish <ISSUE_ID>
```

Generate the PR:

```bash
pnpm backlog:pr <ISSUE_ID>
```

Never manually modify backlog status.

---

# Architecture Principles

CareerOS uses a capability-first architecture.

Backend:

```
apps/api/src/modules/
```

Frontend:

```
apps/web/src/features/
```

Chrome Extension:

```
apps/extension/
```

Shared packages:

```
packages/
```

---

# Architecture Evolution

Always choose the simplest architecture that satisfies current requirements.

Progression:

Level 1

Controller → Service → Repository

↓

Level 2

Feature Module

↓

Level 3

Presentation
Application
Domain
Infrastructure

↓

Level 4

Domain Events
Sagas
Workflows

↓

Level 5

Shared Monorepo Packages

Do not skip levels.

Only introduce additional abstraction when documented evolution triggers are met.

---

# Frontend Rules

- Functional components only
- Feature-first organization
- Keep pages thin
- Business logic belongs in hooks/services
- Validate forms with Zod
- Server state via TanStack Query
- Local UI state with React state

Never:

- Fetch directly inside components
- Duplicate API logic
- Store derived state
- Promote components to shared libraries until reuse is proven

---

# Backend Rules

Modules may contain:

- controller
- service
- dto
- repository
- tests

Simple CRUD should remain simple.

Introduce layered architecture only when domain complexity requires it.

Controllers

- HTTP only

Services

- Business logic

Repositories / Prisma

- Persistence only

---

# API Standards

- RESTful resources
- Validation before persistence
- Consistent error responses
- UUID identifiers
- Pagination for collections

Never invent undocumented endpoints.

---

# Coding Principles

Always:

- Build the smallest solution
- Prefer clarity over cleverness
- Strong typing everywhere
- Reuse existing utilities
- Preserve architecture
- Keep changes focused
- Follow naming conventions

Never:

- Introduce unnecessary abstractions
- Duplicate logic
- Change unrelated code
- Ignore lint or type errors
- Introduce libraries without justification

---

# Testing

Minimum expectations:

- Unit tests for business logic
- Integration tests where appropriate

Behavioral regression tests are preferred over implementation-specific tests.

When fixing bugs, add a regression test whenever practical.

---

# Git Workflow

Feature branches are managed by the Backlog CLI.

Commit prefixes:

- feat:
- fix:
- docs:
- test:
- refactor:
- chore:

Keep commits small and focused.

---

# Performance

- Lazy load routes
- Memoize only when measured
- Avoid premature optimization

---

# Security

Never trust client input.

Always:

- Validate DTOs
- Validate forms with Zod
- Use Prisma parameterization
- Keep secrets in environment variables

---

# Documentation

Update documentation whenever behavior changes.

Feature implementations should remain aligned with:

- backlog
- ADRs
- design documents

Do not silently diverge from documentation.

---

# Tool Usage

Always prefer Backlog CLI over manual operations.

Use:

```bash
pnpm backlog:work
```

to select work.

Use:

```bash
pnpm backlog:status
```

to inspect progress.

Use:

```bash
pnpm backlog:explain
```

instead of manually searching backlog YAML.

Use:

```bash
pnpm gate
```

before completion.

---

# Stop and Ask for Clarification If

- Acceptance criteria conflict
- ADRs conflict
- Design documents conflict
- Requirements are ambiguous
- Required dependency is missing
- User request contradicts backlog
- Architecture documentation is insufficient

Do not guess.

---

# Things You Must Never Do

Never:

- Modify unrelated files
- Rewrite working code because another architecture is "cleaner"
- Implement future backlog items
- Change backlog schema
- Modify CLI behavior unless required by the task
- Modify ADRs unless explicitly instructed
- Bypass `pnpm gate`
- Ignore failing tests
- Skip acceptance criteria
- Invent product requirements

---

# Definition of Done

A task is complete only if:

- Acceptance criteria satisfied
- Types pass
- Lint passes
- Tests pass
- Build passes
- `pnpm gate` passes
- Documentation updated where necessary
- Backlog task completed through Backlog CLI
- PR generated

---

# Required Completion Report

When finishing a task, provide:

## Summary

What was implemented.

## Acceptance Criteria

Map each acceptance criterion to its implementation.

## Files Changed

List major files modified.

## Tests

Describe tests added or updated.

## Verification

List commands executed and their results.

Example:

```text
✓ pnpm check-types
✓ pnpm lint
✓ pnpm test
✓ pnpm build
✓ pnpm gate
```

## Risks

Any remaining limitations or follow-up work.

---

# Guiding Principle

The goal is not to write the most sophisticated code.

The goal is to ship backlog items that satisfy documented requirements while preserving the architecture and engineering contracts of CareerOS.
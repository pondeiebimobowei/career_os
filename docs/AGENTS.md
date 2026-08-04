# agents.md

# CareerOS AI Engineering Guide

## Purpose

This document defines the engineering rules for AI coding assistants (Codex, Cursor, Claude Code, GitHub Copilot) and human contributors.

The objective is consistent, maintainable, production-quality code while optimizing for rapid MVP delivery.

---

# Core Principles

1. Build the smallest solution that solves the problem.
2. Prefer clarity over cleverness.
3. Strong typing everywhere.
4. Keep business logic out of UI components.
5. One source of truth per concern.
6. Every feature must support the MVP strategy.
7. Refactor only after duplication is proven.

---

# Tech Stack

Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- TanStack Query
- React Hook Form
- Zod

Backend
- NestJS
- Prisma
- PostgreSQL

Extension
- Chrome Manifest V3
- React
- TypeScript

---

# Folder Structure

apps/
  web/
  extension/
  api/

packages/
  ui/
  types/
  utils/
  config/

docs/

---

# Architecture Rules

- Modular monolith
- Feature-based modules
- REST API
- Shared types package
- No circular dependencies
- Dependency injection on backend

---

# Frontend Rules

- Functional components only
- Hooks over classes
- Keep pages thin
- Move reusable logic into hooks
- Validate forms with Zod
- Server state via TanStack Query
- Local UI state only with React state

Never:
- Fetch directly inside components without hooks
- Duplicate API logic
- Store derived state

---

# Backend Rules

Each module contains:
- controller
- service
- dto
- entity/model
- repository (if needed)
- tests

Controllers:
- HTTP only

Services:
- Business logic only

Prisma:
- Data access only

---

# API Conventions

- RESTful resources
- Consistent error responses
- Validation before persistence
- UUID identifiers
- Pagination for lists

---

# Naming

Files:
kebab-case

Components:
PascalCase

Variables:
camelCase

Enums:
PascalCase

Constants:
UPPER_SNAKE_CASE

---

# UI Rules

- One primary CTA per screen
- Reuse components
- No hardcoded colors
- Use design tokens
- Empty states required
- Loading and error states required

---

# Testing

Minimum:
- Unit tests for business logic
- Integration tests for APIs
- Manual QA checklist before merge

Avoid excessive testing early.

---

# Git Workflow

main
develop
feature/*

Commit format:
feat:
fix:
refactor:
docs:
test:
chore:

Small focused PRs only.

---

# Performance

- Lazy load routes
- Memoize only when measured
- Avoid premature optimization

---

# Security

- Never trust client input
- Validate with DTO + Zod
- Parameterized queries (Prisma)
- Secrets via environment variables
- HTTPS only

---

# Documentation

Every feature requires:
- Updated PRD if behavior changes
- Inline comments only when necessary
- README updates for setup changes

---

# AI Assistant Rules

Always:
- Read surrounding code before editing
- Preserve architecture
- Reuse existing utilities
- Prefer incremental changes
- Explain trade-offs in PRs

Never:
- Introduce new libraries without justification
- Duplicate logic
- Change unrelated code
- Break naming conventions
- Silence lint/type errors

---

# Definition of Done

A task is complete only if:
- Requirements implemented
- Types pass
- Lint passes
- Build passes
- Tests pass (where applicable)
- UI handles loading/error/empty states
- Documentation updated

---

# MVP Guardrails

Reject features that:
- Add Gmail integration
- Add Calendar sync
- Add AI coaching
- Add job discovery
- Add mobile app
unless explicitly approved after MVP validation.

Always optimize for:
1. Faster capture
2. Better workflow
3. Lower cognitive load
4. Faster learning from users

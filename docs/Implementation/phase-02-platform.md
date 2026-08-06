# Phase 02 — Shared Platform

**Phase:** 02  
**Name:** Shared Platform  
**Status:** Planned  
**Priority:** Critical  
**Estimated Duration:** 3–4 Weeks  
**Related Milestone:** M2 — Shared Platform  
**Related ADRs:** ADR-001, ADR-002, ADR-003, ADR-006, ADR-007, ADR-009, ADR-010, ADR-011, ADR-027, ADR-030, ADR-031, ADR-032, ADR-033

---

# Purpose

The Shared Platform phase establishes the reusable foundation that every CareerOS application depends upon.

Unlike Phase 01, which focuses on engineering infrastructure, this phase builds reusable application infrastructure.

Nothing in this phase is user-facing.

The outcome is a collection of shared packages, abstractions, and platform services that eliminate duplication across:

- Backend API
- Web Application
- Browser Extension
- CLI
- Future applications

---

# Goals

The platform should provide:

- reusable domain models
- reusable validation
- reusable API contracts
- reusable UI components
- reusable authentication interfaces
- reusable infrastructure
- shared utilities
- standardized developer experience

Every application should consume shared packages rather than implementing its own versions.

---

# Success Criteria

Phase 02 is complete when:

- Shared packages are production-ready.
- Prisma package is operational.
- Database access layer is complete.
- API contracts are shared.
- Validation library is complete.
- Shared UI library is available.
- Authentication abstractions exist.
- Logging and configuration packages are stable.
- Every package is tested.
- Documentation is complete.

---

# Deliverables

## Shared Package Ecosystem

The following packages should be fully implemented.

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
auth
analytics-sdk
```

Each package should compile independently.

---

# Package Standards

Every package must include:

```text
src/

README.md

package.json

tsconfig.json

vitest.config.ts

index.ts

CHANGELOG.md
```

Each package exposes only its public API through `index.ts`.

---

# Domain Models

Implement reusable domain models.

Examples:

```text
User

Organization

Job

Application

Resume

ResumeVersion

Activity

Analytics

ParserResult

ImportSession
```

These models represent the CareerOS domain and should remain framework-independent.

---

# Shared Types

Implement common types.

Examples:

```text
UUID

Timestamp

Nullable

Optional

Pagination

Result<T>

ApiError

Cursor

ISODate
```

Avoid duplicate type definitions across applications.

---

# API Contracts

Create shared request and response contracts.

Examples:

```text
LoginRequest

CreateApplicationRequest

UpdateApplicationRequest

ResumeDto

ActivityDto

AnalyticsDto
```

Contracts are consumed by:

- Backend
- Web
- Browser Extension

API contracts should never be duplicated.

---

# Validation Package

Implement reusable Zod schemas.

Examples:

```text
Email

Password

UUID

URL

Phone

Pagination

Search

Filters

Dates
```

Validation should be reusable throughout the platform.

---

# Authentication Package

Provide shared authentication abstractions.

Responsibilities include:

- current user
- session model
- permissions
- roles
- token interfaces
- authentication context

Authentication implementation remains application-specific.

---

# Database Package

Complete database package.

Include:

- Prisma schema
- generated client
- repositories
- migrations
- seed scripts
- transaction helpers
- connection utilities

Repositories should encapsulate Prisma.

---

# Repository Pattern

Implement repositories for:

```text
UserRepository

ApplicationRepository

ResumeRepository

ActivityRepository

JobRepository

AnalyticsRepository
```

Repositories should expose domain-focused methods rather than raw database operations.

---

# Database Seeding

Provide seed support.

Seed data should include:

- demo user
- demo resumes
- sample applications
- development fixtures

Seeds should support local development.

---

# Logging Package

Implement structured logging.

Support:

- debug
- info
- warn
- error
- child loggers
- request logging

Logging implementation should be replaceable.

---

# Configuration Package

Centralize configuration.

Responsibilities:

- environment loading
- validation
- defaults
- feature flags
- runtime configuration

Configuration should fail fast when invalid.

---

# Utility Package

Implement reusable helpers.

Examples:

```text
String utilities

Date utilities

Collection utilities

URL utilities

Array helpers

Retry helpers

Async helpers

Object helpers
```

Utilities should remain dependency-light.

---

# Error Package

Standardize application errors.

Hierarchy example:

```text
ApplicationError

↓

DomainError

InfrastructureError

ValidationError

AuthenticationError

AuthorizationError

ConflictError

NotFoundError
```

Errors should include machine-readable metadata.

---

# Shared UI Package

Develop reusable design system.

Include:

## Design Tokens

- spacing
- colors
- typography
- shadows
- radius
- animation

---

## Primitive Components

Examples:

```text
Button

Input

Label

TextArea

Checkbox

Radio

Switch

Select

Badge

Spinner
```

---

## Layout Components

Examples:

```text
Card

Modal

Drawer

Tabs

Stack

Grid

Container

Separator
```

---

## Feedback Components

Examples:

```text
Alert

Toast

Dialog

Progress

Skeleton

Tooltip

Empty State
```

---

## Navigation Components

Examples:

```text
Sidebar

Navbar

Breadcrumb

Pagination

Menu

Dropdown
```

---

All UI components should support:

- accessibility
- dark mode
- responsive layouts
- keyboard navigation

---

# Analytics SDK

Create shared analytics package.

Responsibilities:

- event definitions
- tracking interfaces
- metric types
- analytics client

Applications should emit standardized events.

---

# HTTP Client

Provide reusable HTTP abstraction.

Features:

- request wrapper
- retries
- interceptors
- authentication
- typed responses
- error mapping

Applications should avoid direct HTTP implementation duplication.

---

# Feature Flags

Implement shared feature flag interfaces.

Support:

- boolean flags
- rollout flags
- environment flags

Feature flag provider should be replaceable.

---

# Storage Abstractions

Provide common storage interfaces.

Examples:

```text
Local Storage

Session Storage

Browser Storage

Memory Storage
```

Consumers depend on abstractions rather than platform-specific APIs.

---

# Event System

Provide shared event model.

Examples:

```text
ApplicationCreated

ResumeUploaded

JobImported

SyncCompleted

ParserFailed
```

Events should remain strongly typed.

---

# Pagination

Standardize pagination.

Support:

- cursor pagination
- offset pagination
- sorting
- filtering

Every application should use the same pagination model.

---

# Testing Utilities

Provide shared testing helpers.

Examples:

- mock factories
- builders
- fixtures
- repository mocks
- API mocks
- test utilities

Testing infrastructure should reduce duplication.

---

# Documentation

Each package should include:

- purpose
- public API
- examples
- dependency diagram
- testing instructions

Public packages require complete documentation.

---

# Package Dependency Rules

Allowed dependency direction:

```text
Applications

↓

Shared Packages

↓

Infrastructure

↓

Third-party Libraries
```

Shared packages must never depend on applications.

Circular dependencies are prohibited.

---

# Quality Standards

Every package must satisfy:

- TypeScript strict mode
- ESLint
- Prettier
- Vitest
- 100% public API documentation
- Zod validation where applicable

---

# Testing

Every package requires:

## Unit Tests

- utilities
- validation
- repositories
- domain models

---

## Integration Tests

- Prisma
- repositories
- transactions
- configuration

---

## Contract Tests

Verify:

- API compatibility
- serialization
- DTO correctness

---

# Dependencies

Phase 02 depends on:

- Phase 01 — Foundation

Phase 03 and all later phases depend on Phase 02.

---

# Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Package coupling | High | Strict dependency rules |
| Duplicate logic | High | Shared package ownership |
| Poor abstractions | High | Domain-driven design reviews |
| Circular dependencies | High | Dependency validation |
| Inconsistent APIs | Medium | Shared contracts package |

---

# Out of Scope

This phase does **not** include:

- authentication implementation
- business services
- REST endpoints
- browser parsers
- web pages
- dashboards
- analytics calculations
- synchronization workflows
- browser extension UI

Those belong to later phases.

---

# Definition of Done

Phase 02 is complete when:

- All shared packages compile independently.
- Shared domain models are finalized.
- API contracts are reusable.
- Validation package is complete.
- Prisma package is operational.
- Repository layer is implemented.
- Logging package is production-ready.
- Configuration package validates environments.
- Shared UI library is functional.
- Analytics SDK is initialized.
- Testing utilities are available.
- Documentation is complete.
- Unit and integration tests pass.
- CI validates every package successfully.

---

# Exit Criteria

Before Phase 03 begins:

- Applications no longer need to create their own infrastructure.
- Shared packages provide reusable building blocks.
- Database access is standardized.
- API contracts are shared across applications.
- Validation is centralized.
- The design system is available.
- Repository abstractions are stable.
- Developers can begin implementing business features without revisiting foundational platform decisions.

Completion of this phase establishes the reusable application platform that every CareerOS product and service will build upon.
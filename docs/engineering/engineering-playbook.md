# CareerOS Engineering Playbook

**Version:** 1.0
**Status:** Active
**Last Updated:** August 2026

---

# Purpose

This playbook defines **how software is built at CareerOS**.

It establishes the engineering standards, workflows, and decision-making processes that every contributor—human or AI—must follow.

Its goals are to:

* Maintain a consistent architecture
* Improve engineering velocity
* Reduce technical debt
* Enable AI-assisted development safely
* Scale engineering without sacrificing quality

This document should be treated as an operational guide, not a suggestion.

---

# Engineering Philosophy

CareerOS is built around a small engineering team augmented by AI.

Engineering decisions prioritize:

1. Simplicity over cleverness
2. Maintainability over speed
3. Correctness over convenience
4. Product outcomes over technical novelty
5. Fast iteration over premature optimization

Every line of code should make the system easier—not harder—to evolve.

---

# Core Principles

## SOLID

All application code should follow SOLID principles where appropriate.

* Single Responsibility
* Open/Closed
* Liskov Substitution
* Interface Segregation
* Dependency Inversion

---

## DRY

Do not duplicate logic.

Duplicate code eventually becomes inconsistent code.

If the same logic appears more than twice, evaluate extracting it.

---

## KISS

Keep implementations straightforward.

Prefer understandable solutions over clever abstractions.

---

## YAGNI

Do not build for hypothetical future requirements.

Only introduce complexity when a real product need exists.

---

## Separation of Concerns

Each layer has one responsibility.

```
UI

↓

Application Logic

↓

Domain Logic

↓

Persistence

↓

Infrastructure
```

---

## Composition Over Inheritance

Favor reusable composition patterns.

Avoid deep inheritance trees.

---

# Engineering Decision Hierarchy

When multiple sources conflict, follow this order:

```
CBS Schema

↓

Architecture Decision Records (ADR)

↓

Product Documentation

↓

Backlog YAML

↓

GitHub Issue

↓

Existing Code

↓

AI Reasoning
```

No implementation should contradict an approved ADR.

---

# Definition of Ready

A work item is ready when:

* Requirements are clear
* Acceptance criteria exist
* Dependencies are resolved
* Design is available if required
* API contract exists (if applicable)
* Scope is understood

If any of these are missing, implementation should not begin.

---

# Definition of Done

A task is complete only when:

* Acceptance criteria are satisfied
* Code is reviewed
* Tests pass
* Lint passes
* Documentation is updated
* Relevant ADRs are created or updated
* Analytics events are implemented (if required)
* Accessibility requirements are met
* Pull request is merged
* GitHub Issue is closed

---

# Development Lifecycle

Every feature follows the same workflow.

```
Backlog

↓

GitHub Issue

↓

Feature Branch

↓

Implementation

↓

Testing

↓

Pull Request

↓

Review

↓

Merge

↓

Deploy
```

Work should never bypass this lifecycle.

---

# Repository Structure

```
apps/
    web/
    api/
    extension/

packages/
    ui/
    api-client/
    backlog-cli/
    config/
    types/

docs/

prisma/
```

Each package should have a single responsibility.

---

# Branch Strategy

Every task is implemented on a short-lived branch.

## Naming

```
feature/APP-001-create-application

feature/AUTH-003-login

bugfix/JOB-014-validation

hotfix/API-005-auth

docs/ADR-007
```

Never use:

```
testing

temp

fix

new-feature

development
```

---

# Commit Convention

Use Conventional Commits.

Examples:

```
feat(applications): create application workflow

fix(auth): resolve session refresh bug

refactor(companies): simplify repository layer

docs(adr): document authentication strategy

test(tasks): add integration tests
```

---

# Pull Request Requirements

Every PR should include:

Summary

What changed

Why it changed

Screenshots (if UI)

Linked GitHub Issue

Testing performed

Checklist

Example:

```
Summary

Implements company notes.

Changes

- New notes API
- Company notes UI
- Integration tests

Issue

COMPANY-012

Checklist

✓ Tests

✓ Documentation

✓ Accessibility

✓ Analytics
```

---

# Code Review Standards

Reviewers should evaluate:

Correctness

Readability

Architecture

Performance

Security

Accessibility

Testing

Documentation

Reviewers should avoid stylistic nitpicks already enforced by tooling.

---

# TypeScript Standards

Strict mode is mandatory.

Never use:

```
any
```

Prefer:

```
unknown

generics

discriminated unions

readonly

const assertions
```

Enable exhaustive switch statements.

Use Zod for runtime validation.

---

# React Standards

Prefer:

Vite SPA Client Components (React 19 Single Page Application)

Feature-oriented component architecture (`apps/web/src/features/*`)

Small, focused components

Reusable hooks (`useOnboarding`, `useApplications`, etc.)

Component composition

Zod validation

Avoid:

Large components

Prop drilling

Business logic in UI

Anonymous inline functions when avoidable

---

# State Management

Hierarchy:

```
Server

↓

TanStack Query

↓

React State

↓

Context

↓

URL

↓

Persistent Storage
```

Do not introduce global state unless necessary.

---

# API Standards

Architecture:

```
Controller

↓

Service

↓

Repository

↓

Database
```

Controllers should never directly access Prisma.

Services contain business logic.

Repositories encapsulate persistence.

---

# Database Standards

Use:

PostgreSQL

Prisma ORM

UUID identifiers

Soft deletes only where justified

Migration-first workflow

Indexes for frequently queried fields

---

# Error Handling

Never expose internal errors.

Every API should return structured errors.

Example:

```
{
  "code": "APPLICATION_NOT_FOUND",
  "message": "Application not found"
}
```

Errors should be logged with sufficient context.

---

# Validation

Validate:

Request body

Query parameters

Route parameters

Uploaded files

Never trust client input.

---

# Security

Always:

Validate authentication

Check authorization

Escape user content

Rate limit sensitive endpoints

Store secrets securely

Use HTTPS

Never:

Commit secrets

Trust client permissions

Leak internal stack traces

---

# Testing Strategy

Every feature should include appropriate tests.

Levels:

Unit

Integration

End-to-End (when justified)

Critical user workflows must have integration coverage.

---

# Accessibility

All UI must support:

Keyboard navigation

Focus management

ARIA where appropriate

Screen readers

Color contrast

Semantic HTML

Accessibility is part of the Definition of Done.

---

# Performance

Avoid unnecessary optimization.

Optimize only after measurement.

Measure:

Bundle size

Database queries

API latency

React render performance

Extension performance

---

# Documentation Standards

Documentation is part of engineering.

Update documentation when:

Architecture changes

API changes

Backlog changes

Developer workflow changes

---

# ADR Policy

Create an ADR when:

Changing architecture

Adding infrastructure

Changing authentication

Introducing major dependencies

Changing deployment

Modifying database strategy

ADRs are immutable historical records.

Never rewrite history.

Supersede instead.

---

# Analytics

Every user-facing feature should define:

Events

Properties

Success metrics

Do not collect unnecessary personal data.

---

# Observability

All production services should include:

Structured logging

Health checks

Error tracking

Performance monitoring

Request tracing (future)

---

# CI/CD

Every pull request should execute:

Type checking

Linting

Unit tests

Integration tests (where applicable)

Build verification

PRs with failing checks should not be merged.

---

# Technical Debt

Technical debt should be:

Visible

Documented

Intentional

Prioritized

Never accumulate silent debt.

---

# Refactoring Guidelines

Refactor when:

Duplication appears

Complexity increases

Naming becomes unclear

Architecture degrades

Avoid large unrelated refactors.

---

# Dependency Policy

Before adding a dependency ask:

Can we build this ourselves reasonably?

Is it actively maintained?

Is it secure?

Is it widely adopted?

Does it reduce complexity?

Avoid unnecessary dependencies.

---

# Engineering Metrics

Track:

Deployment frequency

Lead time

Cycle time

Bug rate

PR review time

Test coverage

Build success rate

These metrics improve engineering—not evaluate individuals.

---

# Communication

Use GitHub Issues for work tracking.

Use ADRs for architectural decisions.

Use PRs for implementation discussion.

Avoid undocumented decisions.

---

# AI-Assisted Development

AI is an engineering assistant.

AI may:

Implement approved tasks

Write tests

Refactor

Generate documentation

Explain code

AI may not:

Invent requirements

Ignore ADRs

Merge code

Change architecture independently

Bypass review

---

# Engineering Checklists

## Before Starting

* Issue assigned
* Acceptance criteria understood
* Dependencies resolved
* Branch created

---

## Before Opening a PR

* Tests pass
* Lint passes
* Documentation updated
* No debug code
* Accessibility verified

---

## Before Merge

* Approved review
* CI passes
* Issue linked
* Milestone correct
* Branch up to date

---

# Engineering Culture

We value:

Clarity over cleverness.

Consistency over personal preference.

Iteration over perfection.

Documentation over tribal knowledge.

Systems over heroics.

Every decision should make the next feature easier to build.

---

# References

* CBS v1.0 (CareerOS Backlog Schema)
* Architecture Decision Records (ADR)
* Product Requirements Document (PRD)
* Technical Requirements Document (TRD)
* API Specification
* Security & Privacy Guide
* Testing Strategy
* Deployment & DevOps Guide
* AI Engineering Operating Manual
* Git Workflow Guide

---

**End of Document**

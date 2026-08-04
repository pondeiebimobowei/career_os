# CareerOS AI Engineering Operational Manual

Version: 1.0  
Status: Approved  
Owner: Engineering

---

# Purpose

This document defines how AI assistants participate in software engineering at CareerOS.

AI is treated as an engineering accelerator—not an autonomous engineer.

Every AI-generated change must be:

- Planned
- Traceable
- Reviewable
- Testable
- Maintainable

The AI assists with implementation.

Humans remain responsible for architecture, product decisions, code review, and production readiness.

---

# Engineering Philosophy

AI should optimize for:

- Development speed
- Engineering quality
- Consistency
- Maintainability
- Documentation
- Knowledge sharing

AI should **never** optimize for:

- Maximum code generation
- Cleverness
- Premature abstraction
- Unnecessary dependencies
- Feature expansion beyond scope

---

# AI Responsibilities

AI is expected to assist with:

## Product

- Refining implementation details
- Translating backlog items into implementation tasks
- Explaining technical trade-offs
- Suggesting architecture improvements
- Identifying edge cases

---

## Engineering

- Writing production-ready code
- Refactoring
- Debugging
- Creating tests
- Updating documentation
- Reviewing Pull Requests
- Explaining implementation decisions

---

## Quality

- Finding bugs
- Identifying architectural violations
- Detecting duplicated logic
- Suggesting simplifications
- Improving performance
- Improving accessibility

---

## Documentation

Maintain:

- Architecture docs
- API docs
- ADRs
- README files
- Backlog updates
- Technical comments where appropriate

---

# AI Is Not Allowed To

AI must never:

- Invent product requirements
- Implement features not defined in the backlog
- Ignore acceptance criteria
- Bypass architecture
- Modify unrelated files
- Introduce unnecessary dependencies
- Rewrite large parts of the application without approval
- Merge Pull Requests
- Deploy directly to production
- Close GitHub Issues automatically
- Change infrastructure without explicit instruction

---

# Engineering Workflow

Every implementation follows:

```
Backlog YAML
        ↓
GitHub Issue
        ↓
Branch
        ↓
AI Implementation
        ↓
Tests
        ↓
Pull Request
        ↓
Code Review
        ↓
Merge
```

AI never skips workflow steps.

---

# Source of Truth

Priority order:

```
1. Product Requirements (PRD)

↓

2. ADRs

↓

3. Technical Requirements

↓

4. Engineering Playbook

↓

5. Backlog YAML

↓

6. GitHub Issue

↓

7. Existing Code
```

If conflicts exist:

Stop.

Explain the conflict.

Request clarification.

Never guess.

---

# Working on an Issue

Before writing code AI must understand:

- Issue objective
- Acceptance criteria
- Dependencies
- Related architecture
- Existing implementation
- Relevant ADRs

Only then should implementation begin.

---

# Scope Discipline

AI must stay inside the assigned issue.

Example:

Issue:

```
APP-004

Create Application API
```

Allowed:

- Endpoint
- Validation
- Repository
- Tests

Not allowed:

- Dashboard redesign
- Analytics
- Resume library
- Authentication improvements

---

# Architecture Rules

AI must preserve the documented architecture.

Never:

- Skip service layers
- Put business logic in UI components
- Access the database directly from controllers
- Duplicate domain logic
- Introduce circular dependencies

---

# Coding Standards

AI should produce code that is:

- Modular
- Typed
- Readable
- Predictable
- Consistent

Follow:

- SOLID
- DRY
- KISS
- Composition over inheritance
- Explicit dependencies
- Functional core where appropriate

---

# Naming Rules

Use descriptive names.

Good:

```
ApplicationRepository

ApplicationService

createApplication()

ApplicationStatus
```

Avoid:

```
helper

manager

util

temp

processData
```

Names should communicate intent.

---

# Folder Structure

Never invent folders.

Follow the documented architecture.

If new folders are required:

Explain why.

Wait for approval if the change affects architecture.

---

# Component Rules

Components should:

- Have one responsibility
- Remain reusable
- Avoid business logic
- Receive typed props
- Prefer composition

Avoid:

- Massive components
- Deep prop drilling
- Mixed UI and business logic

---

# Backend Rules

Business logic belongs in:

```
Services
```

Persistence belongs in:

```
Repositories
```

Routing belongs in:

```
Controllers
```

Validation belongs at application boundaries.

---

# Database Rules

Never:

- Duplicate relationships
- Store derived data unnecessarily
- Ignore constraints
- Skip indexes where needed

Always:

- Respect foreign keys
- Use migrations
- Keep schemas normalized unless justified

---

# API Rules

Use consistent REST conventions.

Endpoints should:

- Return predictable payloads
- Use standard HTTP status codes
- Validate input
- Return structured errors

Avoid custom response formats.

---

# Error Handling

Never ignore failures.

Every operation should:

- Detect errors
- Log appropriately
- Return useful feedback
- Avoid exposing sensitive information

No empty catch blocks.

---

# Security Rules

Always:

- Validate input
- Authorize access
- Authenticate users
- Sanitize user content
- Protect secrets
- Use parameterized queries
- Limit uploaded files
- Follow least privilege

Never trust client input.

---

# Performance Rules

Optimize only where justified.

Avoid:

- N+1 queries
- Unnecessary re-renders
- Expensive synchronous work
- Premature caching

Prefer readable code over speculative optimization.

---

# Accessibility Rules

Every UI should support:

- Keyboard navigation
- Screen readers
- Proper labels
- Focus management
- Semantic HTML
- Adequate contrast

Accessibility is required—not optional.

---

# Testing Expectations

Every implementation should include appropriate tests.

Priority:

1. Unit tests
2. Integration tests
3. Component tests
4. End-to-end tests where applicable

AI should never submit untested critical logic.

---

# Documentation Expectations

If behavior changes:

Update documentation.

Examples:

- API documentation
- Architecture diagrams
- ADR references
- README files
- Setup guides

Documentation and code should evolve together.

---

# Git Workflow

AI follows:

```
Issue

↓

Branch

↓

Implementation

↓

Commits

↓

Push

↓

Pull Request
```

Never:

- Commit directly to `main`
- Force push shared branches
- Create long-lived branches

---

# Commit Standards

Use Conventional Commits.

Examples:

```
feat(applications): create application API

fix(auth): handle expired sessions

refactor(jobs): simplify repository

docs(api): update endpoint documentation
```

---

# Pull Request Standards

AI-generated Pull Requests should include:

- Summary
- Linked Issue
- Acceptance criteria
- Testing notes
- Known limitations
- Documentation updates

---

# Refactoring Rules

Only refactor when:

- Solving the assigned issue
- Reducing meaningful complexity
- Improving maintainability
- Preserving behavior

Avoid "drive-by refactoring."

---

# Dependency Management

Before adding a dependency ask:

- Can the platform already solve this?
- Can existing libraries solve this?
- Is the dependency actively maintained?
- Is it justified?

Avoid dependency bloat.

---

# AI Decision Framework

Before implementing ask:

1. Is this required by the Issue?
2. Does it follow architecture?
3. Is it the simplest solution?
4. Is it maintainable?
5. Is it testable?
6. Does it create unnecessary future work?

If any answer is "no":

Reconsider.

---

# When AI Should Stop

AI should stop and ask for guidance if:

- Requirements conflict
- Architecture is unclear
- Product behavior is ambiguous
- A breaking change is required
- Security implications are uncertain
- Multiple valid implementation paths exist with significant trade-offs

Do not guess.

---

# AI Review Checklist

Before considering work complete:

- Acceptance criteria satisfied
- Architecture preserved
- SOLID respected
- DRY respected
- KISS respected
- Types correct
- Tests added
- Documentation updated
- No duplicated logic
- No unnecessary abstractions
- No unrelated changes

---

# Success Criteria

AI assistance is considered successful when it:

- Reduces implementation time
- Produces maintainable code
- Preserves architectural integrity
- Reduces repetitive work
- Improves documentation
- Makes code review easier
- Introduces minimal technical debt

---

# Anti-Patterns

Avoid:

❌ Implementing multiple issues in one change

❌ Over-engineering simple features

❌ Adding "future-proof" abstractions without evidence

❌ Large rewrites outside issue scope

❌ Ignoring existing patterns

❌ Creating utility files for one-off logic

❌ Adding AI-generated code without understanding it

❌ Treating AI output as production-ready without review

---

# Golden Rules

1. The backlog defines **what** to build.
2. ADRs define **why** architectural decisions exist.
3. The architecture defines **how** the system is organized.
4. GitHub Issues define the current unit of work.
5. AI assists implementation—it does not redefine the product.
6. Every change must be traceable from backlog to production.
7. Simplicity is preferred over cleverness.
8. Maintainability is preferred over speed.
9. Human review is mandatory before merging.
10. The best AI-generated code is code that future engineers can understand without knowing it was written by AI.
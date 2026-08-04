# CareerOS Git Workflow

Version: 1.0  
Status: Approved  
Owner: Engineering

---

# Purpose

This document defines the official Git workflow for CareerOS.

Its goals are to:

- Keep the repository stable.
- Make every change traceable.
- Ensure every Pull Request corresponds to planned work.
- Prevent long-lived feature branches.
- Support AI-assisted development without sacrificing code quality.
- Maintain a clean commit history.

This workflow applies to every contributor, including AI coding assistants.

---

# Core Principles

## 1. Main Must Always Be Deployable

The `main` branch should always represent production-ready code.

No unfinished work should ever be merged into `main`.

---

## 2. Every Change Starts from the Backlog

No engineer starts coding directly.

Every implementation must originate from:

```
Backlog YAML
        ↓
GitHub Issue
        ↓
Short-lived Branch
        ↓
Pull Request
        ↓
Code Review
        ↓
Merge
```

No undocumented work.

No "quick fixes" without an Issue.

---

## 3. One Issue = One Branch

Every GitHub Issue gets its own branch.

Example:

Issue:

```
JOB-004
```

Branch:

```
feature/JOB-004-job-create-api
```

Never combine unrelated work.

---

## 4. Small Pull Requests

Large PRs are difficult to review.

Target:

- 200–500 changed lines

Avoid:

- 2,000+ line PRs

---

## 5. Merge Frequently

Branches should live for:

- ideally < 2 days
- maximum 1 week

Never let feature branches drift.

---

# Branch Strategy

```
main
│
├── feature/APP-001-create-api
├── feature/JOB-004-job-form
├── fix/AUTH-003-session-timeout
├── chore/FOUND-009-eslint
├── docs/API-002-update-spec
└── refactor/DASH-008-dashboard-cards
```

---

## Branch Types

### Feature

```
feature/<ISSUE-ID>-short-description
```

Example

```
feature/APP-004-create-application-ui
```

---

### Bug Fix

```
fix/<ISSUE-ID>-description
```

Example

```
fix/JOB-008-invalid-date
```

---

### Refactor

```
refactor/<ISSUE-ID>-description
```

---

### Documentation

```
docs/<ISSUE-ID>-description
```

---

### Chore

Infrastructure work.

Example

```
chore/FOUND-011-update-dependencies
```

---

### Experiment

Temporary research work.

```
experiment/parser-spike
```

Never merge directly.

---

# Branch Naming Rules

Allowed

```
feature/AUTH-001-login-page

feature/APP-002-create-api

fix/JOB-010-validation

docs/API-001-openapi
```

Not allowed

```
new-feature

fixes

working

test

john-branch
```

---

# GitHub Issue Lifecycle

```
Backlog YAML
        ↓
GitHub Issue
        ↓
Assigned
        ↓
Branch Created
        ↓
Implementation
        ↓
Pull Request
        ↓
Review
        ↓
Merged
        ↓
Closed
```

---

# Commit Strategy

Use Conventional Commits.

## Format

```
type(scope): message
```

Example

```
feat(applications): create application endpoint

fix(auth): resolve session expiration

docs(api): update OpenAPI spec

refactor(jobs): simplify validation

test(companies): add CRUD tests

chore(ci): cache pnpm
```

---

## Allowed Types

```
feat
fix
docs
style
refactor
test
build
ci
perf
chore
revert
```

---

## Good Examples

```
feat(jobs): add create job endpoint

fix(auth): prevent redirect loop

refactor(applications): extract repository

docs(readme): update setup guide
```

---

## Bad Examples

```
update

changes

fixed stuff

more work

oops
```

---

# Commit Frequency

Commit often.

Recommended:

```
Every completed logical step.
```

Not:

```
One giant commit after two days.
```

---

# Pull Request Workflow

```
Issue
    ↓
Branch
    ↓
Development
    ↓
Push
    ↓
Open Draft PR
    ↓
Complete work
    ↓
Ready for Review
    ↓
Review
    ↓
Merge
```

---

# Draft Pull Requests

Open a Draft PR early.

Benefits

- CI starts immediately.
- Progress is visible.
- Easier collaboration.
- Easier reviews.

---

# Pull Request Requirements

Every PR must include:

- linked Issue
- summary
- implementation notes
- screenshots (UI)
- testing performed
- checklist completed

---

## Example

```
Closes #42

Summary

Implements application creation API.

Changes

- POST endpoint
- validation
- Prisma service
- integration tests

Testing

✓ unit tests

✓ integration tests

✓ manual verification
```

---

# Merge Strategy

Use:

```
Squash and Merge
```

Benefits

- cleaner history
- one commit per Issue
- easier rollback

---

# Protected Branch

Protect:

```
main
```

Require:

- PR
- passing CI
- review approval
- no force push
- no direct commits

---

# Syncing Branches

Regularly update from main.

```
git checkout main

git pull

git checkout feature/APP-002-create-api

git rebase main
```

Avoid merge commits inside feature branches.

---

# Branch Deletion

Delete immediately after merge.

Never keep stale branches.

---

# GitHub Labels

Every Issue should have labels.

Examples

```
frontend

backend

extension

security

documentation

bug

feature

enhancement

P0

P1

P2
```

---

# GitHub Milestones

Milestones represent product phases.

Example

```
Foundation

Core Tracker

Productivity

Browser Extension

MVP Polish

Beta

Post-MVP
```

Issues belong to exactly one milestone.

---

# Relationship Between Backlog and Git

```
Backlog

↓

Epic

↓

Feature

↓

Issue

↓

Branch

↓

Commit

↓

Pull Request

↓

Merge

↓

Release
```

---

# AI Assistant Rules

AI assistants must never:

- invent architecture
- skip Issue references
- bypass CI
- bypass PR review
- modify unrelated files
- create large unrelated commits

Every AI-generated change must:

- correspond to a GitHub Issue
- remain within Issue scope
- preserve architecture
- pass tests
- satisfy acceptance criteria

---

# Code Review Checklist

Before approving:

- Requirements satisfied
- Acceptance criteria met
- Tests added
- Naming consistent
- No duplicated logic
- SOLID respected
- DRY respected
- No dead code
- Security considered
- Error handling complete
- Documentation updated if needed

---

# Release Flow

```
Backlog

↓

GitHub Issues

↓

Implementation

↓

Pull Requests

↓

Main

↓

Production Deployment

↓

Release Tag

↓

Next Milestone
```

---

# Golden Rules

1. Never code without an Issue.
2. One Issue = one branch.
3. One branch = one PR.
4. Keep branches short-lived.
5. Keep PRs small.
6. Protect `main`.
7. Use Conventional Commits.
8. Squash merge into `main`.
9. Delete merged branches.
10. Every merge must move the product closer to the current milestone.
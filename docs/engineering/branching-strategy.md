# CareerOS Branching Strategy

Version: 1.0  
Status: Approved  
Owner: Engineering

---

# Purpose

This document defines the official branching strategy for CareerOS.

The goals are to:

- Keep the codebase stable.
- Minimize merge conflicts.
- Enable rapid iteration.
- Support AI-assisted development.
- Ensure every change is traceable.
- Align Git branches with the YAML backlog and GitHub Issues.

CareerOS follows a **trunk-based development** approach with short-lived branches.

---

# Guiding Principles

## 1. `main` is Always Deployable

The `main` branch represents the current production-ready state of the application.

Every commit merged into `main` must:

- Pass all required CI checks.
- Meet the issue's acceptance criteria.
- Preserve application stability.
- Be deployable.

Never commit directly to `main`.

---

## 2. One Branch = One GitHub Issue

Every implementation branch exists for exactly one GitHub Issue.

Example:

```
Issue:
APP-004

↓

Branch:
feature/APP-004-create-application-api
```

This provides complete traceability from:

```
Backlog YAML
        ↓
GitHub Issue
        ↓
Branch
        ↓
Commits
        ↓
Pull Request
        ↓
Production
```

---

## 3. Branches are Short-Lived

Branches should exist only long enough to complete a single unit of work.

Target lifetime:

- 1–2 days
- Maximum: 1 week

If a branch becomes large, split the work into multiple issues.

---

# Branch Topology

```
                     main
                      │
      ┌───────────────┼───────────────┐
      │               │               │
 feature/APP-001   feature/JOB-002   fix/AUTH-003
      │               │               │
      └──────┬────────┴───────┬───────┘
             │                │
          Pull Request    Pull Request
             │                │
             └────── Merge into main ──────►
```

There are no long-lived development branches.

---

# Branch Types

## Feature Branch

Used for new functionality.

Format:

```
feature/<ISSUE-ID>-short-description
```

Examples:

```
feature/APP-001-create-api

feature/JOB-004-job-form

feature/DASH-003-summary-cards
```

---

## Bug Fix Branch

Used to resolve defects.

Format:

```
fix/<ISSUE-ID>-description
```

Examples:

```
fix/AUTH-002-session-timeout

fix/JOB-008-date-validation
```

---

## Refactor Branch

Used for internal improvements that do not change behavior.

Format:

```
refactor/<ISSUE-ID>-description
```

Examples:

```
refactor/API-003-service-layer

refactor/DASH-007-dashboard-hooks
```

---

## Documentation Branch

Used only for documentation updates.

Format:

```
docs/<ISSUE-ID>-description
```

Example:

```
docs/API-002-openapi-update
```

---

## Chore Branch

Used for tooling, infrastructure, or maintenance.

Examples:

```
chore/FOUND-010-eslint

chore/FOUND-014-update-dependencies
```

---

## Experiment Branch

Temporary spikes or research.

Examples:

```
experiment/linkedin-parser

experiment/browser-api
```

Experiment branches are never merged directly into `main`.

If successful:

1. Create backlog items.
2. Create GitHub Issues.
3. Re-implement properly using feature branches.

---

# Branch Naming Rules

Allowed:

```
feature/AUTH-001-login

feature/APP-004-create-ui

fix/JOB-009-invalid-location

docs/API-001-openapi
```

Not allowed:

```
new-feature

john-work

testing

changes

feature-login

my-branch
```

Rules:

- Use lowercase for the branch type.
- Use uppercase issue IDs.
- Use kebab-case for descriptions.
- Keep descriptions concise.

---

# Branch Lifecycle

```
GitHub Issue Created
          │
          ▼
Create Branch
          │
          ▼
Implement
          │
          ▼
Push Branch
          │
          ▼
Draft Pull Request
          │
          ▼
Code Review
          │
          ▼
Merge
          │
          ▼
Delete Branch
```

Every branch should have a clear beginning and end.

---

# Creating a Branch

Always branch from the latest `main`.

```
git checkout main

git pull origin main

git checkout -b feature/APP-004-create-application-api
```

Never branch from another feature branch unless explicitly required.

---

# Keeping Branches Updated

If `main` has changed:

```
git checkout main

git pull origin main

git checkout feature/APP-004-create-application-api

git rebase main
```

Prefer rebasing over merging to maintain a clean history.

---

# Branch Scope

A branch should solve one problem only.

Good example:

```
APP-004

Create application endpoint
```

Bad example:

```
APP-004

Create application endpoint

Dashboard redesign

Authentication improvements

Analytics changes
```

If work spans multiple concerns, create additional issues and branches.

---

# Branch Size

Ideal branch size:

- 5–20 commits
- Less than 500 changed lines where practical

Avoid "mega branches" that are difficult to review.

---

# Commit Expectations

Each commit should represent one logical step.

Example progression:

```
feat(applications): add Prisma model

feat(applications): create repository

feat(applications): implement POST endpoint

test(applications): add integration tests

docs(api): update endpoint documentation
```

Avoid unrelated changes in the same commit.

---

# Pull Request Expectations

Every branch should produce exactly one Pull Request.

The Pull Request should:

- Link the GitHub Issue.
- Reference acceptance criteria.
- Explain implementation details.
- Include testing notes.
- Remain focused on a single concern.

---

# Merge Strategy

CareerOS uses:

```
Squash and Merge
```

Advantages:

- Clean history.
- One commit per issue.
- Easier rollback.
- Better release notes.

Never merge with merge commits.

---

# Protected Branch Rules

The `main` branch must enforce:

- Pull Requests required.
- Passing CI checks.
- Required code review.
- No force pushes.
- No direct commits.
- No deletion.

---

# Handling Blocked Work

If an issue becomes blocked:

Do not continue adding unrelated work.

Instead:

1. Mark the GitHub Issue as blocked.
2. Create dependency issues if needed.
3. Merge completed work only if it is independently valuable.
4. Otherwise pause the branch until dependencies are resolved.

---

# Hotfix Workflow

Critical production fixes:

```
main

↓

fix/HOTFIX-001-auth-timeout

↓

PR

↓

Review

↓

Merge

↓

Deploy
```

Hotfixes still require:

- GitHub Issue
- Pull Request
- Review
- Tests where practical

---

# Branch Deletion

Immediately delete merged branches.

```
git branch -d feature/APP-004-create-application-api

git push origin --delete feature/APP-004-create-application-api
```

Stale branches create confusion and increase merge conflicts.

---

# Relationship to the Backlog

Every implementation originates from the machine-readable backlog.

```
Backlog Domain
        │
        ▼
Feature
        │
        ▼
GitHub Issue
        │
        ▼
Branch
        │
        ▼
Pull Request
        │
        ▼
Merge
```

Branches should never exist without a corresponding issue.

---

# AI Assistant Responsibilities

When creating branches, AI assistants must:

- Verify a GitHub Issue exists.
- Use the approved naming convention.
- Keep branch scope aligned with the issue.
- Avoid unrelated modifications.
- Rebase before opening a final Pull Request.
- Never create long-lived branches.
- Never merge directly into `main`.

---

# Anti-Patterns

Avoid:

❌ Development branches lasting weeks.

❌ One branch implementing multiple epics.

❌ Branches without GitHub Issues.

❌ Force pushing to `main`.

❌ Large, unreviewable Pull Requests.

❌ Mixing refactoring with feature development.

❌ Starting new work on an existing branch after the original issue is complete.

---

# Branching Decision Matrix

| Scenario | Branch Type | Example |
|-----------|-------------|---------|
| New feature | `feature/` | `feature/APP-001-create-api` |
| Bug fix | `fix/` | `fix/JOB-004-validation` |
| Refactoring | `refactor/` | `refactor/API-002-services` |
| Documentation | `docs/` | `docs/TRD-001-update` |
| Tooling or maintenance | `chore/` | `chore/FOUND-010-eslint` |
| Research spike | `experiment/` | `experiment/linkedin-parser` |

---

# Branching Checklist

Before creating a branch:

- GitHub Issue exists.
- Issue is assigned.
- Dependencies are resolved.
- Latest `main` has been pulled.

Before opening a Pull Request:

- Acceptance criteria completed.
- Tests pass.
- Documentation updated if required.
- Branch rebased onto latest `main`.

After merge:

- Delete local branch.
- Delete remote branch.
- Verify GitHub Issue is closed.
- Confirm milestone progress is updated.

---

# Golden Rules

1. Branch only from `main`.
2. One Issue equals one branch.
3. One branch equals one Pull Request.
4. Keep branches short-lived.
5. Rebase frequently.
6. Squash merge into `main`.
7. Delete branches immediately after merge.
8. Never bypass the GitHub Issue workflow.
9. Never work outside the scope of the assigned issue.
10. A branch is an execution artifact—not a planning tool.
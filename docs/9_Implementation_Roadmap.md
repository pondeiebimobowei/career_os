
# CareerOS — Detailed MVP Implementation Roadmap

## Purpose

This roadmap is the execution blueprint for taking CareerOS from concept to a validated MVP. It is intentionally optimized for:
- Fast learning
- Small team execution
- AI-assisted development
- Weekly shipping
- Continuous user feedback

---

# Success Criteria Before Expanding Scope

The MVP is successful if we can demonstrate:

- Users install the browser extension.
- Users capture jobs instead of using spreadsheets.
- Users return multiple times per week.
- Users manage active applications inside CareerOS.
- Early users express willingness to pay.

Anything else is secondary.

---

# Guiding Principles

1. Ship weekly.
2. Demo every Friday.
3. Never build two major features simultaneously.
4. Every sprint ends with something usable.
5. Validate before expanding.
6. Ruthlessly avoid feature creep.

---

# Phase 0 — Foundation (Week 1)

## Product
- Finalize PRD
- Freeze MVP scope
- Define acceptance criteria
- Create UX wireframes
- Review data model

Deliverables
- Product Brief
- PRD
- TRD
- User Flows
- Schema
- Design Brief

## Engineering

Repository
```
careeros/
  apps/
    web/
    api/
    extension/
  packages/
    ui/
    types/
    config/
    utils/
  docs/
```

Setup
- Turborepo
- pnpm
- ESLint
- Prettier
- Husky
- Commitlint
- GitHub Actions
- Docker Compose
- PostgreSQL
- Prisma
- NestJS Auth setup (JWT + Passport)

Definition of Done
- CI passing
- Local setup <10 minutes

---

# Sprint 1 (Week 2)
## Goal
Working authentication and dashboard shell.

Build
- NestJS Auth (JWT endpoints, login/register/refresh)
- Protected routes
- Sidebar
- Layout
- Theme
- Dashboard skeleton
- Shared UI components

Exclude
- Business logic
- Parsing
- Extension

Validation
- Users can sign in and navigate.

---

# Sprint 2 (Week 3)
## Goal
Company + Job domain.

Build
- Company CRUD
- Job CRUD
- Search
- Filters
- Database migrations
- Seed data

Validation
- Manual creation workflow.

---

# Sprint 3 (Week 4)
## Goal
Application pipeline.

Build
- Status workflow
- Kanban board
- Activity history
- Drag and drop
- Detail page

Validation
- Users manage complete pipeline manually.

---

# Sprint 4 (Week 5)
## Goal
Browser extension MVP.

Supported
- LinkedIn
- Greenhouse
- Lever

Build
- Manifest V3
- Content scripts
- Popup
- Background worker
- Capture endpoint
- Duplicate detection
- Manual edit fallback

Validation
- First capture in under 5 seconds.

---

# Sprint 5 (Week 6)

## Goal
Tasks and resumes.

Build
- Resume upload
- Resume library
- Attach resume
- Follow-up tasks
- Due dates

Validation
- End-to-end application management.

---

# Sprint 6 (Week 7)

## Goal
Polish.

Build
- Empty states
- Error states
- Loading states
- Analytics events
- Accessibility
- Performance pass
- Documentation

Reject
- New features

---

# Closed Beta (Week 8)

Target
20–30 active job seekers.

Observe
- Time to first capture
- Weekly usage
- Jobs captured
- Pipeline progression
- Feedback interviews

Success Gate
- Majority prefer CareerOS over spreadsheet.

---

# Month 3

Focus
- Fix friction
- Improve parser reliability
- Improve onboarding
- Pricing experiments

No major new features.

---

# Technical Milestones

## Backend
- Auth
- CRUD modules
- Capture endpoint
- Activity log
- Tasks
- File uploads

## Frontend
- Dashboard
- Pipeline
- Company pages
- Job detail
- Settings

## Extension
- Authentication
- Parsing
- Preview
- Capture
- Retry

---

# Testing Strategy

Every Merge
- Lint
- Types
- Unit tests

Weekly
- Manual regression

Before Beta
- Browser compatibility
- Parser validation
- Accessibility review

---

# Metrics Dashboard

Activation
- Signup
- First capture
- First application

Retention
- WAU
- Capture frequency
- Task completion

Business
- Beta invitations
- Paid conversions
- NPS

---

# Decision Gates

Gate 1
Problem solved?
If no, interview users.

Gate 2
Capture reliable?
If no, improve parsers only.

Gate 3
Retention > value?
If no, fix workflow.

Gate 4
Users willing to pay?
If no, refine positioning.

Only after all gates pass:
- Notion Sync
- Interview tracking
- AI features
- Gmail
- Calendar

---

# Explicitly Deferred

- Mobile apps
- Outlook
- Gmail sync
- Calendar sync
- AI coach
- Auto-apply
- Team workspaces
- Company monitoring
- Job recommendations

---

# Team Allocation

Product
- Discovery
- UX
- Validation

Frontend
- Web UI
- Design system

Backend
- API
- Database
- Auth

Extension
- Browser parsing
- Capture

Everyone
- Code review
- User interviews
- Weekly demos

---

# Exit Criteria for MVP

The MVP is complete when:

- Extension reliably captures supported jobs.
- Users actively manage applications.
- Dashboard is used weekly.
- Parser accuracy is consistently high.
- Users request improvements instead of asking for missing fundamentals.
- At least a handful of users are willing to pay.

At that point, optimize the core workflow before expanding the product.

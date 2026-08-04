# Frontend Architecture — CareerOS MVP

## Purpose

This document defines the frontend architecture for CareerOS. The goal is to maximize development velocity, maintainability, and consistency while supporting rapid AI-assisted development.

---

# Architecture Principles

- Feature-first architecture
- Strong typing end-to-end
- Server state separated from UI state
- Shared design system
- Reusable business logic
- Progressive enhancement
- Mobile responsive, desktop-first

---

# Technology Stack

- React 19
- TypeScript
- Vite
- React Router
- TanStack Query
- React Hook Form
- Zod
- Tailwind CSS
- shadcn/ui
- Lucide Icons

---

# Monorepo Structure

```
apps/
  web/

packages/
  ui/
  types/
  utils/
  config/
```

---

# App Structure

```
src/
  app/
  routes/
  features/
    auth/
    dashboard/
    companies/
    jobs/
    applications/
    tasks/
    resumes/
    settings/
  components/
  layouts/
  hooks/
  services/
  lib/
  providers/
  types/
  utils/
  assets/
```

---

# Feature Module Structure

```
applications/
  api/
  components/
  hooks/
  pages/
  schemas/
  types/
  utils/
```

Each feature owns its UI, API hooks, validation, and business logic.

---

# Routing

Public:
- /
- /login
- /signup

Protected:
- /dashboard
- /applications
- /companies
- /jobs/:id
- /tasks
- /resumes
- /settings

---

# Layout

```
AppLayout
 ├── Sidebar
 ├── Top Navigation
 ├── Main Content
 └── Global Command Bar
```

---

# State Management

## Server State
TanStack Query

Responsibilities:
- API fetching
- Caching
- Background refetching
- Optimistic updates

## Client State

React state only for:
- Modals
- Drawers
- Dropdowns
- Filters
- Form drafts

Avoid global client state unless proven necessary.

---

# Forms

- React Hook Form
- Zod validation
- Shared validation schemas
- Inline error messages

---

# API Layer

```
services/
  api.ts
  auth.ts
  companies.ts
  jobs.ts
  applications.ts
  tasks.ts
```

Rules:
- Never call fetch directly inside components.
- Encapsulate API logic.

---

# UI Components

Shared components:

- Button
- Card
- Input
- Select
- Modal
- Drawer
- Badge
- Avatar
- Table
- Kanban Card
- Empty State
- Skeleton
- Toast

Located in packages/ui.

---

# Design Tokens

Spacing:
4, 8, 12, 16, 24, 32, 48

Radius:
12px

Animation:
150–250ms

Typography:
Inter

---

# Error Handling

Every screen must support:
- Loading
- Empty
- Error
- Success

Errors should provide recovery actions.

---

# Performance

- Route lazy loading
- Code splitting
- Image optimization
- Query caching
- Avoid premature memoization

---

# Accessibility

- Keyboard navigation
- Focus indicators
- Semantic HTML
- WCAG AA contrast
- ARIA labels where needed

---

# Testing Strategy

- Vitest
- React Testing Library

Priority:
1. Business logic
2. Custom hooks
3. Critical UI flows

---

# Analytics

Track:
- Signups
- First capture
- Jobs created
- Pipeline updates
- Task completion
- Extension installs

---

# Coding Standards

- Functional components only
- One component per file
- No business logic in presentation components
- Shared types from packages/types
- Feature isolation

---

# MVP Screens

1. Landing
2. Authentication
3. Dashboard
4. Applications Board
5. Job Detail
6. Company Detail
7. Tasks
8. Resume Library
9. Settings
10. Capture Success

---

# Future Evolution

Phase 2:
- Interview management
- Contacts
- Notes

Phase 3:
- AI insights
- Analytics

Phase 4:
- Gmail
- Calendar
- Notion Sync

---

# Definition of Done

A frontend feature is complete when:
- UX matches design
- Types pass
- Lint passes
- Responsive
- Accessible
- Loading/error/empty states implemented
- Tests added where appropriate
- Documentation updated

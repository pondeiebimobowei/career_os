# CareerOS Master Implementation Roadmap & Sprint-to-Phase Alignment

## Overview

This document reconciles the 6-Sprint Delivery Timeline (`docs/9_Implementation_Roadmap.md`) with the 9 Execution Phases defined in `docs/Implementation/README.md`.

---

## Sprint-to-Phase Mapping Matrix

| Delivery Sprint | Execution Phase | Core Deliverables | Critical Dependencies |
| :--- | :--- | :--- | :--- |
| **Sprint 1 (Week 1–2)** | **Phase 01: Foundation** & **Phase 02: Platform** | Turborepo monorepo, `@repo/database` (Prisma/PostgreSQL), `@repo/logger`, `@repo/ui`, Backlog CLI v1.0.0 | Docker, pnpm workspace |
| **Sprint 2 (Week 3–4)** | **Phase 03: Backend Platform** | NestJS REST API (`apps/api`), JWT Authentication, User Profile API, Jobs & Application CRUD | `@repo/database`, PostgreSQL |
| **Sprint 3 (Week 5)** | **Phase 04: Browser Extension** | WXT Manifest V3 Chrome Extension (`apps/extension`), Tier 1 Parsers (LinkedIn, Greenhouse, Lever), `/api/v1/browser-extension/*` | NestJS API, Auth JWT |
| **Sprint 4 (Week 6)** | **Phase 05: Web Application** | Vite + React Web App (`apps/web`), Multi-step Onboarding UI, Applications Kanban Board, Dashboard | NestJS API, Extension API |
| **Sprint 5 (Week 7)** | **Phase 06: Resume Platform** | Resume Library, PDF upload & storage, Resume version mapping | NestJS API, S3/Storage |
| **Sprint 6 (Week 8)** | **Phase 07: Analytics**, **Phase 08: Polish**, & **Phase 09: Production** | Analytics & search endpoints, Accessibility, Monorepo Confidence Gate (`pnpm gate`), GitHub Actions CI/CD | All prior phases |

---

## Phase Execution Index

- [Phase 01 — Foundation](file:///Users/user/Downloads/code/project/career_os/docs/Implementation/phase-01-foundation.md)
- [Phase 02 — Shared Platform](file:///Users/user/Downloads/code/project/career_os/docs/Implementation/phase-02-platform.md)
- [Phase 03 — Backend Platform](file:///Users/user/Downloads/code/project/career_os/docs/Implementation/phase-03-backend.md)
- [Phase 04 — Browser Extension](file:///Users/user/Downloads/code/project/career_os/docs/Implementation/phase-04-browser-extension.md)
- [Phase 05 — Web Application](file:///Users/user/Downloads/code/project/career_os/docs/Implementation/phase-05-web-app.md)
- [Phase 06 — Resume Library](file:///Users/user/Downloads/code/project/career_os/docs/Implementation/phase-06-resume-library.md)
- [Phase 07 — Analytics](file:///Users/user/Downloads/code/project/career_os/docs/Implementation/phase-07-analytics.md)
- [Phase 08 — Polish & Product Hardening](file:///Users/user/Downloads/code/project/career_os/docs/Implementation/phase-08-polish.md)
- [Phase 09 — Production Readiness](file:///Users/user/Downloads/code/project/career_os/docs/Implementation/phase-09-production.md)

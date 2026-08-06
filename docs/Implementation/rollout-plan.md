# CareerOS Product Rollout & Release Strategy

## Overview

This document defines the deployment rollout and release strategy for CareerOS, detailing the progression from local staging validation through closed beta and public launch on self-hosted VPS infrastructure managed with Coolify, Docker, and Cloudflare.

---

## Rollout Strategy & Deployment Phases

```text
┌───────────────────────────┐
│ Phase 1: Staging & QA     │  Local & Coolify Staging Environment
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│ Phase 2: Closed Beta      │  Week 8 (50 Active Job Searchers)
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│ Phase 3: Public Release   │  General Availability (Coolify Production)
└───────────────────────────┘
```

---

## Rollout Milestones

### Phase 1 — Staging & Automated QA Validation (Weeks 1–7)
- **Infrastructure**: Local Docker Compose & Coolify Staging VPS instance.
- **Objectives**:
  - Run full `pnpm gate` monorepo confidence check (Backlog validation, Lint, Typecheck, Vitest/Jest unit/integration tests, Turbo build).
  - Verify database migrations (`prisma migrate dev`) against staging PostgreSQL container.
  - Test browser extension parser extraction on LinkedIn, Greenhouse, and Lever in Chrome developer mode.

### Phase 2 — Closed Beta Release (Week 8)
- **Infrastructure**: Self-hosted Coolify Production VPS + Cloudflare Tunnel + PostgreSQL.
- **Objectives**:
  - Deploy `apps/api` and `apps/web` Docker containers via Coolify.
  - Publish extension ZIP to internal beta testers (50 active job searchers).
  - Monitor error rates in Sentry and event telemetry in PostHog via NestJS API proxy (`POST /api/v1/analytics/event`).

### Phase 3 — Public MVP Launch (Post-Week 8)
- **Infrastructure**: Production VPS cluster managed via Coolify, Cloudflare WAF/CDN.
- **Objectives**:
  - Publish Manifest V3 Extension to Chrome Web Store.
  - Enable production user registration & onboarding flow (`POST /api/v1/profile/:userId`).
  - Activate automated daily database backups and Cloudflare DDoS protection.

---

## Rollback & Recovery Procedures

In the event of a critical regression during rollout:

1. **Backend & Frontend Application Rollback**:
   - Revert Coolify deployment target to the previous successful Git tag / Docker image hash.
   - Coolify performs zero-downtime container replacement.

2. **Database Schema Rollback**:
   - Execute database down migrations using Prisma CLI (`prisma migrate diff` / restore point backup).
   - Restore PostgreSQL from daily automated S3-compatible snapshot if schema corruption occurs.

3. **Emergency Traffic Killswitch**:
   - Toggle Cloudflare Maintenance Page rule to divert traffic during emergency hotfix deployments.

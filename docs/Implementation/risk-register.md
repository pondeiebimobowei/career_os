# CareerOS Technical & Operational Risk Register

## Overview

This document identifies technical, operational, and architectural risks across the CareerOS platform, establishing severity levels, likelihood, and proactive mitigation strategies.

---

## Risk Matrix Summary

| Risk ID | Risk Category | Risk Description | Severity | Likelihood | Mitigation Strategy |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **RSK-001** | Extension Parsers | DOM changes on job boards (LinkedIn, Greenhouse, Lever) breaking parser extractions | High | High | Implement modular `JobParser` interface, confidence scoring, automated DOM test snapshots, and graceful fallback to manual editing UI. |
| **RSK-002** | Database & Persistence | Database schema drift or broken migrations across environments | High | Medium | Enforce single source of truth in `@repo/database` Prisma schema, run `prisma migrate dev`, and require `pnpm gate` validation prior to merge. |
| **RSK-003** | Backlog Synchronization | GitHub issue sync drift or duplicate mapping corruption | Medium | Medium | Utilize versioned self-healing mapping store (`.github/backlog-map.json`), non-destructive `pnpm backlog sync`, and automated `pnpm backlog repair`. |
| **RSK-004** | Self-Hosted Infrastructure | VPS instance failure or container crash on Coolify | High | Low | Configure Docker container auto-restart policies, Cloudflare Tunnel health checks, and daily offsite database backups to S3-compatible storage. |
| **RSK-005** | Authentication & Security | Extension JWT token expiration or CORS security failures | Medium | Low | Implement silent token refresh in WXT background service worker and enforce NestJS JWT guards on `/api/v1/*` REST routes. |

---

## Risk Mitigation Action Plans

### RSK-001 — Job Board DOM Parser Breakages
- **Monitoring**: Log parser confidence scores and failure rates to Sentry & PostHog. Alert when parser success drops below 95%.
- **Architecture**: Decouple extraction logic into isolated provider parsers (`entrypoints/content/parsers/`). Changes to LinkedIn parser do not affect Greenhouse or Lever parsers.
- **Fallback**: Provide inline manual field editing modal in the extension popup when confidence is low.

### RSK-002 — Database Schema Drift
- **Control**: Block direct SQL schema edits. All database modifications must be authored in `packages/database/prisma/schema.prisma` and generated via Prisma CLI.
- **CI Verification**: CI executes `prisma generate && tsc --noEmit` on every pull request.

### RSK-003 — Backlog Synchronization Drift
- **Control**: Maintain non-destructive sync contract where `pnpm backlog sync` creates missing items and updates titles/labels, but never closes duplicates destructively.
- **Healing**: Fallback to HTML comment markers (`<!-- backlog-id: ID -->`) and title prefixes `[ID]` if `.github/backlog-map.json` is missing or corrupt.

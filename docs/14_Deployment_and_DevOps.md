
# CareerOS Deployment & DevOps Guide

## Purpose

This document defines the deployment, infrastructure, CI/CD, environment management, monitoring, and operational practices for the CareerOS MVP.

---

# DevOps Principles

- Keep infrastructure simple.
- Automate repetitive tasks.
- Every change goes through CI.
- Deploy frequently in small increments.
- Infrastructure should be reproducible.

---

# Environment Strategy

## Local
- Docker Compose
- PostgreSQL
- MinIO (optional)
- MailHog (optional)

## Staging
- Mirrors production
- Used for QA and beta testing

## Production
- Managed cloud services
- Automatic backups
- Monitoring enabled

---

# Recommended Stack & Self-Hosted Infrastructure Rules

> [!IMPORTANT]
> **Canonical Self-Hosted Deployment Platform (ADR-035)**:
> CareerOS applications are hosted entirely on private Virtual Private Servers (VPS) using **Coolify**, **Docker**, and **Cloudflare**. Third-party PaaS platforms (Vercel, Railway, Fly.io, Render) are not used.
>
> - **Frontend Web App (`apps/web`)**: Web container deployed & managed via Coolify on VPS.
> - **Backend REST API (`apps/api`)**: NestJS Node.js Docker container deployed & managed via Coolify on VPS.
> - **Database**: PostgreSQL container (or managed PostgreSQL instance on VPS) managed via Coolify.
> - **DNS, SSL & Edge Security**: Cloudflare (Cloudflare Tunnels / SSL Termination / WAF).
> - **Kubernetes Policy**: Kubernetes is strictly **Out of Scope** for MVP ("Avoid Kubernetes for MVP") per Technical Requirements Document & DevOps guide.

## Hosting & Platform
- Private VPS self-hosted via **Coolify** + **Docker**

## Frontend
- Containerized Vite + React Web App (`apps/web`) on Coolify VPS

## Backend
- Containerized NestJS REST API (`apps/api`) on Coolify VPS

## Database
- PostgreSQL container on Coolify VPS

## ORM
- Prisma

## DNS/CDN & Security
- Cloudflare (Cloudflare Tunnels, DNS, SSL)

---

# Repository Layout

apps/
- web
- api
- extension

packages/
- ui
- types
- config
- utils

docs/

---

# Branch Strategy

- main
- develop
- feature/*
- hotfix/*

Rules:
- Pull requests only
- Squash merge
- Protected main branch

---

# CI Pipeline

Every Pull Request:
1. Install dependencies
2. Cache packages
3. Lint
4. Typecheck
5. Unit tests
6. Integration tests
7. Build web
8. Build API
9. Build extension

Fail the build on any error.

---

# CD Pipeline

## Staging
- Auto deploy from develop

## Production
- Deploy from tagged release or main after approval

Deployment steps:
1. Build
2. Run migrations
3. Health check
4. Release
5. Rollback on failure

---

# Environment Variables

Examples:
- DATABASE_URL
- JWT_SECRET
- JWT_EXPIRES_IN
- JWT_REFRESH_SECRET
- JWT_REFRESH_EXPIRES_IN
- STORAGE_BUCKET
- OPENAI_API_KEY (future)
- POSTHOG_KEY
- SENTRY_DSN

Never commit secrets.

---

# Database Operations

Use Prisma Migrate.

Workflow:
1. Create migration
2. Review SQL
3. Apply in staging
4. Backup production
5. Apply in production

---

# Browser Extension Release

- Build Manifest V3 package
- Smoke test
- Publish to Chrome Web Store
- Tag release

Keep extension version aligned with backend API compatibility.

---

# Monitoring

## Errors
- Sentry

## Product Analytics
- PostHog

## Uptime
- Better Stack or UptimeRobot

Monitor:
- API latency
- Error rate
- Capture failures
- Queue health

---

# Logging

Log:
- Requests
- Authentication
- Background jobs
- Extension capture

Do not log:
- Tokens
- Resume content
- Personal notes

---

# Backups

Database:
- Daily snapshots
- Point-in-time recovery if available

Storage:
- Object versioning

Test restores quarterly.

---

# Rollback

If deployment fails:
1. Stop rollout
2. Restore previous release
3. Verify health
4. Investigate root cause

---

# Security

- HTTPS only
- Dependency scanning
- Secret scanning
- Branch protection
- Required code review
- Least-privilege credentials

---

# Infrastructure as Code

Preferred:
- Docker Compose for local
- Terraform later if infrastructure grows

Avoid Kubernetes for MVP.

---

# Release Checklist

- CI green
- Migrations reviewed
- Monitoring enabled
- Backups verified
- Release notes prepared
- Smoke tests passed

---

# Scaling Plan

Stage 1:
- Single API instance

Stage 2:
- Separate background workers

Stage 3:
- Read replicas
- CDN optimization
- Queue scaling

Optimize only after usage demands it.

---

# Disaster Recovery

Recovery priorities:
1. Database
2. Authentication
3. API
4. Frontend
5. Extension

Target:
- RPO < 24 hours
- RTO < 2 hours (MVP aspiration)

---

# Definition of Operational Readiness

The system is production-ready when:
- Deployments are automated
- Rollbacks are tested
- Monitoring is active
- Alerts are configured
- Backups are verified
- Documentation is current

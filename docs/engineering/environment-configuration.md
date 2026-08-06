# Environment Variables & Secret Management Guide

## Overview

This guide details all environment configuration variables, required secrets, environment boundaries (Local, Staging, Production), and secret management procedures for CareerOS.

---

## Environment Matrix

| Variable | Scope | Target Apps | Description | Secret? | Default / Example |
|---|---|---|---|---|---|
| `NODE_ENV` | Global | API, Web, Ext | Execution environment (`development`, `staging`, `production`) | No | `development` |
| `PORT` | API | API | HTTP server listening port | No | `3000` |
| `DATABASE_URL` | Infrastructure | API, Database | PostgreSQL connection URL string with credentials & schema | **Yes** | `postgresql://user:pass@localhost:5432/careeros` |
| `FIREBASE_PROJECT_ID` | Auth | API, Web, Ext | Firebase Project Identifier | No | `careeros-dev` |
| `FIREBASE_CLIENT_EMAIL` | Auth | API | Firebase Admin Service Account email | **Yes** | `firebase-adminsdk@...` |
| `FIREBASE_PRIVATE_KEY` | Auth | API | Firebase Admin RSA Private Key | **Yes** | `"-----BEGIN PRIVATE KEY-----\n..."` |
| `VITE_API_URL` | Web | Web | Backend REST API base URL | No | `http://localhost:3000` |
| `WXT_VITE_API_URL` | Extension | Extension | Extension API base URL | No | `http://localhost:3000` |
| `STORAGE_BUCKET` | Storage | API | Cloudflare R2 / S3 Storage bucket name | No | `careeros-dev-storage` |
| `STORAGE_ACCESS_KEY_ID` | Storage | API | Storage service access key | **Yes** | `dev_access_key` |
| `STORAGE_SECRET_ACCESS_KEY` | Storage | API | Storage service secret access key | **Yes** | `dev_secret_key` |
| `SENTRY_DSN` | Observability | API, Web | Sentry crash reporting Data Source Name | No | `https://key@sentry.io/1` |
| `POSTHOG_API_KEY` | Analytics | Web, API | PostHog product analytics project key | No | `phc_dev_dummy_key` |
| `OPENAI_API_KEY` | AI | API | OpenAI API key for AI features | **Yes** | `sk-proj-...` |

---

## Secret Safety Rules

1. **Never Commit Secret Credentials**: `.env` and local environment files are ignored in `.gitignore`.
2. **Use Shared `.env.example` Templates**: Every app in `apps/` and the workspace root maintains a `.env.example` file.
3. **Validation at Startup**: Production environments validate environment variable presence on startup using Zod schema parsers.
4. **Secret Management in CI/CD**: Staging and Production secrets are injected securely through GitHub Actions Secrets and Coolify environment settings.

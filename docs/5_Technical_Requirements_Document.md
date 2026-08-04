# Technical Requirements Document (TRD)

# CareerOS MVP

## Purpose
Define the implementation architecture for the MVP with a bias toward rapid delivery, maintainability, and AI-assisted development.

## Guiding Principles
- Monolith first
- Modular architecture
- API-first
- Strong typing end-to-end
- Prefer convention over configuration
- Optimize for shipping, not premature scale

# Technology Stack

## Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- TanStack Query
- React Hook Form
- Zod

## Browser Extension
- Manifest V3
- React + TypeScript
- Chrome Storage
- Shared types package

## Backend
- NestJS
- Prisma ORM
- PostgreSQL
- BullMQ (future background jobs)

## Infrastructure
- Docker
- Coolify
- Cloudflare
- GitHub Actions

# Architecture

Client
├── Web App
├── Browser Extension
└── REST API

Backend
├── Auth
├── Companies
├── Jobs
├── Applications
├── Tasks
├── Documents
└── Activity

Database
└── PostgreSQL

Storage
└── S3-compatible object storage

# Authentication
- Firebase Authentication
- Backend verifies ID tokens
- Role: User/Admin
- Stateless API

# Database Entities
- User
- Profile
- Company
- JobOpening
- Application
- Resume
- Task
- ActivityLog

Relationships:
Company -> JobOpening -> Application

# API Modules
- /auth
- /companies
- /jobs
- /applications
- /tasks
- /resumes
- /activity

REST conventions:
GET /resource
GET /resource/:id
POST /resource
PATCH /resource/:id
DELETE /resource/:id

# Browser Extension

Supported MVP Sites
- LinkedIn
- Greenhouse
- Lever

Flow
1. Detect page
2. Parse DOM
3. Show preview
4. Send payload
5. Receive confirmation

Fallback
- Manual edit
- Unsupported page message

# Background Jobs (Future)
- Notifications
- Email reminders
- Company monitoring

# File Storage
Resume PDFs stored in object storage.
Metadata stored in PostgreSQL.

# Notifications
MVP:
- In-app reminders

Future:
- Email
- Push

# Security
- HTTPS only
- Input validation (Zod)
- Prisma parameterization
- Rate limiting
- JWT verification
- Secure headers

# Monitoring
- Sentry
- Structured logs
- Health endpoint

# CI/CD
- Lint
- Type check
- Unit tests
- Build
- Deploy

Protected main branch.

# Non-functional Requirements
- 95% API responses <500ms (non-file)
- Mobile responsive UI
- Accessible (WCAG AA)

# Out of Scope
- Microservices
- Event sourcing
- Realtime collaboration
- Multi-region deployment
- Kubernetes

# Future Integrations
- Notion
- Gmail
- Outlook
- Google Calendar
- AI services

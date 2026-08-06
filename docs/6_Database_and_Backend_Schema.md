# Database & Backend Schema — CareerOS MVP

## Overview

Database: PostgreSQL
ORM: Prisma
Architecture: Modular monolith (NestJS)

Primary relationship:

```
User
 ├── Company
 │     └── JobOpening
 │            └── Application
 ├── Resume
 ├── Task
 └── Activity
```

---

# Core Models

## User
- id (UUID)
- email (unique)
- passwordHash (optional for OAuth-only users)
- googleId (unique, optional)
- githubId (unique, optional)
- fullName
- avatarUrl
- timezone
- createdAt
- updatedAt

## CareerProfile
- id
- userId
- targetRole
- seniority
- preferredLocations
- remotePreference
- salaryExpectation
- employmentTypes

## Company
- id
- userId
- name
- website
- careersUrl
- linkedinUrl
- industry
- size
- headquarters
- remotePolicy
- notes
- createdAt
- updatedAt

Indexes:
- (userId, name)

## JobOpening
- id
- companyId
- source
- sourceUrl (unique per user)
- externalId (nullable)
- title
- location
- employmentType
- workplaceType
- salaryMin
- salaryMax
- currency
- description
- postedAt
- capturedAt

Indexes:
- companyId
- source
- sourceUrl

## Application
- id
- jobOpeningId
- userId
- status
- appliedAt
- resumeId (nullable)
- coverLetterUrl (nullable)
- nextFollowUp
- outcome
- notes

Indexes:
- (userId, status)

## Resume
- id
- userId
- name
- storageKey
- version
- createdAt

## Task
- id
- userId
- applicationId
- title
- dueDate
- completedAt
- priority

## Activity
- id
- userId
- applicationId
- eventType
- payload (JSONB)
- createdAt

---

# Relationships

- User 1:N Companies
- User 1:N Resumes
- User 1:N Tasks
- Company 1:N JobOpenings
- JobOpening 1:1 Application (per user)
- Application 1:N Activities

---

# Status Enums

ApplicationStatus

- SAVED
- READY_TO_APPLY
- APPLIED
- FOLLOW_UP
- RECRUITER_SCREEN
- TECHNICAL
- FINAL
- OFFER
- REJECTED
- WITHDRAWN

TaskPriority

- LOW
- MEDIUM
- HIGH

---

# API Resources

/auth
/companies
/jobs
/applications
/tasks
/resumes
/profile
/activity

Example:

GET /applications

POST /applications

PATCH /applications/:id

DELETE /applications/:id

---

# Example Create Application

```json
{
  "jobOpeningId":"uuid",
  "status":"SAVED",
  "resumeId":"uuid"
}
```

Response

```json
{
  "id":"uuid",
  "status":"SAVED"
}
```

---

# Browser Extension Payload

```json
{
  "source":"linkedin",
  "url":"https://...",
  "company":"Acme",
  "title":"Frontend Engineer",
  "location":"Remote",
  "employmentType":"Full-time",
  "description":"..."
}
```

---

# Duplicate Detection

Primary:
- userId + sourceUrl

Secondary:
- company + title + location

---

# Permissions

User:
- CRUD own resources

Admin:
- Platform administration only

---

# Audit Trail

Record:
- status changes
- captures
- edits
- task completion

---

# Background Jobs (Future)

- Follow-up reminders
- Company monitoring
- Resume analysis
- Email sync

---

# Prisma Module Layout

```
prisma/
  schema.prisma

src/
  auth/
  companies/
  jobs/
  applications/
  tasks/
  resumes/
  activity/
  common/
```

---

# Design Principles

- UUID primary keys
- Soft delete only if needed later
- JSONB for extensible metadata
- Avoid premature normalization
- API versioning only when necessary

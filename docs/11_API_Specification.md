
# CareerOS API Specification (MVP)

## Principles
- RESTful JSON API
- Versioned: `/api/v1`
- Firebase ID Token authentication
- Resource-oriented endpoints
- Cursor pagination
- Consistent error responses

## Authentication

All protected requests:

`Authorization: Bearer <firebase_id_token>`

## Standard Response

Success

```json
{
  "data": {},
  "meta": {}
}
```

Error

```json
{
  "error": {
    "code":"VALIDATION_ERROR",
    "message":"Validation failed",
    "details":[]
  }
}
```

---

# Auth

## POST /api/v1/auth/session

Verifies Firebase token and creates user profile.

Response:
```json
{
  "data":{
    "user":{
      "id":"usr_123",
      "email":"user@example.com",
      "name":"Jane Doe"
    }
  }
}
```

---

# Profile

GET /api/v1/profile

PATCH /api/v1/profile

Fields:
- fullName
- targetRole
- yearsExperience
- preferredLocations
- remotePreference

---

# Companies

GET /companies

POST /companies

GET /companies/{id}

PATCH /companies/{id}

DELETE /companies/{id}

Company payload

```json
{
  "name":"Acme",
  "website":"https://acme.com",
  "careersUrl":"https://acme.com/careers",
  "industry":"SaaS",
  "priority":"HIGH"
}
```

---

# Jobs

GET /jobs

Supports:
- companyId
- status
- search
- cursor
- limit

POST /jobs

GET /jobs/{id}

PATCH /jobs/{id}

DELETE /jobs/{id}

Job payload

```json
{
  "companyId":"cmp_1",
  "title":"Frontend Engineer",
  "location":"Remote",
  "jobUrl":"https://...",
  "salary":"100000-130000"
}
```

---

# Applications

GET /applications

POST /applications

GET /applications/{id}

PATCH /applications/{id}

PATCH /applications/{id}/status

Statuses:
- SAVED
- READY
- APPLIED
- FOLLOW_UP
- SCREEN
- TECHNICAL
- FINAL
- OFFER
- REJECTED

---

# Tasks

GET /tasks

POST /tasks

PATCH /tasks/{id}

DELETE /tasks/{id}

Task

```json
{
  "title":"Follow up recruiter",
  "dueDate":"2026-08-20",
  "applicationId":"app_1"
}
```

---

# Resumes

GET /resumes

POST /resumes/upload

DELETE /resumes/{id}

Returns storage URL and metadata.

---

# Browser Extension

POST /extension/capture

Input

```json
{
  "url":"https://...",
  "source":"linkedin",
  "rawHtml":"optional",
  "structuredData":{}
}
```

Output

```json
{
  "data":{
    "jobId":"job_1",
    "duplicate":false,
    "confidence":0.97
  }
}
```

POST /extension/heartbeat

Reports extension version.

---

# Activity

GET /activity

Chronological timeline.

---

# Search

GET /search?q=react

Returns companies, jobs and applications.

---

# Pagination

```json
{
 "meta":{
   "nextCursor":"abc123",
   "hasMore":true
 }
}
```

---

# Error Codes

- UNAUTHORIZED
- FORBIDDEN
- NOT_FOUND
- VALIDATION_ERROR
- DUPLICATE_RESOURCE
- RATE_LIMITED
- INTERNAL_ERROR

---

# Rate Limits

- Auth: 20/min
- CRUD: 120/min
- Capture: 60/min

---

# Webhooks (Future)

- application.status_changed
- interview.created
- task.overdue

---

# Versioning

Breaking changes only under `/api/v2`.

Maintain backward compatibility during beta where practical.

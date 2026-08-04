# Browser Extension Architecture — CareerOS MVP

# Purpose

The browser extension is the primary acquisition channel and activation mechanism for CareerOS.

Its only responsibility in the MVP is to make capturing a job opportunity dramatically faster than manual tracking.

It should NOT become a full automation platform.

---

# Design Principles

- One-click capture
- Fast (<5 seconds)
- Reliable
- Explain failures clearly
- Graceful fallback to manual editing
- Easy to extend to new job sites

---

# MVP Scope

Supported Sources:
- LinkedIn Jobs
- Greenhouse
- Lever

Out of Scope:
- Auto-applying
- Email parsing
- Calendar sync
- AI recommendations
- Generic web scraping

---

# High-Level Architecture

Browser
├── Content Script
├── Background Service Worker
├── Popup UI
├── Chrome Storage
└── Messaging API

            │

REST API

            │

NestJS Backend

            │

PostgreSQL

---

# Components

## Content Script

Responsibilities:
- Detect supported pages
- Read DOM
- Extract structured fields
- Send payload to background worker

Never communicates directly with the backend.

---

## Background Service Worker

Responsibilities:
- Authentication
- Token refresh
- API communication
- Retry logic
- Error handling
- Duplicate detection requests

---

## Popup UI

Displays:
- Parsed preview
- Confidence indicators
- Editable fields
- Save button
- Success/error state

Goal:
User should always understand what will be saved.

---

# Authentication

Uses Firebase Authentication.

Flow:
1. User signs into CareerOS.
2. Web app issues Firebase session.
3. Extension retrieves ID token.
4. Backend verifies token.
5. Extension uses authenticated API requests.

No credentials stored in extension code.

---

# Capture Flow

1. User opens supported job page.
2. Content script detects page.
3. Parser extracts data.
4. Popup displays preview.
5. User clicks Save.
6. Background sends payload.
7. Backend:
   - Finds/creates Company
   - Creates Job Opening
   - Creates Application
8. Success confirmation shown.

---

# Parsed Fields

Required:
- Company
- Job title
- Source
- Source URL

Optional:
- Location
- Workplace type
- Employment type
- Salary
- Description
- Posted date

---

# Confidence Model

High:
All required fields found.

Medium:
Minor optional fields missing.

Low:
Missing required information.

Low-confidence captures require manual confirmation.

---

# Duplicate Detection

Primary:
userId + sourceUrl

Secondary:
company + title + location

Prompt user to update existing record if duplicate detected.

---

# Failure Handling

Unsupported Site:
Show friendly message.

Parser Error:
Allow manual entry.

Network Failure:
Queue locally and retry.

Authentication Failure:
Prompt re-login.

---

# Extensibility

Each provider has its own parser module.

providers/
- linkedin.ts
- greenhouse.ts
- lever.ts

Parser interface:

- canHandle(url)
- extract(document)
- confidence(result)

New providers implement the same interface.

---

# Backend API

POST /capture

Payload:
{
  "source": "linkedin",
  "url": "...",
  "company": "...",
  "title": "...",
  "description": "..."
}

Response:
{
  "applicationId": "...",
  "status": "created"
}

---

# Telemetry

Track:
- Capture attempts
- Successful captures
- Parser failures
- Unsupported sites
- Time to capture
- Duplicate rate

Use telemetry to prioritize parser improvements.

---

# Security

- HTTPS only
- Validate all payloads
- Never trust client data
- Rate limiting
- Input sanitization
- Least-privilege extension permissions

---

# Future Evolution

Phase 2:
- Ashby
- Workday
- SmartRecruiters

Phase 3:
- Generic parser
- Saved searches
- Company watchlists

Phase 4:
- Gmail integration
- Calendar integration
- Intelligent follow-up suggestions

---

# Success Criteria

- First capture in under 5 minutes after install
- Average capture time under 5 seconds
- >95% successful parsing on supported providers
- Manual correction required on <20% of captures

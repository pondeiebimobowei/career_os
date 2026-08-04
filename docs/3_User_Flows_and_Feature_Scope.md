# User Flows & Feature Scope — CareerOS MVP

# Purpose
Define the end-to-end user experience and clearly separate MVP functionality from future capabilities.

# Primary User Journey

## 1. Discover
Intent: Find a relevant job while browsing.

User:
- Browses LinkedIn, Greenhouse, or Lever.
- Opens a job posting.

System:
- Detects supported page.
- Enables "Save to CareerOS" extension action.

Success:
- User understands they can capture the job instantly.

---

## 2. Capture (Aha Moment)

User:
- Clicks the extension.
- Reviews parsed information.
- Clicks Save.

System:
- Extracts company, title, location, URL, employment type, and description.
- Creates Company if missing.
- Creates Job Opening.
- Creates Application in "Saved".
- Detects duplicates.
- Redirects (optional) to dashboard.

Success:
- Complete record created in under 5 seconds.

Failure States:
- Unsupported page
- Low parser confidence
- Duplicate job
- Missing required fields

---

## 3. Dashboard

Intent:
See today's job search at a glance.

Displays:
- Active applications
- Tasks due
- Recent captures
- Pipeline summary

Empty State:
"Capture your first opportunity."

---

## 4. Review Opportunity

User:
- Opens saved job.

Can:
- Edit details
- Upload resume
- Add notes
- Apply externally
- Create follow-up task

---

## 5. Application Pipeline

Stages:
- Saved
- Applied
- Recruiter Screen
- Technical Interview
- Final Interview
- Offer
- Rejected
- Withdrawn

User:
- Moves application between stages.

System:
- Records activity history.

---

## 6. Tasks

User:
- Creates reminder.

System:
- Shows overdue/upcoming tasks.

---

## 7. Resume Management

User:
- Uploads resume versions.
- Associates resume with application.

---

## Feature Scope

## P0 (MVP)
- Authentication
- Browser extension
- Job parsing
- Company management
- Job management
- Application pipeline
- Kanban board
- Resume upload
- Tasks
- Search/filter

## P1
- Interview tracking
- Recruiter contacts
- Notes
- Saved filters

## P2
- Notion sync
- AI resume matching
- Analytics
- Watchlists

## Explicitly Excluded
- Gmail integration
- Calendar integration
- AI coach
- Mobile app
- Job discovery
- Team collaboration

# Navigation

- Dashboard
- Applications
- Companies
- Tasks
- Resumes
- Settings

# UX Principles

- Capture before organization.
- Minimize typing.
- One primary action per screen.
- Surface next action.
- Progressive disclosure.

# Friction Risks

- Slow capture
- Parser failures
- Too many required fields
- Confusing pipeline
- Empty dashboard

Mitigation:
- Auto-fill whenever possible.
- Manual edit fallback.
- Simple defaults.

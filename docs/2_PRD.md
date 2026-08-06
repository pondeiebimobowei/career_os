# Product Requirements Document (PRD)

# CareerOS MVP

## 1. Purpose
Build the fastest workflow for capturing, organizing, and executing an active job search.

## 2. Goals
- Eliminate manual job tracking.
- Reduce cognitive load.
- Increase consistent follow-ups.
- Replace spreadsheets for active users.

## 3. Non-Goals
- Job discovery
- Email parsing
- Calendar sync
- AI career coach
- Mobile app

## 4. Target User
Primary: Software engineers with 3–8 years experience actively applying to remote/international roles.

## 5. MVP Scope

### P0
- Authentication
- Browser extension (Tier 1 MVP: LinkedIn, Greenhouse, Lever; Tier 2/3 Expansion: Workday, Ashby, Indeed)
- Automatic job parsing
- Company records
- Job records
- Application pipeline
- Kanban board
- Resume upload
- Tasks & reminders
- Search/filter

### P1
- Interview tracking
- Recruiter contacts
- Notes

### P2
- Notion sync
- AI resume matching
- Analytics
- Company watchlists

## 6. User Stories

### Capture
As a job seeker, I can save a job in one click so I never manually enter job details.

Acceptance:
- Parses supported sites.
- Creates company/job.
- Detects duplicates.

### Manage Pipeline
As a user, I can move applications through stages.

Acceptance:
- Drag-and-drop status.
- History retained.

### Tasks
As a user, I can create follow-up reminders.

Acceptance:
- Due dates.
- Completed state.

### Resume Management
As a user, I can attach resume versions to applications.

Acceptance:
- Upload PDF/DOCX.
- Associate with application.

## 7. Functional Requirements

| Feature | Priority | Acceptance Criteria | Dependencies |
|---|---|---|---|
|Auth|P0|Login/logout/session|Auth provider|
|Extension|P0|Capture supported jobs|Backend API|
|Parser|P0|Extract structured data|Extension|
|Companies|P0|CRUD|Database|
|Jobs|P0|CRUD|Companies|
|Applications|P0|Pipeline management|Jobs|
|Tasks|P0|CRUD reminders|Applications|
|Search|P0|Filter companies/jobs|Database|

## 8. Non-Functional Requirements
- Responsive UI
- <2 second dashboard load
- Strong typing
- Audit logging for status changes
- Secure authentication
- Automatic backups

## 9. Edge Cases
- Unsupported job pages
- Duplicate captures
- Deleted jobs
- Missing salary/location
- Parser confidence too low
- Offline extension

## 10. Success Metrics
- User captures first job within 5 minutes.
- >50% weekly active usage among active job seekers.
- Average jobs captured per active user.
- Repeat extension usage.

## 11. Constraints
- Small engineering team.
- Browser-first.
- No premature microservices.
- AI only where valuable.

## 12. Risks
- Parser maintenance.
- Low retention.
- Spreadsheet inertia.
- Feature creep.

## 13. Future Roadmap
Phase 2:
- Interview tracking
- Contacts
- Notes

Phase 3:
- Resume matching
- Personal insights

Phase 4:
- Gmail
- Calendar
- Automation

Phase 5:
- Career operating system

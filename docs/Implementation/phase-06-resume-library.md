# Phase 06 — Resume Library

**Phase:** 06  
**Name:** Resume Library  
**Status:** Planned  
**Priority:** High  
**Estimated Duration:** 3–4 Weeks  
**Related Milestone:** M6 — Resume Intelligence  
**Related ADRs:** ADR-010, ADR-017, ADR-030, ADR-031, ADR-032, ADR-033

---

# Purpose

The Resume Library is CareerOS's centralized resume management system.

Rather than treating resumes as uploaded files, CareerOS treats them as versioned career assets that can be organized, searched, compared, and associated with job applications.

Every resume should have complete metadata, version history, usage history, and relationships with applications.

The Resume Library establishes the foundation for future AI-powered resume optimization and recommendation features.

---

# Objectives

The Resume Library should allow users to:

- Store multiple resumes
- Upload new resumes
- Create resume versions
- Organize resumes
- Search resumes
- Tag resumes
- Track resume usage
- Associate resumes with applications
- Archive resumes
- Restore archived resumes

---

# Success Criteria

Phase 06 is complete when:

- Multiple resumes are supported.
- Resume versioning works correctly.
- Upload and storage are reliable.
- Resume metadata is searchable.
- Resume usage is tracked.
- Resume relationships with applications are maintained.
- Resume management is production-ready.

---

# High-Level Architecture

```text
Resume Upload

↓

Validation

↓

Storage

↓

Metadata Extraction

↓

Version Management

↓

Resume Library

↓

Search

↓

Application Associations

↓

Analytics
```

Every resume is represented as a domain entity rather than merely a file.

---

# Core Domain Model

```text
Resume

│

├── Metadata

├── Versions

├── Tags

├── File

├── Usage History

├── Applications

└── Activity History
```

---

# Project Structure

```text
resume-library/

controllers/

services/

repositories/

validators/

dtos/

mappers/

tests/
```

---

# Development Order

Implementation should follow:

```text
Resume Entity

↓

File Upload

↓

Storage

↓

Versioning

↓

Metadata

↓

Tagging

↓

Search

↓

Application Relationships

↓

Activity History

↓

Analytics
```

---

# Module 1 — Resume Entity

Implement the primary Resume model.

Attributes include:

- ID
- Name
- Description
- Status
- Default Flag
- Created Date
- Updated Date

The Resume entity is independent of file storage.

---

# Module 2 — File Upload

Support:

- PDF
- DOCX

Responsibilities:

- upload
- validation
- storage
- checksum generation
- duplicate prevention

Uploaded files should be validated before storage.

---

# Module 3 — Storage

Responsibilities:

- persistent storage
- retrieval
- deletion
- download
- archival

Storage implementation should remain abstracted.

---

# Module 4 — Resume Versioning

Every modification creates a new version.

Support:

- version history
- version labels
- restore previous version
- compare versions
- latest version lookup

Previous versions should remain immutable.

---

# Module 5 — Metadata

Store metadata including:

- title
- description
- target role
- target industry
- experience level
- keywords
- creation date

Metadata should support efficient searching.

---

# Module 6 — Tagging

Support custom tags.

Examples:

- Frontend
- Backend
- Full Stack
- React
- Remote
- FinTech

Users should organize resumes without relying solely on filenames.

---

# Module 7 — Search

Support searching by:

- title
- tags
- keywords
- role
- creation date
- updated date

Provide filtering and sorting capabilities.

---

# Module 8 — Resume Associations

Every application may reference:

- one resume version
- one active resume

Relationships should remain historically accurate even when newer versions are created.

---

# Module 9 — Activity History

Record events such as:

- upload
- update
- version creation
- restore
- archive
- delete
- application usage

Activity history integrates with the platform-wide activity system.

---

# Module 10 — Analytics

Track:

- most-used resumes
- interview rate by resume
- response rate
- application count
- active resume distribution

Analytics support future resume optimization.

---

# Default Resume

Users may designate a default resume.

The default resume is used when:

- manually creating applications
- browser extension imports without explicit selection

Only one default resume may exist at a time.

---

# Archiving

Users may archive resumes.

Archived resumes:

- remain searchable (optional)
- remain linked to historical applications
- cannot become default
- are excluded from active selections

No historical relationships are lost.

---

# Duplicate Prevention

Duplicate uploads should be detected using:

- checksum
- filename
- metadata
- file size

Users should be warned before storing duplicate resumes.

---

# File Validation

Validate:

- supported file type
- maximum file size
- corruption
- upload completeness

Invalid files should never be stored.

---

# Security

Ensure:

- user isolation
- authorization checks
- secure file access
- signed download URLs (if applicable)

Users may only access their own resumes.

---

# Performance

Optimize:

- metadata queries
- search
- pagination
- version retrieval

Large resume libraries should remain responsive.

---

# API Endpoints

Representative endpoints include:

```text
GET    /resumes

POST   /resumes

GET    /resumes/:id

PATCH  /resumes/:id

DELETE /resumes/:id

POST   /resumes/:id/archive

POST   /resumes/:id/restore

GET    /resumes/:id/versions

POST   /resumes/:id/versions

GET    /resumes/search
```

API contracts should remain consistent with shared contracts.

---

# User Experience

Users should be able to:

- quickly identify the correct resume
- understand version history
- restore previous versions
- view resume usage
- search efficiently

The Resume Library should reduce organizational overhead.

---

# Accessibility

Support:

- keyboard navigation
- accessible uploads
- focus management
- semantic labels

---

# Testing

Every module requires:

## Unit Tests

- services
- validators
- versioning
- tagging

---

## Integration Tests

Verify:

- uploads
- storage
- associations
- search

---

## End-to-End Tests

Validate:

- upload resume
- create version
- archive resume
- restore resume
- associate with application
- search library

---

# Documentation

Documentation should include:

- upload workflow
- version lifecycle
- storage architecture
- metadata model
- API reference

---

# Dependencies

Phase 06 depends on:

- Phase 01 — Foundation
- Phase 02 — Shared Platform
- Phase 03 — Backend Platform
- Phase 05 — Web Application

---

# Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Duplicate uploads | Medium | Checksum validation |
| Broken historical references | High | Immutable versioning |
| Poor search performance | Medium | Indexed metadata |
| File corruption | Medium | Validation before storage |
| Storage provider changes | Low | Storage abstraction |

---

# Out of Scope

This phase does **not** include:

- AI resume generation
- Resume rewriting
- ATS scoring
- Resume optimization suggestions
- Collaborative editing
- Public resume sharing

These capabilities belong to future phases.

---

# Definition of Done

Phase 06 is complete when:

- Resume uploads work reliably.
- Versioning is operational.
- Metadata is searchable.
- Tags are supported.
- Default resume selection works.
- Resume associations are maintained.
- Activity history is recorded.
- Analytics capture resume usage.
- Unit, integration, and end-to-end tests pass.
- Documentation is complete.

---

# Exit Criteria

Before Phase 07 begins:

- Users can manage multiple resumes confidently.
- Resume history is preserved.
- Applications correctly reference resume versions.
- Resume search and organization are efficient.
- The Resume Library provides a robust foundation for future AI-assisted resume features.

Completion of this phase establishes CareerOS as a comprehensive career asset management platform rather than simply an application tracker.
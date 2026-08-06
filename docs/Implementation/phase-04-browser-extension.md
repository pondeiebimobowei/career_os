# Phase 04 — Browser Extension

**Phase:** 04  
**Name:** Browser Extension  
**Status:** Planned  
**Priority:** Critical  
**Estimated Duration:** 8–10 Weeks  
**Related Milestone:** M4 — Browser Extension MVP  
**Related ADRs:** ADR-041 (Supersedes ADR-008, ADR-013), ADR-014, ADR-015, ADR-016, ADR-021, ADR-030, ADR-031, ADR-032, ADR-033, ADR-034

---

# Purpose

The Browser Extension is the primary data acquisition platform for CareerOS.

Its responsibility is to detect supported job application websites, extract structured application data, normalize it into the CareerOS domain model, prevent duplicate imports, and synchronize it with the backend.

The extension is not responsible for business logic. It acts as a lightweight client that collects, validates, and transmits data.

---

# Objectives

The Browser Extension should:

- Detect supported job platforms
- Extract application data
- Normalize data into the CareerOS domain model
- Prevent duplicate imports
- Synchronize with the backend
- Provide a responsive user interface
- Operate with minimal user interaction
- Remain resilient to website changes

---

# Success Criteria

Phase 04 is complete when:

- Extension installs successfully in supported browsers.
- All supported job platforms are implemented.
- Application imports succeed end-to-end.
- Duplicate detection functions correctly.
- Synchronization is reliable.
- Offline imports are supported.
- Comprehensive parser tests pass.
- Extension package is ready for browser store submission.

---

# High-Level Architecture

```text
Browser

│

▼

Content Scripts

│

▼

Platform Detector

│

▼

Parser Engine

│

▼

Normalization Pipeline

│

▼

Duplicate Detection

│

▼

Storage Queue

│

▼

Background Service

│

▼

Backend API
```

Every layer has a single responsibility.

---

# Project Structure

```text
apps/browser-extension/

src/

background/

content/

popup/

options/

shared/

parsers/

linkedin/

greenhouse/

lever/

workday/

normalizers/

detectors/

storage/

sync/

messaging/

hooks/

components/

lib/

tests/

fixtures/
```

---

# Development Order

Implementation follows dependency order.

```text
Extension Foundation

↓

Storage

↓

Messaging

↓

Platform Detection

↓

Parser Framework

↓

Normalization Pipeline

↓

Duplicate Detection

↓

LinkedIn Parser

↓

Greenhouse Parser

↓

Lever Parser

↓

Workday Parser

↓

Synchronization

↓

Popup UI

↓

Options

↓

Authentication

↓

Analytics

↓

Packaging
```

---

# Module 1 — Extension Foundation

Deliverables:

- WXT configuration
- Manifest V3
- Build pipeline
- Environment configuration
- Development workflow
- Hot reload
- TypeScript
- Tailwind CSS

---

# Module 2 — Background Service

Responsibilities:

- API communication
- Authentication
- Queue processing
- Sync scheduling
- Storage management
- Notifications

The background service coordinates extension behavior.

---

# Module 3 — Content Scripts

Responsibilities:

- DOM access
- Platform detection
- Parser execution
- UI injection
- Event observation

Content scripts should contain minimal business logic.

---

# Module 4 — Storage

Implement storage abstraction.

Support:

- Browser local storage
- Browser sync storage
- IndexedDB (if required)
- Temporary cache

Storage should support offline operation.

---

# Module 5 — Messaging

Implement typed messaging between:

- Content scripts
- Background service
- Popup
- Options page

All messages should use strongly typed contracts.

---

# Module 6 — Platform Detection

Supported platforms:

- LinkedIn
- Greenhouse
- Lever
- Workday

Responsibilities:

- Detect current platform
- Select parser
- Validate page compatibility

Detection should be lightweight and extensible.

---

# Module 7 — Parser Framework

Develop reusable parser infrastructure.

Responsibilities:

- Parser interface
- Parser registry
- Parser lifecycle
- Error handling
- Versioning
- Execution context

New platforms should be added without modifying existing parsers.

---

# Module 8 — Normalization Pipeline

Normalize extracted data into the CareerOS domain model.

Pipeline:

```text
Raw HTML

↓

Extraction

↓

Validation

↓

Normalization

↓

Domain Model

↓

Duplicate Detection

↓

Sync Queue
```

All parsers produce identical output structures.

---

# Module 9 — Duplicate Detection

Prevent duplicate imports using:

- External job ID
- Application URL
- Company
- Position
- Applied date

Support fuzzy matching where necessary.

False positives should be minimized.

---

# Module 10 — LinkedIn Parser

Capabilities:

- Job detection
- Application extraction
- Company extraction
- Status extraction
- Metadata extraction

Parser should tolerate reasonable DOM changes.

---

# Module 11 — Greenhouse Parser

Capabilities:

- Job metadata
- Company
- Location
- Application confirmation
- External identifiers

---

# Module 12 — Lever Parser

Capabilities:

- Position
- Company
- Location
- Application metadata
- Submission confirmation

---

# Module 13 — Workday Parser

Capabilities:

- Job details
- Company
- Application confirmation
- Candidate information

Workday variations should be supported where practical.

---

# Module 14 — Synchronization

Responsibilities:

- Authenticate requests
- Upload applications
- Retry failures
- Resolve conflicts
- Track synchronization status

Synchronization should be resilient to network failures.

---

# Module 15 — Popup UI

Provide:

- Import status
- Recent imports
- Login state
- Sync controls
- Error notifications

Popup should prioritize clarity and speed.

---

# Module 16 — Options Page

Support:

- Account settings
- Sync preferences
- Platform enable/disable
- Debug tools
- Extension information

---

# Module 17 — Authentication

Responsibilities:

- Login flow
- Session persistence
- Token refresh
- Logout

Authentication integrates with the backend API.

---

# Module 18 — Notifications

Support:

- Successful import
- Duplicate detection
- Sync completion
- Errors
- Authentication issues

Notifications should be informative without being intrusive.

---

# Error Handling

Extension should gracefully recover from:

- DOM changes
- Network failures
- Authentication failures
- Invalid data
- Storage failures

Users should receive actionable feedback.

---

# Offline Support

When offline:

- Queue imports locally
- Retry automatically
- Preserve user actions

No application data should be lost.

---

# Performance

Objectives:

- Fast parser execution
- Minimal memory usage
- Minimal CPU usage
- Efficient DOM traversal

The extension should not noticeably impact browsing performance.

---

# Security

Implement:

- Least privilege permissions
- Input validation
- Secure message passing
- Safe storage
- API authentication

Sensitive information should never be exposed to web pages.

---

# Accessibility

Popup and Options pages should support:

- Keyboard navigation
- Screen readers
- Sufficient color contrast
- Focus management

---

# Browser Compatibility

Primary target:

- Google Chrome

Secondary targets:

- Microsoft Edge
- Brave
- Chromium-based browsers

Future support:

- Mozilla Firefox (where Manifest V3 compatibility allows)

---

# Testing

Every parser requires:

## Unit Tests

- Extraction
- Validation
- Normalization

---

## Fixture Tests

Store representative HTML snapshots.

Tests should remain deterministic.

---

## Regression Tests

Protect against DOM changes.

Historical fixtures should remain in the repository.

---

## Integration Tests

Verify:

- Storage
- Messaging
- Synchronization
- Authentication

---

## End-to-End Tests

Validate complete workflows:

- Visit supported site
- Detect platform
- Parse application
- Normalize data
- Upload successfully

---

# Documentation

Each parser includes:

- Supported pages
- Extraction strategy
- DOM assumptions
- Test fixtures
- Known limitations

Parser documentation should evolve alongside implementation.

---

# Dependencies

Phase 04 depends on:

- Phase 01 — Foundation
- Phase 02 — Shared Platform
- Phase 03 — Backend Platform

The Browser Extension is required before the Web Application can provide complete application tracking functionality.

---

# Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Website DOM changes | High | Fixture tests and parser abstraction |
| Browser API changes | Medium | Adapter layer |
| Duplicate imports | High | Multi-stage duplicate detection |
| Network failures | Medium | Offline queue and retries |
| Parser complexity | High | Shared parser framework |

---

# Out of Scope

This phase does **not** include:

- Resume scoring
- Analytics dashboards
- AI-assisted resume improvements
- Browser automation
- Automatic application submission
- Mobile browser support

These belong to future phases.

---

# Definition of Done

Phase 04 is complete when:

- Extension builds successfully.
- All supported parsers are implemented.
- Parser framework is reusable.
- Normalization pipeline is complete.
- Duplicate detection is operational.
- Synchronization is reliable.
- Popup UI is complete.
- Options page is complete.
- Authentication works.
- Offline queue functions correctly.
- Unit, integration, fixture, and end-to-end tests pass.
- Browser store packages can be generated.
- Documentation is complete.

---

# Exit Criteria

Before Phase 05 begins:

- Users can install the extension.
- Supported job platforms are automatically detected.
- Applications are imported accurately.
- Duplicate applications are prevented.
- Data synchronizes successfully with the backend.
- The extension is stable, tested, and ready for production distribution.

Completion of this phase delivers the primary data acquisition engine for CareerOS and establishes the foundation for the web application's user experience.
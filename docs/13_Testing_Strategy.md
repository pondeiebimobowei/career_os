
# CareerOS Testing Strategy

## Purpose

Define a practical, risk-based testing strategy for the MVP that maximizes confidence while keeping execution fast for a small team using AI-assisted development.

---

# Testing Principles

- Test user outcomes, not implementation details.
- Automate high-value, stable scenarios.
- Prefer integration tests over excessive unit tests.
- Every bug gets a regression test.
- Keep CI under 10 minutes.

---

# Testing Pyramid

| Layer | Target | Tooling | Goal |
|---|---|---|---|
| End-to-End | Critical user journeys | Playwright | Confidence before release |
| Integration | API + DB + UI interactions | Vitest | Business logic correctness |
| Unit | Pure functions & utilities | Vitest | Fast feedback |
| Manual | UX, browser extension | Checklists | Human validation |

---

# Scope

## Unit Tests
Test:
- Utility functions
- Parsers
- Validation schemas (Zod)
- Date helpers
- Status transitions
- Permission helpers

Do not unit test:
- UI styling
- Third-party libraries
- Framework behavior

Target: 80% coverage for business logic.

---

## Integration Tests

Validate:
- Authentication flow
- CRUD operations
- Prisma repositories
- File uploads
- Extension capture endpoint
- Search & filtering
- Activity logging

Mock:
- Firebase
- Storage
- AI services

Use a disposable PostgreSQL database.

---

## End-to-End Tests

Critical flows:

1. Sign up
2. Login
3. Create company
4. Capture job
5. Create application
6. Move application through pipeline
7. Create follow-up task
8. Upload resume
9. Logout

Failure states:
- Expired session
- Network failure
- Unsupported job page
- Duplicate capture

---

# Browser Extension Testing

Browsers:
- Chrome (required)
- Edge (recommended)

Validate:
- Injection
- Authentication
- Parser accuracy
- Capture latency
- Duplicate detection
- Unsupported page handling

Maintain sample HTML fixtures for each supported site.

---

# API Testing

Validate:
- Status codes
- Validation errors
- Ownership checks
- Pagination
- Sorting
- Filtering
- Rate limiting

---

# Performance Testing

Targets:
- Dashboard <2s
- Job capture API <500ms (excluding network)
- Search <300ms
- Initial page <2.5s

---

# Accessibility

Use:
- axe
- Lighthouse

Verify:
- Keyboard navigation
- Focus order
- Contrast
- ARIA labels
- Screen reader basics

---

# Cross-Browser

MVP:
- Chrome
- Edge
- Safari (web only)
- Firefox (web only)

Extension:
- Chrome first

---

# Security Testing

Check:
- Authorization
- Input validation
- XSS
- CSRF (if applicable)
- Dependency scanning
- Secret scanning

---

# Regression Strategy

Every production bug:
1. Reproduce
2. Write failing test
3. Fix
4. Verify in CI

---

# CI Pipeline

On every PR:
1. Install
2. Lint
3. Typecheck
4. Unit tests
5. Integration tests
6. Build web
7. Build API
8. Build extension

Nightly:
- E2E
- Lighthouse
- Dependency audit

---

# Test Data

Create reusable fixtures:
- Users
- Companies
- Jobs
- Applications
- Tasks
- Resumes

Never use production data.

---

# Release Checklist

- All CI green
- No critical bugs
- Parser validation complete
- Accessibility review passed
- Performance targets met
- Manual smoke test complete

---

# Bug Severity

Critical:
- Data loss
- Login failure
- Broken capture

High:
- Pipeline unusable
- Upload failure

Medium:
- UI defects
- Analytics issues

Low:
- Copy
- Cosmetic issues

---

# Exit Criteria

Feature is done when:
- Acceptance criteria met
- Tests added
- Documentation updated
- Analytics implemented
- Reviewed and merged

Testing is complete when users can confidently complete the core workflow without manual intervention or data loss.

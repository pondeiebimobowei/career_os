# CareerOS Code Review Guidelines

Version: 1.0  
Status: Approved  
Owner: Engineering

---

# Purpose

This document defines the official code review process for CareerOS.

The objective of code review is **not** to criticize code—it is to improve the product, reduce defects, maintain architectural consistency, and ensure long-term maintainability.

Every change merged into `main` must be reviewed against this document.

This process applies equally to:

- Human contributors
- AI-assisted contributions (Codex, Cursor, Claude Code, etc.)
- External contributors

---

# Code Review Philosophy

Code reviews should answer one question:

> **"Would we be comfortable maintaining this code two years from now?"**

Good code is not just code that works.

Good code is:

- Correct
- Readable
- Maintainable
- Testable
- Secure
- Consistent
- Minimal
- Easy to extend

---

# Core Principles

Every review should optimize for:

- Simplicity over cleverness
- Readability over brevity
- Explicitness over magic
- Maintainability over speed
- Consistency over personal preference

---

# Scope of a Review

A reviewer is responsible for verifying:

- Functional correctness
- Architectural consistency
- Code quality
- User experience impact
- Performance implications
- Security implications
- Accessibility
- Testing
- Documentation
- Future maintainability

A reviewer is **not** responsible for rewriting the author's implementation if it already satisfies these standards.

---

# Review Workflow

```
GitHub Issue
        │
        ▼
Implementation
        │
        ▼
Developer Self Review
        │
        ▼
Pull Request
        │
        ▼
Automated CI
        │
        ▼
Human Review
        │
        ▼
Requested Changes
        │
        ▼
Approval
        │
        ▼
Merge
```

---

# Pull Request Requirements

Every Pull Request must include:

- Linked GitHub Issue
- Summary of changes
- Acceptance criteria checklist
- Testing performed
- Screenshots (if UI changes)
- Known limitations
- Documentation updates (if applicable)

Example:

```
Closes #APP-004

Summary

Implements the Create Application API.

Testing

✓ Unit tests

✓ Integration tests

✓ Manual testing

Acceptance Criteria

✓ Create application

✓ Validation

✓ Error handling

✓ Duplicate prevention
```

---

# Review Checklist

Every Pull Request should be evaluated against the following checklist.

---

# 1. Functional Correctness

Questions:

- Does the feature work?
- Does it satisfy the Issue?
- Does it meet the acceptance criteria?
- Does it introduce regressions?
- Are edge cases handled?

Reject if:

- Requirements are incomplete.
- Behavior is incorrect.
- Business rules are violated.

---

# 2. Architecture

Questions:

- Does this follow the documented architecture?
- Is responsibility placed in the correct layer?
- Are boundaries respected?
- Is business logic leaking into UI?
- Is infrastructure leaking into domain logic?

Reject if:

- Architecture is bypassed.
- Layers are mixed.
- Tight coupling is introduced.

---

# 3. SOLID Principles

Verify:

## Single Responsibility

One class.

One responsibility.

---

## Open/Closed

Can new behavior be added without modifying existing logic?

---

## Liskov Substitution

Can implementations be safely replaced?

---

## Interface Segregation

Are interfaces focused and minimal?

---

## Dependency Inversion

Does high-level logic depend on abstractions rather than implementations?

---

Reject if SOLID violations create future maintenance risks.

---

# 4. DRY (Don't Repeat Yourself)

Look for:

- Duplicate business logic
- Duplicate validation
- Duplicate API handling
- Duplicate UI components
- Duplicate utility functions

Prefer extracting shared behavior when duplication is meaningful.

Do not over-abstract after a single use.

---

# 5. KISS (Keep It Simple)

Questions:

- Is this the simplest solution?
- Is unnecessary complexity introduced?
- Could fewer abstractions achieve the same result?

Avoid:

- Premature optimization
- Generic frameworks for a single use case
- Deep inheritance
- Clever code

---

# 6. Readability

Code should be understandable without additional explanation.

Check:

- Clear naming
- Small functions
- Logical structure
- Consistent formatting
- Minimal nesting

Reject code that requires comments to explain basic logic.

---

# 7. Naming

Names should clearly communicate intent.

Good:

```
createApplication()

ApplicationRepository

ApplicationStatus
```

Bad:

```
handle()

temp()

manager()

data()

utils()
```

---

# 8. Error Handling

Questions:

- Are errors anticipated?
- Are errors surfaced appropriately?
- Are failures recoverable?
- Are user-facing messages meaningful?

Avoid:

```
catch (e) {}
```

or swallowing exceptions.

---

# 9. Validation

Ensure:

- Input validation exists.
- API validation exists.
- Database constraints exist.
- Client-side validation complements—not replaces—server validation.

Never trust client input.

---

# 10. Security

Verify:

- Authorization checks
- Authentication checks
- Input sanitization
- SQL injection prevention
- XSS prevention
- CSRF considerations
- File upload validation
- Secret management

Reject anything that weakens security.

---

# 11. Performance

Questions:

- Unnecessary database queries?
- N+1 queries?
- Excessive re-renders?
- Large bundle impact?
- Expensive computations?
- Missing indexes?

Optimize only when justified by actual usage.

---

# 12. Accessibility

For UI changes verify:

- Keyboard navigation
- Focus management
- Semantic HTML
- ARIA usage where appropriate
- Color contrast
- Screen reader compatibility

Accessibility is a requirement—not a future enhancement.

---

# 13. Testing

Every feature should include appropriate tests.

Review:

- Unit tests
- Integration tests
- API tests
- Component tests
- E2E tests (where applicable)

Reject code with no reasonable test coverage unless explicitly justified.

---

# 14. Documentation

Check whether changes require updates to:

- API documentation
- Architecture docs
- README
- Backlog references
- ADRs
- User-facing documentation

Documentation should evolve with the codebase.

---

# 15. Database Changes

When reviewing schema changes verify:

- Backward compatibility
- Migration safety
- Appropriate indexes
- Foreign keys
- Constraints
- Rollback strategy

Schema changes deserve extra scrutiny.

---

# 16. API Review

Ensure:

- REST conventions are followed.
- Status codes are correct.
- Validation is complete.
- Responses are consistent.
- Error formats are standardized.
- Breaking changes are intentional.

---

# 17. UI Review

Evaluate:

- Visual consistency
- Component reuse
- Responsive behavior
- Empty states
- Loading states
- Error states
- Success feedback
- Accessibility

The UI should feel cohesive across the application.

---

# AI-Generated Code Review

AI-generated code requires the same—or greater—level of scrutiny.

Reviewers should verify:

- No fabricated APIs.
- No unnecessary abstractions.
- No duplicated logic.
- No architectural drift.
- Correct typing.
- Correct dependencies.
- Appropriate error handling.
- Tests are meaningful.
- Generated code is understandable.

Never approve code solely because it "looks correct."

---

# Review Outcomes

## Approve

The implementation satisfies requirements and quality standards.

---

## Approve with Minor Suggestions

Non-blocking improvements can be addressed later.

---

## Request Changes

Blocking issues exist.

Examples:

- Missing validation
- Incorrect architecture
- Security concerns
- Incomplete acceptance criteria
- Missing tests

---

# Reviewer Etiquette

Reviews should be:

- Respectful
- Objective
- Specific
- Actionable
- Focused on the code—not the author

Prefer:

> "This logic could be extracted into a reusable service."

Instead of:

> "This is written badly."

Explain *why* a change is needed.

---

# Author Responsibilities

Before requesting review:

- Run all tests.
- Perform a self-review.
- Remove debugging code.
- Update documentation.
- Rebase onto the latest `main`.
- Ensure the PR is focused and complete.

---

# Pull Request Approval Checklist

Before approving, verify:

- Requirements implemented
- Acceptance criteria satisfied
- Architecture followed
- SOLID respected
- DRY respected
- KISS respected
- Naming consistent
- Validation complete
- Error handling complete
- Security reviewed
- Performance acceptable
- Accessibility maintained
- Tests included and passing
- Documentation updated
- No unrelated changes

---

# Common Reasons for Rejection

Reject Pull Requests that:

- Mix unrelated features
- Ignore acceptance criteria
- Introduce architectural violations
- Duplicate logic unnecessarily
- Lack tests
- Lack validation
- Introduce security risks
- Break existing functionality
- Add premature abstractions
- Increase complexity without justification

---

# Code Review Metrics

Track:

- Review turnaround time
- Average PR size
- Review iterations per PR
- Escaped defects
- Test coverage
- Merge frequency

These metrics help improve the review process—not evaluate individuals.

---

# Golden Rules

1. Review the problem before reviewing the code.
2. Verify acceptance criteria first.
3. Protect the architecture.
4. Favor simplicity.
5. Prefer maintainable solutions over clever ones.
6. Every change should leave the codebase better than it was.
7. AI-generated code is reviewed by the same standards as human-written code.
8. Reject complexity that is not justified.
9. Comments should teach, not criticize.
10. The goal of every review is to improve the product—not to win arguments.
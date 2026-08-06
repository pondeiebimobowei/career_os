
# CareerOS Security & Privacy Specification

## Purpose

This document defines the baseline security, privacy, and data protection requirements for the CareerOS MVP. The goal is to protect user trust while avoiding unnecessary enterprise complexity.

---

# Security Principles

- Secure by default
- Least privilege
- Defense in depth
- Encrypt sensitive data in transit and at rest
- Collect the minimum data necessary
- Audit security-relevant actions
- Privacy by design

---

# Data Classification

## Public
- Marketing pages
- Product documentation

## Internal
- Product analytics
- Operational logs
- Feature flags

## Confidential
- User profiles
- Companies
- Jobs
- Applications
- Tasks
- Notes

## Sensitive
- Resume files
- Cover letters
- OAuth tokens
- Authentication identifiers

Do not store passwords.

---

# Authentication

MVP:
- NestJS JWT & Social OAuth2 Authentication (@nestjs/jwt + Passport)
- Password Hashing (bcrypt / argon2) for local email/password login
- Social OAuth2 Sign-In: Google / Gmail (`passport-google-oauth20`) & GitHub (`passport-github2`)

Backend:
- Validate Google / GitHub OAuth2 tokens/codes server-side before account linking
- Link `googleId` / `githubId` to internal user primary keys in PostgreSQL
- Issue signed NestJS JWT Access Tokens & Refresh Tokens post-authentication
- Never trust client identity without validating bearer token via NestJS `JwtAuthGuard`

Requirements:
- HTTPS only
- Short-lived Access Tokens (15m) + secure HTTP-only Refresh Tokens
- Server-side authorization checks

---

# Authorization

Every resource belongs to one user.

Rules:
- Users access only their own data.
- Validate ownership in every API.
- Deny by default.

Future:
- Teams
- Shared workspaces
- RBAC

---

# Encryption

In Transit
- TLS 1.2+

At Rest
- Managed database encryption
- Encrypted object storage

Secrets
- Environment variables
- Secret manager in production
- Never commit secrets

---

# Browser Extension

Permissions:
- Request only required host permissions
- Minimize extension capabilities

Data Flow:
1. Parse page
2. User confirms capture
3. Send structured payload over HTTPS
4. Store server-side

Never:
- Continuously scrape browsing history
- Track unrelated websites
- Record keystrokes

---

# File Storage

Supported:
- PDF
- DOCX

Checks:
- File size limits
- MIME validation
- Virus scan (future)

Store:
- Metadata in database
- Files in object storage

---

# API Security

Controls:
- Rate limiting
- Input validation
- Zod validation
- Output encoding
- Ownership checks
- Audit logging

Errors:
- Never expose stack traces
- Generic production messages

---

# Database Security

- Prisma ORM
- Parameterized queries
- Foreign key constraints
- Soft delete where appropriate
- Daily backups

Indexes:
- userId
- companyId
- jobId
- applicationId

---

# Logging

Log:
- Authentication events
- Extension failures
- API failures
- Background jobs

Do NOT log:
- Resume contents
- Cover letters
- Tokens
- Authorization headers
- Personal notes

---

# Analytics Privacy

Collect:
- Feature usage
- Anonymous product metrics
- Performance

Do Not Collect:
- Resume text
- Job description bodies
- Personal messages

Allow analytics opt-out where practical.

---

# Privacy Commitments

Users can:
- Export their data
- Delete their account
- Delete uploaded documents

Deletion removes:
- Profile
- Applications
- Tasks
- Documents
- Notes

Backups expire according to retention policy.

---

# Threat Model

Primary Risks:
- Account takeover
- Token theft
- XSS
- CSRF
- Malicious uploads
- Injection attacks
- Extension abuse

Mitigations:
- CSP
- Secure cookies where applicable
- Token verification
- Input sanitization
- Dependency updates
- Automated security scanning

---

# Secure Development

Requirements:
- Pull request review
- CI security checks
- Dependency scanning
- Secret scanning
- Type checking
- Automated tests

---

# Incident Response

Severity Levels:
- Critical
- High
- Medium
- Low

Critical:
- Rotate secrets
- Revoke compromised tokens
- Notify affected users
- Patch immediately
- Postmortem

---

# Compliance Roadmap

MVP:
- Privacy policy
- Terms of service
- Cookie notice
- Data export
- Account deletion

Future:
- GDPR readiness
- SOC 2 preparation
- DPA templates

---

# Backup & Recovery

Database:
- Daily backups
- Point-in-time recovery where available

Files:
- Replicated object storage

Recovery drills:
- Quarterly

---

# Security Checklist Before Launch

- HTTPS everywhere
- Authentication verified
- Authorization tested
- Input validation complete
- Rate limiting enabled
- Error handling reviewed
- Secrets rotated
- Analytics reviewed
- Privacy policy published
- Terms published
- Backups verified
- Monitoring enabled

Security is an ongoing process. Every new feature must include a security and privacy review before release.

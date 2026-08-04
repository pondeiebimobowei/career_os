# CareerOS Analytics & Events Specification

## Purpose
Define the analytics strategy for measuring activation, engagement, retention, and product health during the MVP.

## Guiding Principles
- Track user behavior, not vanity metrics.
- Instrument only events that inform decisions.
- Respect user privacy.
- Version events when schemas change.

## North Star Metric
Weekly Active Job Searchers (WAJS): users who capture or actively manage at least one application in the last 7 days.

## KPI Categories

### Acquisition
- Landing Page Viewed
- Sign Up Started
- Sign Up Completed
- Extension Installed

### Activation
- First Job Captured
- First Application Created
- First Task Created
- First Resume Uploaded

### Engagement
- Job Captured
- Application Status Changed
- Task Completed
- Resume Attached
- Search Performed

### Retention
- Weekly Active User
- Jobs Captured Per Week
- Active Applications
- Return Session (7/30 days)

### Business
- Trial Started
- Subscription Purchased
- Subscription Renewed
- Subscription Cancelled

---

# Event Schema

Common properties:
- event_name
- event_version
- user_id
- session_id
- timestamp
- platform (web|extension)
- app_version

## signup_completed
Properties:
- auth_provider

Success:
- User reaches dashboard.

## extension_installed
Properties:
- browser
- extension_version

## job_capture_started
Properties:
- source
- url_domain

## job_capture_completed
Properties:
- source
- parser_confidence
- duplicate_detected
- duration_ms

## job_capture_failed
Properties:
- source
- failure_reason

Failure reasons:
- unsupported_page
- parse_error
- auth_error
- network_error

## application_status_changed
Properties:
- previous_status
- new_status

## task_created
Properties:
- priority
- due_in_days

## task_completed
Properties:
- completion_time_hours

## resume_uploaded
Properties:
- file_size
- file_type

## search_performed
Properties:
- query_length
- result_count

---

# Funnel

1. Visit Landing
2. Sign Up
3. Install Extension
4. Capture First Job
5. View Dashboard
6. Create First Task
7. Return Within 7 Days

Track conversion between every step.

---

# Dashboards

## Product
- DAU/WAU
- Activation Rate
- Time to First Capture
- Capture Success Rate
- Parser Failure Rate

## Extension
- Installations
- Active Installs
- Supported Source Mix
- Duplicate Rate

## Engagement
- Jobs Captured/User
- Pipeline Distribution
- Tasks Completed
- Resume Attach Rate

## Revenue
- Trial Conversion
- Paid Conversion
- Churn
- MRR

---

# Privacy

Do NOT track:
- Resume contents
- Full job descriptions
- Cover letter text
- Authentication secrets

Hash or anonymize identifiers where possible.

---

# Recommended Stack

MVP:
- PostHog
- Sentry
- Google Search Console
- Plausible (marketing site optional)

---

# Alert Thresholds

- Parser success <95%
- Signup->First Capture <50%
- API errors >2%
- Extension auth failures spike
- WAU drops >20% week-over-week

---

# Review Cadence

Daily:
- Errors
- Parser failures

Weekly:
- Activation
- Retention
- User interviews

Monthly:
- Pricing
- Roadmap
- Funnel optimization

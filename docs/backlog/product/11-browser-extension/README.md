schema_version: CBS-v1.0

domain:
  id: BROWSER_EXTENSION
  name: Browser Extension
  code: EXT
  type: product
  version: 1.0.0

description: >
  The Browser Extension is the primary capture mechanism for CareerOS.
  It enables users to save job opportunities directly from supported job
  boards into CareerOS without manual data entry. The extension focuses
  on fast, reliable capture while remaining maintainable as additional
  platforms are added over time.

objective: >
  Deliver a one-click job capture experience that reduces the time,
  friction, and cognitive load involved in managing job applications.

owner: Product

status: planned

priority: P0

milestone: CAPTURE

dependencies:
  - JOBS
  - COMPANIES
  - APPLICATIONS
  - AUTHENTICATION

success_metrics:
  - id: EXT-001
    metric: capture_success_rate
    target: ">=95%"

  - id: EXT-002
    metric: average_capture_time
    target: "<5 seconds"

  - id: EXT-003
    metric: manual_field_edits
    target: "<10%"

  - id: EXT-004
    metric: duplicate_detection_accuracy
    target: ">=98%"

  - id: EXT-005
    metric: weekly_extension_usage
    target: ">=80% of active users"

subdomains:

  - id: EXT-ARCH
    title: Extension Architecture
    file: architecture.yaml
    description: >
      Overall extension architecture, messaging, storage,
      authentication, and synchronization pipeline.

  - id: EXT-AUTH
    title: Authentication
    file: authentication.yaml
    description: >
      Secure authentication between the extension
      and the CareerOS backend.

  - id: EXT-PARSERS
    title: Parsing Framework
    file: parsers.yaml
    description: >
      Shared parsing engine, extraction pipeline,
      confidence scoring, duplicate detection,
      and normalization across the 3-tier parser roadmap:
      Tier 1 MVP (LinkedIn, Greenhouse, Lever),
      Tier 2 Expansion (Workday, Ashby),
      Tier 3 Backlog (Indeed, Glassdoor, ZipRecruiter).

  - id: EXT-LINKEDIN
    title: LinkedIn Parser
    file: linkedin.yaml
    description: >
      Job extraction support for LinkedIn Jobs.

  - id: EXT-GREENHOUSE
    title: Greenhouse Parser
    file: greenhouse.yaml
    description: >
      Job extraction support for Greenhouse-hosted jobs.

  - id: EXT-LEVER
    title: Lever Parser
    file: lever.yaml
    description: >
      Job extraction support for Lever-hosted jobs.

  - id: EXT-WORKDAY
    title: Workday Parser
    file: workday.yaml
    description: >
      Job extraction support for Workday-hosted jobs.

  - id: EXT-UI
    title: Extension UI
    file: ui.yaml
    description: >
      Popup interface, review screen,
      confirmation flow, and user interactions.

  - id: EXT-SYNC
    title: Synchronization
    file: sync.yaml
    description: >
      Communication between extension and backend,
      offline queue, retries, and conflict handling.

  - id: EXT-TEST
    title: Testing
    file: testing.yaml
    description: >
      Unit, integration, parser validation,
      and browser compatibility testing.

design_principles:

  - One-click capture
  - Manual correction over failed automation
  - Platform-specific parsing isolated from shared logic
  - Deterministic extraction before AI
  - Fail safely
  - Idempotent synchronization
  - Extension should remain lightweight
  - Graceful degradation when parsers fail
  - Easy addition of future job platforms
  - Minimize required permissions

supported_platforms:

  mvp:
    - LinkedIn
    - Greenhouse
    - Lever

  planned:
    - Workday
    - Ashby
    - SmartRecruiters
    - BambooHR
    - iCIMS

future_platforms:
  - Wellfound
  - Indeed
  - ZipRecruiter
  - Glassdoor
  - Dice
  - Company career pages

future_scope:

  - Automatic application status detection
  - Resume recommendation before saving
  - AI-assisted field completion
  - Auto-generated company enrichment
  - Salary normalization
  - Duplicate job recommendations
  - Browser notifications
  - Batch capture
  - Saved searches
  - Job change monitoring
  - Auto-fill support
  - Interview preparation shortcuts

acceptance_tests:

  - User can capture a LinkedIn job with one click.
  - User can review extracted data before saving.
  - Captured job creates Company, Job, and Application records correctly.
  - Duplicate jobs are detected.
  - Extension authenticates securely.
  - Extension functions after browser restart.
  - Failed synchronization retries automatically.
  - Parser failures never crash the extension.
  - Unsupported pages provide clear feedback.
  - User can manually edit extracted information before saving.

notes: >
  This README acts as the catalog for the Browser Extension backlog.
  All implementation details are defined within the individual
  subdomain YAML files. The extension architecture is intentionally
  modular so each supported platform can evolve independently without
  creating an unmaintainable collection of tightly coupled parsers.
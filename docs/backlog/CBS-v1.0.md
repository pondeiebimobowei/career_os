# CareerOS Backlog Specification (CBS) v1.0

This document defines the frozen CBS v1.0 schema.

## Principles

-   Human-readable
-   AI-readable
-   GitHub-compatible
-   Machine-validatable
-   Versioned

## Canonical Top-Level Structure

``` yaml
metadata:
epic:
business_context:
dependencies:
success_metrics:
features:
acceptance_tests:
future_scope:
```

## Metadata

``` yaml
metadata:
  schema: careeros-backlog-v1
  version: 1
  domain: applications
  owner: product
  status: active
```

## Enums

Priority: P0,P1,P2,P3 Estimate: 1,2,3,5,8,13 Issue Types:
task,bug,research,spike,refactor,chore Lifecycle:
DISCOVERY,FOUNDATION,MVP,POST_MVP,V2,FUTURE Milestones:
FOUNDATION,CORE_TRACKER,PRODUCTIVITY,CAPTURE,MVP_POLISH,BETA,POST_MVP,V2

## Issue Template

``` yaml
issues:
- id: APP-001
  title: Create Application API
  type: task
  priority: P0
  estimate: 3
  lifecycle:
    phase: MVP
  implementation:
    layer: backend
  references:
    adr:
      - ADR-003
  automation:
    github: true
  acceptance_criteria:
    - User can create an application
  definition_of_done:
    - CI passing
```

## Validation

-   Unique IDs
-   Valid enums
-   No circular dependencies
-   Acceptance criteria required
-   Definition of done required

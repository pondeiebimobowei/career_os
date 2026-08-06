# PROFILE-001: Onboarding Profile Flow Architecture & Technical Design

## Overview

This specification defines the multi-step onboarding profile architecture for CareerOS. It details the user flow, state machine transitions, field validation schemas, component specs, and REST API contract for capturing user identity, target roles, location preferences, and career goals.

---

## 0. Fundamental Capability-First Architecture Principles

### Backend Architecture (NestJS)
- **Feature Modules**: Backend modules are organized by business capability inside `apps/api/src/modules/` (e.g. `modules/profile/`, `modules/jobs/`, `modules/companies/`). Shared utilities reside in `apps/api/src/shared/`.
- **Pragmatic Layering**: Simple CRUD endpoints use standard NestJS Controller/Service/Repository patterns.
- **Layer Evolution Triggers**: A module evolves internal layers (`presentation/`, `application/`, `domain/`, `infrastructure/`) ONLY when it encounters:
  - Multiple distinct use cases per entity
  - Rich business rules or validation logic
  - External third-party API integrations
  - Multiple data repositories or complex multi-entity transactions
  - Domain event publication
- **No Premature Abstraction**: Simple 50-line CRUD endpoints do not require 17 layers of abstraction; structure scales strictly with domain complexity.

### Frontend Architecture (React / Vite)
- **Feature Boundaries**: Web UI is organized into business features inside `apps/web/src/features/` (e.g., `features/profile/`, `features/dashboard/`).
- **Feature Structure**: Each feature encapsulates its own `components/`, `hooks/`, `api/`, and `types.ts`.
- **Component Reuse Rule**: Build UI components inside the feature directory first. Extract components into shared UI libraries (`@repo/ui` or `src/components/ui/`) ONLY after two or three features genuinely reuse them.
- **UI Focus**: React component architecture emphasizes clean composition, reactivity, and performance rather than backend domain layers.

### Engineering & Refactoring Rule
> **Working code is not a refactoring candidate solely because a better architecture exists.**

Completed features remain untouched in production. Structure evolves organically when a new product requirement explicitly demands additional capability.

### Architecture Evolution Matrix

| Complexity Level | Trigger Scenario | Preferred Architecture Pattern |
| :--- | :--- | :--- |
| **Level 1: Simple CRUD** | Single entity, straightforward DB persistence | Controller → Service → Database Service / Repository |
| **Level 2: Moderate Logic** | Feature-specific business rules & validations | Feature module with internal helper services |
| **Level 3: Rich Domain Model** | Complex business invariants, external integrations | Presentation / Application / Domain / Infrastructure layers |
| **Level 4: Cross-Module Workflows** | Inter-domain side effects, multi-entity flows | Domain Events (`EventDispatcher`) or Saga Orchestrators |
| **Level 5: Shared Infrastructure** | Proven multi-consumer code (2+ apps/packages) | Shared monorepo package (`@repo/ui`, `@repo/database`) |

---

## 1. Multi-Step Onboarding User Flow & State Machine

```text
[ Step 1: Identity & Personal Info ] ──(Valid)──► [ Step 2: Target Role & Seniority ]
               │                                                    │
            (Invalid)                                            (Invalid)
               │                                                    │
               ▼                                                    ▼
   Inline Field Errors                                  Inline Field Errors
                                                                    │
                                                                 (Valid)
                                                                    │
                                                                    ▼
[ Step 4: Summary & Completion ] ◄──(Valid)─── [ Step 3: Location & Work Mode ]
```

### Step Breakdown

- **Step 1: Personal Identity**: Full Name, Professional Bio, Timezone, Avatar URL.
- **Step 2: Target Roles & Seniority**: Primary Role Title (e.g. "Senior Fullstack Engineer"), Target Seniority Level (Entry, Mid, Senior, Lead, Executive), Core Skills tags.
- **Step 3: Location & Work Mode**: Target Locations, Remote Work Preference (Remote Only, Hybrid, Onsite, Open to All), Relocation Willingness boolean.
- **Step 4: Salary & Search Status**: Expected Base Salary (min/max), Currency, Current Search Status (Actively Applying, Open to Offers, Casually Browsing, Not Looking).

---

## 2. Field Schema & Zod Validation Specification

```typescript
import { z } from 'zod';

export const OnboardingStep1Schema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  timezone: z.string().min(1, 'Timezone is required'),
  bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional(),
});

export const OnboardingStep2Schema = z.object({
  targetRole: z.string().min(2, 'Target role is required'),
  seniority: z.enum(['ENTRY', 'MID', 'SENIOR', 'LEAD', 'EXECUTIVE']),
  skills: z.array(z.string()).min(1, 'Select at least one core skill'),
});

export const OnboardingStep3Schema = z.object({
  preferredLocations: z.array(z.string()).min(1, 'Select at least one preferred location'),
  remotePreference: z.enum(['REMOTE_ONLY', 'HYBRID', 'ONSITE', 'OPEN']),
  openToRelocation: z.boolean().default(false),
});

export const OnboardingStep4Schema = z.object({
  minSalary: z.number().positive('Minimum salary must be positive').optional(),
  maxSalary: z.number().positive('Maximum salary must be positive').optional(),
  currency: z.string().default('USD'),
  searchStatus: z.enum(['ACTIVELY_LOOKING', 'OPEN_TO_OFFERS', 'CASUALLY_BROWSING', 'NOT_LOOKING']),
});

export const CompleteOnboardingProfileSchema = OnboardingStep1Schema
  .merge(OnboardingStep2Schema)
  .merge(OnboardingStep3Schema)
  .merge(OnboardingStep4Schema);
```

---

## 3. REST API Contract Specification

### `POST /api/v1/profile/onboarding`

Submits completed onboarding form data and marks profile setup as completed.

**Headers**:
- `Authorization`: `Bearer <jwt_access_token>`
- `Content-Type`: `application/json`

**Request Body**:
```json
{
  "fullName": "Pondei Ebimobowei",
  "timezone": "Africa/Lagos",
  "bio": "Senior Fullstack Engineer specializing in NestJS, React, and AI agents.",
  "targetRole": "Senior Software Engineer",
  "seniority": "SENIOR",
  "skills": ["TypeScript", "NestJS", "React", "PostgreSQL", "Prisma"],
  "preferredLocations": ["Remote", "London", "San Francisco"],
  "remotePreference": "REMOTE_ONLY",
  "openToRelocation": true,
  "minSalary": 120000,
  "maxSalary": 160000,
  "currency": "USD",
  "searchStatus": "ACTIVELY_LOOKING"
}
```

**Response (`201 Created`)**:
```json
{
  "success": true,
  "data": {
    "id": "c1f7b8a0-4e2b-4b1a-9a1b-3c4d5e6f7a8b",
    "userId": "u1f7b8a0-4e2b-4b1a-9a1b-3c4d5e6f7a8b",
    "fullName": "Pondei Ebimobowei",
    "targetRole": "Senior Software Engineer",
    "seniority": "SENIOR",
    "isOnboardingCompleted": true,
    "createdAt": "2026-08-06T12:00:00.000Z",
    "updatedAt": "2026-08-06T12:00:00.000Z"
  }
}
```

---

## 4. UI Architecture & Step Component Specifications

React / Vite component structure in `apps/web/src/features/profile/`:

- `<OnboardingContainer />`: Root wizard layout managing step state (`currentStep: 1..4`).
- `<ProgressHeader currentStep={step} totalSteps={4} />`: Animated progress bar & step title indicator.
- `<Step1IdentityForm />`: Name, bio, timezone input fields.
- `<Step2RoleForm />`: Target role combobox, seniority selector pills, skills multi-select tag input.
- `<Step3LocationForm />`: Preferred locations tag input, remote preference radio group, relocation toggle.
- `<Step4SearchStatusForm />`: Salary range slider/inputs, search status selector, submit action button.

---

## Acceptance Criteria Verification

- [x] Multi-step onboarding flow designed and documented
- [x] Visible progress indicator specified (`ProgressHeader`)
- [x] Comprehensive Zod validation rules defined for each step
- [x] Mobile responsive UI layout specifications defined

# CareerOS

**CareerOS** is an AI-native Job Application Operating System designed to streamline job searching, application tracking, resume management, and automated job capture via a browser extension.

---

## 🏗️ Workspace Architecture

CareerOS is structured as a **pnpm + Turborepo** monorepo containing the following applications and packages:

### Applications (`apps/`)

- **`apps/api`**: [NestJS](https://nestjs.com/) backend API service managing jobs, applications, resumes, and user accounts with PostgreSQL & Prisma.
- **`apps/web`**: [React (Vite)](https://vitejs.dev/) modern single-page application dashboard styled with TailwindCSS.
- **`apps/extension`**: Manifest V3 Chrome Browser Extension for one-click job capture from LinkedIn, Greenhouse, Lever, and Workday.

### Shared Packages (`packages/`)

- **`@repo/backlog-cli`** (`packages/backlog-cli`): CLI tool for managing and validating the single source-of-truth YAML backlog (`pnpm backlog:...`).
- **`@repo/ui`** (`packages/ui`): Shared React UI component library.
- **`@repo/logger`** (`packages/logger`): Isomorphic logging utility.
- **`@repo/eslint-config`** (`packages/config-eslint`): Shared ESLint configuration rules.
- **`@repo/typescript-config`** (`packages/config-typescript`): Base TypeScript `tsconfig.json` configurations.
- **`@repo/jest-presets`** (`packages/jest-presets`): Shared testing presets.

---

## 🚀 Quick Start

### Prerequisites

- **Node.js**: `>= 18.0.0`
- **pnpm**: `8.15.6` (enforced via `packageManager`)

### Installation & Development

```sh
# Install dependencies
pnpm install

# Run all apps in development mode
pnpm dev

# Run type checks across all packages
pnpm check-types

# Run tests
pnpm test

# Format code with Prettier
pnpm format
```

---

## 📋 Backlog & Development Workflow

CareerOS utilizes a schema-validated YAML backlog as the single source of truth (`docs/backlog/`):

```sh
# Validate backlog integrity & schema
pnpm backlog:validate

# Run diagnostic health check
pnpm backlog:doctor

# Sync backlog items with GitHub Issues
pnpm backlog:sync
```

---

## 📚 Documentation

Detailed documentation and Architecture Decision Records (ADRs) are located in the [`docs/`](docs/) directory:

- [Product Brief](docs/1_Product_Brief.md) & [PRD](docs/2_PRD.md)
- [Technical Requirements Document (TRD)](docs/5_Technical_Requirements_Document.md)
- [Database & Backend Schema](docs/6_Database_and_Backend_Schema.md)
- [Browser Extension Architecture](docs/7_Browser_Extension_Architecture.md)
- [Frontend Architecture](docs/8_Frontend_Architecture.md)
- [Architecture Decision Records (ADRs)](docs/adr/)
- [Engineering Playbook](docs/engineering/engineering-playbook.md)


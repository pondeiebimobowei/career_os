# Changelog - @repo/backlog-cli

All notable changes to the **CareerOS Development Platform CLI** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-08-06

### Status: Frozen 🧊

The CareerOS Development Platform is formally declared **v1.0 Frozen**.

#### Permitted Changes Going Forward:
- Bug fixes
- Performance improvements
- GitHub API compatibility updates
- CBS schema versioning & maintenance

*No new platform features will be added unless required by CareerOS product execution.*

---

### Added

- **CBS v1.0 Schema Engine**:
  - Full Zod and TypeScript schema definitions for CBS v1.0 specifications (`cbs.ts`, `zod.ts`).
  - Catalog and workspace YAML parser (`loader.ts`, `validator.ts`, `file-discovery.ts`).
- **Validation Engine (`pnpm backlog:validate`)**:
  - Validates epic, feature, issue IDs for uniqueness, milestone validity, priority formats (P0-P3), and non-circular dependency graphs.
- **GitHub Synchronization (`pnpm backlog:sync`)**:
  - Idempotent label sync (`priority:P0-P3`, domain tags).
  - Milestone creation and issue synchronization with formatted Markdown issue bodies.
  - GitHub Projects V2 status column mapping support.
- **Developer Workflow Automation**:
  - `pnpm backlog:next`: Task recommendation algorithm scoring priority, unblocked dependency status, and fast-flow estimates. Added `--json` output mode for AI agent context injection.
  - `pnpm backlog start <id>`: Automates feature branch naming (`feature/<id>-<slug>`) and `git checkout -b`.
  - `pnpm backlog pr <id>`: Generates Pull Request title, description, issue linkage, and acceptance criteria checklist.
- **Documentation & Reporting (`pnpm backlog:docs`)**:
  - Automatically builds live synchronized Markdown reports (`docs/backlog-report.md`).
- **CI/CD Integration**:
  - Continuous integration workflow ([.github/workflows/backlog.yml](file:///Users/user/Downloads/code/project/career_os/.github/workflows/backlog.yml)) enforcing validation and Vitest test suite on PRs.

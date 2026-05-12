# Open-Source Standards Improvement Plan

## Context

The `keypress-notifications` VS Code extension repo already has a solid foundation but is missing several community-health and automation files that top open-source VS Code extension repos (prettier-vscode, GitLens, microsoft/vscode-pull-request-github) consistently provide.

This plan implements **Option B (Full Community Standard) + Option C (Stretch Polish)** to make the repo best-in-class: actively maintained, low contribution friction, and instantly usable in cloud dev environments.

**License confirmed: MIT** (fixing README badge inconsistency).

---

## Implementation Checklist

### Step 0 — Plan document

- [x] Create `plan.md` in repo root (this file)

### Step 1 — Fix README inconsistencies

- [x] Replace `License: Proprietary` badge → `License: MIT` (links to `LICENSE`)
- [x] Bump version badge `1.0.0` → `2.0.0` (matches `package.json`)
- [x] Add GitHub Actions CI status badge (links to `main.yml` workflow)
- [x] Add Marketplace badges: installs, rating, last-updated (shields.io)
- [x] Add Codecov coverage badge
- [x] Add "Open in GitHub Codespaces" badge/button
- [x] Add contributors section (`all-contributors` markers)
- [x] Fix license footer text: "Proprietary" → "MIT"

### Step 2 — Issue templates + PR template (Option B)

- [x] `.github/ISSUE_TEMPLATE/bug_report.yml` — structured bug report form
- [x] `.github/ISSUE_TEMPLATE/feature_request.yml` — feature request form
- [x] `.github/ISSUE_TEMPLATE/config.yml` — chooser config, disable blank issues
- [x] `.github/PULL_REQUEST_TEMPLATE.md` — PR description scaffold

### Step 3 — Community automation (Option B)

- [x] `.github/FUNDING.yml` — GitHub Sponsors button
- [x] `.github/release.yml` — auto release-notes categorization
- [x] `.github/labels.yml` — canonical label definitions
- [x] `.github/workflows/stale.yml` — auto-close stale issues/PRs
- [x] `.github/workflows/labels-sync.yml` — sync labels from `labels.yml`

### Step 4 — Proper Release workflow (Option B)

- [x] `.github/workflows/release.yml` — tag-triggered: build → package VSIX → GitHub Release + Marketplace publish
- [x] Remove `deploy` job from `.github/workflows/main.yml`

### Step 5 — Coverage reporting (Option B)

- [x] Add `c8` dev dependency to `package.json`
- [x] Add `test:unit:coverage` script to `package.json`
- [x] Add coverage upload step to `main.yml` (Codecov)
- [x] Add Codecov badge to `README.md` (covered in Step 1)

### Step 6 — Third-party notices (Option B)

- [x] Create `THIRDPARTY.md` with key dev dependency licenses

### Step 7 — Fix CONTRIBUTING.md (Option B)

- [x] Remove references to `npm run test:dev` (not in `package.json`)
- [x] Remove references to `npm run test:manual` (not in `package.json`)
- [x] Align with actual script set

### Step 8 — Dev Containers / Codespaces (Option C)

- [x] `.devcontainer/devcontainer.json` — Node 20, npm ci, pre-install extensions
- [x] `.devcontainer/Dockerfile` — with xvfb for E2E tests

### Step 9 — GitHub Copilot instructions (Option C)

- [x] `.github/copilot-instructions.md` — distilled architecture brief from `CLAUDE.md`

### Step 10 — all-contributors setup (Option C)

- [x] `.all-contributorsrc` — project config
- [x] `.github/workflows/all-contributors.yml` — bot workflow
- [x] Add `all-contributors-cli` to dev dependencies

---

## Critical Files Modified

| File                         | Change                                                        |
| ---------------------------- | ------------------------------------------------------------- |
| `README.md`                  | Badge fixes, new badges, contributors section, license footer |
| `.github/workflows/main.yml` | Remove deploy job, add coverage upload                        |
| `package.json`               | Add `c8` devDep, add `test:unit:coverage` script              |
| `.github/CONTRIBUTING.md`    | Fix broken script references                                  |
| `.github/SECURITY.md`        | Update supported versions to v2.x                             |

## Critical Files Created

| File                                         | Purpose                    |
| -------------------------------------------- | -------------------------- |
| `.github/ISSUE_TEMPLATE/bug_report.yml`      | Structured bug report      |
| `.github/ISSUE_TEMPLATE/feature_request.yml` | Feature request form       |
| `.github/ISSUE_TEMPLATE/config.yml`          | Issue chooser config       |
| `.github/PULL_REQUEST_TEMPLATE.md`           | PR description template    |
| `.github/FUNDING.yml`                        | GitHub Sponsors button     |
| `.github/release.yml`                        | Release notes categories   |
| `.github/labels.yml`                         | Issue/PR label definitions |
| `.github/workflows/stale.yml`                | Stale issue automation     |
| `.github/workflows/labels-sync.yml`          | Label sync automation      |
| `.github/workflows/release.yml`              | Tag-triggered release      |
| `THIRDPARTY.md`                              | Third-party attributions   |
| `.devcontainer/devcontainer.json`            | Codespaces config          |
| `.devcontainer/Dockerfile`                   | Dev container image        |
| `.github/copilot-instructions.md`            | Copilot context            |
| `.all-contributorsrc`                        | Contributors config        |
| `.github/workflows/all-contributors.yml`     | Contributors bot           |

---

## Verification

1. **README** — all badges resolve, license shows MIT, contributors section renders
2. **Issue templates** — GitHub "New Issue" shows chooser with Bug + Feature options, blank issues disabled
3. **PR template** — opening a draft PR pre-fills the template body
4. **CI** — `main.yml` passes without the deploy job; coverage artifact generated
5. **Coverage** — `npm run test:unit:coverage` produces `coverage/lcov.info`
6. **Release** — workflow YAML validates; do NOT push a tag during review
7. **Labels** — manually trigger `labels-sync.yml` to verify sync
8. **Stale bot** — trigger manually via `workflow_dispatch` to confirm dry-run output
9. **Codespaces** — `devcontainer.json` opens cleanly in VS Code's Dev Container extension

---

## Manual Step Required After Merge

> **Enable GitHub Discussions**: Go to repo Settings → Features → check "Discussions". This cannot be done via a file — it requires the repo owner to click it in the GitHub UI. Once enabled, the issue template `config.yml` will link there correctly.

# Changelog

All notable changes to this project will be documented in this file.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
Versioning: [Semantic Versioning](https://semver.org/)

---

## [Unreleased]

## [0.2.0] — 2026-03-01

### Added
- **Interactive checklist mode** — every workflow node is now checkable; state persists to `localStorage` per project
- **Per-project namespacing** — `?project=<name>` URL param isolates checklist state; click the project badge in the navbar to switch
- **"Copy Context" button** (navbar) — generates a structured markdown block with active stage, completed steps, and next action; paste at the start of any Claude session to restore context instantly
- **Reset button** (navbar) — clears checklist for the current project after confirmation
- **Stage completion indicators** — green ✓ icons appear on StageNav tabs when all nodes in that stage are done
- **Progress counter** — `done/total` badge on each WorkflowSection header, turns green on completion
- `src/data/workflow.ts` — canonical node manifest (29 nodes × 5 stages); single source of truth for IDs and labels
- `src/hooks/useChecklist.ts` — checklist state management with `localStorage` persistence and `generateContext(activeStage)` for session bootstrap
- **Dark mode toggle** — Sun/Moon button in navbar; reads OS preference on first load, persists to `localStorage`; full dark variant pass across all surfaces

### Fixed
- Moved `react` and `react-dom` from `peerDependencies` to `dependencies` (correct for app, not library)
- Removed unused MUI (`@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled`) — ~300KB bundle reduction
- Added `preview` and `lint` scripts to `package.json`
- Renamed package from `@figma/my-make-file` to `ai-workflow`; bumped version to `0.1.0`

### Changed
- README updated with live deploy URL and corrected Week 1 roadmap status

### Added
- `docs/PRD.md` — product requirements document
- `docs/ARCHITECTURE.md` — system design and key decisions
- `docs/ROADMAP.md` — 4-week sprint + 3-month milestone plan
- `docs/DECISIONS_LOG.md` — architecture decision records (ADRs 001–005)
- `.github/ISSUE_TEMPLATE/feature.md` — feature request template
- `.github/ISSUE_TEMPLATE/bug.md` — bug report template
- `.github/pull_request_template.md` — PR review template
- `CHANGELOG.md` — this file
- `.env.example` — environment variable reference
- `CONTRIBUTING.md` — development workflow guide
- Updated `README.md` with 30-second pitch, stack table, structure, and roadmap link

---

## [0.1.0] — 2026-02-27 (Initial prototype)

### Added
- React + Vite + TypeScript project scaffold (Figma Make export)
- 5-layer animated workflow diagram (Strategy / Architecture / Build Loop / Hardening / Signal)
- Governance side panel with 6 operating rules
- Print-to-PDF with landscape/portrait orientation toggle
- `ConnectionArrow` animated section connectors
- `WorkflowSection` reusable panel component
- `Node` and `ToolNode` workflow step components
- Full shadcn/ui component library (Radix UI foundation)
- Framer Motion entrance animations with staggered delays
- `ATTRIBUTIONS.md` noting shadcn/ui MIT license

### Known issues
- `react` and `react-dom` incorrectly listed as `peerDependencies` (should be `dependencies`)
- MUI (`@mui/material`, `@emotion/*`) installed but unused — adds ~300KB to bundle
- No TypeScript config file (`tsconfig.json`) — implicit Vite defaults
- No linting or formatting config
- No tests
- No deployment pipeline
- Mobile horizontal overflow on viewports < 1024px

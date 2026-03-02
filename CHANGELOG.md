# Changelog

All notable changes to this project will be documented in this file.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
Versioning: [Semantic Versioning](https://semver.org/)

---

## [0.3.0] — 2026-03-02

### Added
- **Layer 1 — AI Production OS poster** (`/`): full visual redesign. Dark-first (#0d0f12), DM Serif Display + JetBrains Mono typography. 5 phase columns derived from `phases.ts` — each with tools + purpose, acceptance criteria, output artifacts. Framer Motion staggered reveal. A3 print-ready.
- **Layer 2 — Execution Layer** (private, access-key gated):
  - `/dashboard` — Sprint control plane: 3-column board (active / parked / frozen), WIP limit enforcement (modal at 3 active), today's focus field persisted per repo, all-repo index
  - `/projects/:id` — Per-project phase walkthrough: clickable phase strip, checkable acceptance criteria (localStorage), editable sprint goal, manual changelog
  - `/sprint` — Weekly planning: 4-step flow (repo status → goals → outcomes → lock); Friday review with shipped/rolled-over toggle and copy-paste summary
  - `/daily` — Daily 10-step checklist: sequential unlock, progress bar, midnight auto-reset, completion screen
- **`PrivateGuard`**: client-side access control via PIN modal or `?key=` URL param; session persisted in `sessionStorage`
- **`src/data/repos.ts`**: 10-repo registry — status, phase, sprint goal, stack, monetization, strategic role
- **`src/data/phases.ts`**: 5 OS phases — tools, acceptance criteria, outputs, hex color per phase
- **`src/vite-env.d.ts`**: `ImportMetaEnv` type for `VITE_ACCESS_KEY`
- Google Fonts: DM Serif Display + JetBrains Mono loaded via `index.html`

## [Unreleased]

### Fixed
- **Theme toggle**: OS-level preference changes now update the theme in real time when the user has not set an explicit override (adds `matchMedia` change listener to `useTheme`)
- **Dark-mode contrast**: Navbar interactive text (`dark:text-gray-500` → `dark:text-gray-400`) now meets WCAG AA contrast ratio on the `dark:bg-gray-900` surface
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

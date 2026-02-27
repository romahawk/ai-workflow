# Sprint Backlog — Week 1 + 2
## AI × Leverage Framework

**Generated:** 2026-02-27
**Sprint goal:** App is live, credible, and clean.

Copy these as GitHub Issues. Apply labels as listed.

---

## Issue #1 — [chore] Fix package.json: move React to dependencies

**Label:** `chore`
**Size:** XS
**Priority:** 1 (blocks clean install in some environments)

**Description:**
`react` and `react-dom` are listed as `peerDependencies` in `package.json`. For an application (not a library), they must be in `dependencies`. This can cause install failures with npm workspaces and some deployment environments.

**Acceptance Criteria:**
- [ ] `react` and `react-dom` moved from `peerDependencies` to `dependencies`
- [ ] `peerDependencies` and `peerDependenciesMeta` blocks removed
- [ ] `npm install && npm run build` succeeds cleanly

---

## Issue #2 — [chore] Remove MUI and emotion dependencies

**Label:** `chore`
**Size:** S
**Priority:** 2 (bundle bloat, unused code)

**Description:**
`@mui/material`, `@mui/icons-material`, `@emotion/react`, and `@emotion/styled` are installed but unused in the current application. Combined they add approximately 300KB to the bundle. Removing them reduces bundle size and eliminates a redundant UI framework.

**Acceptance Criteria:**
- [ ] All four MUI/emotion packages uninstalled
- [ ] `npm run build` still passes
- [ ] No references to `@mui/*` or `@emotion/*` in source files
- [ ] Bundle size is measurably smaller (verify with `npm run build` output)

---

## Issue #3 — [chore] Add tsconfig.json

**Label:** `chore`
**Size:** XS
**Priority:** 3 (enables IDE TypeScript support)

**Description:**
The project has no explicit `tsconfig.json`. Vite uses implicit TypeScript defaults but without a config file, IDE support (path aliases, strict mode) is degraded. Add a standard Vite+React tsconfig.

**Acceptance Criteria:**
- [ ] `tsconfig.json` present at project root
- [ ] Path alias `@` → `./src` configured in both `tsconfig.json` and `vite.config.ts`
- [ ] `strict: true` enabled
- [ ] `npm run build` passes with no new type errors

---

## Issue #4 — [chore] Add lint and preview scripts to package.json

**Label:** `chore`
**Size:** XS
**Priority:** 4

**Description:**
`package.json` only has `dev` and `build` scripts. Add `lint` (ESLint) and `preview` (Vite preview server) scripts so the development workflow is complete. ESLint config will be added in Issue #5.

**Acceptance Criteria:**
- [ ] `npm run preview` starts Vite preview server
- [ ] `npm run lint` runs ESLint (can install ESLint as part of this issue)
- [ ] Both scripts exit 0 on clean code

---

## Issue #5 — [chore] Add ESLint and Prettier configuration

**Label:** `chore`
**Size:** S
**Priority:** 5

**Description:**
No linting or formatting is configured. Add ESLint with TypeScript and React rules, and Prettier for consistent formatting. Run formatter across all existing source files.

**Acceptance Criteria:**
- [ ] `eslint.config.js` (or `.eslintrc.js`) present with `@typescript-eslint/recommended` and `react` rules
- [ ] `.prettierrc` present
- [ ] All existing `.ts` and `.tsx` files formatted with Prettier
- [ ] `npm run lint` exits 0 on current codebase

---

## Issue #6 — [chore] Deploy to Vercel

**Label:** `chore`, `infrastructure`
**Size:** S
**Priority:** 6 (CRITICAL — "if not deployed, it doesn't count")

**Description:**
The app has no public deploy. Connect the GitHub repo to Vercel, configure SPA routing (all paths → `index.html`), and confirm the app is live at a public URL.

**Acceptance Criteria:**
- [ ] App is accessible at a public Vercel URL
- [ ] SPA routing works (direct URL access to any route works)
- [ ] Push to `main` triggers automatic redeploy
- [ ] No build errors in Vercel deploy log
- [ ] Deploy URL added to README.md

---

## Issue #7 — [docs] Update README with deploy link and screenshot

**Label:** `docs`
**Size:** XS
**Priority:** 7 (depends on Issue #6)

**Description:**
Update README.md to include the live Vercel URL, a screenshot of the deployed app, and verify all existing sections are accurate.

**Acceptance Criteria:**
- [ ] README contains live deploy URL
- [ ] README contains at least one screenshot or preview image
- [ ] Setup instructions are accurate (tested from scratch)

---

## Issue #8 — [fix] Resolve mobile horizontal overflow

**Label:** `bug`
**Size:** S
**Priority:** 8

**Description:**
On viewports narrower than 1024px, the 5-column `min-w-max` layout causes horizontal overflow and a scrollbar. The app should scroll gracefully on mobile rather than breaking layout.

**Acceptance Criteria:**
- [ ] No horizontal overflow on 375px viewport (iPhone SE)
- [ ] Workflow sections are still readable on mobile (single column or scrollable row)
- [ ] Desktop layout unchanged
- [ ] Print layout unchanged

---

## Issue #9 — [chore] Audit and prune unused shadcn/ui components

**Label:** `chore`
**Size:** M
**Priority:** 9

**Description:**
~30 shadcn/ui components are installed as boilerplate but most are unused. Audit which components from `src/app/components/ui/` are actually imported anywhere in the app. Remove unused ones to reduce bundle size and code surface area.

**Acceptance Criteria:**
- [ ] Audit complete: list of used vs unused components documented
- [ ] All unused components removed from `src/app/components/ui/`
- [ ] Corresponding unused `@radix-ui/*` packages uninstalled
- [ ] `npm run build` passes after cleanup
- [ ] No runtime errors after cleanup

---

## Issue #10 — [chore] Remove or integrate ImageWithFallback component

**Label:** `chore`
**Size:** XS
**Priority:** 10

**Description:**
`src/app/components/figma/ImageWithFallback.tsx` was generated by Figma Make but is not used anywhere in the current application. Either remove it or document why it's kept.

**Acceptance Criteria:**
- [ ] Component either removed (if unused) or imported and used
- [ ] `src/app/components/figma/` directory cleaned up or removed

---

## Issue #11 — [feature] Add GitHub Actions CI workflow

**Label:** `feature`, `infrastructure`
**Size:** S
**Priority:** 11 (Week 4)

**Description:**
Add a GitHub Actions workflow that runs on every PR: install dependencies, lint, and build. This ensures no broken code reaches `main`.

**Acceptance Criteria:**
- [ ] `.github/workflows/ci.yml` present
- [ ] Workflow triggers on `pull_request` to `main`
- [ ] Runs: `npm install`, `npm run lint`, `npm run build`
- [ ] Workflow passes on a clean PR
- [ ] Failing lint or build causes workflow to fail (blocks merge)

---

## Issue #12 — [docs] Write CONTRIBUTING.md

**Label:** `docs`
**Size:** XS
**Priority:** 12

**Description:**
Add `CONTRIBUTING.md` with branch naming, commit message rules, PR process, and governance rules.

**Acceptance Criteria:**
- [ ] `CONTRIBUTING.md` present at project root
- [ ] Branch naming convention documented
- [ ] Commit message format documented with examples
- [ ] PR checklist documented
- [ ] Governance rules listed

---

## Suggested Label Set

Create these labels in your GitHub repo:

| Label | Color | Description |
|-------|-------|-------------|
| `feature` | `#0075ca` | New functionality |
| `bug` | `#d73a4a` | Something is broken |
| `chore` | `#e4e669` | Tooling, deps, config |
| `docs` | `#0052cc` | Documentation only |
| `infrastructure` | `#5319e7` | Deploy, CI/CD, hosting |
| `refactor` | `#fbca04` | Code restructure, no behavior change |

---

## Suggested Issue Order

```
Week 1: #1 → #2 → #3 → #4 → #6 → #7
Week 2: #5 → #8 → #9 → #10 → #12 → #11
```

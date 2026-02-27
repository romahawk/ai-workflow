# Roadmap
## AI × Leverage Framework — Visual Workflow Reference

**Last updated:** 2026-02-27
**Current phase:** Pre-production (Figma export → production-grade)

---

## Guiding Principle

> "If not deployed, it doesn't count."

Every week must end with a deployed, publicly accessible change. No exceptions.

---

## Next 4 Weeks (Weekly Outcomes)

### Week 1 — Deploy & Stabilize
**Outcome:** The app is live at a public URL. Anyone can open it, print it, share it.

**Issues:**
1. Fix `package.json`: move `react` + `react-dom` from `peerDependencies` to `dependencies`
2. Remove MUI (`@mui/material`, `@emotion/*`, `@mui/icons-material`) — unused, adds ~300KB
3. Add `tsconfig.json` (Vite default config is implicit; make it explicit)
4. Add `npm run lint` and `npm run preview` scripts to `package.json`
5. Deploy to Vercel: connect repo, configure SPA routing, confirm public URL
6. Update README with deploy link, screenshot, 30-second pitch

**Definition of Done:**
- [ ] `npm run build` exits 0 with no type errors
- [ ] App is live at a public Vercel URL
- [ ] README contains the live URL and a screenshot
- [ ] No MUI packages in `node_modules`

**Demo artifact required:** Screenshot of deployed app in browser + print preview PDF

---

### Week 2 — Quality & Docs
**Outcome:** The repo is credible to any technical reviewer. Clean code, clean docs, clean git history.

**Issues:**
1. Add ESLint config (`eslint.config.js` with `@typescript-eslint/recommended`)
2. Add Prettier config (`.prettierrc`) and format all source files
3. Fix `Home.tsx` mobile overflow (`min-w-max` container causes horizontal scroll on small viewports)
4. Extract inline print `<style>` tag to `src/styles/print.css`
5. Remove unused shadcn/ui components (audit which of the 30+ are actually used)
6. Add `src/app/components/figma/ImageWithFallback.tsx` deletion or integration

**Definition of Done:**
- [ ] `npm run lint` exits 0
- [ ] No unused components in `src/app/components/ui/`
- [ ] Mobile viewport (375px) shows no horizontal overflow
- [ ] All docs complete: PRD, ARCHITECTURE, ROADMAP, DECISIONS_LOG

**Demo artifact required:** Loom walkthrough of the codebase structure (2–3 min)

---

### Week 3 — Signal Feature
**Outcome:** Add one visible "proof-of-work" enhancement that demonstrates engineering craft.

**Candidate features (pick ONE):**
- A. **Dark mode toggle** — demonstrates Tailwind theming, system preference detection
- B. **Interactive checklist mode** — nodes become checkable; state persists in localStorage
- C. **Shareable config** — URL hash encodes which nodes are checked (no backend)

**Recommended:** Option B (interactive checklist) — most useful, demonstrates React state management

**Issues:**
1. Research and spec chosen feature (GitHub Issue with acceptance criteria)
2. Implement feature
3. Write first meaningful test (Vitest + React Testing Library for the new feature)
4. Update CHANGELOG.md with v0.2.0 entry

**Definition of Done:**
- [ ] Feature deployed to production
- [ ] At least 1 test passing for the new feature
- [ ] CHANGELOG.md updated
- [ ] PR description follows template

**Demo artifact required:** Screen recording of the new feature in action

---

### Week 4 — Hardening & Analytics
**Outcome:** The app is production-hardened. Performance measured, errors monitored, usage tracked.

**Issues:**
1. Run Lighthouse audit; address any score below 80
2. Add PostHog (or Plausible) analytics — 1 tracking call: page load event
3. Add error boundary component wrapping `<App />`
4. Add `robots.txt` and `sitemap.xml` for SEO discoverability
5. Add GitHub Actions CI: on PR, run `npm run build` and `npm run lint`
6. Write CONTRIBUTING.md

**Definition of Done:**
- [ ] Lighthouse Performance ≥ 90 on deployed URL
- [ ] Analytics event fires on page load (verified in analytics dashboard)
- [ ] CI passes on a test PR
- [ ] `robots.txt` present in `public/`

**Demo artifact required:** Lighthouse report screenshot + analytics dashboard showing first event

---

## Next 3 Months (Milestones)

### Month 2 — Capability Expansion
**Goal:** The app becomes a customizable reference, not just a fixed diagram.

- Extract section data from `Home.tsx` into `src/data/workflow.ts` config
- Add a second route: `/print` — print-optimized view without nav chrome
- Add keyboard navigation for workflow sections
- Introduce Vitest + React Testing Library; get coverage to 40%
- Create a case study blog post / README section: "How I built this in 4 weeks"

### Month 3 — Portfolio Amplification
**Goal:** The repo is a public proof-of-work that drives inbound interest.

- Add `/docs` route — in-app documentation viewer (MDX or static HTML)
- Create v1.0 GitHub Release with changelog and assets
- Build a "fork and customize" one-click template (GitHub Template Repository)
- Record a 5-minute Loom demo for use in portfolio/job applications
- Optional: Submit to Product Hunt as an open-source tool

---

## Freeze List (What Won't Be Touched)

These are explicitly out of scope until Month 3 at the earliest:

- **Backend / API** — no server, no database
- **User authentication** — static tool, no accounts
- **Custom workflow builder UI** — diagram is read-only
- **i18n / localization** — English only
- **Native mobile app** — web is sufficient
- **Framework migration** (e.g., Next.js) — Vite + React Router handles all current needs
- **Storybook** — overhead not justified for this component count

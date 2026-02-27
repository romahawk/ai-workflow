# Product Requirements Document (PRD)
## AI × Leverage Framework — Visual Workflow Reference

**Version:** 1.0
**Status:** MVP Definition
**Last updated:** 2026-02-27

---

## Problem

Solo founders and independent engineers operating in remote-first environments lack a single, printable, visual reference that captures a production-grade AI-augmented development workflow. They either rely on scattered notes, proprietary frameworks locked in paid tools, or abstract methodology docs with no visual clarity.

There is no canonical, deployable, open artifact that shows **exactly how** an AI-leveraged solo developer should structure their week — from strategy to deploy to proof-of-work signal.

---

## Target User

**Primary:** Solo founder or senior independent engineer transitioning to remote-first agile employment.
- Operates 1–3 active projects simultaneously
- Uses AI (Claude, ChatGPT) daily as a force multiplier
- Needs to produce proof-of-work visible to hiring managers, clients, and collaborators
- Comfortable with GitHub but wants a cleaner system

**Secondary:** Small engineering teams (2–4 people) adopting AI-first workflows.

---

## Core Loop

1. **Open the app** — view the full 5-layer AI workflow diagram
2. **Print or save as PDF** — take a portable reference into any working session
3. **Follow the loop** — use the diagram as a daily operating checklist (Strategy → Architecture → Build → Harden → Signal)
4. **Reference governance rules** — side panel enforces constraints (max 3 projects, no refactor without shipping impact)
5. **Share / embed** — deploy link serves as a portfolio artifact and onboarding doc for collaborators

---

## Killer Feature

**A single, print-ready visual that encodes an entire production-grade AI development operating system — deployable in one command, shareable as a URL.**

---

## MVP Scope

- [ ] 5-layer animated workflow diagram (Strategy / Architecture / Build Loop / Production Hardening / Signal)
- [ ] Governance side panel with 6 operating rules
- [ ] Print-to-PDF with landscape/portrait toggle
- [ ] Responsive layout (desktop-first, mobile graceful)
- [ ] Deployed public URL (Vercel or GitHub Pages)
- [ ] README with 30-second pitch, setup steps, deploy link
- [ ] `/docs` folder with PRD, Architecture, Roadmap, Decisions Log

---

## Non-Goals (MVP)

- **No user authentication** — this is a static reference tool, not a SaaS
- **No database or backend** — pure frontend, no server
- **No interactive editing** — diagram is read-only at MVP; users customize by forking
- **No custom workflow builder** — the framework is opinionated and fixed at MVP
- **No mobile-first design** — desktop/print is primary; mobile is secondary
- **No i18n** — English only at MVP

---

## Acceptance Criteria for MVP

| Criterion | Definition of Done |
|-----------|-------------------|
| App renders correctly | All 5 sections visible, animations play, no console errors |
| Print functionality works | PDF output matches landscape/portrait selection, no cut-off content |
| Responsive on mobile | No horizontal overflow on 375px viewport |
| Deploy pipeline exists | Push to `main` triggers auto-deploy to public URL |
| README complete | Contains pitch, stack, setup, deploy link, screenshot |
| Docs folder complete | PRD, ARCHITECTURE, ROADMAP, DECISIONS_LOG all present |
| No unused dependencies | MUI removed or justified; shadcn pruned to used components |
| TypeScript compiles cleanly | `vite build` exits 0 with no type errors |

---

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Figma Make origin creates tight coupling | High | Medium | Document Figma-generated code clearly; refactor incrementally |
| Dependency bloat (MUI + Radix) causes bundle size issues | High | Low-Medium | Audit and remove MUI; tree-shake Radix |
| No deploy = no audience = no proof-of-work | High | High | Deploy to Vercel as Week 1 priority |
| Single-file Home.tsx becomes unmaintainable | Medium | Medium | Split into section components in Week 2 |
| Print layout breaks across updates | Low | Medium | Add visual regression test for print output |

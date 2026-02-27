# Architecture Decision Record (ADR) Log
## AI × Leverage Framework — Visual Workflow Reference

**Format:** ADR-lite — Title / Status / Context / Decision / Consequences

---

## ADR-001 — Retroactive AI Production OS Adoption

**Date:** 2026-02-27
**Status:** Accepted

### Context
This project originated as a Figma Make export — a design-to-code tool that generates React components from Figma designs. The initial output was functional but had no workflow discipline, no documentation, no deploy pipeline, and no governance structure.

### Decision
Retroactively adopt the AI Production OS v1 framework starting from the current state. This means:
- Adding all documentation layers (PRD, ARCHITECTURE, ROADMAP, DECISIONS_LOG)
- Establishing Issue → PR → Deploy discipline going forward
- Not rewriting existing working code unless there is a shipping-impact reason

### Consequences
- **Positive:** Repo goes from prototype to production-credible without a rewrite
- **Positive:** Establishes a disciplined workflow that can serve as its own portfolio proof-of-work
- **Negative:** Some technical debt (MUI + Radix both installed, monolithic Home.tsx) will need scheduled cleanup
- **Risk:** Temptation to over-engineer docs instead of shipping — mitigated by "Week 1 = deploy first" rule

---

## ADR-002 — Remove MUI, Keep Radix/shadcn

**Date:** 2026-02-27
**Status:** Accepted

### Context
The generated `package.json` contains both `@mui/material` (with `@emotion/react` and `@emotion/styled`) AND the full `@radix-ui/*` component suite. These are overlapping UI frameworks. MUI appears to be unused in the current rendered application. Both installed simultaneously adds ~300KB+ to the bundle and creates potential version conflict risk.

### Decision
Remove `@mui/material`, `@mui/icons-material`, `@emotion/react`, and `@emotion/styled`. Keep the Radix UI components as the shadcn/ui foundation. Prune unused Radix components in Week 2.

### Consequences
- **Positive:** ~300KB reduction in bundle size
- **Positive:** Single UI system — no confusion between MUI and Radix patterns
- **Negative:** If MUI is needed in the future, it must be re-added and justified
- **Risk:** None — MUI is confirmed unused in current components

---

## ADR-003 — Vite + React Router over Next.js

**Date:** 2026-02-27
**Status:** Accepted

### Context
This project was generated with Vite. There was no decision point — it was the Figma Make default. However, it's worth documenting the rationale for keeping Vite rather than migrating to Next.js.

### Decision
Keep Vite + React Router v7. Do not migrate to Next.js.

**Rationale:**
- This is a 100% static, no-SSR application — Next.js provides no advantage
- React Router v7 handles all routing needs (currently 1 route, potentially 2–3 in future)
- Vite deploys as a static SPA to Vercel with zero configuration
- Migration would be a pure overhead cost with no user-facing benefit

### Consequences
- **Positive:** Zero config to deploy on Vercel, GitHub Pages, or Netlify
- **Positive:** Fastest possible dev startup and HMR
- **Negative:** No server components, no ISR, no API routes — acceptable given no-backend decision
- **Future trigger to revisit:** If server-side PDF generation or user authentication is added

---

## ADR-004 — Static Data, No CMS

**Date:** 2026-02-27
**Status:** Accepted

### Context
The workflow diagram content (section titles, node labels, tool names, governance rules) is currently hardcoded directly inside `Home.tsx`. This was the Figma Make output behavior.

### Decision
Keep content hardcoded for MVP. Do not introduce a CMS, MDX, or external data source.

**Rationale:**
- The AI Production OS v1 framework is intentionally opinionated and fixed — it's not a "build your own workflow" tool at MVP
- Content changes are infrequent; a code change + deploy is acceptable
- A CMS would add infrastructure complexity with no user-facing benefit at this stage

**Future plan:** In Month 2, extract content to `src/data/workflow.ts` (TypeScript config object) to separate data from render logic without adding a CMS dependency.

### Consequences
- **Positive:** Zero infrastructure, instant deploys, no content pipeline
- **Negative:** Non-technical users cannot edit content without code changes
- **Future trigger to revisit:** If the app is shared as a "fork and customize" template

---

## ADR-005 — Print-First Over Mobile-First

**Date:** 2026-02-27
**Status:** Accepted

### Context
The application has two primary consumption modes: browser viewing on desktop and print-to-PDF for reference. The horizontal scroll layout (5 columns side by side) does not adapt well to mobile viewports.

### Decision
Desktop + print is the primary design target. Mobile is a secondary concern. The horizontal workflow layout will remain as-is for MVP. A basic fix for overflow on mobile viewports will be added in Week 2, but a full mobile-first redesign is explicitly out of scope.

**Rationale:**
- The target user (solo founder/engineer) primarily uses this on a desktop while working
- PDF export is a core feature — print layout quality takes priority
- Responsive redesign would require significant layout changes to the 5-column structure

### Consequences
- **Positive:** Print/PDF output is high-quality and the design intent is preserved
- **Negative:** Mobile experience is degraded — acceptable at MVP given target user profile
- **Future trigger to revisit:** If analytics show >20% mobile traffic

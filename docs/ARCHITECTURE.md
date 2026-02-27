# Architecture Document
## AI × Leverage Framework — Visual Workflow Reference

**Version:** 1.0
**Last updated:** 2026-02-27

---

## High-Level Overview

This is a **purely static, client-side React application**. No backend. No database. No authentication. The entire runtime is a compiled bundle served from a CDN/static host.

```
Browser
  └── React SPA (Vite bundle)
       ├── React Router (single route: "/")
       ├── Home.tsx (page composition)
       │    ├── Header (title + print controls)
       │    ├── WorkflowSection × 5 (animated panels)
       │    ├── ConnectionArrow × 4 (flow indicators)
       │    └── SidePanel (governance rules)
       └── CSS (Tailwind v4 + theme variables + fonts)
```

**Deploy target:** Vercel (static site / SPA) or GitHub Pages.

---

## Key Components

### `src/app/Home.tsx`
The single page. Contains all section data inline. Currently monolithic (~410 lines) — acceptable at MVP but a candidate for splitting into `sections/` in the next iteration.

**Responsibilities:**
- Orientation state (landscape/portrait for print)
- Rendering all 5 workflow sections in sequence
- Print CSS injection via inline `<style>` tag

### `src/app/components/WorkflowSection.tsx`
Reusable panel container. Accepts `title`, `color`, `note`, `footer`, and `children` (nodes). Color theming is handled via hardcoded map — acceptable for 5 fixed sections.

### `src/app/components/Node.tsx`
Two components:
- `Node` — a workflow step card with icon + label + optional subtext
- `ToolNode` — a pill badge for tool names (primary/secondary styling)

### `src/app/components/ConnectionArrow.tsx`
Animated directional chevron connecting sections. Hidden on mobile (`hidden lg:flex`).

### `src/app/components/figma/ImageWithFallback.tsx`
Generated Figma utility — currently unused in the main flow. Candidate for removal.

### `src/app/components/ui/`
Full shadcn/ui component library (~30+ components). Majority are **unused** at MVP. These are generated boilerplate and should be pruned to only what is actively used.

---

## Data Flow

```
Static data (hardcoded in Home.tsx)
  → WorkflowSection props
    → Node / ToolNode renders
      → Framer Motion animations
        → Tailwind CSS classes
          → DOM output
            → Browser print / PDF export
```

No external data fetching. No state management library needed. Single piece of UI state: `orientation` (`"landscape" | "portrait"`).

---

## Storage / Auth Choices

**None required.** This is a stateless reference document. No user data, no persistence, no accounts.

Future consideration: If a "customize your workflow" feature is added, localStorage is sufficient for MVP-level persistence. No backend required until multi-user sharing is needed.

---

## Key Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | React + Vite | Figma Make export baseline; fast dev server; excellent Vercel support |
| Styling | TailwindCSS v4 | Utility-first matches rapid UI iteration; v4 is the current standard |
| Animations | Framer Motion (`motion/react`) | Already integrated in Figma output; smooth stagger animations |
| Router | React Router v7 | Single route at MVP; extensible if more pages are added |
| UI Components | shadcn/ui (Radix) | Pre-built accessible components; MIT licensed |
| Build | Vite 6 | Fastest dev/build; native ESM; minimal config |
| Deploy | Vercel | Zero-config SPA support; free tier; preview deployments per PR |

---

## Key Tradeoffs

### shadcn/ui vs MUI — Both installed (technical debt)
- **Current state:** Both `@mui/material` and `@radix-ui/*` are installed
- **Problem:** MUI adds ~300KB gzipped; Radix + shadcn provides equivalent components
- **Decision:** Remove MUI entirely. It appears unused in the rendered application.
- **Action:** `npm uninstall @mui/material @mui/icons-material @emotion/react @emotion/styled`

### Monolithic `Home.tsx`
- **Current state:** Single 410-line file contains all section data and render logic
- **Tradeoff:** Simple to understand, harder to extend
- **Plan:** Extract section data into a `data/workflow.ts` config object in Month 2. Keep component structure flat for now.

### Inline print CSS via `<style>` tag
- **Current state:** Print media queries injected dynamically inside `Home.tsx`
- **Tradeoff:** Keeps print styles co-located with the component that owns orientation state
- **Risk:** Hard to maintain as layout grows; could conflict with Tailwind print utilities
- **Plan:** Move to a dedicated `print.css` module in Month 2

---

## Bundle Size Targets (MVP)

| Metric | Target | Current estimate |
|--------|--------|-----------------|
| JS bundle (gzipped) | < 200KB | ~180KB (after MUI removal) |
| First Contentful Paint | < 1.5s | Unknown — needs Lighthouse run |
| Lighthouse Performance | ≥ 90 | Unknown — needs measurement |

---

## Future Scaling Notes

1. **If interactive editing is added:** Introduce Zustand for workflow state; keep React Router; add a `WorkflowEditor` page
2. **If user accounts are added:** Use Supabase (auth + database) — avoids building auth from scratch
3. **If multi-page output is needed:** Migrate print logic to `react-to-print` or server-side PDF generation
4. **If content is dynamic:** Extract section data to a CMS (Contentful or MDX files in `/content/`)
5. **Current architecture supports up to:** ~10 routes, ~50 components, zero backend — no scaling changes needed for this scope

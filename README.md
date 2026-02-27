# AI × Leverage Framework — Production-Grade Solo Workflow

> A single, print-ready visual that encodes a complete production-grade AI development operating system — deployable in one command, shareable as a URL.

<!-- TODO: Add screenshot here after first deploy -->
<!-- ![App screenshot](docs/screenshot.png) -->

---

## What is this?

A **visual reference tool** for solo founders and senior engineers operating in remote-first, AI-augmented environments. It renders the AI Production OS v1 framework as a 5-layer interactive diagram:

1. **Strategy / Architect** — weekly outcome compression, scope constraints
2. **Architecture & System Design** — data model, API, folder structure, edge cases
3. **Daily Build Loop** — GitHub Issue → Micro-scope → Implement → Review → PR → Deploy
4. **Production Hardening** — UX, error states, performance, observability
5. **Professional Signal Layer** — clean git history, PR discipline, docs, demos

Includes a **Governance side panel** (6 operating rules) and **Print to PDF** with landscape/portrait toggle.

---

## Live Demo

<!-- TODO: Add Vercel deploy URL -->
🚧 Deploy in progress — see [ROADMAP.md](docs/ROADMAP.md) Week 1

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | React 18 + TypeScript |
| Build | Vite 6 |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion (`motion/react`) |
| Router | React Router v7 |
| UI Components | shadcn/ui (Radix UI) |
| Icons | Lucide React |
| Deploy | Vercel |

---

## Setup

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Requires Node.js 18+.

---

## Project Structure

```
ai-workflow/
├── src/
│   ├── app/
│   │   ├── App.tsx                    # Router entry point
│   │   ├── Home.tsx                   # Main page (all 5 sections)
│   │   ├── routes.ts                  # React Router config
│   │   └── components/
│   │       ├── Node.tsx               # Workflow step + tool badge
│   │       ├── WorkflowSection.tsx    # Animated panel container
│   │       ├── ConnectionArrow.tsx    # Section connector
│   │       └── ui/                    # shadcn/ui primitives
│   ├── styles/
│   │   ├── index.css
│   │   ├── theme.css                  # CSS custom properties
│   │   ├── tailwind.css
│   │   └── fonts.css
│   └── main.tsx                       # React entry point
├── docs/
│   ├── PRD.md                         # Product requirements
│   ├── ARCHITECTURE.md                # System design
│   ├── ROADMAP.md                     # 4-week + 3-month plan
│   └── DECISIONS_LOG.md               # Architecture decisions (ADRs)
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── feature.md
│   │   └── bug.md
│   └── pull_request_template.md
├── CHANGELOG.md
├── .env.example
└── package.json
```

---

## Roadmap

See [docs/ROADMAP.md](docs/ROADMAP.md) for the full 4-week sprint plan and 3-month milestones.

**Current priorities:**
- [ ] Week 1: Deploy to Vercel, fix package.json, remove MUI
- [ ] Week 2: ESLint + Prettier, mobile overflow fix, prune unused components
- [ ] Week 3: Add interactive checklist feature
- [ ] Week 4: Lighthouse audit, analytics, CI/CD

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for branch naming, commit message rules, and PR process.

Issue and PR templates are in `.github/`.

---

## License

MIT. Attribution: shadcn/ui components used under MIT license. See [ATTRIBUTIONS.md](ATTRIBUTIONS.md).

---

*Designed for remote-first agile environments.*

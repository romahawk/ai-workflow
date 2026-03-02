# AI Production OS v1

> A solo engineer's framework for shipping production-grade software — from weekly strategy to daily build loop to proof-of-work.

**[https://ai-workflow-woad.vercel.app](https://ai-workflow-woad.vercel.app)**

---

## What is this?

A **two-layer personal development OS** for solo founders and senior engineers operating in AI-augmented, remote-first environments.

### Layer 1 — Public Reference (`/`)
A print-ready poster encoding the complete 5-phase OS. Shareable as a URL, printable at A3. Beautiful, dense, authoritative — like an engineering reference card.

### Layer 2 — Execution Layer (`/dashboard`, `/sprint`, `/projects`, `/daily`)
A private, interactive control plane for running the OS across real projects:
- **Sprint dashboard** — 3 active repos max (WIP enforced), parked and frozen visible
- **Project detail** — per-phase checklist, editable sprint goal, manual changelog
- **Sprint planning** — Monday flow: set statuses → goals → outcomes → lock sprint; Friday review
- **Daily loop** — 10-step checklist, resets at midnight

Access: append `?key=YOUR_KEY` or set `VITE_ACCESS_KEY` in `.env.local`.

---

## Live Demo

**[https://ai-workflow-woad.vercel.app](https://ai-workflow-woad.vercel.app)**

Execution layer: `https://ai-workflow-woad.vercel.app/dashboard?key=os2024`

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
- [x] Week 1: Deploy to Vercel, fix package.json, remove MUI
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

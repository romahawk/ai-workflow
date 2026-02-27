# Contributing Guide
## AI × Leverage Framework

---

## Workflow: Issue → Branch → PR → Deploy

Every change starts with a GitHub Issue. Every issue ships as a deployed increment.

```
GitHub Issue (scoped)
  → Branch: feature/issue-{N}-short-description
  → Implementation (atomic, focused)
  → PR (template filled out)
  → Review (AI pass + manual reasoning pass)
  → Merge to main
  → Auto-deploy (Vercel)
```

---

## Branch Naming

```
feature/issue-{N}-short-description    # New functionality
fix/issue-{N}-short-description        # Bug fix
chore/issue-{N}-short-description      # Tooling, deps, config
docs/issue-{N}-short-description       # Documentation only
refactor/issue-{N}-short-description   # Code restructure (no behavior change)
```

Examples:
```
feature/issue-7-interactive-checklist
fix/issue-3-mobile-overflow
chore/issue-1-fix-package-json
docs/issue-5-add-prd
```

---

## Commit Message Rules

Format: `type(scope): short description`

```
feat(Home): add interactive checklist nodes
fix(layout): resolve mobile horizontal overflow on 375px
chore(deps): remove MUI, reduce bundle by ~300KB
docs(prd): add MVP acceptance criteria
refactor(Home): extract print styles to print.css
test(Node): add unit test for ToolNode rendering
```

**Rules:**
- Use imperative mood ("add", not "added" or "adds")
- Lowercase first word after colon
- No period at end
- Keep subject line under 72 characters
- Reference issue in body: `Closes #N`

---

## Pull Request Rules

- Use the PR template (auto-loaded from `.github/pull_request_template.md`)
- Keep PRs small: aim for < 200 lines changed
- PRs should address exactly one Issue
- All PRs require:
  - [ ] `npm run build` passes
  - [ ] `npm run lint` passes
  - [ ] Self-review completed (AI pass + manual reasoning pass)

---

## Governance Rules (Non-negotiable)

1. **Max 3 active projects** — this is one of them; don't fragment focus
2. **One outcome per week per repo** — define it Monday, ship it by Friday
3. **No refactor without shipping impact** — if the user can't see a difference, it doesn't ship alone
4. **One source of truth per layer** — one styling system (Tailwind), one component library (shadcn/ui)
5. **AI accelerates, does not decide** — AI reviews code, human owns the commit
6. **If not deployed, it doesn't count** — merge to main = deploy to production

---

## Development Setup

```bash
npm install
npm run dev       # localhost:5173
npm run build     # production build
npm run preview   # preview production build locally
npm run lint      # ESLint check
```

# CLAUDE.md — AI Production OS
## Auto-loaded rules for every Claude Code session in this repo

---

## Before touching any code

1. **Is there a GitHub Issue for this?** If not, stop and create one first.
2. **Are we on a feature branch?** Never work directly on `main`.
   ```bash
   git status && git branch
   ```
3. **Does the branch name match the Issue?**
   ```
   feature/issue-{N}-short-description
   fix/issue-{N}-short-description
   chore/issue-{N}-short-description
   docs/issue-{N}-short-description
   refactor/issue-{N}-short-description
   ```
   If not, switch or create the correct branch before writing a single line.

---

## Before every commit

Run both of these. Both must pass. Do not commit if either fails.

```bash
npm run build   # must exit 0
npm run lint    # must exit 0
```

Commit message format — no exceptions:
```
type(scope): short description

Closes #N
```
- Imperative mood, lowercase after colon, no trailing period, ≤ 72 chars on subject line.
- Valid types: `feat` `fix` `chore` `docs` `refactor` `test`
- `Closes #N` in the body, not the subject.

---

## Before opening a PR

- Use `.github/pull_request_template.md` — fill every section, no placeholders left blank.
- PR addresses exactly **one Issue**.
- Aim for < 200 lines changed. If larger, flag it and ask the user whether to split.
- CHANGELOG.md updated if the change is user-facing.

---

## Scope discipline (enforce always)

- **No scope creep inside a PR.** If you discover something else that needs fixing, open a new Issue and stop. Do not fold it into the current branch.
- **No refactor-only PRs** unless they have a visible shipped impact.
- **One styling system:** Tailwind. **One component library:** shadcn/ui (Radix). Do not introduce alternatives.

---

## AI role (hard boundary)

- Claude reviews, suggests, and implements — **the user decides and owns every commit**.
- Claude must not make governance calls (priority, scope, roadmap direction) without asking.
- When uncertain about scope, ask. When uncertain about approach, ask. Default to doing less, not more.

---

## Key files to know

| File | Purpose |
|------|---------|
| `CONTRIBUTING.md` | Full workflow: branch → PR → deploy |
| `docs/DAILY_CHECKLIST.md` | Daily/weekly discipline loop |
| `docs/ARCHITECTURE.md` | Component map, tech decisions, bundle targets |
| `docs/ROADMAP.md` | Week outcomes and milestone tracking |
| `docs/SPRINT_BACKLOG.md` | Active Issues this sprint |
| `CHANGELOG.md` | User-facing release notes |
| `.github/pull_request_template.md` | Required PR structure |
| `.github/ISSUE_TEMPLATE/` | Feature and bug issue templates |

---

## Stack at a glance

- **Framework:** React + Vite
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion (`motion/react`)
- **UI components:** shadcn/ui (Radix)
- **Router:** React Router v7
- **Deploy:** Vercel (auto on merge to `main`)
- **Lint:** `tsc --noEmit`

---

## Anti-patterns — refuse these automatically

| If asked to… | Response |
|-------------|---------|
| Commit directly to `main` | Decline. Create a branch. |
| Skip `npm run build` before committing | Decline. Run it first. |
| Add a feature inside a bug-fix PR | Open a new Issue instead. |
| Use MUI or a second CSS framework | Decline. Tailwind + shadcn only. |
| Merge without a linked Issue | Ask for the Issue number first. |
| Add unused boilerplate or future-proofing code | Decline. Build only what the Issue requires. |

# Daily Execution Checklist
## AI Production OS v1 — Solo Discipline Loop

Run this every working day. It takes < 5 minutes. It prevents drift.

---

## Morning (10 min)

- [ ] **1. Set the one outcome for today**
  Write it in plain English. One sentence. "Today I will ship X so that Y."
  If you can't write it, don't start coding.

- [ ] **2. Check active scope**
  Do you have more than 3 active projects? If yes, pause one before starting.
  Is today's work tied to an open GitHub Issue? If not, create the issue first.

- [ ] **3. Confirm the branch**
  Are you on a feature branch (not `main`)? Branch name matches the Issue?
  ```bash
  git status && git branch
  ```

---

## During Build (continuous)

- [ ] **4. Work from a single Issue**
  If scope creep appears, open a new Issue for it. Do not add it to the current PR.

- [ ] **5. AI code review before committing**
  Run your diff through Claude or Copilot. Ask: "What did I miss? Any edge cases?"

- [ ] **6. Manual reasoning pass**
  Read your own changes as a reviewer would. Does it make sense? Does it do exactly what the Issue asked?

- [ ] **7. Commit messages follow the format**
  `type(scope): short description` — see CONTRIBUTING.md.
  Reference the Issue: `Closes #N` in the commit body.

---

## End of Day (10 min)

- [ ] **8. Open the PR (even if not merged)**
  Draft PRs are proof-of-work. Use the template. Write the "What / Why / How."

- [ ] **9. Deploy or note why not**
  If the PR is merged: confirm deploy succeeded on Vercel.
  If not merged: note what's blocking.

- [ ] **10. Update the roadmap or backlog**
  Close the Issue if done. Add any new Issues discovered today.
  Update `ROADMAP.md` if a week outcome changed.

---

## Weekly (Friday, 15 min)

- [ ] Review last week's outcome — was it shipped?
- [ ] Define next week's single outcome (add to ROADMAP.md)
- [ ] Update CHANGELOG.md with any user-facing changes
- [ ] Check active scope: still ≤ 3 projects?
- [ ] Archive any decisions made this week in DECISIONS_LOG.md

---

## Anti-Patterns to Avoid

| Anti-pattern | Correct behavior |
|-------------|-----------------|
| Coding without an Issue | Create the Issue first |
| Merging to `main` directly | Always use a branch + PR |
| "I'll deploy later" | Merge = deploy. Vercel is automatic. |
| Adding features inside a bug fix PR | Open a new Issue, new PR |
| Refactoring without a shipping reason | Don't. Or ship it as its own PR with visible impact. |
| Using AI to make decisions | AI reviews. You decide. |
| Opening 5 issues in one day | Max 3 active issues at a time. |

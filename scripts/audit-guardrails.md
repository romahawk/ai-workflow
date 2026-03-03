# AI Production OS — Guardrails Audit Prompt
## Drop this into any Claude Code session to audit a repo against the AI-workflow standards.

---

## HOW TO USE

Paste the content under "PROMPT" into a Claude Code session opened inside the repo you want to audit.
Claude will scan the repo and produce a structured compliance report.

---

## PROMPT

```
You are an auditor for the AI Production OS workflow. Scan this entire repository and
produce a structured compliance report against the guardrails below. For every check,
output one of: ✅ PASS | ⚠️ WARN | ❌ FAIL — followed by a one-line finding and, where
applicable, the exact remediation command or change needed.

At the end, output an OVERALL SCORE as: (passed checks) / (total checks) and a
PRIORITY ACTION LIST of the top 3 things to fix first.

Do not ask questions. Do not propose changes. Only report findings.

---

## CATEGORY 1 — Required files

Check whether each of the following files exists at the path shown. FAIL if missing,
PASS if present, WARN if present but empty or clearly a placeholder (all sections say
"TODO" or similar).

| Check | Path |
|-------|------|
| 1.1 CLAUDE.md (AI session rules) | ./CLAUDE.md |
| 1.2 CONTRIBUTING.md (workflow guide) | ./CONTRIBUTING.md |
| 1.3 CHANGELOG.md (release notes) | ./CHANGELOG.md |
| 1.4 Roadmap | ./docs/ROADMAP.md |
| 1.5 Sprint backlog | ./docs/SPRINT_BACKLOG.md |
| 1.6 Architecture doc | ./docs/ARCHITECTURE.md |
| 1.7 Daily checklist | ./docs/DAILY_CHECKLIST.md |
| 1.8 PR template | ./.github/pull_request_template.md |
| 1.9 Issue templates directory | ./.github/ISSUE_TEMPLATE/ |

---

## CATEGORY 2 — Git hygiene

Run these commands and interpret the output:

2.1 DEFAULT BRANCH PROTECTION
  Command: git log --oneline origin/main..HEAD 2>/dev/null || git log --oneline main..HEAD 2>/dev/null
  PASS if HEAD is on a feature branch, not directly on main.
  FAIL if the working branch IS main or if recent commits were made directly to main
  without a PR.

2.2 BRANCH NAMING CONVENTION
  Command: git branch --show-current
  PASS if current branch matches one of these patterns:
    feature/issue-{N}-*
    fix/issue-{N}-*
    chore/issue-{N}-*
    docs/issue-{N}-*
    refactor/issue-{N}-*
    claude/*   (Claude Code automation branches are acceptable)
  WARN if the branch exists but does not match the pattern.
  FAIL if currently on main or master.

2.3 RECENT COMMIT MESSAGE FORMAT
  Command: git log --oneline -10
  For each commit check: does it follow "type(scope): short description" ?
  Valid types: feat fix chore docs refactor test
  PASS if ≥ 80% of the last 10 commits conform.
  WARN if 50–79% conform.
  FAIL if < 50% conform.

2.4 CLOSES REFERENCE IN COMMIT BODY
  Command: git log -10 --format="%B---END---"
  PASS if ≥ 70% of commits include "Closes #N" in the body.
  WARN if 40–69% include it.
  FAIL if < 40% include it.

2.5 COMMIT SIZE DISCIPLINE
  Command: git log --oneline -10 --stat | grep "files changed"
  WARN if any single commit changed > 200 lines (insertions + deletions combined).
  PASS if all commits are ≤ 200 lines.

---

## CATEGORY 3 — Build and lint gates

3.1 BUILD PASSES
  Command: npm run build
  PASS if exits 0.
  FAIL if exits non-zero. Report the first error line.

3.2 LINT PASSES
  Command: npm run lint
  PASS if exits 0.
  FAIL if exits non-zero. Report the first error line.

3.3 LINT SCRIPT EXISTS
  Check package.json scripts object for a "lint" key.
  PASS if present.
  FAIL if absent.

3.4 BUILD SCRIPT EXISTS
  Check package.json scripts for a "build" key.
  PASS if present.
  FAIL if absent.

---

## CATEGORY 4 — Stack compliance

Read package.json (dependencies + devDependencies).

4.1 NO MUI / EMOTION
  FAIL if any of these are present: @mui/material @mui/icons-material @emotion/react
  @emotion/styled
  PASS if none are present.

4.2 TAILWIND PRESENT
  PASS if tailwindcss appears in dependencies or devDependencies.
  FAIL if absent.

4.3 SHADCN / RADIX PRESENT (for UI component repos)
  PASS if @radix-ui/* packages appear in dependencies.
  WARN if absent (may not be required for all project types).

4.4 NO SECOND CSS FRAMEWORK
  FAIL if bootstrap, @mui/*, styled-components, or emotion appear alongside tailwindcss.
  PASS if only one styling system is present.

4.5 REACT + VITE STACK
  PASS if react, react-dom, and vite all appear.
  WARN if the stack differs (may be intentional for non-React projects — note it).

4.6 REACT IN DEPENDENCIES (NOT peerDependencies)
  Read package.json peerDependencies.
  FAIL if react or react-dom appear there (app, not a library — they must be in
  dependencies).
  PASS if both are under dependencies.

---

## CATEGORY 5 — CI / CD

5.1 GITHUB ACTIONS CI WORKFLOW EXISTS
  Check for any .yml file under .github/workflows/ that contains "npm run build"
  or "npm run lint".
  PASS if found.
  FAIL if no CI workflow exists.

5.2 CI TRIGGERS ON PR
  Read the workflow file(s). Check that at least one workflow triggers on
  pull_request events.
  PASS if present.
  WARN if CI only triggers on push.

5.3 VERCEL CONFIG FOR SPA ROUTING
  Check for vercel.json containing a "rewrites" rule pointing to /index.html.
  PASS if present.
  WARN if absent (Vercel deployments will 404 on direct route access).

5.4 DEPLOY URL IN README
  Read README.md. Check for an https:// URL that looks like a live deploy.
  PASS if found.
  WARN if absent.

---

## CATEGORY 6 — Scope and roadmap discipline

6.1 ROADMAP HAS WEEKLY OUTCOMES
  Read docs/ROADMAP.md. Check that it defines at least one "Week N" outcome with
  explicit acceptance criteria or a definition of done.
  PASS if ≥ 1 week outcome with criteria is present.
  WARN if roadmap exists but contains only vague goals.
  FAIL if roadmap is missing or empty.

6.2 SPRINT BACKLOG HAS ACTIVE ISSUES
  Read docs/SPRINT_BACKLOG.md. Check that it contains at least one issue with
  acceptance criteria checkboxes.
  PASS if found.
  WARN if backlog exists but has no acceptance criteria.
  FAIL if missing.

6.3 ACTIVE PROJECT LIMIT (≤ 3)
  If src/data/repos.ts exists, count repos with status "active".
  PASS if ≤ 3.
  WARN if 4.
  FAIL if ≥ 5.
  Skip check (N/A) if repos.ts does not exist.

6.4 CHANGELOG UPDATED RECENTLY
  Read CHANGELOG.md. Check if the most recent entry is within the last 30 days
  relative to today's date (compare entry date strings).
  PASS if updated within 30 days.
  WARN if last entry is 30–90 days ago.
  FAIL if no entries or last entry > 90 days ago.

---

## CATEGORY 7 — AI role boundary (CLAUDE.md content audit)

Read CLAUDE.md.

7.1 AI ROLE BOUNDARY DEFINED
  PASS if CLAUDE.md contains language restricting Claude from making governance /
  priority / roadmap decisions unilaterally (i.e., "ask the user", "user decides",
  or equivalent).
  WARN if CLAUDE.md exists but has no AI boundary section.
  FAIL if CLAUDE.md is missing.

7.2 ANTI-PATTERNS TABLE PRESENT
  PASS if CLAUDE.md includes a table or list of explicit anti-patterns Claude
  should refuse.
  WARN if absent.

7.3 PRE-COMMIT GATE RULE DOCUMENTED
  PASS if CLAUDE.md explicitly states that npm run build AND npm run lint must
  pass before committing.
  WARN if only one gate is mentioned.
  FAIL if neither is mentioned.

---

## OUTPUT FORMAT

Use this exact structure:

### Guardrails Audit — [repo name] — [today's date]

#### Category 1 — Required files
- 1.1 [✅/⚠️/❌] [finding]
...

#### Category 2 — Git hygiene
...

#### Category 3 — Build and lint gates
...

#### Category 4 — Stack compliance
...

#### Category 5 — CI / CD
...

#### Category 6 — Scope and roadmap discipline
...

#### Category 7 — AI role boundary
...

---

### Overall Score: X / 27 checks passed

### Critical (fix before next commit)
1. [item]
2. [item]
3. [item]

### Recommended (fix this sprint)
- [item]
- [item]

### Notes
[Any observations that don't map to a specific check — e.g., unusual stack,
large uncommitted changes, etc.]
```

---

## TIPS FOR USING THIS AUDIT

- Run it at the **start of a new project** to confirm the scaffold is compliant before writing any feature code.
- Run it at the **start of a sprint** to catch drift before it accumulates.
- Run it on **any repo you're about to contribute to** using Claude Code.
- Pipe the output into a GitHub Issue for tracking: the Priority Action List becomes the issue body.

## SCOPE

This prompt audits **process compliance** — branch hygiene, commit format, file presence, build gates, stack decisions, and roadmap structure. It does NOT audit code quality, security, or performance. For those, use separate dedicated tools.

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
| 1.1 CLAUDE.md (AI session rules)    | ./CLAUDE.md |
| 1.2 CONTRIBUTING.md (workflow guide) | ./CONTRIBUTING.md |
| 1.3 CHANGELOG.md (release notes)    | ./CHANGELOG.md |
| 1.4 Roadmap                         | ./docs/ROADMAP.md |
| 1.5 Sprint backlog                  | ./docs/SPRINT_BACKLOG.md |
| 1.6 Architecture doc                | ./docs/ARCHITECTURE.md |
| 1.7 Daily checklist                 | ./docs/DAILY_CHECKLIST.md |
| 1.8 PR template                     | ./.github/pull_request_template.md |
| 1.9 Issue templates directory       | ./.github/ISSUE_TEMPLATE/ |

---

## CATEGORY 2 — Git hygiene

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
  For each commit check: does it follow "type(scope): short description"?
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

5.5 WEEKLY ROADMAP SYNC WORKFLOW EXISTS
  Check for a .yml file under .github/workflows/ that contains all of:
    - a cron schedule targeting Monday (e.g. "0 * * * 1" or "* * * * 1")
    - "issues: write" permission
    - a github.rest.issues.create (or equivalent) call
  PASS if found.
  WARN if a weekly workflow exists but does not open an issue (e.g. only sends
  a notification).
  FAIL if no weekly automation exists at all.

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

6.5 ROADMAP UPDATED THIS WEEK
  Command: git log --since="7 days ago" --oneline -- docs/ROADMAP.md
  PASS if ≥ 1 commit to docs/ROADMAP.md appears in the last 7 days.
  WARN if last commit to docs/ROADMAP.md is 8–30 days ago.
  FAIL if docs/ROADMAP.md has never been committed or last touched > 30 days ago.
  Note: a Monday Weekly Sync issue opened this week counts as PASS even without
  a direct file commit, if the weekly-sync workflow (check 5.5) is present and
  enabled.

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

## CATEGORY 8 — README structure compliance
The canonical README structure is defined by the JobSprint repository. Check
README.md for each of these required sections. FAIL if a section is missing,
WARN if present but empty or clearly a placeholder.

8.1 30-SECOND PITCH SECTION
  PASS if README contains a "30-Second Pitch" heading (or equivalent value-
  proposition section that explains the product's core purpose in ≤ 5 sentences).
  WARN if present but longer than a paragraph.
  FAIL if absent.

8.2 CURRENT STATUS SECTION
  PASS if README contains a "Current Status" section that includes at minimum:
    - a Stage field (e.g. "Stage: MVP+")
    - a Scope summary
    - an Adoption or process label
  WARN if section exists but is missing ≥ 1 of the three fields.
  FAIL if absent.

8.3 TECH STACK SECTION
  PASS if README contains a "Tech Stack" section listing the primary technologies.
  FAIL if absent.

8.4 SETUP COMMANDS
  PASS if README contains a Setup (or equivalent) section with all four commands:
    npm install  (or equivalent)
    npm run dev
    npm run build
    npm run test  (or npm run test)
  WARN if ≥ 1 command is missing.
  FAIL if no setup section exists at all.

8.5 DEPLOY SECTION WITH PRODUCTION URL
  PASS if README contains a Deploy (or Deployment) section that includes a live
  https:// URL and the hosting platform.
  WARN if URL is present elsewhere in the README but not under a Deploy heading.
  FAIL if no production URL exists anywhere in README.

8.6 DOCUMENTATION INDEX
  PASS if README contains a Documentation section (or equivalent) that links to
  at least the following docs:
    - Architecture (docs/ARCHITECTURE.md or similar)
    - Roadmap (docs/ROADMAP.md or similar)
    - Contributing guide (CONTRIBUTING.md)
    - Changelog (CHANGELOG.md)
  WARN if section exists but fewer than 4 of these links are present.
  FAIL if no documentation index section exists.

---

## CATEGORY 9 — Extended docs compliance
These checks verify that the docs/ directory follows the JobSprint canonical
structure.

9.1 PRD SECTIONS PRESENT
  Read docs/PRD.md.
  PASS if it contains all three of: Problem, Target User (or Audience), and MVP
  Scope (or Core Loop) sections.
  WARN if PRD exists but is missing ≥ 1 section.
  FAIL if docs/PRD.md is absent.

9.2 DECISIONS LOG HAS AT LEAST ONE ADR
  Read docs/DECISIONS_LOG.md.
  PASS if it contains ≥ 1 Architecture Decision Record with Date, Status, and
  Decision fields.
  WARN if file exists but contains no structured ADR entries.
  FAIL if docs/DECISIONS_LOG.md is absent.

9.3 NEXT SESSION START DOC IS CURRENT
  Read docs/NEXT_SESSION_START.md.
  PASS if it contains a "Last updated" date within the last 30 days AND a
  "Start Here" section with ordered steps.
  WARN if file exists but "Last updated" date is > 30 days ago, or the Start
  Here section is missing.
  FAIL if docs/NEXT_SESSION_START.md is absent.

9.4 WORKFLOW AUTOMATION PLAYBOOK EXISTS
  Read docs/WORKFLOW_AUTOMATION_PLAYBOOK.md.
  PASS if it exists and references at least the CI and policy-check workflow
  files.
  WARN if file exists but does not list workflow files to copy.
  FAIL if absent.

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

#### Category 8 — README structure compliance
...

#### Category 9 — Extended docs compliance
...

---

### Overall Score: X / 47 checks passed

### Critical (fix before next commit)
1. [item]
2. [item]
3. [item]

### Recommended (fix this sprint)
- [item]
- [item]

### Notes
[Any observations that don't map to a specific check — e.g., unusual stack,
large uncommitted changes, 5.5/6.5 weekly-sync gap, etc.]

```

---

## TIPS FOR USING THIS AUDIT

- Run it at the **start of a new project** to confirm the scaffold is compliant before writing any feature code.
- Run it at the **start of a sprint** to catch drift before it accumulates.
- Run it on **any repo you're about to contribute to** using Claude Code.
- Pipe the output into a GitHub Issue for tracking: the Priority Action List becomes the issue body.

## SCOPE

This prompt audits **process compliance** — branch hygiene, commit format, file presence, build gates, stack decisions, and roadmap structure. It does NOT audit code quality, security, or performance. For those, use separate dedicated tools.

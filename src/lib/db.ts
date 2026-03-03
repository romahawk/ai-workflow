/**
 * Typed Firestore document shapes and path helpers.
 *
 * Collections:
 *   /repos/{repoId}           – runtime-mutable repo fields (status, phase, sprintGoal, focusToday)
 *   /sprints/w{n}             – per-week sprint plan (outcomes, shipped, lockedAt)
 *   /daily/{YYYY-MM-DD}       – daily checklist state
 *   /criteria/{repoId}_{phaseId} – per-phase acceptance-criteria checkboxes
 *   /changelog/{repoId}       – per-repo shipped log entries
 */

import type { RepoStatus, OSPhase } from "../data/repos";

/* ─── Repo ────────────────────────────────────────────────────────── */
export interface RepoDoc {
  status: RepoStatus;
  phase: OSPhase;
  sprintGoal: string;
  focusToday: string;
}

/* ─── Sprint plan ─────────────────────────────────────────────────── */
export interface SprintDoc {
  week: number;
  lockedAt: string | null;
  outcomes: Record<string, string>;
  shipped: Record<string, boolean>;
}

/* ─── Daily checklist ─────────────────────────────────────────────── */
export interface DailyDoc {
  checked: Record<string, boolean>;
}

/* ─── Per-phase criteria ──────────────────────────────────────────── */
export interface CriteriaDoc {
  items: Record<string, boolean>;
}

/* ─── Changelog ───────────────────────────────────────────────────── */
export interface ChangelogEntry {
  ts: string;
  text: string;
}

export interface ChangelogDoc {
  entries: ChangelogEntry[];
}

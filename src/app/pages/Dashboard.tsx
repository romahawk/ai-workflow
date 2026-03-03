import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router";
import {
  ExternalLink,
  Github,
  ArrowUpRight,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Home,
} from "lucide-react";
import { useRepos } from "../../hooks/useRepos";
import { phases } from "../../data/phases";
import { ACTIVE_LIMIT, type Repo } from "../../data/repos";

/* ─── Helpers ─────────────────────────────────────────────────────── */
function getWeekRange() {
  const now = new Date();
  const day = now.getDay();
  const mon = new Date(now);
  mon.setDate(now.getDate() - ((day + 6) % 7));
  const fri = new Date(mon);
  fri.setDate(mon.getDate() + 4);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
  return `${fmt(mon)} → ${fmt(fri)}`;
}

function getSprintWeek() {
  const start = new Date("2026-02-23");
  const now = new Date();
  const diff = Math.floor(
    (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 7)
  );
  return Math.max(1, diff + 1);
}

const PHASE_COLORS: Record<string, string> = {
  strategy: "#4a7c59",
  design: "#5c6bc0",
  build: "#e67e22",
  qa: "#c0392b",
  ship: "#8e44ad",
};

const STATUS_COLORS: Record<string, string> = {
  active: "#2ecc71",
  parked: "#f39c12",
  frozen: "#636e72",
  archived: "#2d3436",
};

/* ─── Phase strip ─────────────────────────────────────────────────── */
function PhaseStrip({ current }: { current: string }) {
  return (
    <div className="flex gap-0.5 mt-3">
      {phases.map((p) => {
        const isActive = p.id === current;
        const isPast =
          phases.findIndex((x) => x.id === current) > phases.indexOf(p);
        return (
          <div
            key={p.id}
            title={p.name}
            className="flex-1 h-1 rounded-full transition-all"
            style={{
              background: isActive
                ? PHASE_COLORS[p.id]
                : isPast
                  ? `${PHASE_COLORS[p.id]}50`
                  : "#27272a",
            }}
          />
        );
      })}
    </div>
  );
}

/* ─── WIP limit modal ─────────────────────────────────────────────── */
function WIPModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#17191e] border border-zinc-800 rounded-xl p-6 max-w-sm mx-4 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <h3
            className="text-base"
            style={{ fontFamily: "'DM Serif Display', serif", color: "#f0f0f0" }}
          >
            WIP Limit Reached
          </h3>
        </div>
        <p className="text-sm text-zinc-400 leading-relaxed">
          You already have <strong className="text-zinc-200">{ACTIVE_LIMIT} active projects</strong>.
          Park one of your active repos before activating another.
        </p>
        <p className="font-mono text-[11px] text-zinc-600">
          Rule: max {ACTIVE_LIMIT} active · focus over volume
        </p>
        <button
          onClick={onClose}
          className="mt-1 w-full py-2 rounded-lg bg-zinc-800 text-zinc-200 text-sm hover:bg-zinc-700 transition-colors"
        >
          Got it
        </button>
      </motion.div>
    </div>
  );
}

/* ─── Active repo card ────────────────────────────────────────────── */
function ActiveCard({
  repo,
  setFocusToday,
}: {
  repo: Repo;
  setFocusToday: (id: string, val: string) => Promise<void>;
}) {
  const phase = phases.find((p) => p.id === repo.phase);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-3 p-4 rounded-xl border border-zinc-800 bg-[#111318]"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: STATUS_COLORS.active }}
            />
            <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
              active · p{repo.priority}
            </span>
          </div>
          <Link
            to={`/projects/${repo.id}`}
            className="text-sm font-medium text-zinc-100 hover:text-white transition-colors"
          >
            {repo.name}
          </Link>
          <p className="text-[11px] text-zinc-600 mt-0.5">{repo.strategicRole}</p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {repo.deployUrl && (
            <a
              href={repo.deployUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="View deploy"
              className="p-1.5 rounded border border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
          <a
            href={repo.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub"
            className="p-1.5 rounded border border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600 transition-colors"
          >
            <Github className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Phase strip */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest">
            Phase
          </span>
          <span
            className="font-mono text-[9px] px-1.5 py-0.5 rounded"
            style={{
              color: phase ? PHASE_COLORS[phase.id] : "#666",
              background: phase ? `${PHASE_COLORS[phase.id]}15` : "#1a1a1a",
            }}
          >
            {phase?.name ?? repo.phase}
          </span>
        </div>
        <PhaseStrip current={repo.phase} />
      </div>

      {/* Sprint goal */}
      <div>
        <span className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest block mb-1">
          Sprint goal
        </span>
        <p className="text-[11px] text-zinc-400 leading-relaxed">{repo.sprintGoal}</p>
      </div>

      {/* Today's focus */}
      <div>
        <span className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest block mb-1">
          Today's focus
        </span>
        <input
          type="text"
          defaultValue={repo.focusToday ?? ""}
          onBlur={(e) => setFocusToday(repo.id, e.target.value)}
          placeholder="What are you shipping today?"
          className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-[11px] text-zinc-300 placeholder-zinc-700 outline-none focus:border-zinc-600 transition-colors font-mono"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <a
          href={`${repo.githubUrl}/issues`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center py-1.5 rounded border border-zinc-800 text-[10px] font-mono text-zinc-500 hover:text-zinc-300 hover:border-zinc-600 transition-colors"
        >
          Issues
        </a>
        <Link
          to={`/projects/${repo.id}`}
          className="flex-1 text-center py-1.5 rounded border border-zinc-800 text-[10px] font-mono text-zinc-500 hover:text-zinc-300 hover:border-zinc-600 transition-colors"
        >
          Detail →
        </Link>
      </div>
    </motion.div>
  );
}

/* ─── Parked card ─────────────────────────────────────────────────── */
function ParkedCard({
  repo,
  onActivate,
}: {
  repo: Repo;
  onActivate: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start justify-between gap-3 p-3 rounded-lg border border-zinc-800/60 bg-[#0f1114]"
    >
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: STATUS_COLORS.parked }}
          />
          <span className="text-[12px] text-zinc-300">{repo.name}</span>
        </div>
        {repo.parkReason && (
          <p className="text-[10px] text-zinc-600 pl-3.5">{repo.parkReason}</p>
        )}
      </div>
      <button
        onClick={onActivate}
        className="flex-shrink-0 text-[10px] font-mono px-2.5 py-1 rounded border border-zinc-700 text-zinc-500 hover:text-zinc-300 hover:border-zinc-500 transition-colors whitespace-nowrap"
      >
        Activate →
      </button>
    </motion.div>
  );
}

/* ─── Frozen section (collapsed) ─────────────────────────────────── */
function FrozenSection({ repos: frozen }: { repos: Repo[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 text-[10px] font-mono text-zinc-600 hover:text-zinc-400 transition-colors"
      >
        {open ? (
          <ChevronUp className="w-3 h-3" />
        ) : (
          <ChevronDown className="w-3 h-3" />
        )}
        {open ? "Collapse" : `Show ${frozen.length} frozen / archived`}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden flex flex-col gap-1.5"
          >
            {frozen.map((repo) => (
              <div
                key={repo.id}
                className="flex items-center gap-2 p-2.5 rounded border border-zinc-900 text-zinc-600"
              >
                <div
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{
                    background:
                      repo.status === "archived"
                        ? STATUS_COLORS.archived
                        : STATUS_COLORS.frozen,
                  }}
                />
                <span className="text-[11px]">{repo.name}</span>
                {repo.parkReason && (
                  <span className="text-[10px] text-zinc-700 truncate">
                    — {repo.parkReason}
                  </span>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Dashboard ───────────────────────────────────────────────────── */
export function Dashboard() {
  const { repos, activeCount, atLimit, loaded, setStatus, setFocusToday } = useRepos();
  const [wipBlocked, setWipBlocked] = useState(false);

  const activeRepos = repos.filter((r) => r.status === "active");
  const parkedRepos = repos.filter((r) => r.status === "parked");
  const frozenRepos = repos.filter(
    (r) => r.status === "frozen" || r.status === "archived"
  );

  async function handleActivate(id: string) {
    const ok = await setStatus(id, "active");
    if (!ok) setWipBlocked(true);
  }

  return (
    <div
      className="min-h-screen text-zinc-100"
      style={{ background: "#0d0f12", fontFamily: "'Inter', sans-serif" }}
    >
      {wipBlocked && <WIPModal onClose={() => setWipBlocked(false)} />}

      <div className="max-w-[1100px] mx-auto px-6 py-10">

        {/* ── Top bar ─────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="p-2 rounded-lg border border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600 transition-colors"
              title="Back to OS poster"
            >
              <Home className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-3 mb-0.5">
                <span
                  className="text-xl"
                  style={{ fontFamily: "'DM Serif Display', serif", color: "#f0f0f0" }}
                >
                  Sprint Week {getSprintWeek()}
                </span>
                <span className="font-mono text-[10px] text-zinc-500">
                  {getWeekRange()}
                </span>
              </div>
              {/* WIP counter */}
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {Array.from({ length: ACTIVE_LIMIT }).map((_, i) => (
                    <div
                      key={i}
                      className="w-4 h-1.5 rounded-full transition-colors"
                      style={{
                        background:
                          i < activeCount
                            ? atLimit
                              ? STATUS_COLORS.parked
                              : STATUS_COLORS.active
                            : "#27272a",
                      }}
                    />
                  ))}
                </div>
                <span
                  className="font-mono text-[10px]"
                  style={{ color: atLimit ? STATUS_COLORS.parked : "#52525b" }}
                >
                  {activeCount}/{ACTIVE_LIMIT} active
                  {atLimit && " · WIP LIMIT MET"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/sprint"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200 transition-colors text-[12px] font-mono"
            >
              Sprint plan <ArrowUpRight className="w-3 h-3" />
            </Link>
            <Link
              to="/daily"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 text-zinc-900 hover:bg-white transition-colors text-[12px] font-mono"
            >
              Daily loop
            </Link>
          </div>
        </div>

        {/* ── Loading skeleton ─────────────────────────────────── */}
        {!loaded && (
          <div className="flex gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex-1 h-48 rounded-xl border border-zinc-800 bg-[#111318] animate-pulse"
              />
            ))}
          </div>
        )}

        {/* ── Three-column board ──────────────────────────────── */}
        {loaded && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Active */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: STATUS_COLORS.active }}
                />
                <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">
                  Active ({activeCount}/{ACTIVE_LIMIT})
                </span>
              </div>
              {activeRepos.map((repo) => (
                <ActiveCard
                  key={repo.id}
                  repo={repo}
                  setFocusToday={setFocusToday}
                />
              ))}
            </div>

            {/* Parked */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: STATUS_COLORS.parked }}
                />
                <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">
                  Parked ({parkedRepos.length})
                </span>
              </div>
              {parkedRepos.map((repo) => (
                <ParkedCard
                  key={repo.id}
                  repo={repo}
                  onActivate={() => handleActivate(repo.id)}
                />
              ))}
            </div>

            {/* Frozen + archived */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: STATUS_COLORS.frozen }}
                />
                <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">
                  Frozen / Archived ({frozenRepos.length})
                </span>
              </div>
              <FrozenSection repos={frozenRepos} />
            </div>
          </div>
        )}

        {/* ── Repo index ──────────────────────────────────────── */}
        {loaded && (
          <div className="mt-12 border-t border-zinc-900 pt-8">
            <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-600 block mb-4">
              All repos ({repos.length})
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {repos.map((repo) => (
                <Link
                  key={repo.id}
                  to={`/projects/${repo.id}`}
                  className="flex items-center gap-2.5 p-3 rounded-lg border border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/30 transition-colors group"
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: STATUS_COLORS[repo.status] }}
                  />
                  <span className="text-[12px] text-zinc-400 group-hover:text-zinc-200 transition-colors truncate">
                    {repo.name}
                  </span>
                  <ArrowUpRight className="w-3 h-3 text-zinc-700 group-hover:text-zinc-500 ml-auto flex-shrink-0 transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

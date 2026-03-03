import { useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { ArrowLeft, Lock, RotateCcw, Check, ArrowRight } from "lucide-react";
import { repos, ACTIVE_LIMIT, type Repo, type RepoStatus } from "../../data/repos";

/* ─── Design tokens ───────────────────────────────────────────────── */
const BG      = "#050810";
const SURFACE = "rgba(12, 15, 30, 0.75)";
const BORDER  = "rgba(255, 255, 255, 0.07)";
const TEXT_PRIMARY   = "#f8fafc";
const TEXT_SECONDARY = "#94a3b8";
const TEXT_MUTED     = "#475569";
const MONO = "'JetBrains Mono', monospace";

const STATUS_NEON: Record<RepoStatus, string> = {
  active:   "#34d399",
  parked:   "#fb923c",
  frozen:   "#818cf8",
  archived: "#475569",
};

/* ─── Storage ─────────────────────────────────────────────────────── */
const SPRINT_KEY = "os_sprint_plan";

interface SprintPlan {
  week: number;
  lockedAt: string;
  statuses: Record<string, RepoStatus>;
  goals: Record<string, string>;
  outcomes: Record<string, string>;
  shipped: Record<string, boolean>;
}

function loadPlan(): SprintPlan | null {
  try {
    const raw = localStorage.getItem(SPRINT_KEY);
    return raw ? (JSON.parse(raw) as SprintPlan) : null;
  } catch { return null; }
}

function savePlan(plan: SprintPlan) {
  localStorage.setItem(SPRINT_KEY, JSON.stringify(plan));
}

function getSprintWeek() {
  const start = new Date("2026-02-23");
  const now = new Date();
  const diff = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 7));
  return Math.max(1, diff + 1);
}

function getDaysRemaining() {
  const day = new Date().getDay();
  return day <= 5 ? 5 - day : 5 + 7 - day;
}

/* ─── Animated background ─────────────────────────────────────────── */
function BackgroundScene() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -24, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "absolute", top: "-25%", left: "-20%", width: "72%", height: "72%", background: "radial-gradient(ellipse at center, rgba(99,102,241,0.18) 0%, rgba(59,130,246,0.10) 40%, transparent 70%)", filter: "blur(72px)" }}
      />
      <motion.div
        animate={{ x: [0, -30, 0], y: [0, 28, 0], scale: [1, 1.06, 1] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "absolute", top: "5%", right: "-22%", width: "62%", height: "62%", background: "radial-gradient(ellipse at center, rgba(168,85,247,0.16) 0%, rgba(139,92,246,0.08) 45%, transparent 70%)", filter: "blur(80px)" }}
      />
      <motion.div
        animate={{ x: [0, 20, 0], y: [0, -32, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "absolute", bottom: "-20%", left: "25%", width: "55%", height: "55%", background: "radial-gradient(ellipse at center, rgba(52,211,153,0.13) 0%, rgba(16,185,129,0.06) 45%, transparent 70%)", filter: "blur(90px)" }}
      />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "32px 32px", maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)" }} />
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[9px] tracking-widest uppercase font-semibold" style={{ fontFamily: MONO, color: TEXT_MUTED, letterSpacing: "0.12em" }}>
      {children}
    </span>
  );
}

/* ─── Repo row ────────────────────────────────────────────────────── */
function RepoRow({ repo, status, onStatus, locked }: { repo: Repo; status: RepoStatus; onStatus: (s: RepoStatus) => void; locked: boolean }) {
  const options: RepoStatus[] = ["active", "parked", "frozen"];
  return (
    <div className="flex items-center gap-3 py-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: STATUS_NEON[status] }} />
      <span className="flex-1 text-[12px] truncate" style={{ color: TEXT_SECONDARY }}>{repo.name}</span>
      <div className="flex gap-1">
        {options.map((s) => (
          <button
            key={s}
            disabled={locked}
            onClick={() => onStatus(s)}
            className="px-2 py-0.5 rounded text-[10px] transition-all"
            style={{
              fontFamily: MONO,
              background: status === s ? `${STATUS_NEON[s]}20` : "rgba(255,255,255,0.03)",
              border: `1px solid ${status === s ? `${STATUS_NEON[s]}50` : BORDER}`,
              color: status === s ? STATUS_NEON[s] : TEXT_MUTED,
              opacity: locked ? 0.4 : 1,
              cursor: locked ? "not-allowed" : "pointer",
            }}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Sprint planning ─────────────────────────────────────────────── */
export function SprintPlanning() {
  const week = getSprintWeek();
  const existing = loadPlan();
  const isCurrentWeek = existing?.week === week;

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [locked, setLocked] = useState(isCurrentWeek && !!existing?.lockedAt);

  const [statuses, setStatuses] = useState<Record<string, RepoStatus>>(() => {
    if (isCurrentWeek && existing?.statuses) return existing.statuses;
    return Object.fromEntries(repos.map((r) => [r.id, r.status]));
  });

  const [goals, setGoals] = useState<Record<string, string>>(() => {
    if (isCurrentWeek && existing?.goals) return existing.goals;
    return Object.fromEntries(repos.map((r) => [r.id, r.sprintGoal]));
  });

  const [outcomes, setOutcomes] = useState<Record<string, string>>(() => {
    if (isCurrentWeek && existing?.outcomes) return existing.outcomes;
    return {};
  });

  const [shipped, setShipped] = useState<Record<string, boolean>>(() => {
    if (isCurrentWeek && existing?.shipped) return existing.shipped;
    return {};
  });

  const activeIds = repos.filter((r) => statuses[r.id] === "active").map((r) => r.id);
  const activeCount = activeIds.length;
  const atLimit = activeCount >= ACTIVE_LIMIT;
  const activeRepoObjects = repos.filter((r) => activeIds.includes(r.id));

  function setStatus(id: string, s: RepoStatus) {
    if (s === "active" && !activeIds.includes(id) && atLimit) return;
    setStatuses((prev) => ({ ...prev, [id]: s }));
  }

  function lockSprint() {
    const plan: SprintPlan = { week, lockedAt: new Date().toISOString(), statuses, goals, outcomes, shipped };
    savePlan(plan);
    setLocked(true);
    setStep(4);
  }

  function resetSprint() {
    localStorage.removeItem(SPRINT_KEY);
    setLocked(false);
    setStep(1);
    setStatuses(Object.fromEntries(repos.map((r) => [r.id, r.status])));
    setGoals(Object.fromEntries(repos.map((r) => [r.id, r.sprintGoal])));
    setOutcomes({});
    setShipped({});
  }

  function toggleShipped(id: string) {
    const next = { ...shipped, [id]: !shipped[id] };
    setShipped(next);
    if (locked) {
      const plan = loadPlan();
      if (plan) savePlan({ ...plan, shipped: next });
    }
  }

  const STEP_LABELS = ["1. Repos", "2. Goals", "3. Outcomes", "4. Review"];

  return (
    <div className="min-h-screen" style={{ background: BG, fontFamily: "'Inter', sans-serif", color: TEXT_PRIMARY }}>
      <BackgroundScene />
      <div className="relative max-w-[720px] mx-auto px-6 py-8">

        {/* ── Header ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-3 mb-8"
        >
          <Link
            to="/dashboard"
            className="p-2 rounded-xl transition-opacity hover:opacity-70 flex-shrink-0"
            style={{ background: SURFACE, backdropFilter: "blur(12px)", border: `1px solid ${BORDER}`, color: TEXT_MUTED }}
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex-1">
            <div className="mb-0.5">
              <span
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider"
                style={{ fontFamily: MONO, color: "#60a5fa", background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.22)" }}
              >
                <span className="w-1 h-1 rounded-full" style={{ background: "#3b82f6", boxShadow: "0 0 6px #3b82f6" }} />
                Sprint Planning
              </span>
            </div>
            <h1
              className="text-xl font-bold tracking-tight"
              style={{ background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 35%, #94a3b8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
            >
              Sprint Week {week}
            </h1>
            <p className="text-[10px] mt-0.5" style={{ fontFamily: MONO, color: TEXT_MUTED }}>
              {locked ? `Locked · ${getDaysRemaining()} days remaining` : "Monday planning session"}
            </p>
          </div>
          {locked && (
            <button
              onClick={resetSprint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] transition-opacity hover:opacity-70"
              style={{ fontFamily: MONO, background: SURFACE, backdropFilter: "blur(12px)", border: `1px solid ${BORDER}`, color: TEXT_MUTED }}
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          )}
        </motion.div>

        {/* ── Step nav ───────────────────────────────────────────── */}
        <div className="flex gap-1.5 mb-8 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${BORDER}` }}>
          {([1, 2, 3, 4] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStep(s)}
              className="flex-1 py-1.5 rounded-lg text-[10px] transition-all"
              style={{
                fontFamily: MONO,
                background: step === s ? SURFACE : "transparent",
                border: step === s ? `1px solid ${BORDER}` : "1px solid transparent",
                color: step === s ? TEXT_PRIMARY : TEXT_MUTED,
                backdropFilter: step === s ? "blur(12px)" : "none",
              }}
            >
              {STEP_LABELS[s - 1]}
            </button>
          ))}
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col gap-6"
        >
          {/* ── Step 1: Repo status ──────────────────────────────── */}
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <Label>Set status for each repo</Label>
                <span className="text-[10px]" style={{ fontFamily: MONO, color: atLimit ? STATUS_NEON.parked : TEXT_MUTED }}>
                  {activeCount}/{ACTIVE_LIMIT} active{atLimit && " · LIMIT"}
                </span>
              </div>
              <div
                className="px-4 rounded-xl"
                style={{ background: SURFACE, backdropFilter: "blur(24px)", border: `1px solid ${BORDER}` }}
              >
                {repos.map((repo) => (
                  <RepoRow key={repo.id} repo={repo} status={statuses[repo.id]} onStatus={(s) => setStatus(repo.id, s)} locked={locked} />
                ))}
              </div>
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-2 justify-end text-[12px] transition-opacity hover:opacity-70"
                style={{ fontFamily: MONO, color: TEXT_SECONDARY }}
              >
                Next: Set goals <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* ── Step 2: Sprint goals ─────────────────────────────── */}
          {step === 2 && (
            <div className="flex flex-col gap-4">
              <Label>Sprint goal per active repo</Label>
              {activeRepoObjects.map((repo) => (
                <div
                  key={repo.id}
                  className="p-4 rounded-xl flex flex-col gap-2"
                  style={{ background: SURFACE, backdropFilter: "blur(24px)", border: `1px solid ${BORDER}` }}
                >
                  <span className="text-[12px] font-medium" style={{ color: TEXT_SECONDARY }}>{repo.name}</span>
                  <input
                    type="text"
                    value={goals[repo.id] ?? ""}
                    onChange={(e) => setGoals((prev) => ({ ...prev, [repo.id]: e.target.value }))}
                    disabled={locked}
                    placeholder="What ships this week?"
                    className="w-full rounded-lg px-3 py-1.5 text-[11px] outline-none transition-colors disabled:opacity-50"
                    style={{ fontFamily: MONO, background: "rgba(255,255,255,0.04)", border: `1px solid ${BORDER}`, color: TEXT_PRIMARY }}
                  />
                </div>
              ))}
              <button
                onClick={() => setStep(3)}
                className="flex items-center gap-2 justify-end text-[12px] transition-opacity hover:opacity-70"
                style={{ fontFamily: MONO, color: TEXT_SECONDARY }}
              >
                Next: Weekly outcomes <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* ── Step 3: Outcomes ─────────────────────────────────── */}
          {step === 3 && (
            <div className="flex flex-col gap-4">
              <Label>Define this week's outcome (one sentence per active repo)</Label>
              {activeRepoObjects.map((repo) => (
                <div
                  key={repo.id}
                  className="p-4 rounded-xl flex flex-col gap-2"
                  style={{ background: SURFACE, backdropFilter: "blur(24px)", border: `1px solid ${BORDER}` }}
                >
                  <span className="text-[12px] font-medium" style={{ color: TEXT_SECONDARY }}>{repo.name}</span>
                  <textarea
                    value={outcomes[repo.id] ?? ""}
                    onChange={(e) => setOutcomes((prev) => ({ ...prev, [repo.id]: e.target.value }))}
                    disabled={locked}
                    placeholder='"Ship the repo registry UI so the dashboard is usable"'
                    rows={2}
                    className="w-full rounded-lg px-3 py-2 text-[11px] outline-none resize-none disabled:opacity-50 transition-colors"
                    style={{ fontFamily: MONO, background: "rgba(255,255,255,0.04)", border: `1px solid ${BORDER}`, color: TEXT_PRIMARY }}
                  />
                </div>
              ))}
              {!locked && (
                <button
                  onClick={lockSprint}
                  className="flex items-center gap-2 justify-center py-2.5 rounded-xl text-[12px] font-semibold transition-opacity hover:opacity-90"
                  style={{ fontFamily: MONO, background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #a21caf 100%)", color: "#fff", boxShadow: "0 0 28px rgba(124,58,237,0.4), inset 0 1px 0 rgba(255,255,255,0.15)" }}
                >
                  <Lock className="w-3.5 h-3.5" />
                  Lock Sprint
                </button>
              )}
            </div>
          )}

          {/* ── Step 4: Friday review ────────────────────────────── */}
          {step === 4 && (
            <div className="flex flex-col gap-4">
              <Label>Friday review — mark what shipped</Label>
              {activeRepoObjects.map((repo) => (
                <div
                  key={repo.id}
                  className="p-4 rounded-xl flex flex-col gap-3"
                  style={{ background: SURFACE, backdropFilter: "blur(24px)", border: `1px solid ${BORDER}` }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-medium" style={{ color: TEXT_SECONDARY }}>{repo.name}</span>
                    <button
                      onClick={() => toggleShipped(repo.id)}
                      className="flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-lg transition-all"
                      style={shipped[repo.id]
                        ? { fontFamily: MONO, background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.35)", color: "#34d399" }
                        : { fontFamily: MONO, background: "rgba(255,255,255,0.04)", border: `1px solid ${BORDER}`, color: TEXT_MUTED }
                      }
                    >
                      {shipped[repo.id] ? <><Check className="w-3 h-3" /> Shipped</> : "Rolled over →"}
                    </button>
                  </div>
                  {goals[repo.id] && (
                    <p className="text-[11px]" style={{ color: TEXT_MUTED }}>Goal: {goals[repo.id]}</p>
                  )}
                  {outcomes[repo.id] && (
                    <p className="text-[11px] italic" style={{ color: TEXT_MUTED }}>{outcomes[repo.id]}</p>
                  )}
                </div>
              ))}

              {activeRepoObjects.length > 0 && (
                <div
                  className="mt-2 p-4 rounded-xl flex flex-col gap-3"
                  style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${BORDER}` }}
                >
                  <Label>Sprint summary</Label>
                  <pre className="text-[10px] leading-relaxed whitespace-pre-wrap" style={{ fontFamily: MONO, color: TEXT_SECONDARY }}>
                    {`Week ${week} Review\n${"─".repeat(30)}\n${activeRepoObjects
                      .map((r) => `${shipped[r.id] ? "✓" : "→"} ${r.name}\n  ${goals[r.id] ?? "—"}`)
                      .join("\n")}`}
                  </pre>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

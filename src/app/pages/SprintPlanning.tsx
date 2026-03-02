import { useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { ArrowLeft, Lock, RotateCcw, Check, ArrowRight } from "lucide-react";
import { repos, ACTIVE_LIMIT, type Repo, type RepoStatus } from "../../data/repos";

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
  } catch {
    return null;
  }
}

function savePlan(plan: SprintPlan) {
  localStorage.setItem(SPRINT_KEY, JSON.stringify(plan));
}

function getSprintWeek() {
  const start = new Date("2026-02-23");
  const now = new Date();
  const diff = Math.floor(
    (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 7)
  );
  return Math.max(1, diff + 1);
}

function getDaysRemaining() {
  const now = new Date();
  const day = now.getDay();
  const daysToFri = day <= 5 ? 5 - day : 5 + 7 - day;
  return daysToFri;
}

/* ─── Colors ──────────────────────────────────────────────────────── */
const STATUS_COLORS: Record<RepoStatus, string> = {
  active: "#2ecc71",
  parked: "#f39c12",
  frozen: "#636e72",
  archived: "#2d3436",
};

/* ─── Repo row ────────────────────────────────────────────────────── */
function RepoRow({
  repo,
  status,
  onStatus,
  locked,
}: {
  repo: Repo;
  status: RepoStatus;
  onStatus: (s: RepoStatus) => void;
  locked: boolean;
}) {
  const options: RepoStatus[] = ["active", "parked", "frozen"];
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-zinc-900 last:border-0">
      <div
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: STATUS_COLORS[status] }}
      />
      <span className="flex-1 text-[12px] text-zinc-300 truncate">
        {repo.name}
      </span>
      <div className="flex gap-1">
        {options.map((s) => (
          <button
            key={s}
            disabled={locked}
            onClick={() => onStatus(s)}
            className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
              status === s
                ? "text-zinc-900"
                : "text-zinc-600 hover:text-zinc-400 bg-transparent border border-zinc-800 hover:border-zinc-600"
            } ${locked ? "opacity-40 cursor-not-allowed" : ""}`}
            style={
              status === s
                ? { background: STATUS_COLORS[s], border: "none" }
                : {}
            }
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

  const activeIds = repos
    .filter((r) => statuses[r.id] === "active")
    .map((r) => r.id);
  const activeCount = activeIds.length;
  const atLimit = activeCount >= ACTIVE_LIMIT;

  function setStatus(id: string, s: RepoStatus) {
    if (s === "active" && !activeIds.includes(id) && atLimit) return;
    setStatuses((prev) => ({ ...prev, [id]: s }));
  }

  function lockSprint() {
    const plan: SprintPlan = {
      week,
      lockedAt: new Date().toISOString(),
      statuses,
      goals,
      outcomes,
      shipped,
    };
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

  const activeRepoObjects = repos.filter((r) => activeIds.includes(r.id));

  return (
    <div
      className="min-h-screen text-zinc-100"
      style={{ background: "#0d0f12", fontFamily: "'Inter', sans-serif" }}
    >
      <div className="max-w-[720px] mx-auto px-6 py-10">

        {/* ── Header ──────────────────────────────────────────── */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            to="/dashboard"
            className="p-2 rounded-lg border border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex-1">
            <h1
              className="text-xl"
              style={{ fontFamily: "'DM Serif Display', serif", color: "#f0f0f0" }}
            >
              Sprint Week {week} — Planning
            </h1>
            <p className="font-mono text-[10px] text-zinc-600 mt-0.5">
              {locked
                ? `Locked · ${getDaysRemaining()} days remaining`
                : "Monday planning session"}
            </p>
          </div>
          {locked && (
            <button
              onClick={resetSprint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600 transition-colors text-[11px] font-mono"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          )}
        </div>

        {/* ── Step nav ─────────────────────────────────────────── */}
        <div className="flex gap-2 mb-8">
          {([1, 2, 3, 4] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStep(s)}
              className={`flex-1 py-1.5 rounded font-mono text-[10px] transition-colors ${
                step === s
                  ? "bg-zinc-800 text-zinc-100"
                  : "text-zinc-600 hover:text-zinc-400"
              }`}
            >
              {s === 1
                ? "1. Repos"
                : s === 2
                  ? "2. Goals"
                  : s === 3
                    ? "3. Outcomes"
                    : "4. Review"}
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
          {/* ── Step 1: Repo status ──────────────────────────── */}
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] tracking-widest text-zinc-600 uppercase">
                  Set status for each repo
                </span>
                <span
                  className="font-mono text-[10px]"
                  style={{ color: atLimit ? "#f39c12" : "#52525b" }}
                >
                  {activeCount}/{ACTIVE_LIMIT} active
                  {atLimit && " · LIMIT"}
                </span>
              </div>
              <div className="p-4 rounded-xl border border-zinc-800 bg-[#111318]">
                {repos.map((repo) => (
                  <RepoRow
                    key={repo.id}
                    repo={repo}
                    status={statuses[repo.id]}
                    onStatus={(s) => setStatus(repo.id, s)}
                    locked={locked}
                  />
                ))}
              </div>
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-2 justify-end text-[12px] font-mono text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                Next: Set goals <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* ── Step 2: Sprint goals ─────────────────────────── */}
          {step === 2 && (
            <div className="flex flex-col gap-4">
              <span className="font-mono text-[9px] tracking-widest text-zinc-600 uppercase">
                Sprint goal per active repo
              </span>
              {activeRepoObjects.map((repo) => (
                <div
                  key={repo.id}
                  className="p-4 rounded-xl border border-zinc-800 bg-[#111318] flex flex-col gap-2"
                >
                  <span className="text-[12px] text-zinc-300">{repo.name}</span>
                  <input
                    type="text"
                    value={goals[repo.id] ?? ""}
                    onChange={(e) =>
                      setGoals((prev) => ({
                        ...prev,
                        [repo.id]: e.target.value,
                      }))
                    }
                    disabled={locked}
                    placeholder="What ships this week?"
                    className="bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-[11px] text-zinc-300 placeholder-zinc-700 outline-none focus:border-zinc-600 transition-colors font-mono disabled:opacity-50"
                  />
                </div>
              ))}
              <button
                onClick={() => setStep(3)}
                className="flex items-center gap-2 justify-end text-[12px] font-mono text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                Next: Weekly outcomes <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* ── Step 3: Outcomes ─────────────────────────────── */}
          {step === 3 && (
            <div className="flex flex-col gap-4">
              <span className="font-mono text-[9px] tracking-widest text-zinc-600 uppercase">
                Define this week's outcome (one sentence per active repo)
              </span>
              {activeRepoObjects.map((repo) => (
                <div
                  key={repo.id}
                  className="p-4 rounded-xl border border-zinc-800 bg-[#111318] flex flex-col gap-2"
                >
                  <span className="text-[12px] text-zinc-300">{repo.name}</span>
                  <textarea
                    value={outcomes[repo.id] ?? ""}
                    onChange={(e) =>
                      setOutcomes((prev) => ({
                        ...prev,
                        [repo.id]: e.target.value,
                      }))
                    }
                    disabled={locked}
                    placeholder='e.g. "Ship the repo registry UI so the dashboard is usable"'
                    rows={2}
                    className="bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-[11px] text-zinc-300 placeholder-zinc-700 outline-none focus:border-zinc-600 transition-colors resize-none disabled:opacity-50"
                  />
                </div>
              ))}
              {!locked && (
                <button
                  onClick={lockSprint}
                  className="flex items-center gap-2 justify-center py-2.5 rounded-lg bg-zinc-100 text-zinc-900 hover:bg-white transition-colors text-[12px] font-mono"
                >
                  <Lock className="w-3.5 h-3.5" />
                  Lock Sprint
                </button>
              )}
            </div>
          )}

          {/* ── Step 4: Friday review ────────────────────────── */}
          {step === 4 && (
            <div className="flex flex-col gap-4">
              <span className="font-mono text-[9px] tracking-widest text-zinc-600 uppercase">
                Friday review — mark what shipped
              </span>
              {activeRepoObjects.map((repo) => (
                <div
                  key={repo.id}
                  className="p-4 rounded-xl border border-zinc-800 bg-[#111318] flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-zinc-300">{repo.name}</span>
                    <button
                      onClick={() => toggleShipped(repo.id)}
                      className="flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded border transition-colors"
                      style={
                        shipped[repo.id]
                          ? {
                              borderColor: "#2ecc7150",
                              color: "#2ecc71",
                              background: "#2ecc7110",
                            }
                          : {
                              borderColor: "#3f3f46",
                              color: "#71717a",
                            }
                      }
                    >
                      {shipped[repo.id] ? (
                        <>
                          <Check className="w-3 h-3" /> Shipped
                        </>
                      ) : (
                        "Rolled over →"
                      )}
                    </button>
                  </div>
                  {goals[repo.id] && (
                    <p className="text-[11px] text-zinc-600">
                      Goal: {goals[repo.id]}
                    </p>
                  )}
                  {outcomes[repo.id] && (
                    <p className="text-[11px] text-zinc-500 italic">
                      {outcomes[repo.id]}
                    </p>
                  )}
                </div>
              ))}

              {/* Summary block */}
              {activeRepoObjects.length > 0 && (
                <div className="mt-2 p-4 rounded-xl border border-zinc-800 bg-zinc-900">
                  <span className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest block mb-3">
                    Sprint summary
                  </span>
                  <pre className="font-mono text-[10px] text-zinc-400 whitespace-pre-wrap leading-relaxed">
                    {`Week ${week} Review\n${"─".repeat(30)}\n${activeRepoObjects
                      .map(
                        (r) =>
                          `${shipped[r.id] ? "✓" : "→"} ${r.name}\n  ${goals[r.id] ?? "—"}`
                      )
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

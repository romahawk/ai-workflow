import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { ArrowLeft, RotateCcw } from "lucide-react";

/* ─── Checklist definition ────────────────────────────────────────── */
const STEPS = [
  {
    id: 1,
    label: "Open ROADMAP — confirm today's outcome",
    note: "One sentence: 'Today I will ship X so that Y.'",
  },
  {
    id: 2,
    label: "Check active Issues — pick ONE",
    note: "Max 2 in-flight. If you can't pick one, something is wrong with scope.",
  },
  {
    id: 3,
    label: "Create branch: type/description",
    note: "e.g. feat/dashboard-wip-counter or fix/mobile-overflow",
  },
  {
    id: 4,
    label: "Write acceptance criteria BEFORE coding",
    note: "If you can't write them, the scope is not clear enough.",
  },
  {
    id: 5,
    label: "Implement minimum viable change",
    note: "No scope creep. If you discover new work, open a new Issue.",
  },
  {
    id: 6,
    label: "Test locally against acceptance criteria",
    note: "Run npm run build and npm run lint. Both must exit 0.",
  },
  {
    id: 7,
    label: "Open PR using template, link Issue",
    note: "Fill every section. No placeholders. Closes #N in the body.",
  },
  {
    id: 8,
    label: "Merge PR, update CHANGELOG",
    note: "CHANGELOG entry for every user-facing change.",
  },
  {
    id: 9,
    label: "Confirm Vercel deploy succeeded",
    note: "If not deployed, it doesn't count.",
  },
  {
    id: 10,
    label: "Close Issue, log outcome",
    note: "Update ROADMAP if a week outcome changed.",
  },
];

/* ─── Storage ─────────────────────────────────────────────────────── */
function todayKey() {
  return `os_daily_${new Date().toISOString().slice(0, 10)}`;
}

function loadChecked(): Record<number, boolean> {
  try {
    return JSON.parse(localStorage.getItem(todayKey()) ?? "{}");
  } catch {
    return {};
  }
}

function saveChecked(data: Record<number, boolean>) {
  localStorage.setItem(todayKey(), JSON.stringify(data));
}

/* ─── Daily loop ──────────────────────────────────────────────────── */
export function DailyLoop() {
  const [checked, setChecked] = useState<Record<number, boolean>>(loadChecked);
  const [date, setDate] = useState(new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  }));

  // Reset at midnight
  useEffect(() => {
    const interval = setInterval(() => {
      const nowDate = new Date().toLocaleDateString("en-GB", {
        weekday: "long",
        day: "2-digit",
        month: "long",
      });
      if (nowDate !== date) {
        setDate(nowDate);
        setChecked({});
      }
    }, 60_000);
    return () => clearInterval(interval);
  }, [date]);

  function toggle(id: number) {
    const next = { ...checked, [id]: !checked[id] };
    setChecked(next);
    saveChecked(next);
  }

  function reset() {
    localStorage.removeItem(todayKey());
    setChecked({});
  }

  const doneCount = Object.values(checked).filter(Boolean).length;
  const total = STEPS.length;
  const progress = (doneCount / total) * 100;
  const allDone = doneCount === total;

  return (
    <div
      className="min-h-screen text-zinc-100"
      style={{ background: "#0d0f12", fontFamily: "'Inter', sans-serif" }}
    >
      <div className="max-w-[600px] mx-auto px-6 py-10">

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
              Daily Loop
            </h1>
            <p className="font-mono text-[10px] text-zinc-600 mt-0.5">{date}</p>
          </div>
          <button
            onClick={reset}
            title="Reset today's checklist"
            className="p-2 rounded-lg border border-zinc-800 text-zinc-600 hover:text-zinc-400 hover:border-zinc-600 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* ── Progress bar ─────────────────────────────────────── */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[10px] text-zinc-600">
              {doneCount}/{total} steps
            </span>
            <span
              className="font-mono text-[10px]"
              style={{ color: allDone ? "#2ecc71" : "#52525b" }}
            >
              {allDone ? "Complete ✓" : `${Math.round(progress)}%`}
            </span>
          </div>
          <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: allDone ? "#2ecc71" : "#e67e22" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* ── Steps ────────────────────────────────────────────── */}
        <div className="flex flex-col gap-2">
          {STEPS.map((step, i) => {
            const done = !!checked[step.id];
            const prevDone = i === 0 || !!checked[STEPS[i - 1].id];
            return (
              <motion.button
                key={step.id}
                onClick={() => toggle(step.id)}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${
                  done
                    ? "border-zinc-800/40 bg-zinc-900/30"
                    : prevDone
                      ? "border-zinc-800 bg-[#111318] hover:border-zinc-700"
                      : "border-zinc-900 bg-[#0f1114] opacity-60"
                }`}
              >
                {/* Step number / check */}
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
                  style={{
                    background: done
                      ? "#2ecc71"
                      : prevDone
                        ? "#e67e2215"
                        : "#1a1a1a",
                    border: done
                      ? "none"
                      : `1px solid ${prevDone ? "#e67e2240" : "#27272a"}`,
                  }}
                >
                  {done ? (
                    <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M2 6l3 3 5-5"
                        stroke="#0d0f12"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <span
                      className="font-mono text-[9px]"
                      style={{ color: prevDone ? "#e67e22" : "#3f3f46" }}
                    >
                      {step.id}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-col gap-0.5">
                  <span
                    className={`text-[13px] leading-snug transition-colors ${
                      done ? "text-zinc-600 line-through" : "text-zinc-200"
                    }`}
                  >
                    {step.label}
                  </span>
                  {!done && (
                    <span className="text-[10px] text-zinc-700 leading-relaxed">
                      {step.note}
                    </span>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* ── Completion message ───────────────────────────────── */}
        {allDone && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 rounded-xl border text-center"
            style={{ borderColor: "#2ecc7130", background: "#2ecc7108" }}
          >
            <p
              className="text-base mb-1"
              style={{
                fontFamily: "'DM Serif Display', serif",
                color: "#2ecc71",
              }}
            >
              Day complete.
            </p>
            <p className="font-mono text-[10px] text-zinc-600">
              Proof-of-work or it didn't happen.
            </p>
          </motion.div>
        )}

        {/* ── Footer nav ───────────────────────────────────────── */}
        <div className="mt-10 pt-6 border-t border-zinc-900 flex gap-4">
          <Link
            to="/dashboard"
            className="text-[11px] font-mono text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            ← Dashboard
          </Link>
          <Link
            to="/sprint"
            className="text-[11px] font-mono text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            Sprint plan →
          </Link>
        </div>
      </div>
    </div>
  );
}

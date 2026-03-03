import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { ArrowLeft, RotateCcw } from "lucide-react";

/* ─── Design tokens ───────────────────────────────────────────────── */
const BG      = "#050810";
const SURFACE = "rgba(12, 15, 30, 0.75)";
const BORDER  = "rgba(255, 255, 255, 0.07)";
const TEXT_PRIMARY   = "#f8fafc";
const TEXT_SECONDARY = "#94a3b8";
const TEXT_MUTED     = "#475569";
const MONO = "'JetBrains Mono', monospace";
const NEON_GREEN  = "#34d399";
const NEON_AMBER  = "#fb923c";

/* ─── Checklist definition ────────────────────────────────────────── */
const STEPS = [
  { id: 1,  label: "Open ROADMAP — confirm today's outcome",    note: "One sentence: 'Today I will ship X so that Y.'" },
  { id: 2,  label: "Check active Issues — pick ONE",            note: "Max 2 in-flight. If you can't pick one, something is wrong with scope." },
  { id: 3,  label: "Create branch: type/description",           note: "e.g. feat/dashboard-wip-counter or fix/mobile-overflow" },
  { id: 4,  label: "Write acceptance criteria BEFORE coding",   note: "If you can't write them, the scope is not clear enough." },
  { id: 5,  label: "Implement minimum viable change",           note: "No scope creep. If you discover new work, open a new Issue." },
  { id: 6,  label: "Test locally against acceptance criteria",  note: "Run npm run build and npm run lint. Both must exit 0." },
  { id: 7,  label: "Open PR using template, link Issue",        note: "Fill every section. No placeholders. Closes #N in the body." },
  { id: 8,  label: "Merge PR, update CHANGELOG",               note: "CHANGELOG entry for every user-facing change." },
  { id: 9,  label: "Confirm Vercel deploy succeeded",           note: "If not deployed, it doesn't count." },
  { id: 10, label: "Close Issue, log outcome",                  note: "Update ROADMAP if a week outcome changed." },
];

/* ─── Storage ─────────────────────────────────────────────────────── */
function todayKey() { return `os_daily_${new Date().toISOString().slice(0, 10)}`; }
function loadChecked(): Record<number, boolean> {
  try { return JSON.parse(localStorage.getItem(todayKey()) ?? "{}"); }
  catch { return {}; }
}
function saveChecked(data: Record<number, boolean>) {
  localStorage.setItem(todayKey(), JSON.stringify(data));
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

/* ─── Daily loop ──────────────────────────────────────────────────── */
export function DailyLoop() {
  const [checked, setChecked] = useState<Record<number, boolean>>(loadChecked);
  const [date, setDate] = useState(new Date().toLocaleDateString("en-GB", { weekday: "long", day: "2-digit", month: "long" }));

  useEffect(() => {
    const interval = setInterval(() => {
      const nowDate = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "2-digit", month: "long" });
      if (nowDate !== date) { setDate(nowDate); setChecked({}); }
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
    <div className="min-h-screen" style={{ background: BG, fontFamily: "'Inter', sans-serif", color: TEXT_PRIMARY }}>
      <BackgroundScene />
      <div className="relative max-w-[600px] mx-auto px-6 py-8">

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
                Daily Build Loop
              </span>
            </div>
            <h1
              className="text-xl font-bold tracking-tight"
              style={{ background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 35%, #94a3b8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
            >
              Daily Loop
            </h1>
            <p className="text-[10px] mt-0.5" style={{ fontFamily: MONO, color: TEXT_MUTED }}>{date}</p>
          </div>
          <button
            onClick={reset}
            title="Reset today"
            className="p-2 rounded-xl transition-opacity hover:opacity-70"
            style={{ background: SURFACE, backdropFilter: "blur(12px)", border: `1px solid ${BORDER}`, color: TEXT_MUTED }}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </motion.div>

        {/* ── Progress bar ───────────────────────────────────────── */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px]" style={{ fontFamily: MONO, color: TEXT_MUTED }}>{doneCount}/{total} steps</span>
            <span className="text-[10px]" style={{ fontFamily: MONO, color: allDone ? NEON_GREEN : TEXT_MUTED }}>
              {allDone ? "Complete ✓" : `${Math.round(progress)}%`}
            </span>
          </div>
          <div className="h-0.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: allDone ? NEON_GREEN : NEON_AMBER, boxShadow: `0 0 8px ${allDone ? NEON_GREEN : NEON_AMBER}80` }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* ── Steps ──────────────────────────────────────────────── */}
        <div className="flex flex-col gap-2">
          {STEPS.map((step, i) => {
            const done = !!checked[step.id];
            const prevDone = i === 0 || !!checked[STEPS[i - 1].id];
            const c = NEON_AMBER;

            return (
              <motion.button
                key={step.id}
                onClick={() => toggle(step.id)}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-start gap-3 p-4 rounded-xl text-left transition-all"
                style={{
                  background: done
                    ? "rgba(255,255,255,0.02)"
                    : prevDone
                      ? SURFACE
                      : "rgba(255,255,255,0.01)",
                  backdropFilter: prevDone && !done ? "blur(24px)" : "none",
                  border: done
                    ? "1px solid rgba(255,255,255,0.04)"
                    : prevDone
                      ? `1px solid ${BORDER}`
                      : "1px solid rgba(255,255,255,0.03)",
                  opacity: !prevDone && !done ? 0.5 : 1,
                }}
              >
                {/* Step indicator */}
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
                  style={{
                    background: done ? NEON_GREEN : prevDone ? `${c}15` : "rgba(255,255,255,0.04)",
                    border: done ? "none" : `1px solid ${prevDone ? `${c}40` : "rgba(255,255,255,0.07)"}`,
                    boxShadow: done ? `0 0 10px ${NEON_GREEN}60` : "none",
                  }}
                >
                  {done ? (
                    <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke={BG} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <span className="text-[9px]" style={{ fontFamily: MONO, color: prevDone ? c : TEXT_MUTED }}>{step.id}</span>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-col gap-0.5">
                  <span
                    className="text-[13px] leading-snug transition-colors"
                    style={{ color: done ? TEXT_MUTED : TEXT_PRIMARY, textDecoration: done ? "line-through" : "none" }}
                  >
                    {step.label}
                  </span>
                  {!done && (
                    <span className="text-[10px] leading-relaxed" style={{ color: TEXT_MUTED }}>{step.note}</span>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* ── Completion message ──────────────────────────────────── */}
        {allDone && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-5 rounded-xl text-center overflow-hidden relative"
            style={{ background: `${NEON_GREEN}08`, border: `1px solid ${NEON_GREEN}30` }}
          >
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(90deg, ${NEON_GREEN} 0%, ${NEON_GREEN}60 50%, transparent 100%)` }} />
            <p className="text-base font-semibold mb-1" style={{ color: NEON_GREEN }}>Day complete.</p>
            <p className="text-[10px]" style={{ fontFamily: MONO, color: TEXT_MUTED }}>Proof-of-work or it didn't happen.</p>
          </motion.div>
        )}

        {/* ── Footer nav ─────────────────────────────────────────── */}
        <div className="mt-10 pt-6 flex gap-6" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <Link to="/dashboard" className="text-[11px] transition-opacity hover:opacity-70" style={{ fontFamily: MONO, color: TEXT_MUTED }}>
            ← Dashboard
          </Link>
          <Link to="/sprint" className="text-[11px] transition-opacity hover:opacity-70" style={{ fontFamily: MONO, color: TEXT_MUTED }}>
            Sprint plan →
          </Link>
        </div>
      </div>
    </div>
  );
}

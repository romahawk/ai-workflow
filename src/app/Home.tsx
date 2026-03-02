import { motion } from "motion/react";
import { Github, ArrowUpRight, ExternalLink } from "lucide-react";
import { phases } from "../data/phases";

/* ─── Design tokens ───────────────────────────────────────────────── */
const BG = "#050810";
const SURFACE = "rgba(12, 15, 30, 0.75)";
const BORDER = "rgba(255, 255, 255, 0.07)";
const BORDER_INNER = "rgba(255, 255, 255, 0.045)";
const TEXT_PRIMARY = "#f8fafc";
const TEXT_SECONDARY = "#475569";
const TEXT_MUTED = "#1e2d40";
const MONO = "'JetBrains Mono', monospace";

/** Boost each phase's muted color to a vivid neon equivalent */
const NEON: Record<string, string> = {
  "#4a7c59": "#34d399", // Strategy  → emerald
  "#5c6bc0": "#818cf8", // Design    → indigo
  "#e67e22": "#fb923c", // Build     → amber
  "#c0392b": "#f87171", // QA        → rose
  "#8e44ad": "#c084fc", // Ship      → purple
};
const neon = (raw: string) => NEON[raw] ?? raw;

/* ─── Animated background ─────────────────────────────────────────── */
function BackgroundScene() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {/* Blue blob — top left */}
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -24, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "-25%",
          left: "-20%",
          width: "72%",
          height: "72%",
          background:
            "radial-gradient(ellipse at center, rgba(99,102,241,0.18) 0%, rgba(59,130,246,0.10) 40%, transparent 70%)",
          filter: "blur(72px)",
        }}
      />
      {/* Purple blob — top right */}
      <motion.div
        animate={{ x: [0, -30, 0], y: [0, 28, 0], scale: [1, 1.06, 1] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "5%",
          right: "-22%",
          width: "62%",
          height: "62%",
          background:
            "radial-gradient(ellipse at center, rgba(168,85,247,0.16) 0%, rgba(139,92,246,0.08) 45%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      {/* Emerald blob — bottom center */}
      <motion.div
        animate={{ x: [0, 20, 0], y: [0, -32, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          bottom: "-20%",
          left: "25%",
          width: "55%",
          height: "55%",
          background:
            "radial-gradient(ellipse at center, rgba(52,211,153,0.13) 0%, rgba(16,185,129,0.06) 45%, transparent 70%)",
          filter: "blur(90px)",
        }}
      />
      {/* Dot grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage:
            "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
        }}
      />
    </div>
  );
}

/* ─── Shared micro-components ─────────────────────────────────────── */
function Label({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="text-[9px] tracking-widest uppercase font-semibold"
      style={{ fontFamily: MONO, color: TEXT_MUTED, letterSpacing: "0.12em" }}
    >
      {children}
    </span>
  );
}

function Divider() {
  return <div style={{ height: "1px", background: BORDER_INNER }} />;
}

/* ─── Phase card ──────────────────────────────────────────────────── */
function PhaseCard({
  phase,
  index,
}: {
  phase: (typeof phases)[number];
  index: number;
}) {
  const c = neon(phase.color);

  return (
    <motion.article
      initial={{ opacity: 0, y: 36 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, delay: index * 0.11, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col flex-1 min-w-[185px] max-w-[250px] rounded-2xl overflow-hidden"
      style={{
        background: SURFACE,
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: `1px solid ${BORDER}`,
        boxShadow: `0 0 0 1px rgba(255,255,255,0.03), 0 4px 6px rgba(0,0,0,0.25), 0 20px 60px rgba(0,0,0,0.55), 0 0 80px ${c}08, inset 0 1px 0 rgba(255,255,255,0.06)`,
      }}
    >
      {/* Colored top stripe */}
      <div
        style={{
          height: "2px",
          background: `linear-gradient(90deg, ${c} 0%, ${c}60 50%, transparent 100%)`,
        }}
      />

      {/* Header */}
      <div className="px-5 pt-5 pb-4">
        {/* Badge row */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-lg text-[11px] font-bold"
            style={{
              fontFamily: MONO,
              color: c,
              background: `${c}12`,
              border: `1px solid ${c}28`,
              boxShadow: `0 0 18px ${c}22, inset 0 1px 0 ${c}15`,
            }}
          >
            0{phase.number}
          </div>
          <div
            className="h-px flex-1"
            style={{
              background: `linear-gradient(90deg, ${c}50 0%, transparent 100%)`,
            }}
          />
        </div>

        <h2
          className="text-[14px] font-semibold leading-snug mb-2 tracking-tight"
          style={{ color: TEXT_PRIMARY }}
        >
          {phase.name}
        </h2>
        <p
          className="text-[10px] tracking-wider"
          style={{ fontFamily: MONO, color: c, opacity: 0.75 }}
        >
          {phase.tagline}
        </p>
      </div>

      <div className="mx-5" style={{ height: "1px", background: BORDER_INNER }} />

      {/* Body */}
      <div className="flex flex-col flex-1 px-5 py-4 gap-5">
        {/* Tools */}
        <div className="flex flex-col gap-2">
          <Label>Tools</Label>
          <div className="flex flex-col gap-1.5">
            {phase.tools.map((tool) => (
              <div key={tool.name} className="flex items-baseline gap-2">
                <span
                  className="text-[10px] font-semibold whitespace-nowrap leading-relaxed"
                  style={{ fontFamily: MONO, color: c }}
                >
                  {tool.name}
                </span>
                <span className="text-[10px] leading-relaxed" style={{ color: TEXT_SECONDARY }}>
                  — {tool.purpose}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Divider />

        {/* Acceptance criteria */}
        <div className="flex flex-col gap-2">
          <Label>Done when</Label>
          <ul className="flex flex-col gap-1.5">
            {phase.acceptanceCriteria.map((ac) => (
              <li key={ac.id} className="flex items-start gap-2">
                <span
                  className="mt-[4px] w-3 h-3 flex-shrink-0 rounded border flex items-center justify-center"
                  style={{ borderColor: `${c}35` }}
                >
                  <span
                    className="w-1 h-1 rounded-full"
                    style={{ background: `${c}55` }}
                  />
                </span>
                <span className="text-[10px] leading-relaxed" style={{ color: TEXT_SECONDARY }}>
                  {ac.text}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <Divider />

        {/* Outputs */}
        <div className="flex flex-col gap-2 mt-auto">
          <Label>Output artifacts</Label>
          <div className="flex flex-wrap gap-1.5">
            {phase.outputs.map((out) => (
              <span
                key={out}
                className="text-[9px] font-medium px-2 py-0.5 rounded"
                style={{
                  fontFamily: MONO,
                  color: c,
                  background: `${c}0e`,
                  border: `1px solid ${c}22`,
                  boxShadow: `0 0 10px ${c}0a`,
                }}
              >
                {out}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/* ─── Phase connector ─────────────────────────────────────────────── */
function PhaseConnector({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{ opacity: 1, scaleX: 1 }}
      transition={{ duration: 0.4, delay: index * 0.11 + 0.35 }}
      className="hidden lg:flex items-center self-center flex-shrink-0"
    >
      <div style={{ color: "#1a2540" }} className="flex items-center">
        <div className="w-5 h-px" style={{ background: "currentColor" }} />
        <svg width="7" height="7" viewBox="0 0 8 8" fill="currentColor">
          <path d="M0 0L8 4L0 8V0Z" />
        </svg>
      </div>
    </motion.div>
  );
}

/* ─── Governance rules ────────────────────────────────────────────── */
const RULES = [
  "Max 3 active projects",
  "One outcome per week per repo",
  "If not deployed, it doesn't count",
  "No refactor without shipping impact",
  "AI accelerates — human decides",
  "One source of truth per layer",
];

/* ─── Home ────────────────────────────────────────────────────────── */
export default function Home() {
  return (
    <div
      className="min-h-screen selection:bg-violet-400/20"
      style={{ background: BG, fontFamily: "'Inter', sans-serif", color: TEXT_PRIMARY }}
    >
      <BackgroundScene />

      <div className="relative max-w-[1400px] mx-auto px-6 py-14">

        {/* ── Header ──────────────────────────────────────────────── */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 mb-16"
        >
          <div className="flex flex-col gap-4">
            {/* Version badge */}
            <div>
              <span
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider"
                style={{
                  fontFamily: MONO,
                  color: "#60a5fa",
                  background: "rgba(59,130,246,0.1)",
                  border: "1px solid rgba(59,130,246,0.22)",
                  boxShadow: "0 0 20px rgba(59,130,246,0.12)",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "#3b82f6", boxShadow: "0 0 6px #3b82f6" }}
                />
                v1.0 · romahawk
              </span>
            </div>

            {/* Title */}
            <div>
              <h1
                className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight"
                style={{
                  background:
                    "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 35%, #94a3b8 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                AI Production OS
              </h1>
              <p
                className="mt-3 text-sm leading-relaxed max-w-md"
                style={{ color: TEXT_SECONDARY }}
              >
                A solo engineer's framework for shipping production-grade software —
                from weekly strategy to daily build loop to proof-of-work.
              </p>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-2.5">
            <a
              href="https://github.com/romahawk/ai-workflow"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-medium transition-opacity hover:opacity-80"
              style={{
                fontFamily: MONO,
                background: SURFACE,
                backdropFilter: "blur(12px)",
                border: `1px solid ${BORDER}`,
                color: TEXT_SECONDARY,
              }}
            >
              <Github className="w-3.5 h-3.5" />
              GitHub
            </a>
            <a
              href="/dashboard"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-semibold transition-opacity hover:opacity-90"
              style={{
                fontFamily: MONO,
                background:
                  "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #a21caf 100%)",
                color: "#fff",
                boxShadow:
                  "0 0 28px rgba(124,58,237,0.4), 0 4px 20px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
              }}
            >
              Execution Layer
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={toggle}
              aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
              className="p-2 rounded-lg transition-colors"
              style={{ border: `1px solid ${borderMid}`, color: subtitleText }}
            >
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </motion.header>

        {/* ── Phase cards ─────────────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-2.5 items-stretch">
          {phases.map((phase, i) => (
            <div key={phase.id} className="contents">
              <PhaseCard phase={phase} index={i} />
              {i < phases.length - 1 && <PhaseConnector index={i} />}
            </div>
          ))}
        </div>

        {/* ── Operating rules ─────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.85 }}
          className="mt-16 pt-8"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <Label>Operating rules</Label>
          <div className="flex flex-wrap gap-x-8 gap-y-2.5 mt-3">
            {RULES.map((rule) => (
              <div key={rule} className="flex items-center gap-2.5">
                <div
                  className="w-1 h-1 rounded-full"
                  style={{ background: "#7c3aed", boxShadow: "0 0 6px #7c3aed80" }}
                />
                <span className="text-[11px]" style={{ color: "#334155" }}>
                  {rule}
                </span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── Footer ──────────────────────────────────────────────── */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          className="mt-10 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
        >
          <p
            className="text-[10px] tracking-wide"
            style={{ fontFamily: MONO, color: "#0f172a" }}
          >
            © {new Date().getFullYear()} Roman Mazuryk · Built using itself
          </p>
          <div className="flex items-center gap-5">
            {[
              { label: "mazuryk.dev", href: "https://mazuryk.dev" },
              {
                label: "Roadmap",
                href: "https://github.com/romahawk/ai-workflow/blob/main/docs/ROADMAP.md",
              },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[10px] transition-colors hover:text-slate-500"
                style={{ fontFamily: MONO, color: "#0f172a" }}
              >
                {label} <ExternalLink className="w-2.5 h-2.5" />
              </a>
            ))}
            <span className="text-[10px]" style={{ fontFamily: MONO, color: "#0f172a" }}>
              React · Vite · Tailwind · shadcn/ui
            </span>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}

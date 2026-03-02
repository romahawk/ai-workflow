import { motion } from "motion/react";
import { Github, ArrowUpRight, ExternalLink } from "lucide-react";
import { phases } from "../data/phases";
import { useTheme } from "../hooks/useTheme";

/* ─── Phase column ────────────────────────────────────────────────── */
function PhaseColumn({
  phase,
  index,
}: {
  phase: (typeof phases)[number];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      className="flex flex-col flex-1 min-w-[200px] max-w-[260px] print:max-w-none print:min-w-0"
    >
      {/* Phase header */}
      <div
        className="px-5 pt-5 pb-4 rounded-t-xl border border-b-0"
        style={{
          borderColor: `${phase.color}30`,
          background: `linear-gradient(160deg, ${phase.color}14 0%, transparent 70%)`,
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span
            className="font-mono text-[10px] px-2 py-0.5 rounded tracking-widest"
            style={{ color: phase.color, background: `${phase.color}18` }}
          >
            0{phase.number}
          </span>
          <div
            className="h-px flex-1 opacity-30"
            style={{ background: phase.color }}
          />
        </div>
        <h2
          className="text-[15px] leading-tight mb-1"
          style={{ fontFamily: "'DM Serif Display', serif", color: "#f0f0f0" }}
        >
          {phase.name}
        </h2>
        <p
          className="font-mono text-[10px] tracking-wide opacity-60"
          style={{ color: phase.color }}
        >
          {phase.tagline}
        </p>
      </div>

      {/* Body */}
      <div
        className="flex flex-col flex-1 px-5 py-4 border border-t-0 rounded-b-xl gap-5"
        style={{ borderColor: `${phase.color}30`, background: "#111318" }}
      >
        {/* Tools */}
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase">
            Tools
          </span>
          <div className="flex flex-col gap-1.5">
            {phase.tools.map((tool) => (
              <div key={tool.name} className="flex items-start gap-2">
                <span
                  className="font-mono text-[10px] whitespace-nowrap leading-relaxed"
                  style={{ color: phase.color }}
                >
                  {tool.name}
                </span>
                <span className="text-[10px] text-zinc-600 leading-relaxed">
                  — {tool.purpose}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="h-px opacity-20" style={{ background: phase.color }} />

        {/* Acceptance criteria */}
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase">
            Done when
          </span>
          <ul className="flex flex-col gap-1.5">
            {phase.acceptanceCriteria.map((ac) => (
              <li key={ac.id} className="flex items-start gap-2">
                <span
                  className="mt-[3px] w-3 h-3 flex-shrink-0 rounded-sm border flex items-center justify-center"
                  style={{ borderColor: `${phase.color}50` }}
                >
                  <span
                    className="w-1 h-1 rounded-full"
                    style={{ background: `${phase.color}60` }}
                  />
                </span>
                <span className="text-[10px] text-zinc-400 leading-relaxed">
                  {ac.text}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="h-px opacity-20" style={{ background: phase.color }} />

        {/* Outputs */}
        <div className="flex flex-col gap-2 mt-auto">
          <span className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase">
            Output artifacts
          </span>
          <div className="flex flex-wrap gap-1.5">
            {phase.outputs.map((out) => (
              <span
                key={out}
                className="font-mono text-[9px] px-2 py-0.5 rounded border"
                style={{
                  color: `${phase.color}cc`,
                  borderColor: `${phase.color}25`,
                  background: `${phase.color}0a`,
                }}
              >
                {out}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Phase connector ─────────────────────────────────────────────── */
function PhaseConnector({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{ opacity: 1, scaleX: 1 }}
      transition={{ duration: 0.3, delay: index * 0.1 + 0.3, ease: "easeOut" }}
      className="hidden lg:flex items-center self-center flex-shrink-0"
    >
      <div className="flex items-center text-zinc-700">
        <div className="w-6 h-px bg-zinc-700" />
        <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
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

/* ─── Main ────────────────────────────────────────────────────────── */
export default function Home() {
  const { dark, toggle } = useTheme();

  return (
    <div
      className="min-h-screen text-zinc-100 selection:bg-zinc-700"
      style={{ background: "#0d0f12", fontFamily: "'Inter', sans-serif" }}
    >
      <style>{`
        @media print {
          @page { size: A3 landscape; margin: 8mm; }
          body { background: #0d0f12 !important; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
          .print-row { flex-direction: row !important; flex-wrap: nowrap !important; }
          .print-hide { display: none !important; }
        }
      `}</style>

      {/* Grid texture */}
      <div
        className="fixed inset-0 pointer-events-none print-hide"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative max-w-[1400px] mx-auto px-6 py-10 print:px-4 print:py-6">

        {/* ── Header ────────────────────────────────────────────── */}
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 print:mb-8"
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] text-zinc-500 tracking-widest uppercase">
                v1.0
              </span>
              <div className="h-px w-8 bg-zinc-700" />
              <span className="font-mono text-[10px] text-zinc-500 tracking-widest uppercase">
                romahawk
              </span>
            </div>
            <h1
              className="text-3xl sm:text-4xl leading-tight"
              style={{ fontFamily: "'DM Serif Display', serif", color: "#f5f5f0" }}
            >
              AI Production OS
            </h1>
            <p className="text-sm text-zinc-500 max-w-md leading-relaxed">
              A solo engineer's framework for shipping production-grade software
              — from weekly strategy to daily build loop to proof-of-work.
            </p>
          </div>

          <div className="flex items-center gap-3 print-hide">
            <a
              href="https://github.com/romahawk/ai-workflow"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200 transition-colors text-[12px] font-mono"
            >
              <Github className="w-3.5 h-3.5" />
              GitHub
            </a>
            <a
              href="/dashboard"
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-zinc-100 text-zinc-900 hover:bg-white transition-colors text-[12px] font-mono"
            >
              Execution Layer
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={toggle}
              title="Toggle theme"
              aria-label="Toggle theme"
              className="p-2 rounded-lg border border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600 transition-colors"
            >
              {dark ? (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="1" x2="12" y2="3"/>
                  <line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/>
                  <line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>
          </div>
        </motion.header>

        {/* ── Phase columns ─────────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-3 items-stretch print-row print:gap-2">
          {phases.map((phase, i) => (
            <div key={phase.id} className="contents">
              <PhaseColumn phase={phase} index={i} />
              {i < phases.length - 1 && <PhaseConnector index={i} />}
            </div>
          ))}
        </div>

        {/* ── Governance rules ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-10 print:mt-8 border-t border-zinc-800 pt-8"
        >
          <span className="font-mono text-[9px] tracking-widest text-zinc-600 uppercase block mb-3">
            Operating rules
          </span>
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            {RULES.map((rule) => (
              <div key={rule} className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-zinc-600" />
                <span className="text-[11px] text-zinc-500">{rule}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Footer ────────────────────────────────────────────── */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-8 pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print-hide"
        >
          <p className="font-mono text-[10px] text-zinc-700 tracking-wide">
            © {new Date().getFullYear()} Roman Mazuryk · Built using itself
          </p>
          <div className="flex items-center gap-5">
            <a
              href="https://mazuryk.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 font-mono text-[10px] text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              mazuryk.dev <ExternalLink className="w-2.5 h-2.5" />
            </a>
            <a
              href="https://github.com/romahawk/ai-workflow/blob/main/docs/ROADMAP.md"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 font-mono text-[10px] text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              Roadmap <ExternalLink className="w-2.5 h-2.5" />
            </a>
            <span className="font-mono text-[10px] text-zinc-700">
              React · Vite · Tailwind · shadcn/ui
            </span>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}

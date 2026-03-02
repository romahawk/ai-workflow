import { motion } from "motion/react";
import { Github, ArrowUpRight, ExternalLink, Sun, Moon } from "lucide-react";
import { phases } from "../data/phases";
import { useTheme } from "../hooks/useTheme";

/* ─── Phase column ────────────────────────────────────────────────── */
function PhaseColumn({
  phase,
  index,
  dark,
}: {
  phase: (typeof phases)[number];
  index: number;
  dark: boolean;
}) {
  const c = phase.color;

  // Background tints — stronger in dark for visibility
  const headerBg = dark
    ? `linear-gradient(160deg, ${c}22 0%, ${c}08 70%)`
    : `linear-gradient(160deg, ${c}12 0%, ${c}04 70%)`;
  const bodyBg = dark ? "#13151b" : "#ffffff";
  const borderColor = dark ? `${c}45` : `${c}35`;

  // Text
  const primaryText = dark ? "#eaeaea" : "#111318";
  const purposeText = dark ? "#b0b0bc" : "#4a4a5e";
  const labelColor = dark ? "#80809080" : "#6e6e82";

  // Dividers
  const dividerOpacity = dark ? 0.35 : 0.18;

  // Output tags
  const tagColor = dark ? `${c}ee` : `${c}cc`;
  const tagBorder = dark ? `${c}50` : `${c}40`;
  const tagBg = dark ? `${c}18` : `${c}10`;

  // Criteria check box
  const checkBorder = dark ? `${c}60` : `${c}50`;
  const checkDot = dark ? `${c}80` : `${c}70`;

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
        style={{ borderColor, background: headerBg }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span
            className="font-mono text-[10px] px-2 py-0.5 rounded tracking-widest font-medium"
            style={{ color: c, background: dark ? `${c}20` : `${c}14` }}
          >
            0{phase.number}
          </span>
          <div className="h-px flex-1" style={{ background: c, opacity: dark ? 0.4 : 0.3 }} />
        </div>
        <h2
          className="text-[15px] leading-tight mb-1.5"
          style={{ fontFamily: "'DM Serif Display', serif", color: primaryText }}
        >
          {phase.name}
        </h2>
        <p
          className="font-mono text-[10px] tracking-wide"
          style={{ color: c, opacity: dark ? 0.85 : 0.75 }}
        >
          {phase.tagline}
        </p>
      </div>

      {/* Body */}
      <div
        className="flex flex-col flex-1 px-5 py-4 border border-t-0 rounded-b-xl gap-5"
        style={{ borderColor, background: bodyBg }}
      >
        {/* Tools */}
        <div className="flex flex-col gap-2">
          <span
            className="font-mono text-[9px] tracking-widest uppercase font-medium"
            style={{ color: labelColor }}
          >
            Tools
          </span>
          <div className="flex flex-col gap-1.5">
            {phase.tools.map((tool) => (
              <div key={tool.name} className="flex items-start gap-2">
                <span
                  className="font-mono text-[10px] font-medium whitespace-nowrap leading-relaxed"
                  style={{ color: c }}
                >
                  {tool.name}
                </span>
                <span
                  className="text-[10px] leading-relaxed"
                  style={{ color: purposeText }}
                >
                  — {tool.purpose}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="h-px" style={{ background: c, opacity: dividerOpacity }} />

        {/* Acceptance criteria */}
        <div className="flex flex-col gap-2">
          <span
            className="font-mono text-[9px] tracking-widest uppercase font-medium"
            style={{ color: labelColor }}
          >
            Done when
          </span>
          <ul className="flex flex-col gap-1.5">
            {phase.acceptanceCriteria.map((ac) => (
              <li key={ac.id} className="flex items-start gap-2">
                <span
                  className="mt-[3px] w-3 h-3 flex-shrink-0 rounded-sm border flex items-center justify-center"
                  style={{ borderColor: checkBorder }}
                >
                  <span className="w-1 h-1 rounded-full" style={{ background: checkDot }} />
                </span>
                <span
                  className="text-[10px] leading-relaxed"
                  style={{ color: purposeText }}
                >
                  {ac.text}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="h-px" style={{ background: c, opacity: dividerOpacity }} />

        {/* Outputs */}
        <div className="flex flex-col gap-2 mt-auto">
          <span
            className="font-mono text-[9px] tracking-widest uppercase font-medium"
            style={{ color: labelColor }}
          >
            Output artifacts
          </span>
          <div className="flex flex-wrap gap-1.5">
            {phase.outputs.map((out) => (
              <span
                key={out}
                className="font-mono text-[9px] px-2 py-0.5 rounded border font-medium"
                style={{ color: tagColor, borderColor: tagBorder, background: tagBg }}
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
function PhaseConnector({ index, dark }: { index: number; dark: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{ opacity: 1, scaleX: 1 }}
      transition={{ duration: 0.3, delay: index * 0.1 + 0.3, ease: "easeOut" }}
      className="hidden lg:flex items-center self-center flex-shrink-0"
    >
      <div
        className="flex items-center"
        style={{ color: dark ? "#3f3f52" : "#bbbbc8" }}
      >
        <div className="w-6 h-px" style={{ background: "currentColor" }} />
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

  const rootBg = dark ? "#0d0f12" : "#f4f5f7";
  const primaryText = dark ? "#eaeaea" : "#111318";
  const subtitleText = dark ? "#909098" : "#5a5a6e";
  const metaText = dark ? "#606070" : "#8a8a9a";
  const borderSubtle = dark ? "#1e2028" : "#d8d9e0";
  const borderMid = dark ? "#2a2b36" : "#c8c9d4";
  const gridColor = dark
    ? "rgba(255,255,255,0.025)"
    : "rgba(0,0,0,0.055)";
  const ruleDot = dark ? "#4a4a5e" : "#aaaabc";
  const ruleText = dark ? "#808090" : "#5e5e72";
  const dividerBorder = dark ? "#1a1b24" : "#dcdde6";
  const logoSep = dark ? "#2e2f3a" : "#d0d1dc";

  return (
    <div
      className="min-h-screen selection:bg-violet-300/30"
      style={{ background: rootBg, fontFamily: "'Inter', sans-serif", color: primaryText, transition: "background 0.2s, color 0.2s" }}
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
          backgroundImage: `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`,
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
              <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: metaText }}>
                v1.0
              </span>
              <div className="h-px w-8" style={{ background: logoSep }} />
              <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: metaText }}>
                romahawk
              </span>
            </div>
            <h1
              className="text-3xl sm:text-4xl leading-tight"
              style={{ fontFamily: "'DM Serif Display', serif", color: primaryText }}
            >
              AI Production OS
            </h1>
            <p className="text-sm max-w-md leading-relaxed" style={{ color: subtitleText }}>
              A solo engineer's framework for shipping production-grade software
              — from weekly strategy to daily build loop to proof-of-work.
            </p>
          </div>

          <div className="flex items-center gap-2 print-hide">
            <a
              href="https://github.com/romahawk/ai-workflow"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-[12px] font-mono transition-colors"
              style={{ border: `1px solid ${borderMid}`, color: subtitleText }}
            >
              <Github className="w-3.5 h-3.5" />
              GitHub
            </a>
            <a
              href="/dashboard"
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-[12px] font-mono transition-colors"
              style={{
                background: dark ? "#f0f0f0" : "#111318",
                color: dark ? "#111318" : "#f0f0f0",
              }}
            >
              Execution Layer
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className="p-2 rounded-lg transition-colors"
              style={{ border: `1px solid ${borderMid}`, color: subtitleText }}
            >
              {dark
                ? <Sun className="w-4 h-4" />
                : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </motion.header>

        {/* ── Phase columns ─────────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-3 items-stretch print-row print:gap-2">
          {phases.map((phase, i) => (
            <div key={phase.id} className="contents">
              <PhaseColumn phase={phase} index={i} dark={dark} />
              {i < phases.length - 1 && <PhaseConnector index={i} dark={dark} />}
            </div>
          ))}
        </div>

        {/* ── Governance rules ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-10 print:mt-8 pt-8"
          style={{ borderTop: `1px solid ${dividerBorder}` }}
        >
          <span
            className="font-mono text-[9px] tracking-widest uppercase font-medium block mb-3"
            style={{ color: metaText }}
          >
            Operating rules
          </span>
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            {RULES.map((rule) => (
              <div key={rule} className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full" style={{ background: ruleDot }} />
                <span className="text-[11px]" style={{ color: ruleText }}>{rule}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Footer ────────────────────────────────────────────── */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-8 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print-hide"
          style={{ borderTop: `1px solid ${borderSubtle}` }}
        >
          <p className="font-mono text-[10px] tracking-wide" style={{ color: metaText }}>
            © {new Date().getFullYear()} Roman Mazuryk · Built using itself
          </p>
          <div className="flex items-center gap-5">
            <a
              href="https://mazuryk.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 font-mono text-[10px] transition-colors"
              style={{ color: metaText }}
            >
              mazuryk.dev <ExternalLink className="w-2.5 h-2.5" />
            </a>
            <a
              href="https://github.com/romahawk/ai-workflow/blob/main/docs/ROADMAP.md"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 font-mono text-[10px] transition-colors"
              style={{ color: metaText }}
            >
              Roadmap <ExternalLink className="w-2.5 h-2.5" />
            </a>
            <span className="font-mono text-[10px]" style={{ color: metaText }}>
              React · Vite · Tailwind · shadcn/ui
            </span>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}

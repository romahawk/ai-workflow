import { useState } from "react";
import { useParams, Link, Navigate } from "react-router";
import { motion } from "motion/react";
import { Github, ExternalLink, ArrowLeft, Plus, CheckSquare, Square } from "lucide-react";
import { repos, type OSPhase } from "../../data/repos";
import { phases } from "../../data/phases";

/* ─── Design tokens ───────────────────────────────────────────────── */
const BG      = "#050810";
const SURFACE = "rgba(12, 15, 30, 0.75)";
const BORDER  = "rgba(255, 255, 255, 0.07)";
const TEXT_PRIMARY   = "#f8fafc";
const TEXT_SECONDARY = "#94a3b8";
const TEXT_MUTED     = "#475569";
const MONO = "'JetBrains Mono', monospace";

const PHASE_NEON: Record<string, string> = {
  strategy: "#34d399",
  design:   "#818cf8",
  build:    "#fb923c",
  qa:       "#f87171",
  ship:     "#c084fc",
};

const STATUS_NEON: Record<string, string> = {
  active:   "#34d399",
  parked:   "#fb923c",
  frozen:   "#818cf8",
  archived: "#475569",
};

/* ─── Storage helpers ─────────────────────────────────────────────── */
function getCriteria(repoId: string, phaseId: string): Record<string, boolean> {
  try { return JSON.parse(localStorage.getItem(`os_criteria_${repoId}_${phaseId}`) ?? "{}"); }
  catch { return {}; }
}
function saveCriteria(repoId: string, phaseId: string, data: Record<string, boolean>) {
  localStorage.setItem(`os_criteria_${repoId}_${phaseId}`, JSON.stringify(data));
}
function getChangelog(repoId: string): { ts: string; text: string }[] {
  try { return JSON.parse(localStorage.getItem(`os_changelog_${repoId}`) ?? "[]"); }
  catch { return []; }
}
function saveChangelog(repoId: string, entries: { ts: string; text: string }[]) {
  localStorage.setItem(`os_changelog_${repoId}`, JSON.stringify(entries));
}
function getSprintGoal(repoId: string, fallback: string) {
  return localStorage.getItem(`os_sprintgoal_${repoId}`) ?? fallback;
}
function saveSprintGoal(repoId: string, val: string) {
  localStorage.setItem(`os_sprintgoal_${repoId}`, val);
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

/* ─── Phase progress strip ────────────────────────────────────────── */
function PhaseStrip({ current, onSelect, selected }: { current: OSPhase; onSelect: (id: string) => void; selected: string }) {
  const currentIdx = phases.findIndex((p) => p.id === current);
  return (
    <div className="flex gap-1.5">
      {phases.map((p, i) => {
        const isActive = p.id === current;
        const isPast = i < currentIdx;
        const isSelected = p.id === selected;
        const c = PHASE_NEON[p.id] ?? TEXT_MUTED;
        return (
          <button key={p.id} onClick={() => onSelect(p.id)} className="flex-1 flex flex-col gap-1.5 text-left">
            <div
              className="h-0.5 rounded-full transition-all w-full"
              style={{
                background: isActive ? c : isPast ? `${c}50` : "rgba(255,255,255,0.07)",
                boxShadow: isActive ? `0 0 6px ${c}80` : isSelected ? `0 0 0 2px ${c}40` : "none",
                outline: isSelected ? `2px solid ${c}40` : "none",
                outlineOffset: "2px",
              }}
            />
            <span
              className="text-[9px] leading-tight transition-colors"
              style={{ fontFamily: MONO, color: isSelected ? c : isActive ? TEXT_SECONDARY : TEXT_MUTED }}
            >
              {p.number}. {p.slug}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ─── Phase detail panel ──────────────────────────────────────────── */
function PhasePanel({ phase, repoId, isCurrent }: { phase: (typeof phases)[number]; repoId: string; isCurrent: boolean }) {
  const [criteria, setCriteria] = useState(() => getCriteria(repoId, phase.id));
  const c = PHASE_NEON[phase.id] ?? TEXT_MUTED;

  function toggle(id: string) {
    const next = { ...criteria, [id]: !criteria[id] };
    setCriteria(next);
    saveCriteria(repoId, phase.id, next);
  }

  const doneCount = phase.acceptanceCriteria.filter((ac) => criteria[ac.id]).length;
  const total = phase.acceptanceCriteria.length;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
      {/* Phase header */}
      <div className="flex items-center gap-3">
        <div className="w-0.5 h-8 rounded-full flex-shrink-0" style={{ background: `linear-gradient(180deg, ${c} 0%, ${c}30 100%)` }} />
        <div>
          <h3 className="text-base font-semibold" style={{ color: TEXT_PRIMARY }}>{phase.name}</h3>
          <p className="text-[10px]" style={{ fontFamily: MONO, color: c, opacity: 0.8 }}>
            {phase.tagline}
            {!isCurrent && <span style={{ color: TEXT_MUTED }}> — not current phase</span>}
          </p>
        </div>
      </div>

      <p className="text-[12px] leading-relaxed" style={{ color: TEXT_SECONDARY }}>{phase.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tools */}
        <div className="flex flex-col gap-3">
          <Label>Tools</Label>
          {phase.tools.map((tool) => (
            <div key={tool.name} className="flex items-start gap-2">
              <span className="text-[11px] whitespace-nowrap" style={{ fontFamily: MONO, color: c }}>{tool.name}</span>
              <span className="text-[11px]" style={{ color: TEXT_MUTED }}>— {tool.purpose}</span>
            </div>
          ))}
        </div>

        {/* Acceptance criteria */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Label>Done when</Label>
            <span className="text-[10px]" style={{ fontFamily: MONO, color: doneCount === total ? c : TEXT_MUTED }}>
              {doneCount}/{total}
            </span>
          </div>
          {phase.acceptanceCriteria.map((ac) => (
            <button key={ac.id} onClick={() => toggle(ac.id)} className="flex items-start gap-2 text-left group">
              {criteria[ac.id]
                ? <CheckSquare className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 transition-colors" style={{ color: c }} />
                : <Square className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 transition-colors" style={{ color: TEXT_MUTED }} />
              }
              <span
                className="text-[11px] leading-relaxed transition-colors"
                style={{ color: criteria[ac.id] ? TEXT_MUTED : TEXT_SECONDARY, textDecoration: criteria[ac.id] ? "line-through" : "none" }}
              >
                {ac.text}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Output artifacts */}
      <div className="flex flex-col gap-2">
        <Label>Output artifacts</Label>
        <div className="flex flex-wrap gap-1.5">
          {phase.outputs.map((out) => (
            <span
              key={out}
              className="text-[9px] font-medium px-2 py-0.5 rounded"
              style={{ fontFamily: MONO, color: c, background: `${c}0e`, border: `1px solid ${c}22`, boxShadow: `0 0 10px ${c}0a` }}
            >
              {out}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Changelog ───────────────────────────────────────────────────── */
function Changelog({ repoId }: { repoId: string }) {
  const [entries, setEntries] = useState(() => getChangelog(repoId));
  const [input, setInput] = useState("");

  function addEntry() {
    const text = input.trim();
    if (!text) return;
    const next = [{ ts: new Date().toISOString(), text }, ...entries];
    setEntries(next);
    saveChangelog(repoId, next);
    setInput("");
  }

  return (
    <div className="flex flex-col gap-3">
      <Label>Changelog</Label>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addEntry()}
          placeholder="What shipped? (Enter to add)"
          className="flex-1 rounded-lg px-3 py-1.5 text-[11px] outline-none transition-colors"
          style={{ fontFamily: MONO, background: "rgba(255,255,255,0.04)", border: `1px solid ${BORDER}`, color: TEXT_PRIMARY }}
        />
        <button
          onClick={addEntry}
          className="p-1.5 rounded-lg transition-opacity hover:opacity-70"
          style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${BORDER}`, color: TEXT_MUTED }}
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
      {entries.length > 0 && (
        <div className="flex flex-col gap-1.5 mt-1">
          {entries.map((e, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-[9px] whitespace-nowrap mt-0.5" style={{ fontFamily: MONO, color: TEXT_MUTED }}>
                {new Date(e.ts).toLocaleDateString("en-GB", { month: "short", day: "2-digit" })}
              </span>
              <span className="text-[11px]" style={{ color: TEXT_SECONDARY }}>{e.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Main page ───────────────────────────────────────────────────── */
export function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const repo = repos.find((r) => r.id === id);

  const [selectedPhase, setSelectedPhase] = useState<string>(repo?.phase ?? "strategy");
  const [sprintGoal, setSprintGoal] = useState(() => (repo ? getSprintGoal(repo.id, repo.sprintGoal) : ""));

  if (!repo) return <Navigate to="/dashboard" replace />;

  const currentPhase = phases.find((p) => p.id === selectedPhase) ?? phases[0];
  const c = PHASE_NEON[repo.phase] ?? TEXT_MUTED;

  return (
    <div className="min-h-screen" style={{ background: BG, fontFamily: "'Inter', sans-serif", color: TEXT_PRIMARY }}>
      <BackgroundScene />
      <div className="relative max-w-[860px] mx-auto px-6 py-8">

        {/* ── Top bar ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-start justify-between gap-4 mb-8"
        >
          <div className="flex items-start gap-3">
            <Link
              to="/dashboard"
              className="mt-1 p-2 rounded-xl transition-opacity hover:opacity-70 flex-shrink-0"
              style={{ background: SURFACE, backdropFilter: "blur(12px)", border: `1px solid ${BORDER}`, color: TEXT_MUTED }}
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="mb-0.5 flex items-center gap-2">
                <span
                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider"
                  style={{ fontFamily: MONO, color: c, background: `${c}12`, border: `1px solid ${c}28` }}
                >
                  <span className="w-1 h-1 rounded-full" style={{ background: c, boxShadow: `0 0 4px ${c}` }} />
                  {repo.status} · p{repo.priority}
                </span>
              </div>
              <h1
                className="text-xl font-bold leading-tight tracking-tight"
                style={{ background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 35%, #94a3b8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
              >
                {repo.name}
              </h1>
              <p className="text-[11px] mt-0.5" style={{ color: TEXT_MUTED }}>{repo.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {repo.deployUrl && (
              <a
                href={repo.deployUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] transition-opacity hover:opacity-70"
                style={{ fontFamily: MONO, background: SURFACE, backdropFilter: "blur(12px)", border: `1px solid ${BORDER}`, color: TEXT_SECONDARY }}
              >
                <ExternalLink className="w-3 h-3" /> Deploy
              </a>
            )}
            <a
              href={repo.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] transition-opacity hover:opacity-70"
              style={{ fontFamily: MONO, background: SURFACE, backdropFilter: "blur(12px)", border: `1px solid ${BORDER}`, color: TEXT_SECONDARY }}
            >
              <Github className="w-3 h-3" /> GitHub
            </a>
          </div>
        </motion.div>

        {/* ── Sprint goal ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="flex flex-col gap-2 mb-6 p-4 rounded-xl"
          style={{ background: SURFACE, backdropFilter: "blur(24px)", border: `1px solid ${BORDER}` }}
        >
          <Label>Sprint goal</Label>
          <input
            type="text"
            value={sprintGoal}
            onChange={(e) => { setSprintGoal(e.target.value); saveSprintGoal(repo.id, e.target.value); }}
            className="bg-transparent text-sm outline-none"
            style={{ color: TEXT_PRIMARY }}
            placeholder="What are you shipping this sprint?"
          />
        </motion.div>

        {/* ── Phase strip ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-6"
        >
          <PhaseStrip current={repo.phase} onSelect={setSelectedPhase} selected={selectedPhase} />
        </motion.div>

        {/* ── Phase detail panel ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mb-6 rounded-xl overflow-hidden"
          style={{ background: SURFACE, backdropFilter: "blur(24px)", border: `1px solid ${BORDER}` }}
        >
          {/* Phase top stripe */}
          <div style={{ height: "2px", background: `linear-gradient(90deg, ${PHASE_NEON[selectedPhase] ?? TEXT_MUTED} 0%, ${PHASE_NEON[selectedPhase] ?? TEXT_MUTED}60 50%, transparent 100%)` }} />
          <div className="p-5">
            <PhasePanel phase={currentPhase} repoId={repo.id} isCurrent={currentPhase.id === repo.phase} />
          </div>
        </motion.div>

        {/* ── Changelog + meta ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div
            className="p-4 rounded-xl"
            style={{ background: SURFACE, backdropFilter: "blur(24px)", border: `1px solid ${BORDER}` }}
          >
            <Changelog repoId={repo.id} />
          </div>

          <div
            className="p-4 rounded-xl flex flex-col gap-4"
            style={{ background: SURFACE, backdropFilter: "blur(24px)", border: `1px solid ${BORDER}` }}
          >
            <Label>Project meta</Label>
            <div className="flex flex-col gap-3">
              {[
                ["Stack", repo.stack.join(", ") || "—"],
                ["Monetization", repo.monetization],
                ["Strategic role", repo.strategicRole],
                ["Status", repo.status],
                ...(repo.lastShipped ? [["Last shipped", repo.lastShipped]] : []),
              ].map(([label, val]) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <Label>{label}</Label>
                  <span
                    className="text-[12px] mt-0.5"
                    style={{ color: label === "Status" ? (STATUS_NEON[val] ?? TEXT_SECONDARY) : TEXT_SECONDARY }}
                  >
                    {val}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

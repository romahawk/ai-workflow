import { useState } from "react";
import { useParams, Link, Navigate } from "react-router";
import { motion } from "motion/react";
import {
  Github,
  ExternalLink,
  ArrowLeft,
  Plus,
  CheckSquare,
  Square,
} from "lucide-react";
import { repos, type OSPhase } from "../../data/repos";
import { phases } from "../../data/phases";

/* ─── Storage helpers ─────────────────────────────────────────────── */
function getCriteria(repoId: string, phaseId: string): Record<string, boolean> {
  try {
    return JSON.parse(
      localStorage.getItem(`os_criteria_${repoId}_${phaseId}`) ?? "{}"
    );
  } catch {
    return {};
  }
}

function saveCriteria(
  repoId: string,
  phaseId: string,
  data: Record<string, boolean>
) {
  localStorage.setItem(
    `os_criteria_${repoId}_${phaseId}`,
    JSON.stringify(data)
  );
}

function getChangelog(repoId: string): { ts: string; text: string }[] {
  try {
    return JSON.parse(localStorage.getItem(`os_changelog_${repoId}`) ?? "[]");
  } catch {
    return [];
  }
}

function saveChangelog(
  repoId: string,
  entries: { ts: string; text: string }[]
) {
  localStorage.setItem(`os_changelog_${repoId}`, JSON.stringify(entries));
}

function getSprintGoal(repoId: string, fallback: string) {
  return localStorage.getItem(`os_sprintgoal_${repoId}`) ?? fallback;
}

function saveSprintGoal(repoId: string, val: string) {
  localStorage.setItem(`os_sprintgoal_${repoId}`, val);
}

/* ─── Colors ──────────────────────────────────────────────────────── */
const PHASE_COLORS: Record<string, string> = {
  strategy: "#4a7c59",
  design: "#5c6bc0",
  build: "#e67e22",
  qa: "#c0392b",
  ship: "#8e44ad",
};

/* ─── Phase progress strip ────────────────────────────────────────── */
function PhaseStrip({
  current,
  onSelect,
  selected,
}: {
  current: OSPhase;
  onSelect: (id: string) => void;
  selected: string;
}) {
  const currentIdx = phases.findIndex((p) => p.id === current);
  return (
    <div className="flex gap-1">
      {phases.map((p, i) => {
        const isActive = p.id === current;
        const isPast = i < currentIdx;
        const isSelected = p.id === selected;
        return (
          <button
            key={p.id}
            onClick={() => onSelect(p.id)}
            className="flex-1 flex flex-col gap-1.5 text-left group"
          >
            <div
              className="h-1 rounded-full transition-all"
              style={{
                background: isActive
                  ? PHASE_COLORS[p.id]
                  : isPast
                    ? `${PHASE_COLORS[p.id]}50`
                    : "#27272a",
                boxShadow: isSelected
                  ? `0 0 0 2px ${PHASE_COLORS[p.id]}60`
                  : undefined,
              }}
            />
            <span
              className="font-mono text-[9px] leading-tight transition-colors"
              style={{
                color: isSelected
                  ? PHASE_COLORS[p.id]
                  : isActive
                    ? "#a1a1aa"
                    : "#52525b",
              }}
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
function PhasePanel({
  phase,
  repoId,
  isCurrent,
}: {
  phase: (typeof phases)[number];
  repoId: string;
  isCurrent: boolean;
}) {
  const [criteria, setCriteria] = useState(() =>
    getCriteria(repoId, phase.id)
  );

  function toggle(id: string) {
    const next = { ...criteria, [id]: !criteria[id] };
    setCriteria(next);
    saveCriteria(repoId, phase.id, next);
  }

  const doneCount = phase.acceptanceCriteria.filter(
    (ac) => criteria[ac.id]
  ).length;
  const total = phase.acceptanceCriteria.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6"
    >
      {/* Phase header */}
      <div className="flex items-center gap-3">
        <div
          className="w-1 h-8 rounded-full flex-shrink-0"
          style={{ background: PHASE_COLORS[phase.id] }}
        />
        <div>
          <h3
            className="text-lg"
            style={{
              fontFamily: "'DM Serif Display', serif",
              color: "#f0f0f0",
            }}
          >
            {phase.name}
          </h3>
          <p className="font-mono text-[10px]" style={{ color: `${PHASE_COLORS[phase.id]}aa` }}>
            {phase.tagline}
            {!isCurrent && (
              <span className="ml-2 text-zinc-600">— not current phase</span>
            )}
          </p>
        </div>
      </div>

      <p className="text-[13px] text-zinc-500 leading-relaxed">
        {phase.description}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tools */}
        <div className="flex flex-col gap-3">
          <span className="font-mono text-[9px] tracking-widest text-zinc-600 uppercase">
            Tools
          </span>
          {phase.tools.map((tool) => (
            <div key={tool.name} className="flex items-start gap-2">
              <span
                className="font-mono text-[11px] whitespace-nowrap"
                style={{ color: PHASE_COLORS[phase.id] }}
              >
                {tool.name}
              </span>
              <span className="text-[11px] text-zinc-600">— {tool.purpose}</span>
            </div>
          ))}
        </div>

        {/* Acceptance criteria */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] tracking-widest text-zinc-600 uppercase">
              Done when
            </span>
            <span
              className="font-mono text-[10px]"
              style={{
                color:
                  doneCount === total
                    ? PHASE_COLORS[phase.id]
                    : "#52525b",
              }}
            >
              {doneCount}/{total}
            </span>
          </div>
          {phase.acceptanceCriteria.map((ac) => (
            <button
              key={ac.id}
              onClick={() => toggle(ac.id)}
              className="flex items-start gap-2 text-left group"
            >
              {criteria[ac.id] ? (
                <CheckSquare
                  className="w-3.5 h-3.5 flex-shrink-0 mt-0.5"
                  style={{ color: PHASE_COLORS[phase.id] }}
                />
              ) : (
                <Square className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-zinc-700 group-hover:text-zinc-500 transition-colors" />
              )}
              <span
                className={`text-[11px] leading-relaxed transition-colors ${
                  criteria[ac.id]
                    ? "text-zinc-500 line-through"
                    : "text-zinc-400 group-hover:text-zinc-300"
                }`}
              >
                {ac.text}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Output artifacts */}
      <div className="flex flex-col gap-2">
        <span className="font-mono text-[9px] tracking-widest text-zinc-600 uppercase">
          Output artifacts
        </span>
        <div className="flex flex-wrap gap-1.5">
          {phase.outputs.map((out) => (
            <span
              key={out}
              className="font-mono text-[10px] px-2 py-0.5 rounded border"
              style={{
                color: `${PHASE_COLORS[phase.id]}cc`,
                borderColor: `${PHASE_COLORS[phase.id]}25`,
                background: `${PHASE_COLORS[phase.id]}0a`,
              }}
            >
              {out}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── CHANGELOG ───────────────────────────────────────────────────── */
function Changelog({ repoId }: { repoId: string }) {
  const [entries, setEntries] = useState(() => getChangelog(repoId));
  const [input, setInput] = useState("");

  function addEntry() {
    const text = input.trim();
    if (!text) return;
    const next = [
      { ts: new Date().toISOString(), text },
      ...entries,
    ];
    setEntries(next);
    saveChangelog(repoId, next);
    setInput("");
  }

  return (
    <div className="flex flex-col gap-3">
      <span className="font-mono text-[9px] tracking-widest text-zinc-600 uppercase">
        Changelog
      </span>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addEntry()}
          placeholder="What shipped? (Enter to add)"
          className="flex-1 bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-[11px] text-zinc-300 placeholder-zinc-700 outline-none focus:border-zinc-600 transition-colors font-mono"
        />
        <button
          onClick={addEntry}
          className="p-1.5 rounded border border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
      {entries.length > 0 && (
        <div className="flex flex-col gap-1.5 mt-1">
          {entries.map((e, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="font-mono text-[9px] text-zinc-700 whitespace-nowrap mt-0.5">
                {new Date(e.ts).toLocaleDateString("en-GB", {
                  month: "short",
                  day: "2-digit",
                })}
              </span>
              <span className="text-[11px] text-zinc-400">{e.text}</span>
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

  const [selectedPhase, setSelectedPhase] = useState<string>(
    repo?.phase ?? "strategy"
  );
  const [sprintGoal, setSprintGoal] = useState(
    () => (repo ? getSprintGoal(repo.id, repo.sprintGoal) : "")
  );

  if (!repo) return <Navigate to="/dashboard" replace />;

  const currentPhase = phases.find((p) => p.id === selectedPhase) ?? phases[0];

  return (
    <div
      className="min-h-screen text-zinc-100"
      style={{ background: "#0d0f12", fontFamily: "'Inter', sans-serif" }}
    >
      <div className="max-w-[860px] mx-auto px-6 py-10">

        {/* ── Top bar ─────────────────────────────────────────── */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            to="/dashboard"
            className="p-2 rounded-lg border border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex-1">
            <h1
              className="text-xl leading-tight"
              style={{ fontFamily: "'DM Serif Display', serif", color: "#f0f0f0" }}
            >
              {repo.name}
            </h1>
            <p className="text-[11px] text-zinc-600 mt-0.5">{repo.description}</p>
          </div>
          <div className="flex items-center gap-2">
            {repo.deployUrl && (
              <a
                href={repo.deployUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200 transition-colors text-[11px] font-mono"
              >
                <ExternalLink className="w-3 h-3" />
                Deploy
              </a>
            )}
            <a
              href={repo.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200 transition-colors text-[11px] font-mono"
            >
              <Github className="w-3 h-3" />
              GitHub
            </a>
          </div>
        </div>

        {/* ── Sprint goal ──────────────────────────────────────── */}
        <div className="flex flex-col gap-2 mb-8 p-4 rounded-xl border border-zinc-800 bg-[#111318]">
          <span className="font-mono text-[9px] tracking-widest text-zinc-600 uppercase">
            Sprint goal
          </span>
          <input
            type="text"
            value={sprintGoal}
            onChange={(e) => {
              setSprintGoal(e.target.value);
              saveSprintGoal(repo.id, e.target.value);
            }}
            className="bg-transparent text-sm text-zinc-200 outline-none placeholder-zinc-700"
            placeholder="What are you shipping this sprint?"
          />
        </div>

        {/* ── Phase strip ──────────────────────────────────────── */}
        <div className="mb-8">
          <PhaseStrip
            current={repo.phase}
            onSelect={setSelectedPhase}
            selected={selectedPhase}
          />
        </div>

        {/* ── Selected phase detail ────────────────────────────── */}
        <div className="p-5 rounded-xl border border-zinc-800 bg-[#111318] mb-8">
          <PhasePanel
            phase={currentPhase}
            repoId={repo.id}
            isCurrent={currentPhase.id === repo.phase}
          />
        </div>

        {/* ── Changelog + meta ─────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 rounded-xl border border-zinc-800 bg-[#111318]">
            <Changelog repoId={repo.id} />
          </div>

          <div className="p-4 rounded-xl border border-zinc-800 bg-[#111318] flex flex-col gap-4">
            <span className="font-mono text-[9px] tracking-widest text-zinc-600 uppercase">
              Project meta
            </span>
            <div className="flex flex-col gap-2.5">
              {[
                ["Stack", repo.stack.join(", ") || "—"],
                ["Monetization", repo.monetization],
                ["Strategic role", repo.strategicRole],
                ["Status", repo.status],
                ...(repo.lastShipped
                  ? [["Last shipped", repo.lastShipped]]
                  : []),
              ].map(([label, val]) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <span className="font-mono text-[9px] text-zinc-700 uppercase tracking-wider">
                    {label}
                  </span>
                  <span className="text-[12px] text-zinc-400">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

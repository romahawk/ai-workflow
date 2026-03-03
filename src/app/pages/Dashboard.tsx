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

/* ─── Design tokens (mirrors Home.tsx) ───────────────────────────── */
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

/* ─── Animated background (same as Home) ─────────────────────────── */
function BackgroundScene() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -24, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute", top: "-25%", left: "-20%", width: "72%", height: "72%",
          background: "radial-gradient(ellipse at center, rgba(99,102,241,0.18) 0%, rgba(59,130,246,0.10) 40%, transparent 70%)",
          filter: "blur(72px)",
        }}
      />
      <motion.div
        animate={{ x: [0, -30, 0], y: [0, 28, 0], scale: [1, 1.06, 1] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute", top: "5%", right: "-22%", width: "62%", height: "62%",
          background: "radial-gradient(ellipse at center, rgba(168,85,247,0.16) 0%, rgba(139,92,246,0.08) 45%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      <motion.div
        animate={{ x: [0, 20, 0], y: [0, -32, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute", bottom: "-20%", left: "25%", width: "55%", height: "55%",
          background: "radial-gradient(ellipse at center, rgba(52,211,153,0.13) 0%, rgba(16,185,129,0.06) 45%, transparent 70%)",
          filter: "blur(90px)",
        }}
      />
      <div
        style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
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

/* ─── Phase strip ─────────────────────────────────────────────────── */
function PhaseStrip({ current }: { current: string }) {
  return (
    <div className="flex gap-0.5 mt-2">
      {phases.map((p) => {
        const isActive = p.id === current;
        const isPast = phases.findIndex((x) => x.id === current) > phases.indexOf(p);
        const c = PHASE_NEON[p.id] ?? "#475569";
        return (
          <div
            key={p.id}
            title={p.name}
            className="flex-1 h-0.5 rounded-full transition-all"
            style={{
              background: isActive ? c : isPast ? `${c}45` : "rgba(255,255,255,0.07)",
              boxShadow: isActive ? `0 0 6px ${c}80` : "none",
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
        className="max-w-sm mx-4 w-full rounded-2xl overflow-hidden flex flex-col"
        style={{
          background: SURFACE,
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: `1px solid ${BORDER}`,
          boxShadow: "0 0 0 1px rgba(255,255,255,0.03), 0 20px 60px rgba(0,0,0,0.6), 0 0 80px rgba(251,146,60,0.10)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* amber top stripe */}
        <div style={{ height: "2px", background: "linear-gradient(90deg, #fb923c 0%, #fb923c60 50%, transparent 100%)" }} />
        <div className="p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-4 h-4 flex-shrink-0" style={{ color: "#fb923c" }} />
            <h3 className="text-sm font-semibold" style={{ color: TEXT_PRIMARY }}>WIP Limit Reached</h3>
          </div>
          <p className="text-[12px] leading-relaxed" style={{ color: TEXT_SECONDARY }}>
            You already have{" "}
            <strong style={{ color: TEXT_PRIMARY }}>{ACTIVE_LIMIT} active projects</strong>.
            Park one before activating another.
          </p>
          <p className="text-[10px]" style={{ fontFamily: MONO, color: TEXT_MUTED }}>
            Rule: max {ACTIVE_LIMIT} active · focus over volume
          </p>
          <button
            onClick={onClose}
            className="w-full py-2 rounded-xl text-[12px] transition-opacity hover:opacity-80"
            style={{ fontFamily: MONO, background: "rgba(255,255,255,0.05)", border: `1px solid ${BORDER}`, color: TEXT_SECONDARY }}
          >
            Got it
          </button>
        </div>
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
  const c = PHASE_NEON[repo.phase] ?? "#94a3b8";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col rounded-2xl overflow-hidden"
      style={{
        background: SURFACE,
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: `1px solid ${BORDER}`,
        boxShadow: `0 0 0 1px rgba(255,255,255,0.03), 0 4px 6px rgba(0,0,0,0.25), 0 20px 60px rgba(0,0,0,0.55), 0 0 80px ${c}08, inset 0 1px 0 rgba(255,255,255,0.06)`,
      }}
    >
      {/* Phase neon stripe */}
      <div style={{ height: "2px", flexShrink: 0, background: `linear-gradient(90deg, ${c} 0%, ${c}60 50%, transparent 100%)` }} />

      <div className="px-4 pt-3 pb-4 flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: STATUS_NEON.active, boxShadow: `0 0 6px ${STATUS_NEON.active}80` }} />
              <Label>active · p{repo.priority}</Label>
            </div>
            <Link
              to={`/projects/${repo.id}`}
              className="text-[13px] font-semibold transition-opacity hover:opacity-70"
              style={{ color: TEXT_PRIMARY }}
            >
              {repo.name}
            </Link>
            <p className="text-[10px] mt-0.5" style={{ color: TEXT_MUTED }}>{repo.strategicRole}</p>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {repo.deployUrl && (
              <a
                href={repo.deployUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="View deploy"
                className="p-1.5 rounded-lg transition-opacity hover:opacity-70"
                style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${BORDER}`, color: TEXT_MUTED }}
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            <a
              href={repo.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub"
              className="p-1.5 rounded-lg transition-opacity hover:opacity-70"
              style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${BORDER}`, color: TEXT_MUTED }}
            >
              <Github className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Phase strip */}
        <div>
          <div className="flex items-center justify-between">
            <Label>Phase</Label>
            <span
              className="text-[9px] px-1.5 py-0.5 rounded"
              style={{ fontFamily: MONO, color: c, background: `${c}15`, border: `1px solid ${c}28` }}
            >
              {phase?.name ?? repo.phase}
            </span>
          </div>
          <PhaseStrip current={repo.phase} />
        </div>

        <div style={{ height: "1px", background: "rgba(255,255,255,0.045)" }} />

        {/* Sprint goal */}
        <div>
          <Label>Sprint goal</Label>
          <p className="text-[11px] mt-1 leading-relaxed" style={{ color: TEXT_SECONDARY }}>{repo.sprintGoal}</p>
        </div>

        {/* Today's focus */}
        <div>
          <Label>Today's focus</Label>
          <input
            type="text"
            defaultValue={repo.focusToday ?? ""}
            onBlur={(e) => setFocusToday(repo.id, e.target.value)}
            placeholder="What are you shipping today?"
            className="w-full mt-1 rounded-lg px-3 py-1.5 text-[11px] outline-none transition-colors"
            style={{
              fontFamily: MONO,
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${BORDER}`,
              color: TEXT_PRIMARY,
            }}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <a
            href={`${repo.githubUrl}/issues`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center py-1.5 rounded-xl text-[10px] transition-opacity hover:opacity-80"
            style={{ fontFamily: MONO, background: "rgba(255,255,255,0.04)", border: `1px solid ${BORDER}`, color: TEXT_MUTED }}
          >
            Issues
          </a>
          <Link
            to={`/projects/${repo.id}`}
            className="flex-1 text-center py-1.5 rounded-xl text-[10px] transition-opacity hover:opacity-80"
            style={{ fontFamily: MONO, background: `${c}18`, border: `1px solid ${c}30`, color: c }}
          >
            Detail →
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Parked card ─────────────────────────────────────────────────── */
function ParkedCard({ repo, onActivate }: { repo: Repo; onActivate: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start justify-between gap-3 p-3 rounded-xl"
      style={{ background: "rgba(12,15,30,0.5)", backdropFilter: "blur(12px)", border: `1px solid ${BORDER}` }}
    >
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: STATUS_NEON.parked }} />
          <span className="text-[12px]" style={{ color: TEXT_SECONDARY }}>{repo.name}</span>
        </div>
        {repo.parkReason && (
          <p className="text-[10px] pl-3.5" style={{ color: TEXT_MUTED }}>{repo.parkReason}</p>
        )}
      </div>
      <button
        onClick={onActivate}
        className="flex-shrink-0 text-[10px] px-2.5 py-1 rounded-lg transition-opacity hover:opacity-80 whitespace-nowrap"
        style={{ fontFamily: MONO, background: "rgba(255,255,255,0.04)", border: `1px solid ${BORDER}`, color: TEXT_MUTED }}
      >
        Activate →
      </button>
    </motion.div>
  );
}

/* ─── Frozen section ──────────────────────────────────────────────── */
function FrozenSection({ repos: frozen }: { repos: Repo[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 text-[10px] transition-opacity hover:opacity-70"
        style={{ fontFamily: MONO, color: TEXT_MUTED }}
      >
        {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
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
                className="flex items-center gap-2 p-2.5 rounded-lg"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: STATUS_NEON[repo.status] ?? TEXT_MUTED }}
                />
                <span className="text-[11px]" style={{ color: TEXT_MUTED }}>{repo.name}</span>
                {repo.parkReason && (
                  <span className="text-[10px] truncate" style={{ color: "rgba(71,85,105,0.6)" }}>
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
  const frozenRepos = repos.filter((r) => r.status === "frozen" || r.status === "archived");

  async function handleActivate(id: string) {
    const ok = await setStatus(id, "active");
    if (!ok) setWipBlocked(true);
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: BG, fontFamily: "'Inter', sans-serif", color: TEXT_PRIMARY }}
    >
      <BackgroundScene />
      {wipBlocked && <WIPModal onClose={() => setWipBlocked(false)} />}

      <div className="relative max-w-[1100px] mx-auto px-6 py-8">

        {/* ── Top bar ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-start justify-between mb-8"
        >
          <div className="flex items-start gap-4">
            <Link
              to="/"
              title="Back to OS poster"
              className="mt-1 p-2 rounded-xl transition-opacity hover:opacity-70 flex-shrink-0"
              style={{ background: SURFACE, backdropFilter: "blur(12px)", border: `1px solid ${BORDER}`, color: TEXT_MUTED }}
            >
              <Home className="w-4 h-4" />
            </Link>

            <div>
              <div className="mb-1.5">
                <span
                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider"
                  style={{ fontFamily: MONO, color: "#60a5fa", background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.22)" }}
                >
                  <span className="w-1 h-1 rounded-full" style={{ background: "#3b82f6", boxShadow: "0 0 6px #3b82f6" }} />
                  Execution Layer · Week {getSprintWeek()}
                </span>
              </div>
              <h1
                className="text-2xl font-bold leading-tight tracking-tight"
                style={{ background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 35%, #94a3b8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
              >
                Sprint Week {getSprintWeek()}
              </h1>
              <p className="text-[11px] mt-0.5" style={{ fontFamily: MONO, color: TEXT_MUTED }}>{getWeekRange()}</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex gap-1">
                  {Array.from({ length: ACTIVE_LIMIT }).map((_, i) => (
                    <div
                      key={i}
                      className="w-5 h-1 rounded-full transition-all"
                      style={{
                        background: i < activeCount
                          ? atLimit ? STATUS_NEON.parked : STATUS_NEON.active
                          : "rgba(255,255,255,0.07)",
                        boxShadow: i < activeCount
                          ? `0 0 6px ${atLimit ? STATUS_NEON.parked : STATUS_NEON.active}80`
                          : "none",
                      }}
                    />
                  ))}
                </div>
                <span className="text-[10px]" style={{ fontFamily: MONO, color: atLimit ? STATUS_NEON.parked : TEXT_MUTED }}>
                  {activeCount}/{ACTIVE_LIMIT} active{atLimit && " · WIP LIMIT MET"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/sprint"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] transition-opacity hover:opacity-80"
              style={{ fontFamily: MONO, background: SURFACE, backdropFilter: "blur(12px)", border: `1px solid ${BORDER}`, color: TEXT_SECONDARY }}
            >
              Sprint plan <ArrowUpRight className="w-3 h-3" />
            </Link>
            <Link
              to="/daily"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-semibold transition-opacity hover:opacity-90"
              style={{ fontFamily: MONO, background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #a21caf 100%)", color: "#fff", boxShadow: "0 0 28px rgba(124,58,237,0.4), 0 4px 20px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.15)" }}
            >
              Daily loop
            </Link>
          </div>
        </motion.div>

        {/* ── Loading skeleton ─────────────────────────────────────── */}
        {!loaded && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-56 rounded-2xl animate-pulse"
                style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
              />
            ))}
          </div>
        )}

        {/* ── Three-column board ───────────────────────────────────── */}
        {loaded && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Active */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: STATUS_NEON.active, boxShadow: `0 0 6px ${STATUS_NEON.active}80` }} />
                <Label>Active ({activeCount}/{ACTIVE_LIMIT})</Label>
              </div>
              {activeRepos.map((repo) => (
                <ActiveCard key={repo.id} repo={repo} setFocusToday={setFocusToday} />
              ))}
            </div>

            {/* Parked */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: STATUS_NEON.parked }} />
                <Label>Parked ({parkedRepos.length})</Label>
              </div>
              {parkedRepos.map((repo) => (
                <ParkedCard key={repo.id} repo={repo} onActivate={() => handleActivate(repo.id)} />
              ))}
            </div>

            {/* Frozen + archived */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: STATUS_NEON.frozen }} />
                <Label>Frozen / Archived ({frozenRepos.length})</Label>
              </div>
              <FrozenSection repos={frozenRepos} />
            </div>
          </motion.div>
        )}

        {/* ── Repo index ───────────────────────────────────────────── */}
        {loaded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 pt-6"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
          >
            <Label>All repos ({repos.length})</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-3">
              {repos.map((repo) => (
                <Link
                  key={repo.id}
                  to={`/projects/${repo.id}`}
                  className="flex items-center gap-2.5 p-3 rounded-xl transition-all"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                    e.currentTarget.style.borderColor = BORDER;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.04)";
                  }}
                >
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: STATUS_NEON[repo.status] ?? TEXT_MUTED }} />
                  <span className="text-[12px] truncate" style={{ color: TEXT_SECONDARY }}>{repo.name}</span>
                  <ArrowUpRight className="w-3 h-3 ml-auto flex-shrink-0" style={{ color: TEXT_MUTED }} />
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

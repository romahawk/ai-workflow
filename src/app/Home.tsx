import React, { useCallback, useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Target,
  Layout,
  Code2,
  ShieldCheck,
  Briefcase,
  Bot,
  Layers,
  Zap,
  Terminal,
  FileCode2,
  GitBranch,
  Rocket,
  SearchCode,
  CheckCircle2,
  Check,
  MousePointer2,
  MessageCircleCode,
  Eye,
  Activity,
  BarChart3,
  Video,
  FileText,
  MonitorCheck,
  Github,
  ArrowUpRight,
  Star,
  Mail,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { WorkflowSection } from "./components/WorkflowSection";
import { Node, ToolNode } from "./components/Node";
import { ConnectionArrow } from "./components/ConnectionArrow";
import { Navbar } from "./components/Navbar";
import { useTheme } from "../hooks/useTheme";
import { useChecklist } from "../hooks/useChecklist";
import { WORKFLOW } from "../data/workflow";
import type { CheckedState } from "../hooks/useChecklist";

/* ─── Stage metadata ──────────────────────────────────────────────── */
const STAGES = [
  {
    label: "Strategy / Architect",
    shortLabel: "Strategy",
    color: "blue",
    activeText: "text-blue-600 dark:text-blue-400",
    activeBg: "bg-blue-50 dark:bg-blue-950/40",
    progressBg: "bg-blue-500",
    dotColor: "bg-blue-500",
  },
  {
    label: "Architecture & Design",
    shortLabel: "Architecture",
    color: "purple",
    activeText: "text-purple-600 dark:text-purple-400",
    activeBg: "bg-purple-50 dark:bg-purple-950/40",
    progressBg: "bg-purple-500",
    dotColor: "bg-purple-500",
  },
  {
    label: "Daily Build Loop",
    shortLabel: "Build Loop",
    color: "green",
    activeText: "text-green-600 dark:text-green-400",
    activeBg: "bg-green-50 dark:bg-green-950/40",
    progressBg: "bg-green-500",
    dotColor: "bg-green-500",
  },
  {
    label: "Production Hardening",
    shortLabel: "Hardening",
    color: "amber",
    activeText: "text-amber-600 dark:text-amber-400",
    activeBg: "bg-amber-50 dark:bg-amber-950/40",
    progressBg: "bg-amber-500",
    dotColor: "bg-amber-500",
  },
  {
    label: "Professional Signal",
    shortLabel: "Signal Layer",
    color: "gray",
    activeText: "text-gray-700 dark:text-zinc-300",
    activeBg: "bg-gray-50 dark:bg-zinc-800/50",
    progressBg: "bg-gray-700",
    dotColor: "bg-gray-600",
  },
] as const;

/* ─── Stage nav bar ───────────────────────────────────────────────── */
const StageNav = ({
  active,
  setActive,
  stageCompletion,
}: {
  active: number;
  setActive: (n: number) => void;
  stageCompletion: boolean[];
}) => {
  const progress = ((active + 1) / STAGES.length) * 100;
  return (
    <div className="fixed top-14 left-0 right-0 z-40 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-sm border-b border-gray-100 dark:border-zinc-800 print:hidden">
      <div className="flex h-11">
        {STAGES.map((s, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`flex-1 flex items-center justify-center gap-1.5 text-[11px] font-bold transition-all relative overflow-hidden ${
              active === i
                ? `${s.activeText} ${s.activeBg}`
                : "text-gray-400 hover:text-gray-600 hover:bg-gray-50/50 dark:text-zinc-500 dark:hover:text-zinc-300 dark:hover:bg-zinc-800/50"
            }`}
          >
            <span
              className={`w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center flex-shrink-0 transition-colors ${
                active === i ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900" : "bg-gray-100 text-gray-500 dark:bg-zinc-800 dark:text-zinc-500"
              }`}
            >
              {i + 1}
            </span>
            <span className="truncate hidden sm:block">{s.shortLabel}</span>
            {stageCompletion[i] && (
              <Check className="w-3 h-3 text-green-500 dark:text-green-400 flex-shrink-0" />
            )}
            {/* Active tab underline */}
            {active === i && (
              <motion.div
                layoutId="stage-tab-indicator"
                className={`absolute bottom-0 left-0 right-0 h-[2px] ${s.progressBg}`}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              />
            )}
            {/* Column separator */}
            {i < STAGES.length - 1 && (
              <div className="absolute right-0 top-3 bottom-3 w-px bg-gray-100 dark:bg-zinc-800 pointer-events-none" />
            )}
          </button>
        ))}
      </div>
      {/* Overall progress fill */}
      <div className="h-[3px] bg-gray-100 dark:bg-zinc-800 relative overflow-hidden">
        <motion.div
          className={`absolute inset-y-0 left-0 ${STAGES[active].progressBg} opacity-40`}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
};

/* ─── Operating rules sidebar ─────────────────────────────────────── */
const SidePanel = () => {
  const rules = [
    "Max 3 active projects",
    "One outcome per week per repo",
    "No refactor without shipping impact",
    "One source of truth per layer",
    "AI accelerates, does not decide",
    "If not deployed, it doesn't count",
  ];
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
          Governance
        </span>
        <h4 className="text-sm font-black text-gray-900 dark:text-zinc-100 leading-tight">Operating Rules</h4>
        <div className="h-0.5 w-6 bg-gray-900 dark:bg-zinc-100 rounded-full mt-1" />
      </div>
      <ul className="flex flex-col gap-3.5">
        {rules.map((rule, idx) => (
          <li key={idx} className="flex items-start gap-2.5 group">
            <div className="w-4 h-4 rounded-full bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-700 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-gray-900 group-hover:border-gray-900 dark:group-hover:bg-zinc-100 dark:group-hover:border-zinc-100 transition-colors">
              <Zap className="w-2 h-2 text-gray-400 dark:text-zinc-600 group-hover:text-white dark:group-hover:text-zinc-900 transition-colors" />
            </div>
            <span className="text-[12px] font-semibold text-gray-700 dark:text-zinc-300 leading-snug">{rule}</span>
          </li>
        ))}
      </ul>
      <div className="pt-4 border-t border-gray-100 dark:border-zinc-800 flex flex-col gap-2.5">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          Optional Tools
        </span>
        <div className="flex flex-wrap gap-2">
          <ToolNode name="Linear" type="secondary" />
          <ToolNode name="Trello" type="secondary" />
          <ToolNode name="Calendar" type="secondary" />
        </div>
      </div>
    </div>
  );
};

/* ─── Stage content ───────────────────────────────────────────────── */
const renderStage = (
  idx: number,
  fullWidth = false,
  checkable = false,
  checked: CheckedState = {},
  toggle: (id: string) => void = () => {},
) => {
  // Helper: spread checkable props onto a Node (no-op in print view)
  const np = (nodeId: string) =>
    checkable
      ? { checkable: true, checked: !!checked[nodeId], onToggle: () => toggle(nodeId) }
      : {};

  // Progress for WorkflowSection header counter
  const stageData = WORKFLOW[idx];
  const stageProg = checkable && stageData
    ? { progress: { done: stageData.nodes.filter((n) => !!checked[n.id]).length, total: stageData.nodes.length } }
    : {};

  switch (idx) {
    case 0:
      return (
        <WorkflowSection
          title="Strategy / Architect (Weekly Decision Compression)"
          color="blue"
          delay={fullWidth ? 0 : 0.1}
          fullWidth={fullWidth}
          note="AI supports clarity. Human owns scope."
          {...stageProg}
          footer={
            <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-blue-100/40 dark:border-blue-900/40">
              <span className="text-[9px] text-blue-500 dark:text-blue-400 font-bold uppercase tracking-widest">
                Primary Tools
              </span>
              <div className="flex flex-wrap gap-2">
                <ToolNode name="ChatGPT" />
                <ToolNode name="Claude" />
                <ToolNode name="FigJam" type="secondary" />
                <ToolNode name="GitHub Issues" type="secondary" />
              </div>
            </div>
          }
        >
          <Node label="Define 1–3 Weekly Outcomes"         icon={Target}      {...np('define-weekly-outcomes')} />
          <Node label="Scope Constraints (Max 3 Projects)" icon={Briefcase}   {...np('scope-constraints')} />
          <Node label="Write Acceptance Criteria"          icon={CheckCircle2} {...np('write-acceptance-criteria')} />
          <Node label="Update Roadmap"                     icon={Layers}      {...np('update-roadmap')} />
          <Node label="Update Decision Log"                icon={FileCode2}   {...np('update-decision-log')} />
        </WorkflowSection>
      );

    case 1:
      return (
        <WorkflowSection
          title="Architecture & System Design"
          color="purple"
          delay={fullWidth ? 0 : 0.3}
          fullWidth={fullWidth}
          {...stageProg}
          footer={
            <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-purple-100/40 dark:border-purple-900/40">
              <span className="text-[9px] text-purple-500 dark:text-purple-400 font-bold uppercase tracking-widest">
                Primary Tools
              </span>
              <div className="flex flex-wrap gap-2">
                <ToolNode name="Claude" />
                <ToolNode name="ChatGPT" />
                <ToolNode name="Mermaid" type="secondary" />
                <ToolNode name="Figma" type="secondary" />
              </div>
            </div>
          }
        >
          <Node label="Data Model Definition"    icon={Layers}     {...np('data-model')} />
          <Node label="API Schema"               icon={Terminal}   {...np('api-schema')} />
          <Node label="Folder Structure"         icon={Layout}     {...np('folder-structure')} />
          <Node label="State Management Design"  icon={Layers}     {...np('state-management')} />
          <Node label="Edge Case Review"         icon={SearchCode} {...np('edge-cases')} />
          <Node label="Scalability Considerations" icon={Zap}      {...np('scalability')} />
        </WorkflowSection>
      );

    case 2:
      return (
        <WorkflowSection
          title="Daily Build Loop"
          color="green"
          delay={fullWidth ? 0 : 0.5}
          fullWidth={fullWidth}
          note="Small PRs. Async clarity. Ship daily."
          {...stageProg}
          footer={
            <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-green-100/40 dark:border-green-900/40">
              <span className="text-[9px] text-green-600 dark:text-green-400 font-bold uppercase tracking-widest">
                Core Engine
              </span>
              <div className="flex flex-wrap gap-2">
                <ToolNode name="GitHub" />
                <ToolNode name="GitHub Copilot" />
                <ToolNode name="VS Code" />
                <ToolNode name="Claude" type="secondary" />
                <ToolNode name="ChatGPT" type="secondary" />
                <ToolNode name="Vercel" type="secondary" />
              </div>
            </div>
          }
        >
          <div className="flex flex-col gap-3 relative">
            <div className="absolute left-[11px] top-6 bottom-6 w-0.5 border-l-2 border-dashed border-green-200 dark:border-green-800/50" />
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-green-500 border-4 border-white shadow-sm flex-shrink-0 z-10" />
              <Node label="Select GitHub Issue" icon={MessageCircleCode} className="flex-1" {...np('select-issue')} />
            </div>
            <div className="flex items-center gap-2 pl-4">
              <Node label="Define Micro-Scope" icon={Target} className="flex-1" {...np('define-scope')} />
            </div>
            <div className="flex items-center gap-2 pl-4">
              <Node label="Implement" icon={Code2} className="flex-1 bg-green-50/50 dark:bg-green-950/30 border-green-200 dark:border-green-800/50" {...np('implement')} />
            </div>
            <div className="flex items-center gap-2 pl-4">
              <Node label="AI Code Review" icon={Bot} className="flex-1" {...np('ai-review')} />
            </div>
            <div className="flex items-center gap-2 pl-4">
              <Node label="Manual Reasoning Pass" icon={MousePointer2} className="flex-1" {...np('manual-reasoning')} />
            </div>
            <div className="flex items-center gap-2 pl-4">
              <Node label="PR + Merge" icon={GitBranch} className="flex-1" {...np('pr-merge')} />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-green-600 border-4 border-white shadow-md flex-shrink-0 z-10 animate-pulse" />
              <Node
                label="Deploy"
                icon={Rocket}
                className="flex-1 bg-green-600 text-white border-none shadow-lg"
                {...np('deploy')}
              />
            </div>
          </div>
        </WorkflowSection>
      );

    case 3:
      return (
        <WorkflowSection
          title="Production Hardening"
          color="amber"
          delay={fullWidth ? 0 : 0.7}
          fullWidth={fullWidth}
          note="Production readiness > feature count."
          {...stageProg}
          footer={
            <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-amber-100/40 dark:border-amber-900/40">
              <span className="text-[9px] text-amber-600 dark:text-amber-400 font-bold uppercase tracking-widest">
                Refinement Stack
              </span>
              <div className="flex flex-wrap gap-2">
                <ToolNode name="Claude" />
                <ToolNode name="ChatGPT" />
                <ToolNode name="Lighthouse" type="secondary" />
                <ToolNode name="Sentry" type="secondary" />
                <ToolNode name="PostHog" type="secondary" />
              </div>
            </div>
          }
        >
          <Node label="UX Review"                icon={Eye}       {...np('ux-review')} />
          <Node label="Loading & Error States"  icon={Activity}  {...np('loading-error-states')} />
          <Node label="Performance Optimization" icon={Zap}      {...np('performance')} />
          <Node label="Error Monitoring"         icon={ShieldCheck} {...np('error-monitoring')} />
          <Node label="Analytics Integration"    icon={BarChart3}   {...np('analytics-integration')} />
        </WorkflowSection>
      );

    case 4:
    default:
      return (
        <WorkflowSection
          title="Professional Signal Layer"
          color="gray"
          delay={fullWidth ? 0 : 0.9}
          fullWidth={fullWidth}
          {...stageProg}
          footer={
            <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
              <span className="text-[9px] text-gray-500 dark:text-zinc-400 font-bold uppercase tracking-widest">
                Distribution Tools
              </span>
              <div className="flex flex-wrap gap-2">
                <ToolNode name="GitHub" />
                <ToolNode name="Loom" />
                <ToolNode name="README" type="secondary" />
                <ToolNode name="Portfolio" type="secondary" />
                <ToolNode name="ChatGPT" type="secondary" />
              </div>
            </div>
          }
        >
          <Node label="Clean Git History"     icon={GitBranch}       {...np('clean-git-history')} />
          <Node label="PR Discipline"          icon={MessageCircleCode} {...np('pr-discipline')} />
          <Node label="Architecture Docs"      icon={FileCode2}       {...np('architecture-docs')} />
          <Node label="Public Deployment"      icon={MonitorCheck}    {...np('public-deployment')} />
          <Node label="Demo Recording"         icon={Video}           {...np('demo-recording')} />
          <Node label="Case Study Extraction"  icon={FileText}        {...np('case-study')} />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: fullWidth ? 0.2 : 1.5, duration: 0.5 }}
            className="mt-6 p-5 bg-gray-900 rounded-2xl flex items-center justify-between border-b-4 border-blue-500 shadow-xl"
          >
            <div className="flex flex-col">
              <span className="text-[10px] text-blue-400 font-black uppercase tracking-widest mb-1">
                Final Output
              </span>
              <span className="text-white text-sm font-bold tracking-tight">
                Public Portfolio Artifact
              </span>
            </div>
            <Rocket className="w-5 h-5 text-blue-400" />
          </motion.div>
        </WorkflowSection>
      );
  }
};

/* ─── CTA section ─────────────────────────────────────────────────── */
const CTASection = () => (
  <section className="w-full py-8 print:hidden">
    <div className="max-w-3xl mx-auto px-6">
      <div className="bg-gray-900 rounded-2xl px-8 py-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
            Open to opportunities
          </span>
          <p className="text-white font-black text-lg tracking-tight leading-tight">
            Roman Mazuryk
          </p>
          <p className="text-gray-400 text-[13px] font-medium">
            Senior Engineer · Solo Founder · Remote-First
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <a
            href="https://github.com/romahawk/ai-workflow"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white transition-all text-[12px] font-bold"
          >
            <Star className="w-3.5 h-3.5" />
            Star on GitHub
          </a>
          {/* Replace href with your portfolio/contact URL or mailto:you@email.com */}
          <a
            href="https://github.com/romahawk"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all text-[12px] font-bold shadow-lg shadow-blue-900/30"
          >
            <Mail className="w-3.5 h-3.5" />
            Get in Touch
          </a>
        </div>
      </div>
    </div>
  </section>
);

/* ─── Footer ──────────────────────────────────────────────────────── */
const Footer = () => (
  <footer className="w-full pb-10 print:hidden">
    <div className="border-t border-gray-100 dark:border-zinc-800 pt-6 max-w-3xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <p className="text-[11px] text-gray-400 dark:text-zinc-500 tracking-wide">
        © {new Date().getFullYear()} Roman Mazuryk · SDLC Workflow Algorithm
      </p>
      <div className="flex items-center gap-5">
        <a
          href="https://github.com/romahawk/ai-workflow"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-gray-400 hover:text-gray-900 dark:text-zinc-500 dark:hover:text-zinc-100 transition-colors text-[12px] font-semibold"
        >
          <Github className="w-3.5 h-3.5" />
          Source
        </a>
        <a
          href="https://github.com/romahawk/ai-workflow/blob/main/docs/ROADMAP.md"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-gray-400 hover:text-blue-600 dark:text-zinc-500 dark:hover:text-blue-400 transition-colors text-[12px] font-semibold"
        >
          Roadmap
          <ArrowUpRight className="w-3 h-3" />
        </a>
      </div>
    </div>
  </footer>
);

/* ─── Main ────────────────────────────────────────────────────────── */
export default function Home() {
  const { dark, toggle } = useTheme();
  const { checked, toggle: toggleNode, reset, projectId, generateContext } = useChecklist();
  const [orientation, setOrientation] = useState<"landscape" | "portrait">("landscape");
  const [activeStage, setActiveStage] = useState(0);

  const stageCompletion = WORKFLOW.map((stage) =>
    stage.nodes.length > 0 && stage.nodes.every((n) => !!checked[n.id]),
  );

  const handleCopyContext = useCallback(() => {
    navigator.clipboard.writeText(generateContext(activeStage)).catch(() => {});
  }, [generateContext, activeStage]);
  const [direction, setDirection] = useState<1 | -1>(1);
  const goTo = (next: number) => {
    setDirection(next > activeStage ? 1 : -1);
    setActiveStage(next);
  };

  // Keyboard navigation: ←/→ arrows, 1–5 keys
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Don't capture when typing in an input
      if ((e.target as HTMLElement).tagName === "INPUT") return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        setDirection(1);
        setActiveStage((s) => Math.min(s + 1, STAGES.length - 1));
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        setDirection(-1);
        setActiveStage((s) => Math.max(s - 1, 0));
      } else {
        const n = parseInt(e.key);
        if (!isNaN(n) && n >= 1 && n <= STAGES.length) {
          setActiveStage((prev) => {
            setDirection(n - 1 > prev ? 1 : -1);
            return n - 1;
          });
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="bg-background text-foreground font-sans selection:bg-blue-100 selection:text-blue-900 print:bg-white">
      <style>{`
        @media print {
          @page {
            size: ${orientation};
            margin: 10mm;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .print-grid-layout {
            display: grid !important;
            grid-template-columns: ${orientation === "landscape" ? "repeat(5, 1fr)" : "repeat(2, 1fr)"} !important;
            gap: 1.5rem !important;
            width: 100% !important;
            min-width: unset !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .print-grid-layout > div {
            max-width: 100% !important;
            min-width: unset !important;
            width: 100% !important;
          }
          .side-panel-print {
            grid-column: 1 / -1 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin-top: 2rem !important;
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 2rem !important;
          }
        }
      `}</style>

      {/* Fixed background texture */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.018] bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] bg-repeat print:hidden" />

      {/* ── Fixed chrome ─────────────────────────────────────────── */}
      <Navbar
        orientation={orientation}
        setOrientation={setOrientation}
        dark={dark}
        onToggle={toggle}
        projectId={projectId}
        onCopyContext={handleCopyContext}
        onReset={reset}
      />
      <StageNav active={activeStage} setActive={goTo} stageCompletion={stageCompletion} />

      {/* ── Screen view: single-stage viewport ───────────────────── */}
      <div className="print:hidden">
        {/* Spacer so content starts below both navbars (56px + 46px) */}
        <div className="h-[102px]" />

        {/* Stage panel — fills exactly one viewport height below navbars */}
        <div
          className="flex flex-col"
          style={{ height: "calc(100vh - 102px)" }}
        >
          {/* Content row: stage panel + sidebar */}
          <div className="flex flex-1 overflow-hidden">
            {/* Active stage */}
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={activeStage}
                  custom={direction}
                  variants={{
                    enter: (dir: number) => ({ opacity: 0, x: dir * 28, y: 0 }),
                    center: { opacity: 1, x: 0, y: 0 },
                    exit: (dir: number) => ({ opacity: 0, x: -dir * 28, y: 0 }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="p-6 lg:p-10 max-w-2xl mx-auto"
                >
                  {renderStage(activeStage, true, true, checked, toggleNode)}
                </motion.div>
              </AnimatePresence>
            </div>

          </div>

          {/* Bottom navigation strip */}
          <div className="flex-shrink-0 h-10 border-t border-gray-100 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-sm flex items-center justify-between px-6">
            <button
              onClick={() => goTo(Math.max(activeStage - 1, 0))}
              disabled={activeStage === 0}
              className="flex items-center gap-1 text-[12px] font-semibold text-gray-400 hover:text-gray-900 dark:hover:text-zinc-100 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:block">Prev</span>
            </button>

            {/* Dot indicators */}
            <div className="flex items-center gap-2">
              {STAGES.map((s, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  title={s.label}
                  className={`rounded-full transition-all duration-200 ${
                    i === activeStage
                      ? `w-4 h-2 ${s.dotColor}`
                      : "w-1.5 h-1.5 bg-gray-200 dark:bg-zinc-700 hover:bg-gray-400 dark:hover:bg-zinc-500"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => goTo(Math.min(activeStage + 1, STAGES.length - 1))}
              disabled={activeStage === STAGES.length - 1}
              className="flex items-center gap-1 text-[12px] font-semibold text-gray-400 hover:text-gray-900 dark:hover:text-zinc-100 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
            >
              <span className="hidden sm:block">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Below-fold: CTA + Footer (accessible via scroll) */}
        <CTASection />
        <Footer />
      </div>

      {/* ── Print view: all stages in grid ───────────────────────── */}
      <div className="hidden print:block max-w-[1920px] mx-auto p-4">
        {/* Print header */}
        <div className="flex flex-col items-center justify-center pt-4 pb-8 px-6">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-1">
            Roman Mazuryk's
          </p>
          <h1 className="text-2xl font-black text-gray-900 text-center tracking-tighter">
            SDLC Workflow Algorithm
          </h1>
          <p className="mt-2 text-sm text-gray-500 text-center max-w-xl leading-relaxed">
            AI-augmented, production-grade solo engineering — from weekly strategy to daily shipping to public proof-of-work.
          </p>
        </div>

        {/* All stages */}
        <div className="flex gap-4 items-start min-w-max print-grid-layout">
          {renderStage(0)}
          <ConnectionArrow delay={0.3} />
          {renderStage(1)}
          <ConnectionArrow delay={0.5} />
          {renderStage(2)}
          <ConnectionArrow delay={0.7} />
          {renderStage(3)}
          <ConnectionArrow delay={0.9} />
          {renderStage(4)}
        </div>

        {/* Operating rules */}
        <div className="mt-12 max-w-sm">
          <SidePanel />
        </div>
      </div>
    </div>
  );
}

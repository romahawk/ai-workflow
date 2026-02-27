import React, { useState } from "react";
import { motion } from "motion/react";
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
} from "lucide-react";
import { WorkflowSection } from "./components/WorkflowSection";
import { Node, ToolNode } from "./components/Node";
import { ConnectionArrow } from "./components/ConnectionArrow";
import { Navbar } from "./components/Navbar";

const SidePanel = () => {
  const rules = [
    "Max 3 active projects",
    "One outcome per week per repo",
    "No refactor without shipping impact",
    "One source of truth per layer",
    "AI accelerates, does not decide",
    "If not deployed, it doesn't count"
  ];

  return (
    <motion.aside
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1, duration: 0.6 }}
      className="w-[280px] bg-white border border-gray-200 rounded-2xl p-6 shadow-lg shadow-gray-100/50 flex flex-col gap-6 h-fit lg:sticky top-20 self-start"
    >
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Governance</span>
        <h4 className="text-base font-black text-gray-900 leading-tight">Operating Rules</h4>
        <div className="h-0.5 w-8 bg-gray-900 rounded-full mt-1" />
      </div>

      <ul className="flex flex-col gap-4">
        {rules.map((rule, idx) => (
          <motion.li
            key={idx}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 + idx * 0.08, duration: 0.3 }}
            className="flex items-start gap-3 group"
          >
            <div className="w-5 h-5 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-gray-900 group-hover:border-gray-900 transition-colors">
              <Zap className="w-2.5 h-2.5 text-gray-400 group-hover:text-white transition-colors" />
            </div>
            <span className="text-[13px] font-semibold text-gray-700 leading-snug">{rule}</span>
          </motion.li>
        ))}
      </ul>

      <div className="pt-5 border-t border-gray-100 flex flex-col gap-3">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Optional Tools</span>
        <div className="flex flex-wrap gap-2">
          <ToolNode name="Linear" type="secondary" />
          <ToolNode name="Trello" type="secondary" />
          <ToolNode name="Calendar" type="secondary" />
        </div>
      </div>
    </motion.aside>
  );
};

const Header = () => (
  <header className="flex flex-col items-center justify-center pt-10 pb-8 px-6 print:pt-4 print:pb-8">
    {/* Author attribution badge */}
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex items-center gap-3 mb-5"
    >
      <div className="px-3.5 py-1.5 rounded-full bg-gray-900 text-white flex items-center gap-2">
        <Zap className="w-3 h-3 text-yellow-400 fill-yellow-400" />
        <span className="text-[10px] font-black uppercase tracking-[0.25em]">Production-Grade System</span>
      </div>
      <span className="text-[11px] text-gray-400 font-semibold hidden sm:block print:hidden">
        by Roman Mazuryk
      </span>
    </motion.div>

    {/* Proprietary title */}
    <motion.p
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 }}
      className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 mb-2 print:text-[9px]"
    >
      Roman Mazuryk's
    </motion.p>

    <motion.h1
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="text-4xl md:text-5xl font-black text-gray-900 text-center tracking-tighter leading-[1.1] max-w-3xl print:text-2xl"
    >
      SDLC Workflow Algorithm
    </motion.h1>

    <motion.p
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.18 }}
      className="mt-3 text-base text-gray-500 text-center max-w-xl leading-relaxed print:text-sm"
    >
      AI-augmented, production-grade solo engineering — from weekly strategy to daily shipping to public proof-of-work.
    </motion.p>
  </header>
);

const CTASection = () => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 1.8, duration: 0.6 }}
    className="w-full my-8 print:hidden"
  >
    <div className="max-w-4xl mx-auto px-6">
      <div className="bg-gray-900 rounded-2xl px-8 py-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Open to opportunities</span>
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
          {/* Replace href with your portfolio contact URL or mailto:you@email.com */}
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
  </motion.section>
);

const Footer = () => (
  <footer className="w-full pb-10 print:hidden">
    <div className="border-t border-gray-100 pt-8 max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <p className="text-[11px] text-gray-400 tracking-wide">
        © {new Date().getFullYear()} Roman Mazuryk · SDLC Workflow Algorithm
      </p>
      <div className="flex items-center gap-5">
        <a
          href="https://github.com/romahawk/ai-workflow"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-gray-400 hover:text-gray-900 transition-colors text-[12px] font-semibold"
        >
          <Github className="w-3.5 h-3.5" />
          Source
        </a>
        <a
          href="https://github.com/romahawk/ai-workflow/blob/main/docs/ROADMAP.md"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-gray-400 hover:text-blue-600 transition-colors text-[12px] font-semibold"
        >
          Roadmap
          <ArrowUpRight className="w-3 h-3" />
        </a>
      </div>
    </div>
  </footer>
);

export default function Home() {
  const [orientation, setOrientation] = useState<"landscape" | "portrait">("landscape");

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden relative print:bg-white print:overflow-visible">
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
          .print\\:hidden {
            display: none !important;
          }
          .no-scrollbar::-webkit-scrollbar {
            display: none;
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
          .side-panel-print > div:last-child {
            margin-top: 0 !important;
          }
          .hidden.lg\\:flex {
            display: none !important;
          }
        }
      `}</style>

      {/* Subtle texture */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.018] bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] bg-repeat print:hidden" />

      {/* Navbar */}
      <Navbar orientation={orientation} setOrientation={setOrientation} />

      <div className="relative z-10 max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 pt-14 print:p-0">
        <Header />

        <div className="flex flex-col lg:flex-row gap-12 items-start justify-center print:block">

          <main className="flex-1 w-full overflow-x-auto pb-12 no-scrollbar print:pb-0">
            <div className="flex gap-4 items-start min-w-max px-4 print-grid-layout">

              {/* SECTION 1 — STRATEGY */}
              <WorkflowSection
                title="Strategy / Architect (Weekly Decision Compression)"
                color="blue"
                delay={0.1}
                note="AI supports clarity. Human owns scope."
                footer={
                  <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-blue-100/40">
                    <span className="text-[9px] text-blue-500 font-bold uppercase tracking-widest">Primary Tools</span>
                    <div className="flex flex-wrap gap-2">
                      <ToolNode name="ChatGPT" />
                      <ToolNode name="Claude" />
                      <ToolNode name="FigJam" type="secondary" />
                      <ToolNode name="GitHub Issues" type="secondary" />
                    </div>
                  </div>
                }
              >
                <Node label="Define 1–3 Weekly Outcomes" icon={Target} />
                <Node label="Scope Constraints (Max 3 Projects)" icon={Briefcase} />
                <Node label="Write Acceptance Criteria" icon={CheckCircle2} />
                <Node label="Update Roadmap" icon={Layers} />
                <Node label="Update Decision Log" icon={FileCode2} />
              </WorkflowSection>

              <ConnectionArrow delay={0.3} />

              {/* SECTION 2 — ARCHITECTURE */}
              <WorkflowSection
                title="Architecture & System Design"
                color="purple"
                delay={0.3}
                footer={
                  <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-purple-100/40">
                    <span className="text-[9px] text-purple-500 font-bold uppercase tracking-widest">Primary Tools</span>
                    <div className="flex flex-wrap gap-2">
                      <ToolNode name="Claude" />
                      <ToolNode name="ChatGPT" />
                      <ToolNode name="Mermaid" type="secondary" />
                      <ToolNode name="Figma" type="secondary" />
                    </div>
                  </div>
                }
              >
                <Node label="Data Model Definition" icon={Layers} />
                <Node label="API Schema" icon={Terminal} />
                <Node label="Folder Structure" icon={Layout} />
                <Node label="State Management Design" icon={Layers} />
                <Node label="Edge Case Review" icon={SearchCode} />
                <Node label="Scalability Considerations" icon={Zap} />
              </WorkflowSection>

              <ConnectionArrow delay={0.5} />

              {/* SECTION 3 — BUILD LOOP */}
              <WorkflowSection
                title="Daily Build Loop"
                color="green"
                delay={0.5}
                note="Small PRs. Async clarity. Ship daily."
                footer={
                  <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-green-100/40">
                    <span className="text-[9px] text-green-600 font-bold uppercase tracking-widest">Core Engine</span>
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
                  <div className="absolute left-[11px] top-6 bottom-6 w-0.5 border-l-2 border-dashed border-green-200" />
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-green-500 border-4 border-white shadow-sm flex-shrink-0 z-10" />
                    <Node label="Select GitHub Issue" icon={MessageCircleCode} className="flex-1" />
                  </div>
                  <div className="flex items-center gap-2 pl-4">
                    <Node label="Define Micro-Scope" icon={Target} className="flex-1" />
                  </div>
                  <div className="flex items-center gap-2 pl-4">
                    <Node label="Implement" icon={Code2} className="flex-1 bg-green-50/50 border-green-200" />
                  </div>
                  <div className="flex items-center gap-2 pl-4">
                    <Node label="AI Code Review" icon={Bot} className="flex-1" />
                  </div>
                  <div className="flex items-center gap-2 pl-4">
                    <Node label="Manual Reasoning Pass" icon={MousePointer2} className="flex-1" />
                  </div>
                  <div className="flex items-center gap-2 pl-4">
                    <Node label="PR + Merge" icon={GitBranch} className="flex-1" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-green-600 border-4 border-white shadow-md flex-shrink-0 z-10 animate-pulse" />
                    <Node label="Deploy" icon={Rocket} className="flex-1 bg-green-600 text-white border-none shadow-lg" />
                  </div>
                </div>
              </WorkflowSection>

              <ConnectionArrow delay={0.7} />

              {/* SECTION 4 — PRODUCTION HARDENING */}
              <WorkflowSection
                title="Production Hardening"
                color="amber"
                delay={0.7}
                note="Production readiness > feature count."
                footer={
                  <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-amber-100/40">
                    <span className="text-[9px] text-amber-600 font-bold uppercase tracking-widest">Refinement Stack</span>
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
                <Node label="UX Review" icon={Eye} />
                <Node label="Loading & Error States" icon={Activity} />
                <Node label="Performance Optimization" icon={Zap} />
                <Node label="Error Monitoring" icon={ShieldCheck} />
                <Node label="Analytics Integration" icon={BarChart3} />
              </WorkflowSection>

              <ConnectionArrow delay={0.9} />

              {/* SECTION 5 — SIGNAL LAYER */}
              <WorkflowSection
                title="Professional Signal Layer"
                color="gray"
                delay={0.9}
                footer={
                  <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-gray-100">
                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Distribution Tools</span>
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
                <Node label="Clean Git History" icon={GitBranch} />
                <Node label="PR Discipline" icon={MessageCircleCode} />
                <Node label="Architecture Docs" icon={FileCode2} />
                <Node label="Public Deployment" icon={MonitorCheck} />
                <Node label="Demo Recording" icon={Video} />
                <Node label="Case Study Extraction" icon={FileText} />

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.5, duration: 0.5 }}
                  className="mt-6 p-5 bg-gray-900 rounded-2xl flex items-center justify-between border-b-4 border-blue-500 shadow-xl"
                >
                  <div className="flex flex-col">
                    <span className="text-[10px] text-blue-400 font-black uppercase tracking-widest mb-1">Final Output</span>
                    <span className="text-white text-sm font-bold tracking-tight">Public Portfolio Artifact</span>
                  </div>
                  <Rocket className="w-5 h-5 text-blue-400" />
                </motion.div>
              </WorkflowSection>

            </div>
          </main>

          <div className="print:mt-12 print-grid-layout side-panel-print">
            <SidePanel />
          </div>

        </div>

        <CTASection />
        <Footer />
      </div>
    </div>
  );
}

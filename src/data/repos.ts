export type RepoStatus = "active" | "parked" | "frozen" | "archived";
export type OSPhase = "strategy" | "design" | "build" | "qa" | "ship";

export interface Repo {
  id: string;
  name: string;
  description: string;
  status: RepoStatus;
  priority: number;
  sprintGoal: string;
  phase: OSPhase;
  stack: string[];
  deployUrl?: string;
  githubUrl: string;
  lastShipped?: string;
  parkReason?: string;
  monetization: string;
  strategicRole: string;
  focusToday?: string;
}

export const repos: Repo[] = [
  {
    id: "ai-workflow",
    name: "AI Production OS",
    description: "Personal dev OS — standardizes workflow across all projects",
    status: "active",
    priority: 1,
    sprintGoal: "Ship repo registry + status board UI",
    phase: "build",
    stack: ["React", "Vite", "Tailwind", "shadcn/ui"],
    deployUrl: "https://ai-workflow-woad.vercel.app",
    githubUrl: "https://github.com/romahawk/ai-workflow",
    monetization: "Indirect — career leverage / consulting",
    strategicRole: "Senior differentiation layer",
  },
  {
    id: "portfolio",
    name: "Portfolio (mazuryk.dev)",
    description: "Career conversion engine — projects to hireability",
    status: "active",
    priority: 2,
    sprintGoal: "Ship interactive architecture case study",
    phase: "build",
    stack: ["React"],
    githubUrl: "https://github.com/romahawk/portfolio-react",
    monetization: "Indirect — career leverage",
    strategicRole: "Career conversion engine",
  },
  {
    id: "jobsprint",
    name: "JobSprint",
    description: "Job application funnel tracker + probability dashboard",
    status: "active",
    priority: 3,
    sprintGoal: "Ship funnel conversion dashboard MVP",
    phase: "build",
    stack: ["React"],
    githubUrl: "https://github.com/romahawk/JobSprint",
    monetization: "Optional future SaaS pivot",
    strategicRole: "Tactical runway stabilization",
  },
  {
    id: "alphaRhythm",
    name: "AlphaRhythm",
    description: "AI-powered behavioral finance & execution discipline system",
    status: "parked",
    priority: 4,
    sprintGoal: "Onboard via AI OS in Sprint 2",
    phase: "strategy",
    stack: [],
    githubUrl: "https://github.com/romahawk/strategy-tracker",
    parkReason: "Needs OS framework established first",
    monetization: "High — SaaS / B2C",
    strategicRole: "Core FinTech flagship",
  },
  {
    id: "magic-kick",
    name: "Magic Kick (AXIS 2.0)",
    description: "Personal execution OS — discipline streak engine",
    status: "parked",
    priority: 5,
    sprintGoal: "No active sprint goal",
    phase: "build",
    stack: [],
    githubUrl: "https://github.com/romahawk/magic-kick",
    parkReason: "Internal only — no career/income leverage currently",
    monetization: "None",
    strategicRole: "Internal productivity infrastructure",
  },
  {
    id: "livesurgery",
    name: "LiveSurgery POC",
    description: "MedTech surgical collaboration proof-of-concept",
    status: "archived",
    priority: 6,
    sprintGoal: "Document in portfolio only",
    phase: "ship",
    stack: [],
    githubUrl: "https://github.com/romahawk/livesurgery-poc",
    parkReason: "Archive/Signal — document, do not develop",
    monetization: "High enterprise — long-term only",
    strategicRole: "Portfolio credibility asset",
  },
  {
    id: "smartshooter",
    name: "SmartShooter",
    description: "Basketball shooting analytics & gamified identity engine",
    status: "frozen",
    priority: 7,
    sprintGoal: "No active sprint goal",
    phase: "strategy",
    stack: [],
    githubUrl: "https://github.com/romahawk/smartshooter",
    parkReason: "Good optionality — wrong timing",
    monetization: "Medium subscription",
    strategicRole: "Future SportsTech optionality",
  },
  {
    id: "flowlogix",
    name: "FlowLogix",
    description: "Operations / supply dashboard for logistics",
    status: "frozen",
    priority: 8,
    sprintGoal: "No active sprint goal",
    phase: "strategy",
    stack: [],
    githubUrl: "https://github.com/romahawk/flowlogix",
    parkReason: "High maintenance risk — poor solo fit",
    monetization: "Medium B2B SaaS",
    strategicRole: "Dormant B2B concept",
  },
  {
    id: "loadwise",
    name: "Loadwise",
    description: "Longevity-focused performance load optimization engine",
    status: "frozen",
    priority: 9,
    sprintGoal: "No active sprint goal",
    phase: "strategy",
    stack: [],
    githubUrl: "https://github.com/romahawk/loadwise",
    parkReason: "High risk — future platform, wrong timing",
    monetization: "High subscription",
    strategicRole: "Future SportsTech platform",
  },
  {
    id: "nba-narrative",
    name: "NBA Narrative Engine",
    description: "AI-generated daily NBA performance narratives",
    status: "frozen",
    priority: 10,
    sprintGoal: "MVP only if deliverable in under 1 week",
    phase: "strategy",
    stack: [],
    githubUrl: "",
    parkReason: "Optional — only if fast MVP feasible",
    monetization: "Low–Medium ads/subscription",
    strategicRole: "Experimental AI showcase",
  },
];

export const ACTIVE_LIMIT = 3;
export const activeRepos = repos.filter((r) => r.status === "active");
export const parkedRepos = repos.filter((r) => r.status === "parked");
export const frozenRepos = repos.filter(
  (r) => r.status === "frozen" || r.status === "archived"
);

export interface Tool {
  name: string;
  purpose: string;
  url?: string;
}

export interface AcceptanceCriteria {
  id: string;
  text: string;
}

export interface Phase {
  id: string;
  number: number;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  color: string;
  tools: Tool[];
  acceptanceCriteria: AcceptanceCriteria[];
  outputs: string[];
  issueTemplate?: string;
}

export const phases: Phase[] = [
  {
    id: "strategy",
    number: 1,
    name: "Strategy / Architect",
    slug: "strategy",
    tagline: "Define before you build",
    description:
      "Weekly outcomes, scope definition, acceptance criteria. No code until this is done.",
    color: "#4a7c59",
    tools: [
      { name: "ChatGPT", purpose: "Ideation, market framing" },
      { name: "Claude", purpose: "PRD drafting, ADR writing" },
      { name: "FigJam", purpose: "System mapping, user flows" },
      { name: "GitHub Issues", purpose: "Scope capture" },
    ],
    acceptanceCriteria: [
      {
        id: "s1",
        text: "PRD.md exists with problem, user, killer feature, MVP scope",
      },
      { id: "s2", text: "DECISIONS_LOG.md has ≥3 ADR entries" },
      { id: "s3", text: "Weekly outcome defined and written" },
      { id: "s4", text: "Non-goals explicitly listed" },
    ],
    outputs: ["docs/PRD.md", "docs/DECISIONS_LOG.md", "GitHub Milestone"],
  },
  {
    id: "design",
    number: 2,
    name: "Design / Spec",
    slug: "design",
    tagline: "System before syntax",
    description:
      "Architecture decisions, data model, API contracts. Prevents 80% of refactors.",
    color: "#5c6bc0",
    tools: [
      { name: "Claude", purpose: "Architecture docs, data modeling" },
      { name: "ChatGPT", purpose: "Alternative approach exploration" },
      { name: "Mermaid", purpose: "Data flow diagrams" },
      { name: "Figma", purpose: "UI wireframes and component spec" },
    ],
    acceptanceCriteria: [
      {
        id: "d1",
        text: "ARCHITECTURE.md covers stack, data model, key tradeoffs",
      },
      { id: "d2", text: "Core data types defined in TypeScript" },
      { id: "d3", text: "Folder structure committed" },
      { id: "d4", text: ".env.example committed" },
    ],
    outputs: ["docs/ARCHITECTURE.md", "src/data/ types", "folder scaffold"],
  },
  {
    id: "build",
    number: 3,
    name: "Build",
    slug: "build",
    tagline: "Issue → branch → implement → PR",
    description:
      "Daily build loop. Max 2 issues in-flight. Write acceptance criteria before code.",
    color: "#e67e22",
    tools: [
      { name: "GitHub", purpose: "Issues, PRs, branch discipline" },
      { name: "GitHub Copilot", purpose: "Autocomplete, boilerplate" },
      { name: "VS Code", purpose: "Primary editor" },
      { name: "Claude", purpose: "Complex logic, code review" },
      { name: "Vercel", purpose: "Preview deploys per PR" },
    ],
    acceptanceCriteria: [
      { id: "b1", text: "Every change starts with a GitHub Issue" },
      { id: "b2", text: "Branch named: type/short-description" },
      { id: "b3", text: "PR uses template, links to Issue" },
      { id: "b4", text: "CHANGELOG.md updated on merge" },
    ],
    outputs: ["Merged PRs", "Preview deploy URLs", "CHANGELOG entries"],
    issueTemplate: "feature.md",
  },
  {
    id: "qa",
    number: 4,
    name: "QA / Review",
    slug: "qa",
    tagline: "Ship nothing you haven't verified",
    description:
      "Error handling, performance baseline, UX review, observability hooks.",
    color: "#c0392b",
    tools: [
      { name: "Claude", purpose: "Code review, edge case analysis" },
      { name: "ChatGPT", purpose: "UX critique" },
      { name: "Lighthouse", purpose: "Performance + accessibility audit" },
      { name: "Sentry", purpose: "Error tracking" },
      { name: "PostHog", purpose: "Usage analytics" },
    ],
    acceptanceCriteria: [
      {
        id: "q1",
        text: "Lighthouse score ≥80 on Performance, Accessibility",
      },
      { id: "q2", text: "No uncaught errors in console" },
      { id: "q3", text: "Analytics event fires on core action" },
      { id: "q4", text: "Error boundary implemented" },
    ],
    outputs: [
      "Lighthouse report",
      "Sentry project linked",
      "Analytics event map",
    ],
  },
  {
    id: "ship",
    number: 5,
    name: "Ship / Document",
    slug: "ship",
    tagline: "Proof-of-work or it didn't happen",
    description:
      "Deploy, document, demo. Every ship leaves an artifact trail.",
    color: "#8e44ad",
    tools: [
      { name: "GitHub", purpose: "Release tag, CHANGELOG" },
      { name: "Loom", purpose: "Demo recording" },
      { name: "README", purpose: "30-second pitch, setup, deploy link" },
      { name: "Portfolio", purpose: "Case study write-up" },
    ],
    acceptanceCriteria: [
      { id: "sh1", text: "Deploy URL live and accessible" },
      { id: "sh2", text: "README has pitch, stack, deploy link, roadmap link" },
      { id: "sh3", text: "CHANGELOG has release entry" },
      { id: "sh4", text: "Demo artifact exists (screenshot or Loom)" },
    ],
    outputs: ["Live URL", "README.md", "CHANGELOG entry", "Loom/screenshot"],
  },
];

export const phaseById = Object.fromEntries(phases.map((p) => [p.id, p]));

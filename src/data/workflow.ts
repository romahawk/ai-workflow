/**
 * Canonical node manifest — single source of truth for stage/node IDs and labels.
 * Rendering details (icons, special layouts) live in Home.tsx / renderStage.
 * This file is the data layer: used by useChecklist for state tracking and
 * context generation, and by WorkflowSection for progress display.
 */

export interface NodeData {
  id: string;
  label: string;
}

export interface StageData {
  id: string;
  label: string;
  shortLabel: string;
  color: string;
  nodes: NodeData[];
}

export const WORKFLOW: StageData[] = [
  {
    id: 'strategy',
    label: 'Strategy / Architect',
    shortLabel: 'Strategy',
    color: 'blue',
    nodes: [
      { id: 'define-weekly-outcomes',    label: 'Define 1–3 Weekly Outcomes' },
      { id: 'scope-constraints',         label: 'Scope Constraints (Max 3 Projects)' },
      { id: 'write-acceptance-criteria', label: 'Write Acceptance Criteria' },
      { id: 'update-roadmap',            label: 'Update Roadmap' },
      { id: 'update-decision-log',       label: 'Update Decision Log' },
    ],
  },
  {
    id: 'architecture',
    label: 'Architecture & System Design',
    shortLabel: 'Architecture',
    color: 'purple',
    nodes: [
      { id: 'data-model',       label: 'Data Model Definition' },
      { id: 'api-schema',       label: 'API Schema' },
      { id: 'folder-structure', label: 'Folder Structure' },
      { id: 'state-management', label: 'State Management Design' },
      { id: 'edge-cases',       label: 'Edge Case Review' },
      { id: 'scalability',      label: 'Scalability Considerations' },
    ],
  },
  {
    id: 'build-loop',
    label: 'Daily Build Loop',
    shortLabel: 'Build Loop',
    color: 'green',
    nodes: [
      { id: 'select-issue',     label: 'Select GitHub Issue' },
      { id: 'define-scope',     label: 'Define Micro-Scope' },
      { id: 'implement',        label: 'Implement' },
      { id: 'ai-review',        label: 'AI Code Review' },
      { id: 'manual-reasoning', label: 'Manual Reasoning Pass' },
      { id: 'pr-merge',         label: 'PR + Merge' },
      { id: 'deploy',           label: 'Deploy' },
    ],
  },
  {
    id: 'production-hardening',
    label: 'Production Hardening',
    shortLabel: 'Hardening',
    color: 'amber',
    nodes: [
      { id: 'ux-review',             label: 'UX Review' },
      { id: 'loading-error-states',  label: 'Loading & Error States' },
      { id: 'performance',           label: 'Performance Optimization' },
      { id: 'error-monitoring',      label: 'Error Monitoring' },
      { id: 'analytics-integration', label: 'Analytics Integration' },
    ],
  },
  {
    id: 'professional-signal',
    label: 'Professional Signal Layer',
    shortLabel: 'Signal Layer',
    color: 'gray',
    nodes: [
      { id: 'clean-git-history',  label: 'Clean Git History' },
      { id: 'pr-discipline',      label: 'PR Discipline' },
      { id: 'architecture-docs',  label: 'Architecture Docs' },
      { id: 'public-deployment',  label: 'Public Deployment' },
      { id: 'demo-recording',     label: 'Demo Recording' },
      { id: 'case-study',         label: 'Case Study Extraction' },
    ],
  },
];

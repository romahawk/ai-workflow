import { useCallback, useState } from 'react';
import { WORKFLOW } from '../data/workflow';

function getProjectId(): string {
  if (typeof window === 'undefined') return 'default';
  return new URLSearchParams(window.location.search).get('project') ?? 'default';
}

function storageKey(projectId: string): string {
  return `wf-checklist-${projectId}`;
}

export type CheckedState = Record<string, boolean>;

export function useChecklist() {
  const projectId = getProjectId();

  const [checked, setChecked] = useState<CheckedState>(() => {
    try {
      const raw = localStorage.getItem(storageKey(projectId));
      return raw ? (JSON.parse(raw) as CheckedState) : {};
    } catch {
      return {};
    }
  });

  const toggle = useCallback(
    (nodeId: string) => {
      setChecked((prev) => {
        const next = { ...prev, [nodeId]: !prev[nodeId] };
        localStorage.setItem(storageKey(projectId), JSON.stringify(next));
        return next;
      });
    },
    [projectId],
  );

  const reset = useCallback(() => {
    setChecked({});
    localStorage.removeItem(storageKey(projectId));
  }, [projectId]);

  /**
   * Generates a markdown context block to paste at the start of a Claude session.
   * Tells the AI exactly which project, stage, step to resume from, and what's done.
   */
  const generateContext = useCallback(
    (activeStageIdx: number): string => {
      const projectLabel = projectId === 'default' ? 'this project' : projectId;
      const activeStage = WORKFLOW[activeStageIdx];
      const date = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      const totalNodes = WORKFLOW.reduce((acc, s) => acc + s.nodes.length, 0);
      const totalDone = Object.values(checked).filter(Boolean).length;

      const lines: string[] = [
        `## Workflow Context — ${projectLabel}`,
        `**Date:** ${date}`,
        `**Active stage:** ${activeStageIdx + 1}/5 — ${activeStage.label}`,
        `**Overall progress:** ${totalDone}/${totalNodes} steps complete`,
        '',
      ];

      // Completed stages summary
      const completedStages = WORKFLOW.filter(
        (s, i) => i < activeStageIdx && s.nodes.every((n) => checked[n.id]),
      );
      if (completedStages.length > 0) {
        lines.push('### ✅ Completed stages');
        completedStages.forEach((s) => lines.push(`- ${s.shortLabel}`));
        lines.push('');
      }

      // Active stage detail
      const doneNodes = activeStage.nodes.filter((n) => checked[n.id]);
      const todoNodes = activeStage.nodes.filter((n) => !checked[n.id]);

      lines.push(`### 🔄 Active: ${activeStage.shortLabel} (${doneNodes.length}/${activeStage.nodes.length})`);

      doneNodes.forEach((n) => lines.push(`- ✅ ${n.label}`));

      if (todoNodes.length > 0) {
        lines.push(`- **→ ${todoNodes[0].label}** ← resume here`);
        todoNodes.slice(1).forEach((n) => lines.push(`- ☐ ${n.label}`));
      } else {
        lines.push('- ✅ All steps complete — advance to the next stage');
      }

      lines.push('');
      lines.push('### Remaining stages');
      WORKFLOW.slice(activeStageIdx + 1).forEach((s, offset) => {
        const si = activeStageIdx + 1 + offset;
        const done = s.nodes.filter((n) => checked[n.id]).length;
        lines.push(`- Stage ${si + 1}: ${s.shortLabel}${done > 0 ? ` (${done}/${s.nodes.length} partial)` : ''}`);
      });

      lines.push('');
      lines.push('---');
      lines.push('*Paste this at the start of a Claude Code session to restore context.*');

      return lines.join('\n');
    },
    [checked, projectId],
  );

  return { checked, toggle, reset, projectId, generateContext };
}

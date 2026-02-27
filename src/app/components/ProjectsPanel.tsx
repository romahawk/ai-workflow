import React, { useState } from "react";
import { Plus, X, ExternalLink } from "lucide-react";
import { useLocalStorage } from "../hooks/useLocalStorage";

const STAGE_LABELS = ["Strategy", "Architecture", "Build Loop", "Hardening", "Signal"] as const;

const STAGE_DOT = ["bg-blue-500", "bg-purple-500", "bg-green-500", "bg-amber-500", "bg-gray-600"];
const STAGE_TEXT = [
  "text-blue-600",
  "text-purple-600",
  "text-green-600",
  "text-amber-600",
  "text-gray-600",
];
const STAGE_CARD_BG = [
  "bg-blue-50/60 border-blue-100",
  "bg-purple-50/60 border-purple-100",
  "bg-green-50/60 border-green-100",
  "bg-amber-50/60 border-amber-100",
  "bg-gray-50/60 border-gray-100",
];

interface Project {
  id: string;
  name: string;
  repoUrl: string;
  stage: number;
}

interface Props {
  onStageSelect: (stage: number) => void;
}

export function ProjectsPanel({ onStageSelect }: Props) {
  const [projects, setProjects] = useLocalStorage<Project[]>("aiw_projects", []);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ name: "", repoUrl: "", stage: 0 });

  const addProject = () => {
    if (!draft.name.trim()) return;
    setProjects([
      ...projects,
      {
        id: crypto.randomUUID(),
        name: draft.name.trim(),
        repoUrl: draft.repoUrl.trim(),
        stage: draft.stage,
      },
    ]);
    setDraft({ name: "", repoUrl: "", stage: 0 });
    setAdding(false);
  };

  const removeProject = (id: string) => setProjects(projects.filter((p) => p.id !== id));

  const setStage = (id: string, stage: number) =>
    setProjects(projects.map((p) => (p.id === id ? { ...p, stage } : p)));

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            Active Projects
          </span>
          <p className="text-sm font-black text-gray-900 leading-tight mt-0.5">
            {projects.length}
            <span className="text-gray-400 font-semibold">/3</span>
          </p>
        </div>
        {projects.length < 3 && !adding && (
          <button
            onClick={() => setAdding(true)}
            className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-900 hover:text-white text-gray-500 flex items-center justify-center transition-colors"
            title="Add project"
          >
            <Plus className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Project cards */}
      <div className="flex flex-col gap-2">
        {projects.map((p) => (
          <div
            key={p.id}
            className={`rounded-xl p-3 border ${STAGE_CARD_BG[p.stage]}`}
          >
            {/* Name + actions */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${STAGE_DOT[p.stage]}`} />
                <span className="text-[12px] font-bold text-gray-900 truncate">{p.name}</span>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {p.repoUrl && (
                  <a
                    href={p.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-gray-600 transition-colors"
                    title="Open repo"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                <button
                  onClick={() => removeProject(p.id)}
                  className="text-gray-200 hover:text-red-400 transition-colors"
                  title="Remove"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Stage progress — clickable segments */}
            <div className="flex gap-0.5 mb-1.5">
              {STAGE_LABELS.map((label, i) => (
                <button
                  key={i}
                  title={`Set to Stage ${i + 1}: ${label}`}
                  onClick={() => {
                    setStage(p.id, i);
                    onStageSelect(i);
                  }}
                  className={`h-1.5 flex-1 rounded-full transition-all hover:opacity-80 ${
                    i <= p.stage ? STAGE_DOT[p.stage] : "bg-gray-200"
                  }`}
                />
              ))}
            </div>

            {/* Stage label + view link */}
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-bold ${STAGE_TEXT[p.stage]}`}>
                {p.stage + 1} · {STAGE_LABELS[p.stage]}
              </span>
              <button
                onClick={() => onStageSelect(p.stage)}
                className={`text-[9px] font-black uppercase tracking-wide ${STAGE_TEXT[p.stage]} hover:underline`}
              >
                View →
              </button>
            </div>
          </div>
        ))}

        {projects.length === 0 && !adding && (
          <p className="text-[11px] text-gray-400 text-center py-4 leading-relaxed">
            No active projects.
            <br />
            Add up to 3.
          </p>
        )}
      </div>

      {/* Add form */}
      {adding && (
        <div className="flex flex-col gap-2 p-3 rounded-xl bg-gray-50 border border-gray-100">
          <input
            autoFocus
            placeholder="Project name"
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && addProject()}
            className="text-[12px] font-semibold bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-gray-400 w-full"
          />
          <input
            placeholder="Repo URL (optional)"
            value={draft.repoUrl}
            onChange={(e) => setDraft({ ...draft, repoUrl: e.target.value })}
            className="text-[12px] font-semibold bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-gray-400 w-full"
          />
          {/* Stage picker */}
          <div>
            <div className="flex gap-0.5 mb-1">
              {STAGE_LABELS.map((label, i) => (
                <button
                  key={i}
                  title={label}
                  onClick={() => setDraft({ ...draft, stage: i })}
                  className={`h-1.5 flex-1 rounded-full transition-all ${
                    i <= draft.stage ? STAGE_DOT[draft.stage] : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
            <span className={`text-[10px] font-bold ${STAGE_TEXT[draft.stage]}`}>
              Starting at Stage {draft.stage + 1}: {STAGE_LABELS[draft.stage]}
            </span>
          </div>
          <div className="flex gap-2 pt-1">
            <button
              onClick={addProject}
              disabled={!draft.name.trim()}
              className="flex-1 text-[11px] font-bold bg-gray-900 text-white rounded-lg py-1.5 hover:bg-gray-700 disabled:opacity-40 transition-colors"
            >
              Add
            </button>
            <button
              onClick={() => { setAdding(false); setDraft({ name: "", repoUrl: "", stage: 0 }); }}
              className="flex-1 text-[11px] font-bold bg-white border border-gray-200 text-gray-500 rounded-lg py-1.5 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import React from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { useLocalStorage } from "../hooks/useLocalStorage";

const today = () => new Date().toISOString().slice(0, 10);

const ITEMS = [
  { id: "m1", section: "Morning", label: "Set today's one outcome" },
  { id: "m2", section: "Morning", label: "Active scope ≤3 projects" },
  { id: "m3", section: "Morning", label: "On a feature branch (not main)" },
  { id: "b1", section: "Build", label: "Working from a single Issue" },
  { id: "b2", section: "Build", label: "AI code review before committing" },
  { id: "b3", section: "Build", label: "Manual reasoning pass" },
  { id: "b4", section: "Build", label: "Commit message follows format" },
  { id: "e1", section: "End of Day", label: "PR opened (even if draft)" },
  { id: "e2", section: "End of Day", label: "Deployed or blocker noted" },
  { id: "e3", section: "End of Day", label: "Backlog updated" },
] as const;

const SECTIONS = ["Morning", "Build", "End of Day"] as const;

interface DailyState {
  date: string;
  outcome: string;
  done: string[];
}

const EMPTY: DailyState = { date: today(), outcome: "", done: [] };

export function DailyChecklistPanel() {
  const [stored, setStored] = useLocalStorage<DailyState>("aiw_daily", EMPTY);

  // Auto-reset when the date rolls over
  const state: DailyState = stored.date === today() ? stored : { ...EMPTY, date: today() };

  const set = (patch: Partial<DailyState>) => setStored({ ...state, ...patch });

  const toggle = (id: string) => {
    const done = state.done.includes(id)
      ? state.done.filter((d) => d !== id)
      : [...state.done, id];
    set({ done });
  };

  const completed = state.done.length;
  const total = ITEMS.length;
  const pct = Math.round((completed / total) * 100);

  const dateLabel = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div>
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
          {dateLabel}
        </span>
        <div className="flex items-center justify-between mt-0.5">
          <p className="text-sm font-black text-gray-900">Daily Loop</p>
          <span className="text-[11px] font-bold text-gray-400">
            {completed}/{total}
          </span>
        </div>
        <div className="h-1 bg-gray-100 rounded-full mt-2 overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Outcome */}
      <input
        placeholder="Today I will ship… (one sentence)"
        value={state.outcome}
        onChange={(e) => set({ outcome: e.target.value })}
        className="text-[11px] font-semibold bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-2 outline-none focus:border-gray-300 w-full placeholder:text-gray-300 leading-snug"
      />

      {/* Checklist */}
      <div className="flex flex-col gap-4">
        {SECTIONS.map((section) => (
          <div key={section} className="flex flex-col gap-1.5">
            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
              {section}
            </span>
            {ITEMS.filter((item) => item.section === section).map((item) => {
              const done = state.done.includes(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => toggle(item.id)}
                  className="flex items-start gap-2 text-left group"
                >
                  {done ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="w-3.5 h-3.5 text-gray-200 group-hover:text-gray-400 flex-shrink-0 mt-0.5 transition-colors" />
                  )}
                  <span
                    className={`text-[11px] font-semibold leading-snug transition-colors ${
                      done ? "text-gray-300 line-through" : "text-gray-700"
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Done state */}
      {completed === total && (
        <div className="text-center pt-2">
          <span className="text-[11px] font-black text-green-600 uppercase tracking-wider">
            ✓ Loop complete
          </span>
        </div>
      )}
    </div>
  );
}

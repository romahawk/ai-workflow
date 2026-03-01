import React, { ReactNode } from "react";
import { motion } from "motion/react";

interface WorkflowSectionProps {
  title: string;
  color: string;
  children: ReactNode;
  delay?: number;
  className?: string;
  note?: string;
  footer?: ReactNode;
  fullWidth?: boolean;
  progress?: { done: number; total: number };
}

export const WorkflowSection: React.FC<WorkflowSectionProps> = ({
  title,
  color,
  children,
  delay = 0,
  className = "",
  note,
  footer,
  fullWidth = false,
  progress,
}) => {
  const bgColorMap: Record<string, string> = {
    blue:   "bg-blue-50/30   dark:bg-blue-950/25   border-blue-100   dark:border-blue-900/50",
    purple: "bg-purple-50/30 dark:bg-purple-950/25 border-purple-100 dark:border-purple-900/50",
    green:  "bg-green-50/30  dark:bg-green-950/25  border-green-100  dark:border-green-900/50",
    amber:  "bg-amber-50/30  dark:bg-amber-950/25  border-amber-100  dark:border-amber-900/50",
    gray:   "bg-gray-50/30   dark:bg-zinc-900/50   border-gray-100   dark:border-zinc-800/60",
  };

  const accentColorMap: Record<string, string> = {
    blue:   "text-blue-700   dark:text-blue-300   bg-blue-100/50   dark:bg-blue-950/70   border-blue-200   dark:border-blue-800/60",
    purple: "text-purple-700 dark:text-purple-300 bg-purple-100/50 dark:bg-purple-950/70 border-purple-200 dark:border-purple-800/60",
    green:  "text-green-700  dark:text-green-300  bg-green-100/50  dark:bg-green-950/70  border-green-200  dark:border-green-800/60",
    amber:  "text-amber-700  dark:text-amber-300  bg-amber-100/50  dark:bg-amber-950/70  border-amber-200  dark:border-amber-800/60",
    gray:   "text-gray-700   dark:text-zinc-300   bg-gray-100/50   dark:bg-zinc-800/60   border-gray-200   dark:border-zinc-700/60",
  };

  const isComplete = progress && progress.done === progress.total && progress.total > 0;

  return (
    <motion.div
      initial={fullWidth ? false : { opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      className={`relative flex flex-col p-6 rounded-2xl border h-fit transition-all ${
        fullWidth ? "w-full min-w-0" : "min-w-[320px] max-w-[400px]"
      } ${bgColorMap[color] || bgColorMap.blue} ${className}`}
    >
      {/* Title row: badge + progress counter */}
      <div className="flex items-start justify-between gap-3 mb-6">
        <div
          className={`inline-block w-fit px-3 py-1 rounded-lg border text-xs font-bold uppercase tracking-widest ${
            accentColorMap[color] || accentColorMap.blue
          }`}
        >
          {title}
        </div>
        {progress && (
          <span
            className={`flex-shrink-0 text-[11px] font-black tabular-nums px-2 py-0.5 rounded-md transition-colors ${
              isComplete
                ? "text-green-600 dark:text-green-400 bg-green-100/60 dark:bg-green-950/50"
                : "text-gray-400 dark:text-zinc-500 bg-gray-100/60 dark:bg-zinc-800/60"
            }`}
          >
            {progress.done}/{progress.total}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-4 relative">
        {children}
      </div>

      {note && (
        <div className="mt-8 pt-4 border-t border-dashed border-current opacity-60">
          <p className="text-[11px] italic text-gray-600 dark:text-zinc-400 font-medium leading-relaxed">
            "{note}"
          </p>
        </div>
      )}

      {footer && (
        <div className="mt-4">
          {footer}
        </div>
      )}
    </motion.div>
  );
};

import React from "react";
import { motion } from "motion/react";
import { Check, LucideIcon } from "lucide-react";

interface NodeProps {
  label: string;
  icon?: LucideIcon;
  subtext?: string;
  className?: string;
  delay?: number;
  checkable?: boolean;
  checked?: boolean;
  onToggle?: () => void;
}

export const Node: React.FC<NodeProps> = ({
  label,
  icon: Icon,
  subtext,
  className = "",
  delay = 0,
  checkable = false,
  checked = false,
  onToggle,
}) => {
  return (
    <motion.div
      role={checkable ? "button" : undefined}
      tabIndex={checkable ? 0 : undefined}
      onClick={checkable ? onToggle : undefined}
      onKeyDown={checkable ? (e) => { if (e.key === "Enter" || e.key === " ") onToggle?.(); } : undefined}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={`group bg-white dark:bg-zinc-800 border rounded-lg p-3 shadow-sm dark:shadow-none flex items-start gap-3 min-w-[200px] transition-all ${
        checkable ? "cursor-pointer select-none" : ""
      } ${
        checked
          ? "border-green-200 dark:border-green-800/60 bg-green-50/40 dark:bg-green-950/20"
          : "border-gray-200 dark:border-zinc-700 hover:shadow-md"
      } ${className}`}
    >
      {Icon && (
        <Icon
          className={`w-4 h-4 mt-1 flex-shrink-0 transition-colors ${
            checked ? "text-green-500 dark:text-green-500" : "text-gray-400 dark:text-zinc-500"
          }`}
        />
      )}
      <div className="flex flex-col flex-1 min-w-0">
        <span
          className={`text-sm font-medium leading-tight transition-all ${
            checked
              ? "text-gray-400 dark:text-zinc-500 line-through"
              : "text-gray-800 dark:text-zinc-200"
          }`}
        >
          {label}
        </span>
        {subtext && (
          <span className="text-[10px] text-gray-500 dark:text-zinc-500 mt-1 uppercase tracking-wider">
            {subtext}
          </span>
        )}
      </div>
      {checkable && (
        <div
          className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${
            checked
              ? "border-green-500 bg-green-500 dark:border-green-600 dark:bg-green-600"
              : "border-gray-300 dark:border-zinc-600 group-hover:border-gray-400 dark:group-hover:border-zinc-400"
          }`}
        >
          {checked && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
        </div>
      )}
    </motion.div>
  );
};

interface ToolNodeProps {
  name: string;
  type?: "primary" | "secondary";
  className?: string;
  delay?: number;
}

export const ToolNode: React.FC<ToolNodeProps> = ({ name, type = "primary", className = "", delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4 }}
      className={`px-3 py-1.5 rounded-full border border-dashed flex items-center gap-2 ${
        type === "primary"
          ? "border-blue-300 bg-blue-50/50 dark:border-blue-700/60 dark:bg-blue-950/50"
          : "border-gray-300 bg-gray-50/50 dark:border-zinc-600/50 dark:bg-zinc-800/60"
      } ${className}`}
    >
      <div className={`w-1.5 h-1.5 rounded-full ${type === "primary" ? "bg-blue-500" : "bg-gray-400 dark:bg-zinc-500"}`} />
      <span className="text-[11px] font-semibold text-gray-600 dark:text-zinc-400 uppercase tracking-tight">{name}</span>
    </motion.div>
  );
};

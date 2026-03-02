import React from "react";
import { motion } from "motion/react";
import { Zap, Github, Download, Monitor, Smartphone, Sun, Moon } from "lucide-react";

interface NavbarProps {
  orientation: "landscape" | "portrait";
  setOrientation: (o: "landscape" | "portrait") => void;
  dark: boolean;
  onToggle: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ orientation, setOrientation, dark, onToggle }) => {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-0 right-0 z-50 h-14 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 flex items-center px-4 sm:px-8 gap-4 print:hidden"
    >
      {/* Brand */}
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        {/* Monogram */}
        <div className="w-7 h-7 rounded-md bg-gray-900 dark:bg-white flex items-center justify-center flex-shrink-0">
          <span className="text-[10px] font-black text-white dark:text-gray-900 tracking-tight">RM</span>
        </div>
        <span className="text-[13px] font-black text-gray-900 dark:text-white tracking-tight hidden sm:block whitespace-nowrap">
          Roman Mazuryk
        </span>
        <span className="text-gray-300 dark:text-gray-600 hidden sm:block">·</span>
        <span className="text-[12px] text-gray-400 dark:text-gray-400 hidden md:block truncate">SDLC Workflow Algorithm</span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        {/* GitHub */}
        <a
          href="https://github.com/romahawk/ai-workflow"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-gray-400 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          aria-label="View source on GitHub"
        >
          <Github className="w-4 h-4" />
          <span className="text-[12px] font-semibold hidden sm:block">GitHub</span>
        </a>

        <div className="w-px h-4 bg-gray-200 dark:bg-gray-700" />

        {/* Dark / light toggle */}
        <button
          onClick={onToggle}
          aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
          className="flex items-center justify-center w-7 h-7 rounded-md text-gray-400 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
        >
          {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <div className="w-px h-4 bg-gray-200 dark:bg-gray-700" />

        {/* Orientation toggle */}
        <div className="flex bg-gray-100 dark:bg-gray-800 p-0.5 rounded-lg border border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setOrientation("landscape")}
            title="Landscape PDF"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide transition-all ${
              orientation === "landscape"
                ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            }`}
          >
            <Monitor className="w-3 h-3" />
            <span className="hidden sm:block">Landscape</span>
          </button>
          <button
            onClick={() => setOrientation("portrait")}
            title="Portrait PDF"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide transition-all ${
              orientation === "portrait"
                ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            }`}
          >
            <Smartphone className="w-3 h-3" />
            <span className="hidden sm:block">Portrait</span>
          </button>
        </div>

        {/* Save PDF */}
        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 hover:bg-gray-700 dark:bg-white dark:hover:bg-gray-200 dark:text-gray-900 text-white rounded-lg transition-all text-[12px] font-bold"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:block">Save PDF</span>
        </button>
      </div>
    </motion.nav>
  );
};

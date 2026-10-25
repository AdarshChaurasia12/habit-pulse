import React from 'react';
import { Activity, Plus, RefreshCw, Download, Github } from 'lucide-react';

export default function Navbar({ onOpenAddModal, onResetDemo, onExportData }) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Activity className="w-6 h-6 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                HabitPulse
              </span>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Daily Streak & Heatmap Tracker
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onResetDemo}
            title="Load sample productivity data"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-800 rounded-lg transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden md:inline">Demo Data</span>
          </button>

          <button
            onClick={onExportData}
            title="Export habit data to JSON"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-800 rounded-lg transition-all"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden md:inline">Export</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 rounded-lg shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Habit</span>
          </button>

          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-colors border border-transparent hover:border-slate-800"
            title="View on GitHub"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>
      </div>
    </header>
  );
}

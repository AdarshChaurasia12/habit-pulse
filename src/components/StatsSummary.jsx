import React from 'react';
import { Flame, CheckCircle2, TrendingUp, Target } from 'lucide-react';
import { getTodayString, calculateStreaks } from '../utils/dateUtils';

export default function StatsSummary({ habits }) {
  const todayStr = getTodayString();

  // Habits completed today
  const totalHabits = habits.length;
  const completedTodayCount = habits.filter(h => h.completedDates?.includes(todayStr)).length;
  const completionRate = totalHabits > 0 ? Math.round((completedTodayCount / totalHabits) * 100) : 0;

  // Best streak across all habits
  let maxCurrentStreak = 0;
  let maxLongestStreak = 0;
  let totalCompletionsAllTime = 0;

  habits.forEach(h => {
    const { currentStreak, longestStreak } = calculateStreaks(h.completedDates || []);
    if (currentStreak > maxCurrentStreak) maxCurrentStreak = currentStreak;
    if (longestStreak > maxLongestStreak) maxLongestStreak = longestStreak;
    totalCompletionsAllTime += (h.completedDates || []).length;
  });

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {/* Today's Progress */}
      <div className="glass-panel p-4 rounded-2xl relative overflow-hidden group hover:border-slate-700/80 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Today's Progress
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-white">
            {completionRate}%
          </span>
          <span className="text-xs text-slate-400 font-medium">
            ({completedTodayCount}/{totalHabits} done)
          </span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      {/* Current Best Streak */}
      <div className="glass-panel p-4 rounded-2xl relative overflow-hidden group hover:border-slate-700/80 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Current Best Streak
          </span>
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Flame className="w-4 h-4 fill-amber-400/20" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-white">
            {maxCurrentStreak}
          </span>
          <span className="text-xs text-slate-400">days streak</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-2">
          All-time record: <span className="text-slate-200 font-semibold">{maxLongestStreak} days</span>
        </p>
      </div>

      {/* Total Check-Ins */}
      <div className="glass-panel p-4 rounded-2xl relative overflow-hidden group hover:border-slate-700/80 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Total Check-ins
          </span>
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-white">
            {totalCompletionsAllTime}
          </span>
          <span className="text-xs text-slate-400">completions</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-2">
          Across all logged habits
        </p>
      </div>

      {/* Active Habits */}
      <div className="glass-panel p-4 rounded-2xl relative overflow-hidden group hover:border-slate-700/80 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Active Habits
          </span>
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <Target className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-white">
            {totalHabits}
          </span>
          <span className="text-xs text-slate-400">habits tracked</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-2">
          {totalHabits > 0 ? 'Consistency builds mastery' : 'Add your first habit'}
        </p>
      </div>
    </div>
  );
}

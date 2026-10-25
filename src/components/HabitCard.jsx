import React from 'react';
import { Flame, Trophy, Trash2, Check, Clock } from 'lucide-react';
import { calculateStreaks, getTodayString, getRecentDays } from '../utils/dateUtils';

export default function HabitCard({ habit, onToggleDate, onDelete }) {
  const todayStr = getTodayString();
  const isCompletedToday = (habit.completedDates || []).includes(todayStr);

  const { currentStreak, longestStreak } = calculateStreaks(habit.completedDates || []);
  const recentDays = getRecentDays(7);

  const categoryBadgeColors = {
    Coding: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Fitness: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Learning: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    Health: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    Mindset: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    Productivity: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
  };

  const badgeClass = categoryBadgeColors[habit.category] || 'bg-slate-800 text-slate-300 border-slate-700';

  return (
    <div className={`glass-card p-4 sm:p-5 rounded-2xl relative transition-all duration-300 group hover:border-slate-700/80 ${
      isCompletedToday ? 'border-emerald-500/30 bg-slate-900/60' : ''
    }`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        {/* Habit Icon & Details */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xl shrink-0 shadow-inner">
            {habit.emoji || '🎯'}
          </div>
          <div>
            <h3 className="font-semibold text-white text-base tracking-tight leading-snug">
              {habit.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border ${badgeClass}`}>
                {habit.category}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                <Clock className="w-3 h-3 text-slate-500" />
                {(habit.completedDates || []).length} done
              </span>
            </div>
          </div>
        </div>

        {/* Delete button */}
        <button
          onClick={() => onDelete(habit.id)}
          title="Delete habit"
          className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Streak indicators */}
      <div className="flex items-center gap-4 py-2 px-3 rounded-xl bg-slate-900/80 border border-slate-800/60 mb-4">
        <div className="flex items-center gap-1.5">
          <Flame className={`w-4 h-4 ${currentStreak > 0 ? 'text-amber-400 fill-amber-400/20' : 'text-slate-600'}`} />
          <span className="text-xs font-semibold text-slate-200">{currentStreak}</span>
          <span className="text-[11px] text-slate-500">day streak</span>
        </div>
        <div className="w-px h-3.5 bg-slate-800" />
        <div className="flex items-center gap-1.5">
          <Trophy className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-xs font-medium text-slate-400">Best: {longestStreak}d</span>
        </div>
      </div>

      {/* Mini 7-Day History Pills */}
      <div className="mb-4">
        <div className="text-[11px] text-slate-400 mb-1.5 font-medium flex justify-between">
          <span>Last 7 Days</span>
          <span className="text-[10px] text-slate-500">Click to toggle past days</span>
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {recentDays.map((day) => {
            const isDone = (habit.completedDates || []).includes(day.dateStr);
            return (
              <button
                key={day.dateStr}
                onClick={() => onToggleDate(habit.id, day.dateStr)}
                title={`${day.dateStr} (${isDone ? 'Completed' : 'Missed'})`}
                className={`flex flex-col items-center justify-center py-1.5 rounded-lg border text-center transition-all ${
                  isDone
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-900/50 border-slate-800/80 text-slate-500 hover:border-slate-700'
                } ${day.isToday ? 'ring-1 ring-emerald-400/50' : ''}`}
              >
                <span className="text-[9px] font-mono uppercase">{day.dayName}</span>
                <span className="text-[11px] font-bold mt-0.5">{day.dayNumber}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Today Check-in Button */}
      <button
        onClick={() => onToggleDate(habit.id, todayStr)}
        className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
          isCompletedToday
            ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 shadow-sm'
            : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700/80 hover:border-emerald-500/40 hover:text-white'
        }`}
      >
        <Check className={`w-4 h-4 stroke-[2.5] ${isCompletedToday ? 'text-emerald-400' : 'text-slate-500'}`} />
        <span>{isCompletedToday ? 'Completed Today!' : 'Mark as Done Today'}</span>
      </button>
    </div>
  );
}

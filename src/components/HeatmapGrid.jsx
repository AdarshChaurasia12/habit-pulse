import React, { useState, useMemo } from 'react';
import { generateHeatmapGrid, formatDisplayDate } from '../utils/dateUtils';
import { Layers } from 'lucide-react';

export default function HeatmapGrid({ habits }) {
  const [selectedHabitId, setSelectedHabitId] = useState('all');
  const [hoveredDay, setHoveredDay] = useState(null);

  // Generate 20 weeks of grid data
  const { weeks, monthLabels } = useMemo(() => generateHeatmapGrid(22), []);

  // Map of dateStr -> array of completed habit names
  const dateCompletionsMap = useMemo(() => {
    const map = {};
    const filteredHabits = selectedHabitId === 'all'
      ? habits
      : habits.filter(h => h.id === selectedHabitId);

    filteredHabits.forEach(habit => {
      (habit.completedDates || []).forEach(dateStr => {
        if (!map[dateStr]) {
          map[dateStr] = [];
        }
        map[dateStr].push({
          name: habit.name,
          emoji: habit.emoji,
          color: habit.color
        });
      });
    });

    return map;
  }, [habits, selectedHabitId]);

  // Determine color intensity based on completion count
  const getCellColor = (dateStr, isFuture) => {
    if (isFuture) {
      return 'bg-slate-900/30 border-dashed border-slate-800/40 opacity-40 cursor-not-allowed';
    }

    const completions = dateCompletionsMap[dateStr] || [];
    const count = completions.length;

    if (count === 0) {
      return 'bg-slate-900 border-slate-800/70 hover:border-slate-500';
    }

    if (selectedHabitId !== 'all') {
      // Single habit mode: either completed (1) or not (0)
      return 'bg-emerald-500 border-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.4)]';
    }

    // Combined multi-habit scale
    if (count === 1) {
      return 'bg-emerald-950 border-emerald-800/80 hover:border-emerald-600';
    } else if (count === 2) {
      return 'bg-emerald-800 border-emerald-700 hover:border-emerald-500';
    } else if (count === 3) {
      return 'bg-emerald-600 border-emerald-500 hover:border-emerald-400';
    } else {
      return 'bg-emerald-400 border-emerald-300 shadow-[0_0_8px_rgba(52,211,153,0.5)]';
    }
  };

  // Count total completions across the displayed weeks
  const totalWindowCompletions = useMemo(() => {
    let sum = 0;
    weeks.forEach(week => {
      week.forEach(day => {
        if (!day.isFuture && dateCompletionsMap[day.dateStr]) {
          sum += dateCompletionsMap[day.dateStr].length;
        }
      });
    });
    return sum;
  }, [weeks, dateCompletionsMap]);

  return (
    <div className="glass-panel p-5 sm:p-6 rounded-2xl mb-8 relative">
      {/* Heatmap Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Productivity Heatmap
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono font-medium border border-slate-700/60">
              {totalWindowCompletions} logs in last 22 weeks
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Consistency graph visualized in GitHub style
          </p>
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-slate-400" />
          <select
            value={selectedHabitId}
            onChange={(e) => setSelectedHabitId(e.target.value)}
            className="text-xs bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">All Habits (Combined)</option>
            {habits.map(h => (
              <option key={h.id} value={h.id}>
                {h.emoji} {h.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Heatmap Grid Container with horizontal scroll */}
      <div className="overflow-x-auto pb-3 pt-1">
        <div className="inline-block min-w-full">
          {/* Month labels row */}
          <div className="flex text-[11px] font-mono text-slate-400 mb-1.5 pl-7 select-none">
            {weeks.map((_, i) => {
              const labelObj = monthLabels.find(m => m.weekIndex === i);
              return (
                <div key={i} className="w-[15px] mr-[3px] text-left shrink-0">
                  {labelObj ? labelObj.label : ''}
                </div>
              );
            })}
          </div>

          {/* Grid with Weekday Labels */}
          <div className="flex items-start">
            {/* Weekday indicators (Mon, Wed, Fri) */}
            <div className="flex flex-col text-[10px] font-mono text-slate-500 mr-2 select-none justify-between h-[122px] py-[2px]">
              <span className="leading-none">Sun</span>
              <span className="leading-none">Tue</span>
              <span className="leading-none">Thu</span>
              <span className="leading-none">Sat</span>
            </div>

            {/* Matrix of Columns (Weeks) */}
            <div className="flex gap-[3px]">
              {weeks.map((week, weekIdx) => (
                <div key={weekIdx} className="flex flex-col gap-[3px]">
                  {week.map(day => (
                    <div
                      key={day.dateStr}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setHoveredDay({
                          dateStr: day.dateStr,
                          isFuture: day.isFuture,
                          completions: dateCompletionsMap[day.dateStr] || [],
                          x: rect.left + rect.width / 2,
                          y: rect.top
                        });
                      }}
                      onMouseLeave={() => setHoveredDay(null)}
                      className={`w-[15px] h-[15px] rounded-[3px] border transition-all duration-150 cursor-pointer ${getCellColor(day.dateStr, day.isFuture)} ${
                        day.isToday ? 'ring-2 ring-emerald-400/80 ring-offset-1 ring-offset-slate-950' : ''
                      }`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Floating Tooltip */}
      {hoveredDay && !hoveredDay.isFuture && (
        <div
          className="fixed z-50 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-2 bg-slate-900 border border-slate-700/80 text-white rounded-xl shadow-xl px-3 py-2 text-xs w-64 backdrop-blur-md"
          style={{
            left: `${hoveredDay.x}px`,
            top: `${hoveredDay.y - 8}px`
          }}
        >
          <div className="font-semibold text-slate-200 border-b border-slate-800 pb-1 mb-1.5 flex items-center justify-between">
            <span>{formatDisplayDate(hoveredDay.dateStr)}</span>
            <span className="text-[10px] font-mono text-slate-400">{hoveredDay.dateStr}</span>
          </div>

          {hoveredDay.completions.length === 0 ? (
            <p className="text-slate-400 text-[11px] italic">No habits completed on this day</p>
          ) : (
            <div>
              <p className="text-[11px] font-medium text-emerald-400 mb-1">
                {hoveredDay.completions.length} habit{hoveredDay.completions.length > 1 ? 's' : ''} completed:
              </p>
              <ul className="space-y-0.5">
                {hoveredDay.completions.map((comp, idx) => (
                  <li key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                    <span>{comp.emoji}</span>
                    <span className="truncate">{comp.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Heatmap Footer / Legend */}
      <div className="mt-4 pt-3 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
        <span className="text-[11px]">
          Tip: Hover over any square to view habits completed on that day.
        </span>

        <div className="flex items-center gap-2 select-none">
          <span className="text-[11px]">Less</span>
          <div className="flex gap-1 items-center">
            <span className="w-3 h-3 rounded-[2px] bg-slate-900 border border-slate-800/80" />
            <span className="w-3 h-3 rounded-[2px] bg-emerald-950 border border-emerald-800" />
            <span className="w-3 h-3 rounded-[2px] bg-emerald-800 border border-emerald-700" />
            <span className="w-3 h-3 rounded-[2px] bg-emerald-600 border border-emerald-500" />
            <span className="w-3 h-3 rounded-[2px] bg-emerald-400 border border-emerald-300" />
          </div>
          <span className="text-[11px]">More</span>
        </div>
      </div>
    </div>
  );
}

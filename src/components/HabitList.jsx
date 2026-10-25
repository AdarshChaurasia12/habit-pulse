import React, { useState, useMemo } from 'react';
import HabitCard from './HabitCard';
import { Search, Plus, Sparkles } from 'lucide-react';

export default function HabitList({ habits, onToggleDate, onDelete, onOpenAddModal }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Coding', 'Learning', 'Fitness', 'Health', 'Mindset', 'Productivity'];

  const filteredHabits = useMemo(() => {
    return habits.filter(h => {
      const matchesCategory = activeCategory === 'All' || h.category === activeCategory;
      const matchesSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [habits, activeCategory, searchQuery]);

  return (
    <div>
      {/* Controls: Category tabs + Search bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-6">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 ${
                activeCategory === cat
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[200px] sm:min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search habits..."
            className="w-full text-xs bg-slate-900 border border-slate-800 text-slate-200 rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-emerald-500 placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Habit Cards Grid */}
      {filteredHabits.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {filteredHabits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onToggleDate={onToggleDate}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <div className="glass-panel p-10 rounded-2xl text-center border-dashed border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 text-emerald-400 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-white mb-1">
            No habits found
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            {habits.length === 0
              ? "You haven't tracked any habits yet. Start by creating your first daily goal!"
              : "No habits matched your filter. Try picking 'All' or clearing your search."}
          </p>
          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors shadow-md shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create Habit</span>
          </button>
        </div>
      )}
    </div>
  );
}

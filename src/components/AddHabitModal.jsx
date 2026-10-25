import React, { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';

const PRESET_EMOJIS = ['💻', '📚', '⚡', '💧', '🧘', '🏃', '✍️', '🎯', '🎨', '🎵', '🥗', '💤'];
const CATEGORIES = ['Coding', 'Learning', 'Fitness', 'Health', 'Mindset', 'Productivity'];

export default function AddHabitModal({ isOpen, onClose, onAddHabit }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Coding');
  const [emoji, setEmoji] = useState('💻');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddHabit({
      id: `habit-${Date.now()}`,
      name: name.trim(),
      category,
      emoji,
      color: '#10b981',
      createdAt: new Date().toISOString(),
      completedDates: []
    });

    setName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-md bg-slate-900 border border-slate-850 rounded-2xl p-6 shadow-2xl relative border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">Create New Habit</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Habit Name
            </label>
            <input
              type="text"
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Daily LeetCode problem, Morning Run"
              className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 placeholder:text-slate-500"
            />
          </div>

          {/* Emoji Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Pick an Icon
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {PRESET_EMOJIS.map((em) => (
                <button
                  type="button"
                  key={em}
                  onClick={() => setEmoji(em)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all ${
                    emoji === em
                      ? 'bg-emerald-500/20 border-2 border-emerald-500 scale-105'
                      : 'bg-slate-950 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`py-2 text-xs font-medium rounded-xl border text-center transition-all ${
                    category === cat
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-semibold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-3 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-medium text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 shadow-md shadow-emerald-500/20 transition-all active:scale-95"
            >
              Add Habit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import Navbar from './components/Navbar';
import StatsSummary from './components/StatsSummary';
import HeatmapGrid from './components/HeatmapGrid';
import HabitList from './components/HabitList';
import AddHabitModal from './components/AddHabitModal';
import { loadHabits, saveHabits, getFreshDemoData, exportHabitsAsJSON } from './utils/storage';
import { getTodayString } from './utils/dateUtils';
import { Sparkles, Heart } from 'lucide-react';

export default function App() {
  const [habits, setHabits] = useState(() => loadHabits());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Sync state to LocalStorage
  useEffect(() => {
    saveHabits(habits);
  }, [habits]);

  // Show a temporary toast notification
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Toggle habit completion on a given date (Today or past day)
  const handleToggleDate = (habitId, dateStr) => {
    const todayStr = getTodayString();

    setHabits(prevHabits => {
      const updated = prevHabits.map(habit => {
        if (habit.id !== habitId) return habit;

        const dates = habit.completedDates || [];
        const isAlreadyDone = dates.includes(dateStr);

        const newDates = isAlreadyDone
          ? dates.filter(d => d !== dateStr)
          : [...dates, dateStr];

        return { ...habit, completedDates: newDates };
      });

      // Check if all habits are now completed for today
      if (dateStr === todayStr) {
        const total = updated.length;
        const doneCount = updated.filter(h => (h.completedDates || []).includes(todayStr)).length;

        if (total > 0 && doneCount === total) {
          triggerCelebration();
          showToast('🎉 All habits completed for today! Keep up the momentum!');
        }
      }

      return updated;
    });
  };

  // Fun confetti burst
  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#10b981', '#34d399', '#38bdf8', '#fbbf24', '#f43f5e']
      });
    } catch (e) {
      // Confetti fallback
    }
  };

  // Add new habit
  const handleAddHabit = (newHabit) => {
    setHabits(prev => [newHabit, ...prev]);
    showToast(`Added "${newHabit.name}"`);
  };

  // Delete habit
  const handleDeleteHabit = (id) => {
    const habitToDelete = habits.find(h => h.id === id);
    if (window.confirm(`Are you sure you want to delete "${habitToDelete?.name || 'this habit'}"?`)) {
      setHabits(prev => prev.filter(h => h.id !== id));
      showToast('Habit removed');
    }
  };

  // Reset to fresh demo dataset
  const handleResetDemo = () => {
    const demo = getFreshDemoData();
    setHabits(demo);
    showToast('Loaded demo consistency dataset');
  };

  // Export JSON backup
  const handleExportData = () => {
    exportHabitsAsJSON(habits);
    showToast('Exported habit history to JSON');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-400">
      {/* Navigation */}
      <Navbar
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onResetDemo={handleResetDemo}
        onExportData={handleExportData}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section Banner */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Consistency Beats Intensity</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Daily Habits & Activity Matrix
          </h1>
          <p className="text-sm sm:text-base text-slate-400 mt-1 max-w-2xl">
            Track daily routines, visualize your streak heatmaps, and build momentum just like your GitHub commits.
          </p>
        </div>

        {/* Stats Metrics Row */}
        <StatsSummary habits={habits} />

        {/* Heatmap Grid (GitHub Style) */}
        <HeatmapGrid habits={habits} />

        {/* Habits Checklist & Management */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Your Daily Habits
            </h2>
            <span className="text-xs text-slate-400">
              {habits.length} total active
            </span>
          </div>
          <HabitList
            habits={habits}
            onToggleDate={handleToggleDate}
            onDelete={handleDeleteHabit}
            onOpenAddModal={() => setIsAddModalOpen(true)}
          />
        </div>
      </main>

      {/* Add Habit Modal */}
      <AddHabitModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddHabit={handleAddHabit}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-emerald-500/40 text-emerald-300 px-4 py-2.5 rounded-xl shadow-2xl text-xs font-medium backdrop-blur-md flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 mt-12 bg-slate-950/50 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="flex items-center justify-center gap-1">
            Built with React, Vite & Tailwind CSS
          </p>
          <p className="text-slate-400">
            Open-source project ready for your GitHub portfolio.
          </p>
        </div>
      </footer>
    </div>
  );
}

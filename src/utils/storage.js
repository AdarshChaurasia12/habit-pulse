import { formatDate } from './dateUtils';

const STORAGE_KEY = 'habitpulse_data_v1';

/**
 * Generates sample check-in history across the last 75 days
 * with realistic productivity clusters.
 */
function generateSampleDates(daysBack = 75, probability = 0.7) {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < daysBack; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    // Slight bias for recent days and random realistic misses
    const bias = i < 7 ? 0.85 : probability;
    if (Math.random() < bias) {
      dates.push(formatDate(d));
    }
  }
  return dates;
}

export const INITIAL_HABITS = [
  {
    id: 'habit-1',
    name: 'LeetCode / DSA Practice',
    category: 'Coding',
    emoji: '💻',
    color: '#10b981', // emerald
    createdAt: new Date().toISOString(),
    completedDates: generateSampleDates(70, 0.75)
  },
  {
    id: 'habit-2',
    name: 'Read 20 Pages',
    category: 'Learning',
    emoji: '📚',
    color: '#3b82f6', // blue
    createdAt: new Date().toISOString(),
    completedDates: generateSampleDates(65, 0.65)
  },
  {
    id: 'habit-3',
    name: 'Morning Workout & Stretch',
    category: 'Fitness',
    emoji: '⚡',
    color: '#f59e0b', // amber
    createdAt: new Date().toISOString(),
    completedDates: generateSampleDates(75, 0.6)
  },
  {
    id: 'habit-4',
    name: 'Drink 2.5L Water',
    category: 'Health',
    emoji: '💧',
    color: '#06b6d4', // cyan
    createdAt: new Date().toISOString(),
    completedDates: generateSampleDates(80, 0.85)
  }
];

export function loadHabits() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // First visit: initialize with starter demo habits
      saveHabits(INITIAL_HABITS);
      return INITIAL_HABITS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_HABITS;
  } catch (error) {
    console.error('Failed to load habits from localStorage', error);
    return INITIAL_HABITS;
  }
}

export function saveHabits(habits) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  } catch (error) {
    console.error('Failed to save habits to localStorage', error);
  }
}

export function getFreshDemoData() {
  return [
    {
      id: 'demo-1',
      name: 'LeetCode / DSA Practice',
      category: 'Coding',
      emoji: '💻',
      color: '#10b981',
      createdAt: new Date().toISOString(),
      completedDates: generateSampleDates(70, 0.8)
    },
    {
      id: 'demo-2',
      name: 'Read Tech Articles / Books',
      category: 'Learning',
      emoji: '📚',
      color: '#3b82f6',
      createdAt: new Date().toISOString(),
      completedDates: generateSampleDates(60, 0.65)
    },
    {
      id: 'demo-3',
      name: 'Gym / Calisthenics',
      category: 'Fitness',
      emoji: '⚡',
      color: '#f59e0b',
      createdAt: new Date().toISOString(),
      completedDates: generateSampleDates(75, 0.7)
    },
    {
      id: 'demo-4',
      name: 'Meditate & Screen-Free Wind Down',
      category: 'Mindset',
      emoji: '🧘',
      color: '#a855f7',
      createdAt: new Date().toISOString(),
      completedDates: generateSampleDates(50, 0.6)
    }
  ];
}

export function exportHabitsAsJSON(habits) {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(habits, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `habitpulse_backup_${formatDate(new Date())}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Formats a Date object to YYYY-MM-DD in local time
 */
export function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns today's date formatted as YYYY-MM-DD
 */
export function getTodayString() {
  return formatDate(new Date());
}

/**
 * Parses YYYY-MM-DD into a local Date object safely
 */
export function parseDate(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Formats a date string for display (e.g. "Sat, Oct 25, 2026")
 */
export function formatDisplayDate(dateStr) {
  if (!dateStr) return '';
  const date = parseDate(dateStr);
  const todayStr = getTodayString();
  
  if (dateStr === todayStr) return 'Today';
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (dateStr === formatDate(yesterday)) return 'Yesterday';

  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Generates an array of the last N days (including today)
 */
export function getRecentDays(count = 7) {
  const days = [];
  const today = new Date();
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push({
      dateStr: formatDate(d),
      dayName: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
      dayNumber: d.getDate(),
      isToday: i === 0
    });
  }
  return days;
}

/**
 * Generates a GitHub-like contribution matrix (array of weeks, each containing 7 days)
 * @param {number} totalWeeks - Number of weeks to display (default 20 weeks)
 */
export function generateHeatmapGrid(totalWeeks = 20) {
  const today = new Date();
  const todayDayOfWeek = today.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat

  // Find the end date: the upcoming Saturday of this week
  const endDate = new Date(today);
  endDate.setDate(today.getDate() + (6 - todayDayOfWeek));

  // Find the start date: totalWeeks ago on Sunday
  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - (totalWeeks * 7 - 1));

  const weeks = [];
  let currentWeek = [];
  const monthLabels = [];
  let lastMonth = -1;

  const currentIter = new Date(startDate);
  const todayStr = getTodayString();

  let weekIndex = 0;
  while (currentIter <= endDate) {
    const dateStr = formatDate(currentIter);
    const month = currentIter.getMonth();
    const isFuture = currentIter > today;

    // Track month label on the first row of each week (Sunday)
    if (currentWeek.length === 0 && month !== lastMonth && weekIndex > 0) {
      monthLabels.push({
        weekIndex,
        label: currentIter.toLocaleDateString('en-US', { month: 'short' })
      });
      lastMonth = month;
    }

    currentWeek.push({
      dateStr,
      isFuture,
      isToday: dateStr === todayStr,
      dayOfWeek: currentIter.getDay()
    });

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
      weekIndex++;
    }

    currentIter.setDate(currentIter.getDate() + 1);
  }

  return { weeks, monthLabels };
}

/**
 * Calculates current streak and longest streak from an array of date strings (YYYY-MM-DD)
 */
export function calculateStreaks(completedDates = []) {
  if (!completedDates || completedDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Sort dates chronologically ascending
  const uniqueDates = Array.from(new Set(completedDates)).sort();
  const dateSet = new Set(uniqueDates);

  const todayStr = getTodayString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatDate(yesterday);

  // 1. Current streak calculation
  let currentStreak = 0;
  let checkDate = new Date();

  // If today isn't completed, check if streak can continue from yesterday
  if (!dateSet.has(todayStr)) {
    if (dateSet.has(yesterdayStr)) {
      checkDate = yesterday;
    } else {
      currentStreak = 0;
    }
  }

  // Walk backwards day-by-day
  if (dateSet.has(formatDate(checkDate))) {
    while (dateSet.has(formatDate(checkDate))) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
  }

  // 2. Longest streak calculation
  let longestStreak = 0;
  let tempStreak = 0;
  let prevDate = null;

  for (const dateStr of uniqueDates) {
    const curDate = parseDate(dateStr);
    if (!prevDate) {
      tempStreak = 1;
    } else {
      const diffTime = curDate - prevDate;
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        tempStreak++;
      } else if (diffDays > 1) {
        tempStreak = 1;
      }
    }
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }
    prevDate = curDate;
  }

  return { currentStreak, longestStreak };
}

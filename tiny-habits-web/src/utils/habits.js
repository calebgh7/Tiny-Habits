export function todayString() {
  return new Date().toISOString().slice(0, 10);
}

export function formatDisplayDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export function calculateStreak(completions) {
  if (!completions || completions.length === 0) return 0;

  const sorted = [...new Set(completions)].sort().reverse();
  const today = todayString();
  const yesterday = offsetDay(today, -1);

  if (sorted[0] !== today && sorted[0] !== yesterday) return 0;

  let streak = 0;
  let cursor = sorted[0];

  for (const date of sorted) {
    if (date === cursor) {
      streak++;
      cursor = offsetDay(cursor, -1);
    } else {
      break;
    }
  }
  return streak;
}

export function isCompletedToday(completions) {
  return completions ? completions.includes(todayString()) : false;
}

export function getLast7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    days.push(offsetDay(todayString(), -i));
  }
  return days;
}

function offsetDay(dateStr, offset) {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

export function mapScore(motivation, ability) {
  const avg = (motivation + ability) / 2;
  if (avg >= 8) return { label: 'Golden Zone', color: 'text-emerald-600', bg: 'bg-emerald-50', dot: 'bg-emerald-500' };
  if (avg >= 5) return { label: 'Growing', color: 'text-amber-600', bg: 'bg-amber-50', dot: 'bg-amber-500' };
  return { label: 'Needs Attention', color: 'text-red-500', bg: 'bg-red-50', dot: 'bg-red-500' };
}

export const CARD_COLORS = [
  { bg: 'bg-indigo-500', light: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200', hex: '#6366f1' },
  { bg: 'bg-violet-500', light: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-200', hex: '#8b5cf6' },
  { bg: 'bg-pink-500', light: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-200', hex: '#ec4899' },
  { bg: 'bg-emerald-500', light: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', hex: '#10b981' },
  { bg: 'bg-amber-500', light: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', hex: '#f59e0b' },
  { bg: 'bg-sky-500', light: 'bg-sky-50', text: 'text-sky-600', border: 'border-sky-200', hex: '#0ea5e9' },
];

export const CELEBRATIONS = [
  "You're on fire! Keep that shine going!",
  "That tiny habit just wired your brain for success!",
  "Feel the pride — you showed up for yourself!",
  "Every tiny win compounds. This matters!",
  "BJ Fogg would be proud. So should you!",
  "You did it! Tiny but mighty!",
  "Shine! That feeling is what makes habits stick.",
  "Small action, big momentum. Nailed it!",
  "You're building something great, one tiny step at a time.",
  "Yes! That's how lasting change is made.",
];

export function randomCelebration() {
  return CELEBRATIONS[Math.floor(Math.random() * CELEBRATIONS.length)];
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

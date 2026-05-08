import { useState } from 'react';
import { calculateStreak, isCompletedToday, CARD_COLORS, getLast7Days } from '../utils/habits';
import CelebrationModal from './CelebrationModal';

function TodayHabitCard({ habit, onCheck, onOpenDetail }) {
  const [bouncing, setBouncing] = useState(false);
  const [celebratingHabit, setCelebratingHabit] = useState(null);
  const done = isCompletedToday(habit.completions);
  const streak = calculateStreak(habit.completions);
  const color = CARD_COLORS[habit.colorIndex ?? 0];
  const last7 = getLast7Days();

  function handleCheck(e) {
    e.stopPropagation();
    setBouncing(true);
    setTimeout(() => setBouncing(false), 450);
    if (!done) setCelebratingHabit(habit);
    onCheck(habit.id);
  }

  return (
    <>
      <div
        className={`bg-white rounded-2xl p-4 shadow-sm border ${done ? 'border-gray-100 opacity-80' : 'border-white'} cursor-pointer active:scale-[0.98] transition-all`}
        onClick={() => onOpenDetail(habit)}
      >
        <div className="flex items-start gap-3">
          <button
            onClick={handleCheck}
            className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all
              ${done
                ? `${color.bg} text-white shadow-md`
                : `border-2 border-gray-200 text-gray-300 hover:border-indigo-300`
              } ${bouncing ? 'animate-check-bounce' : ''}`}
          >
            {done ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
              </svg>
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${color.light} ${color.text}`}>
                After I {habit.anchor}
              </span>
            </div>
            <p className={`font-semibold text-gray-900 ${done ? 'line-through text-gray-400' : ''}`}>
              I will {habit.habit}
            </p>
            <p className="text-xs text-gray-400 mt-0.5 truncate">Then: {habit.celebration}</p>
          </div>

          <div className="shrink-0 flex flex-col items-end gap-1">
            {streak > 0 && (
              <span className="flex items-center gap-1 text-xs font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">
                🔥 {streak}
              </span>
            )}
            <svg
              className="text-gray-300"
              width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </div>

        <div className="flex gap-1 mt-3 ml-13">
          {last7.map(day => {
            const completed = habit.completions.includes(day);
            const isToday = day === last7[6];
            return (
              <div
                key={day}
                title={day}
                className={`flex-1 h-1.5 rounded-full transition-all
                  ${completed ? color.bg : 'bg-gray-100'}
                  ${isToday && !completed ? 'ring-1 ring-gray-300' : ''}
                `}
              />
            );
          })}
        </div>
      </div>

      {celebratingHabit && (
        <CelebrationModal
          habit={celebratingHabit}
          onClose={() => setCelebratingHabit(null)}
        />
      )}
    </>
  );
}

export default function TodayView({ habits, onToggle, onOpenDetail, onAdd }) {
  const today = new Date();
  const dateLabel = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const doneCount = habits.filter(h => isCompletedToday(h.completions)).length;
  const total = habits.length;
  const progress = total > 0 ? (doneCount / total) * 100 : 0;

  return (
    <div className="flex flex-col h-full">
      <div className="bg-indigo-600 text-white px-5 pt-12 pb-6 rounded-b-3xl">
        <p className="text-indigo-200 text-sm font-medium">{dateLabel}</p>
        <h1 className="text-2xl font-bold mt-1 mb-4">Today's Habits</h1>

        {total > 0 && (
          <>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-indigo-200">{doneCount} of {total} done</span>
              {doneCount === total && total > 0 && (
                <span className="text-yellow-300 font-semibold">All done! 🌟</span>
              )}
            </div>
            <div className="bg-indigo-500/50 rounded-full h-2">
              <div
                className="bg-white rounded-full h-2 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-28 space-y-3">
        {habits.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-16">
            <div className="text-6xl mb-4">🌱</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">No habits yet</h2>
            <p className="text-gray-500 text-sm max-w-xs mb-6">
              Start tiny. BJ Fogg says even a 2-minute habit is enough to get started.
            </p>
            <button
              onClick={onAdd}
              className="bg-indigo-600 text-white font-semibold rounded-2xl px-6 py-3 text-base active:scale-95 transition-transform"
            >
              Create Your First Habit
            </button>
          </div>
        ) : (
          habits.map(habit => (
            <TodayHabitCard
              key={habit.id}
              habit={habit}
              onCheck={onToggle}
              onOpenDetail={onOpenDetail}
            />
          ))
        )}
      </div>
    </div>
  );
}

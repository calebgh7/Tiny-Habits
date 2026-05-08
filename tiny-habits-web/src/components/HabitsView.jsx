import { calculateStreak, isCompletedToday, mapScore, CARD_COLORS } from '../utils/habits';

function HabitRow({ habit, onOpenDetail }) {
  const streak = calculateStreak(habit.completions);
  const done = isCompletedToday(habit.completions);
  const color = CARD_COLORS[habit.colorIndex ?? 0];
  const score = mapScore(habit.motivation, habit.ability);

  return (
    <div
      className="bg-white rounded-2xl p-4 shadow-sm border border-white cursor-pointer active:scale-[0.98] transition-transform"
      onClick={() => onOpenDetail(habit)}
    >
      <div className="flex items-center gap-3">
        <div className={`w-11 h-11 rounded-xl ${color.bg} flex items-center justify-center shrink-0`}>
          <span className="text-xl">🌱</span>
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 truncate">After I {habit.anchor}</p>
          <p className="text-sm text-gray-500 truncate">I will {habit.habit}</p>
        </div>

        <div className="flex flex-col items-end gap-1 shrink-0">
          {streak > 0 && (
            <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">
              🔥 {streak}d
            </span>
          )}
          {done && (
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${color.light} ${color.text}`}>
              ✓ done
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${score.bg} ${score.color}`}>
          {score.label}
        </span>
        <span className="text-xs text-gray-400">
          M: {habit.motivation} · A: {habit.ability}
        </span>
      </div>
    </div>
  );
}

export default function HabitsView({ habits, onOpenDetail, onAdd }) {
  const totalStreak = habits.reduce((sum, h) => sum + calculateStreak(h.completions), 0);
  const doneToday = habits.filter(h => isCompletedToday(h.completions)).length;

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white border-b border-gray-100 px-5 pt-12 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">My Habits</h1>
        <p className="text-sm text-gray-400">{habits.length} habit{habits.length !== 1 ? 's' : ''} · {doneToday} done today · {totalStreak} total streak days</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-28 space-y-3">
        {habits.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-16">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">No habits yet</h2>
            <p className="text-gray-500 text-sm max-w-xs mb-6">
              Build your first habit recipe using BJ Fogg's proven method.
            </p>
            <button
              onClick={onAdd}
              className="bg-indigo-600 text-white font-semibold rounded-2xl px-6 py-3 text-base active:scale-95 transition-transform"
            >
              Create a Habit Recipe
            </button>
          </div>
        ) : (
          <>
            {habits.map(habit => (
              <HabitRow key={habit.id} habit={habit} onOpenDetail={onOpenDetail} />
            ))}
            <button
              onClick={onAdd}
              className="w-full border-2 border-dashed border-indigo-200 text-indigo-400 font-medium rounded-2xl py-4 text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform hover:border-indigo-300 hover:text-indigo-500"
            >
              <span className="text-xl">+</span> Add Another Habit
            </button>
          </>
        )}
      </div>
    </div>
  );
}

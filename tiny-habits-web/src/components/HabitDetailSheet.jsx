import { useState, useEffect } from 'react';
import { calculateStreak, getLast7Days, mapScore, CARD_COLORS } from '../utils/habits';

export default function HabitDetailSheet({ habit, onClose, onEdit, onDelete, onUpdate }) {
  const [motivation, setMotivation] = useState(habit.motivation);
  const [ability, setAbility] = useState(habit.ability);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const streak = calculateStreak(habit.completions);
  const last7 = getLast7Days();
  const color = CARD_COLORS[habit.colorIndex ?? 0];
  const score = mapScore(motivation, ability);
  const totalDone = habit.completions.length;

  useEffect(() => {
    setMotivation(habit.motivation);
    setAbility(habit.ability);
  }, [habit]);

  function handleSliderSave() {
    onUpdate(habit.id, { motivation, ability });
  }

  return (
    <div className="fixed inset-0 z-40 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl animate-slide-up max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white pt-3 pb-4 px-5 border-b border-gray-100 rounded-t-3xl z-10">
          <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 truncate flex-1 pr-2">Habit Details</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        <div className="px-5 py-4 space-y-5 pb-10">
          {/* Recipe */}
          <div className={`rounded-2xl p-4 ${color.light} border ${color.border}`}>
            <p className="text-xs uppercase tracking-widest font-semibold text-gray-400 mb-3">Habit Recipe</p>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-lg">⚓</span>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Anchor</p>
                  <p className={`font-semibold ${color.text}`}>After I {habit.anchor}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-lg">🌱</span>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Tiny Habit</p>
                  <p className="font-semibold text-gray-800">I will {habit.habit}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-lg">🎉</span>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Celebration</p>
                  <p className="font-semibold text-gray-800">Then {habit.celebration}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-orange-50 rounded-2xl p-3 text-center">
              <p className="text-2xl font-bold text-orange-500">{streak > 0 ? `🔥${streak}` : '—'}</p>
              <p className="text-xs text-gray-400 mt-1">Day Streak</p>
            </div>
            <div className="bg-indigo-50 rounded-2xl p-3 text-center">
              <p className="text-2xl font-bold text-indigo-600">{totalDone}</p>
              <p className="text-xs text-gray-400 mt-1">Total Done</p>
            </div>
            <div className={`${score.bg} rounded-2xl p-3 text-center`}>
              <div className={`inline-block w-3 h-3 rounded-full ${score.dot} mb-1`} />
              <p className={`text-xs font-semibold ${score.color}`}>{score.label}</p>
            </div>
          </div>

          {/* Last 7 days */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">Last 7 Days</p>
            <div className="flex gap-1.5">
              {last7.map(day => {
                const done = habit.completions.includes(day);
                const dayLabel = new Date(day + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'narrow' });
                return (
                  <div key={day} className="flex-1 flex flex-col items-center gap-1">
                    <div className={`w-full aspect-square rounded-xl flex items-center justify-center
                      ${done ? `${color.bg} text-white` : 'bg-gray-100 text-gray-300'}`}>
                      {done ? (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        <span className="text-xs">·</span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">{dayLabel}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* B=MAP Sliders */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-700">B = MAP Tuning</p>
              <button
                onClick={handleSliderSave}
                className="text-xs text-indigo-600 font-semibold bg-indigo-50 px-3 py-1 rounded-full active:scale-95 transition-transform"
              >
                Save
              </button>
            </div>

            <div className="space-y-4 bg-gray-50 rounded-2xl p-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-gray-700">Motivation</span>
                  <span className="font-bold text-indigo-600">{motivation}/10</span>
                </div>
                <input
                  type="range" min="1" max="10" value={motivation}
                  onChange={e => setMotivation(Number(e.target.value))}
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Low</span><span>High</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-gray-700">Ability (Ease)</span>
                  <span className="font-bold text-indigo-600">{ability}/10</span>
                </div>
                <input
                  type="range" min="1" max="10" value={ability}
                  onChange={e => setAbility(Number(e.target.value))}
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Hard</span><span>Easy</span>
                </div>
              </div>

              {(motivation < 5 || ability < 5) && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <p className="text-xs text-amber-700 font-medium">
                    {ability < motivation
                      ? "💡 Tip: Make this habit even smaller so it's easier to do."
                      : "💡 Tip: Connect this habit to something you care deeply about to boost motivation."}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => onEdit(habit)}
              className="flex-1 bg-indigo-600 text-white font-semibold rounded-2xl py-3.5 active:scale-95 transition-transform"
            >
              Edit Habit
            </button>
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 bg-red-50 text-red-500 font-semibold rounded-2xl py-3.5 active:scale-95 transition-transform"
              >
                Delete
              </button>
            ) : (
              <button
                onClick={() => { onDelete(habit.id); onClose(); }}
                className="px-4 bg-red-500 text-white font-semibold rounded-2xl py-3.5 active:scale-95 transition-transform"
              >
                Confirm
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

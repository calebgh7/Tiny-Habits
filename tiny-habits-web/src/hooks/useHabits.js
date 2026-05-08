import { useState, useEffect } from 'react';
import { generateId, todayString, CARD_COLORS } from '../utils/habits';

const STORAGE_KEY = 'tiny-habits-v1';

function loadHabits() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHabits(habits) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
}

export function useHabits() {
  const [habits, setHabits] = useState(() => loadHabits());

  useEffect(() => {
    saveHabits(habits);
  }, [habits]);

  function addHabit({ anchor, habit, celebration, motivation, ability }) {
    const colorIndex = habits.length % CARD_COLORS.length;
    const newHabit = {
      id: generateId(),
      anchor,
      habit,
      celebration,
      motivation,
      ability,
      colorIndex,
      createdAt: new Date().toISOString(),
      completions: [],
    };
    setHabits(prev => [newHabit, ...prev]);
    return newHabit.id;
  }

  function updateHabit(id, updates) {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, ...updates } : h));
  }

  function deleteHabit(id) {
    setHabits(prev => prev.filter(h => h.id !== id));
  }

  function toggleCompletion(id) {
    const today = todayString();
    setHabits(prev => prev.map(h => {
      if (h.id !== id) return h;
      const already = h.completions.includes(today);
      return {
        ...h,
        completions: already
          ? h.completions.filter(d => d !== today)
          : [...h.completions, today],
      };
    }));
  }

  return { habits, addHabit, updateHabit, deleteHabit, toggleCompletion };
}

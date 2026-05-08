import { useState, useCallback } from 'react';
import { useHabits } from './hooks/useHabits';
import TodayView from './components/TodayView';
import HabitsView from './components/HabitsView';
import AddEditHabit from './components/AddEditHabit';
import HabitDetailSheet from './components/HabitDetailSheet';

const TABS = [
  {
    id: 'today',
    label: 'Today',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    id: 'habits',
    label: 'My Habits',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" strokeWidth="2.5" />
        <line x1="3" y1="12" x2="3.01" y2="12" strokeWidth="2.5" />
        <line x1="3" y1="18" x2="3.01" y2="18" strokeWidth="2.5" />
      </svg>
    ),
  },
];

export default function App() {
  const { habits, addHabit, updateHabit, deleteHabit, toggleCompletion } = useHabits();
  const [activeTab, setActiveTab] = useState('today');
  const [view, setView] = useState('main'); // 'main' | 'add' | 'edit'
  const [detailHabit, setDetailHabit] = useState(null);
  const [editingHabit, setEditingHabit] = useState(null);

  const openDetail = useCallback((habit) => {
    setDetailHabit(habit);
  }, []);

  const closeDetail = useCallback(() => {
    setDetailHabit(null);
  }, []);

  function handleSaveHabit(data) {
    if (editingHabit) {
      updateHabit(editingHabit.id, data);
    } else {
      addHabit(data);
    }
    setEditingHabit(null);
    setView('main');
    setActiveTab('today');
  }

  function handleEditHabit(habit) {
    setDetailHabit(null);
    setEditingHabit(habit);
    setView('edit');
  }

  function handleAddClick() {
    setEditingHabit(null);
    setView('add');
  }

  if (view === 'add' || view === 'edit') {
    return (
      <div className="max-w-md mx-auto h-screen bg-white flex flex-col">
        <AddEditHabit
          initial={editingHabit}
          habitCount={habits.length}
          onSave={handleSaveHabit}
          onBack={() => { setView('main'); setEditingHabit(null); }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto h-screen bg-[#f5f3ff] flex flex-col relative">
      <div className="flex-1 overflow-hidden relative">
        {activeTab === 'today' && (
          <TodayView
            habits={habits}
            onToggle={toggleCompletion}
            onOpenDetail={openDetail}
            onAdd={handleAddClick}
          />
        )}
        {activeTab === 'habits' && (
          <HabitsView
            habits={habits}
            onOpenDetail={openDetail}
            onAdd={handleAddClick}
          />
        )}
      </div>

      {/* Bottom navigation */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 safe-area-inset-bottom shadow-lg">
        <div className="flex items-center">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center py-3 gap-1 transition-colors
                ${activeTab === tab.id ? 'text-indigo-600' : 'text-gray-400'}`}
            >
              {tab.icon(activeTab === tab.id)}
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          ))}

          {/* Add FAB in middle-ish */}
          <button
            onClick={handleAddClick}
            className="flex-1 flex flex-col items-center py-3 gap-1 text-indigo-600"
          >
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-200 active:scale-90 transition-transform">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </div>
            <span className="text-xs font-medium">Add</span>
          </button>
        </div>
      </div>

      {/* Habit detail sheet */}
      {detailHabit && (
        <HabitDetailSheet
          habit={habits.find(h => h.id === detailHabit.id) ?? detailHabit}
          onClose={closeDetail}
          onEdit={handleEditHabit}
          onDelete={deleteHabit}
          onUpdate={updateHabit}
        />
      )}
    </div>
  );
}

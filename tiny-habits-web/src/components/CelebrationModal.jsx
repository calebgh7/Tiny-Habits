import { useEffect, useRef } from 'react';
import { randomCelebration } from '../utils/habits';

const CONFETTI_COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#0ea5e9', '#f97316'];

function spawnConfetti() {
  for (let i = 0; i < 60; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    const size = 8 + Math.random() * 8;
    el.style.cssText = `
      left: ${Math.random() * 100}vw;
      top: -20px;
      width: ${size}px;
      height: ${size}px;
      background: ${CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]};
      animation-duration: ${1.5 + Math.random() * 2}s;
      animation-delay: ${Math.random() * 0.4}s;
      transform: rotate(${Math.random() * 360}deg);
    `;
    document.body.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }
}

export default function CelebrationModal({ habit, onClose }) {
  const messageRef = useRef(randomCelebration());

  useEffect(() => {
    spawnConfetti();
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl mx-4 p-8 max-w-sm w-full text-center shadow-2xl animate-celebration-pop"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-7xl mb-4 select-none">🎉</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Habit Done!</h2>
        <p className="text-gray-500 text-sm mb-5">{messageRef.current}</p>

        {habit?.celebration && (
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl px-4 py-3 mb-6">
            <p className="text-xs text-indigo-400 uppercase tracking-widest font-semibold mb-1">Your celebration</p>
            <p className="text-indigo-700 font-medium">{habit.celebration}</p>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full bg-indigo-600 text-white font-semibold rounded-2xl py-3.5 text-base active:scale-95 transition-transform"
        >
          Keep Shining ✨
        </button>
      </div>
    </div>
  );
}

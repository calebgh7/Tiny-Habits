import { useState } from 'react';
import { CARD_COLORS } from '../utils/habits';

const ANCHOR_EXAMPLES = [
  'brush my teeth', 'pour my morning coffee', 'sit down at my desk',
  'put on my shoes', 'wake up', 'eat lunch', 'finish a meeting',
];

const HABIT_EXAMPLES = [
  'do 2 pushups', 'write one sentence in my journal',
  'take 3 deep breaths', 'drink a glass of water',
  'stretch for 30 seconds', 'say one thing I\'m grateful for',
  'read one page', 'meditate for 1 minute',
];

const CELEBRATION_EXAMPLES = [
  'say "Yes! I did it!"', 'do a fist pump', 'smile at myself',
  'do a happy dance', 'say "I am awesome!"', 'take a proud breath',
];

function SuggestionChips({ examples, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {examples.map(ex => (
        <button
          key={ex}
          type="button"
          onClick={() => onSelect(ex)}
          className="text-xs bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-full px-3 py-1.5 active:scale-95 transition-transform"
        >
          {ex}
        </button>
      ))}
    </div>
  );
}

function SliderField({ label, sublabel, value, onChange, leftLabel, rightLabel }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div>
          <label className="text-sm font-semibold text-gray-800">{label}</label>
          {sublabel && <p className="text-xs text-gray-400">{sublabel}</p>}
        </div>
        <span className="text-xl font-bold text-indigo-600 w-8 text-center">{value}</span>
      </div>
      <input
        type="range"
        min="1"
        max="10"
        value={value}
        onChange={e => onChange(Number(e.target.value))}
      />
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  );
}

export default function AddEditHabit({ initial, habitCount, onSave, onBack }) {
  const isEdit = !!initial;
  const [step, setStep] = useState(0);
  const [anchor, setAnchor] = useState(initial?.anchor ?? '');
  const [habit, setHabit] = useState(initial?.habit ?? '');
  const [celebration, setCelebration] = useState(initial?.celebration ?? '');
  const [motivation, setMotivation] = useState(initial?.motivation ?? 7);
  const [ability, setAbility] = useState(initial?.ability ?? 7);
  const [colorIndex, setColorIndex] = useState(
    initial?.colorIndex ?? (habitCount % CARD_COLORS.length)
  );

  const steps = [
    {
      title: 'Set Your Anchor',
      subtitle: 'After I do this existing habit or event...',
      icon: '⚓',
      content: (
        <>
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 mb-4">
            <p className="text-sm text-indigo-600 font-medium">
              An anchor is something you already do every day. Your tiny habit will attach to it.
            </p>
          </div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">After I...</label>
          <input
            autoFocus
            className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-base focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            placeholder="e.g. brush my teeth"
            value={anchor}
            onChange={e => setAnchor(e.target.value)}
          />
          <SuggestionChips examples={ANCHOR_EXAMPLES} onSelect={setAnchor} />
        </>
      ),
      valid: anchor.trim().length > 0,
    },
    {
      title: 'Design Your Tiny Habit',
      subtitle: 'I will do this right after the anchor...',
      icon: '🌱',
      content: (
        <>
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 mb-4">
            <p className="text-sm text-emerald-700 font-medium">
              Keep it tiny! It should take under 2 minutes. You can always do more, but design for the minimum.
            </p>
          </div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">I will...</label>
          <input
            autoFocus
            className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-base focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            placeholder="e.g. do 2 pushups"
            value={habit}
            onChange={e => setHabit(e.target.value)}
          />
          <SuggestionChips examples={HABIT_EXAMPLES} onSelect={setHabit} />
        </>
      ),
      valid: habit.trim().length > 0,
    },
    {
      title: 'Plan Your Celebration',
      subtitle: 'This wires the habit into your brain!',
      icon: '🎉',
      content: (
        <>
          <div className="bg-pink-50 border border-pink-100 rounded-2xl p-4 mb-4">
            <p className="text-sm text-pink-700 font-medium">
              Celebrations create positive emotion — the feeling of success is what makes habits stick. Make it genuine!
            </p>
          </div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Then I will...</label>
          <input
            autoFocus
            className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-base focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            placeholder="e.g. say 'Yes! I did it!'"
            value={celebration}
            onChange={e => setCelebration(e.target.value)}
          />
          <SuggestionChips examples={CELEBRATION_EXAMPLES} onSelect={setCelebration} />
        </>
      ),
      valid: celebration.trim().length > 0,
    },
    {
      title: 'Tune Your Habit',
      subtitle: 'Rate your motivation & ability (B = MAP)',
      icon: '🎛️',
      content: (
        <div className="space-y-6">
          <div className="bg-violet-50 border border-violet-100 rounded-2xl p-4">
            <p className="text-sm text-violet-700 font-medium">
              BJ Fogg's formula: Behavior = Motivation × Ability × Prompt. Rate honestly to identify what to adjust.
            </p>
          </div>
          <SliderField
            label="Motivation"
            sublabel="How much do you want to do this?"
            value={motivation}
            onChange={setMotivation}
            leftLabel="Low (1)"
            rightLabel="High (10)"
          />
          <SliderField
            label="Ability"
            sublabel="How easy is this to do right now?"
            value={ability}
            onChange={setAbility}
            leftLabel="Hard (1)"
            rightLabel="Easy (10)"
          />
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Card Color</label>
            <div className="flex gap-2 flex-wrap">
              {CARD_COLORS.map((c, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setColorIndex(i)}
                  className={`w-9 h-9 rounded-full ${c.bg} transition-transform active:scale-90 ${colorIndex === i ? 'ring-3 ring-offset-2 ring-gray-400 scale-110' : ''}`}
                />
              ))}
            </div>
          </div>
        </div>
      ),
      valid: true,
    },
  ];

  const currentStep = steps[step];
  const isLastStep = step === steps.length - 1;

  function handleNext() {
    if (isLastStep) {
      onSave({ anchor: anchor.trim(), habit: habit.trim(), celebration: celebration.trim(), motivation, ability, colorIndex });
    } else {
      setStep(s => s + 1);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white border-b border-gray-100 px-4 pt-12 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <h1 className="text-lg font-bold text-gray-900">{isEdit ? 'Edit Habit' : 'New Habit Recipe'}</h1>
        </div>

        <div className="flex gap-1.5">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-1.5 rounded-full transition-all duration-300
                ${i < step ? 'bg-indigo-600' : i === step ? 'bg-indigo-400' : 'bg-gray-100'}`}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6">
        <div className="text-4xl mb-3">{currentStep.icon}</div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">{currentStep.title}</h2>
        <p className="text-sm text-gray-500 mb-5">{currentStep.subtitle}</p>

        {step > 0 && (
          <div className="bg-gray-50 rounded-2xl p-3 mb-5 space-y-1">
            {anchor && (
              <p className="text-xs text-gray-500">
                <span className="font-semibold text-gray-700">After I</span> {anchor}
              </p>
            )}
            {habit && step > 1 && (
              <p className="text-xs text-gray-500">
                <span className="font-semibold text-gray-700">I will</span> {habit}
              </p>
            )}
            {celebration && step > 2 && (
              <p className="text-xs text-gray-500">
                <span className="font-semibold text-gray-700">Then</span> {celebration}
              </p>
            )}
          </div>
        )}

        {currentStep.content}
      </div>

      <div className="px-5 pb-8 pt-4 bg-white border-t border-gray-100">
        <button
          disabled={!currentStep.valid}
          onClick={handleNext}
          className={`w-full font-semibold rounded-2xl py-4 text-base transition-all
            ${currentStep.valid
              ? 'bg-indigo-600 text-white active:scale-95'
              : 'bg-gray-100 text-gray-300 cursor-not-allowed'
            }`}
        >
          {isLastStep ? (isEdit ? 'Save Changes' : 'Create Habit') : 'Next →'}
        </button>
        {step > 0 && (
          <button
            onClick={() => setStep(s => s - 1)}
            className="w-full text-center text-sm text-gray-400 mt-3 py-1 active:text-gray-600"
          >
            Back
          </button>
        )}
      </div>
    </div>
  );
}

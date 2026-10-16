import React, { useState } from 'react';
import {
  Activity,
  Heart,
  Flame,
  CheckCircle,
  Plus,
  ShieldAlert,
  Sparkles,
  Zap,
  Info,
} from 'lucide-react';
import { HealthTrackerData, Language } from '../types/index.ts';

interface FitnessViewProps {
  trackerData: HealthTrackerData;
  onUpdateTracker: (updater: (prev: HealthTrackerData) => HealthTrackerData) => void;
  language: Language;
}

const ROUTINES = [
  {
    id: 'mobility',
    titleEn: '10-Minute Morning Posture & Spine Mobility',
    titleTa: '10 நிமிட காலை உடல் நெகிழ்வுத்தன்மை & தோரணை பயிற்சி',
    duration: '10 mins',
    level: 'Gentle / All Levels',
    benefits: 'Counteracts desk stiffness, lubricates synovial joints, improves circulation.',
    steps: [
      'Neck rolls & shoulder shrugs (1 min)',
      'Cat-Cow spinal wave breathing (2 mins)',
      'Gentle standing forward fold & hamstring lengthener (2 mins)',
      'Torso twist & deep side rib openers (2 mins)',
      'Gentle hip circles & ankle rotations (3 mins)',
    ],
  },
  {
    id: 'cardio',
    titleEn: '30-Minute Low-Impact Heart Health Walk',
    titleTa: '30 நிமிட இதய நலம் காக்கும் சுறுசுறுப்பான நடைபயிற்சி',
    duration: '30 mins',
    level: 'Moderate Aerobic',
    benefits: 'Enhances VO2 capacity, strengthens myocardial tissue, regulates blood pressure.',
    steps: [
      '5-minute warm-up easy walking pace',
      '20-minute brisk walk maintaining the "Talk-Test" (breathing deeper but conversational)',
      '5-minute gradual cooldown stride and calf stretches',
    ],
  },
  {
    id: 'strength',
    titleEn: 'Functional Bodyweight & Core Stability',
    titleTa: 'உடல் எடை சார்ந்த தசை வலிமை & சமநிலை பயிற்சி',
    duration: '20 mins',
    level: 'Moderate',
    benefits: 'Preserves lean muscle mass, elevates metabolic rate, strengthens bones.',
    steps: [
      'Chair squats or air squats: 2 sets of 10-12 reps',
      'Wall or incline push-ups: 2 sets of 8-10 reps',
      'Glute bridges on floor mat: 2 sets of 12 reps',
      'Modified plank or bird-dog balance hold: 30 seconds x 3',
    ],
  },
  {
    id: 'yoga',
    titleEn: 'Evening Parasympathetic Wind-down Yoga',
    titleTa: 'மாலை நேர மன அமைதி & தசை தளர்வு யோகாசனம்',
    duration: '15 mins',
    level: 'Restorative',
    benefits: 'Lowers evening cortisol, prepares the central nervous system for deep restorative sleep.',
    steps: [
      'Child pose (Balasana) with extended arm stretch (3 mins)',
      'Legs-up-the-wall pose (Viparita Karani) (5 mins)',
      'Supine spinal twist right and left (4 mins)',
      'Corpse pose (Savasana) with slow 4-count nasal breathing (3 mins)',
    ],
  },
];

export const FitnessView: React.FC<FitnessViewProps> = ({
  trackerData,
  onUpdateTracker,
  language,
}) => {
  const [selectedRoutine, setSelectedRoutine] = useState(ROUTINES[0]);
  const [logMinutes, setLogMinutes] = useState(20);
  const [selectedType, setSelectedType] = useState('Brisk Walking');

  const handleAddMinutes = () => {
    onUpdateTracker((prev) => ({
      ...prev,
      exerciseMinutes: prev.exerciseMinutes + logMinutes,
      exerciseType: selectedType,
    }));
  };

  const progressPercent = Math.min(
    100,
    Math.round((trackerData.exerciseMinutes / trackerData.exerciseGoalMinutes) * 100)
  );

  return (
    <div className="space-y-6">
      {/* Top Banner with Image */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                <Activity className="w-3.5 h-3.5 text-emerald-600" />
                <span>{language === 'ta' ? 'உடற்பயிற்சி & தினசரி இயக்கம்' : 'Physical Activity & Movement'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                {language === 'ta' ? 'ஆரோக்கியமான சுறுசுறுப்பான வாழ்க்கை' : 'Move Daily for Vitality & Longevity'}
              </h1>
              <p className="text-sm text-slate-600 leading-relaxed max-w-xl">
                {language === 'ta'
                  ? 'கடினமான பயிற்சிகள் இன்றி, தினசரி 20-30 நிமிட நடைபயிற்சி, உடல் தளர்வு மற்றும் எளிய அசைவுகள் மூலம் உடல் ஆரோக்கியத்தையும் மன அமைதியையும் பேணுங்கள்.'
                  : 'Physical activity does not require exhausting regimens. Consistency with gentle walks, joint mobility, and balanced movement supports cardiovascular health, insulin sensitivity, and mood.'}
              </p>
            </div>

            {/* Benchmark Pill */}
            <div className="pt-2 flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-1.5 font-medium text-slate-900 dark:text-white">
                <Heart className="w-4 h-4 text-rose-500" />
                <span>WHO Clinical Standard:</span>
              </div>
              <span>150 mins of moderate aerobic movement per week</span>
            </div>
          </div>

          <div className="lg:col-span-5 relative min-h-[220px] bg-slate-100 dark:bg-slate-800">
            <img
              src="/src/assets/images/fitness_lifestyle_wellness_1792151412093.jpg"
              alt="Person practicing peaceful morning yoga and stretching in bright room"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Interactive Activity Tracker & Logger */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xs space-y-5 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {language === 'ta' ? 'இன்றைய உடற்பயிற்சி பதிவு' : 'Daily Movement Log'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'ta'
                ? 'பயனர் உள்ளீடு செய்த தகவல் · சுய-கண்காணிப்பு'
                : 'User-entered information for daily habit tracking'}
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            {language === 'ta' ? 'இன்றைய சாதனை: ' : 'Today: '}
            <span className="font-mono-numbers">{trackerData.exerciseMinutes}</span> / {trackerData.exerciseGoalMinutes} mins ({progressPercent}%)
          </span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 dark:text-slate-500 font-mono-numbers">
            <span>0m</span>
            <span>Target: {trackerData.exerciseGoalMinutes} mins</span>
          </div>
        </div>

        {/* Quick Log Form */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-3">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 block">
            {language === 'ta' ? 'செயல்பாட்டை பதிவு செய்க:' : 'Log an activity:'}
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {['Brisk Walking', 'Yoga / Stretch', 'Cardio / Jog', 'Bodyweight / Strength'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`py-2 px-3 text-xs font-medium rounded-lg border transition-colors ${
                  selectedType === type
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-600">{language === 'ta' ? 'நேரம்:' : 'Minutes:'}</span>
              {[10, 20, 30, 45].map((m) => (
                <button
                  key={m}
                  onClick={() => setLogMinutes(m)}
                  className={`px-2.5 py-1 rounded text-xs font-mono-numbers border ${
                    logMinutes === m
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {m}m
                </button>
              ))}
            </div>

            <button
              onClick={handleAddMinutes}
              className="ml-auto inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'ta' ? 'பதிவு செய்' : `Add ${logMinutes} Mins`}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Structured Routines Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-5">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            {language === 'ta' ? 'பரிந்துரைக்கப்படும் எளிய உடற்பயிற்சி முறைகள்' : 'Curated Evidence-Based Movement Routines'}
          </h2>
          <p className="text-xs text-slate-500">
            {language === 'ta'
              ? 'உங்கள் உடல் நிலைக்கு ஏற்றவாறு செய்யக்கூடிய பாதுகாப்பான பயிற்சிகள்.'
              : 'Safe, accessible routines designed to protect joints and enhance cardiovascular fitness.'}
          </p>
        </div>

        {/* Routine Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {ROUTINES.map((routine) => {
            const isSelected = selectedRoutine.id === routine.id;
            return (
              <button
                key={routine.id}
                onClick={() => setSelectedRoutine(routine)}
                className={`p-3.5 text-left rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 shadow-2xs'
                    : 'bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-mono-numbers font-bold text-emerald-700">{routine.duration}</span>
                  <span className="text-[11px] text-slate-500">{routine.level}</span>
                </div>
                <h4 className="text-xs font-bold leading-snug">
                  {language === 'ta' ? routine.titleTa : routine.titleEn}
                </h4>
              </button>
            );
          })}
        </div>

        {/* Selected Routine Details */}
        <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {language === 'ta' ? selectedRoutine.titleTa : selectedRoutine.titleEn}
              </h3>
              <p className="text-xs text-slate-600 mt-1">{selectedRoutine.benefits}</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 shrink-0 font-mono-numbers">
              {selectedRoutine.duration}
            </span>
          </div>

          <div className="pt-2 space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              {language === 'ta' ? 'படிநிலைகள்:' : 'Step-by-step guidance:'}
            </span>
            {selectedRoutine.steps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-800">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold font-mono-numbers flex items-center justify-center text-[11px] shrink-0">
                  {idx + 1}
                </span>
                <span className="mt-0.5">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* The Talk Test & Safety Protocol */}
        <div className="p-4 bg-teal-50/60 rounded-xl border border-teal-200 text-teal-950 text-xs space-y-2">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-teal-700" />
            <h4 className="font-bold text-teal-900">
              {language === 'ta' ? 'பாதுகாப்பு விதி: "பேசிப் பார்க்கும் முறை" (The Talk Test)' : 'The Clinical "Talk-Test" for Exertion Safety'}
            </h4>
          </div>
          <p className="text-teal-800 leading-relaxed">
            During moderate aerobic exercise (like brisk walking), you should be able to speak full sentences without panting. If you cannot speak without gasping for breath, slow down your pace immediately.
          </p>
          <div className="pt-1 flex items-center gap-2 text-rose-700 text-[11px] font-semibold">
            <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
            <span>
              Safety Warning: Stop exercise immediately if you experience dizziness, lightheadedness, nausea, or chest discomfort.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

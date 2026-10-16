import React, { useState } from 'react';
import {
  Lightbulb,
  Droplets,
  Moon,
  Activity,
  Apple,
  Brain,
  Calculator,
  Clock,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { HEALTH_TIPS } from '../data/healthData.ts';
import { Language } from '../types/index.ts';

interface TipsViewProps {
  language: Language;
}

export const TipsView: React.FC<TipsViewProps> = ({ language }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Hydration calculator state
  const [weightKg, setWeightKg] = useState<number>(68);
  const [dailyActivityMins, setDailyActivityMins] = useState<number>(30);

  // Calculate baseline water (approx 35 ml per kg body weight + 350ml per 30 mins exercise)
  const estimatedWaterMl = Math.round(weightKg * 35 + (dailyActivityMins / 30) * 350);

  // Sleep cycle calculator state
  const [wakeHour, setWakeHour] = useState<number>(7);
  const [wakeMinute, setWakeMinute] = useState<number>(0);
  const [wakePeriod, setWakePeriod] = useState<'AM' | 'PM'>('AM');

  // Compute 90-minute cycles back from wake time
  // 5 cycles = 7.5 hrs + 15m to fall asleep = 7h 45m
  // 6 cycles = 9 hrs + 15m to fall asleep = 9h 15m
  // 4 cycles = 6 hrs + 15m to fall asleep = 6h 15m
  const calculateBedtimes = () => {
    let wakeTotalMins = (wakeHour % 12) * 60 + wakeMinute;
    if (wakePeriod === 'PM') wakeTotalMins += 12 * 60;

    const formatMins = (totalMins: number) => {
      let norm = (totalMins + 24 * 60) % (24 * 60);
      let h = Math.floor(norm / 60);
      let m = norm % 60;
      let p = h >= 12 ? 'PM' : 'AM';
      let displayH = h % 12 || 12;
      let displayM = m < 10 ? `0${m}` : m;
      return `${displayH}:${displayM} ${p}`;
    };

    return [
      { cycles: 5, hours: '7.5 hours (Optimal)', time: formatMins(wakeTotalMins - (7 * 60 + 45)) },
      { cycles: 6, hours: '9 hours (Long Rest)', time: formatMins(wakeTotalMins - (9 * 60 + 15)) },
      { cycles: 4, hours: '6 hours (Minimum)', time: formatMins(wakeTotalMins - (6 * 60 + 15)) },
    ];
  };

  const bedtimes = calculateBedtimes();

  const filteredTips =
    selectedCategory === 'all'
      ? HEALTH_TIPS
      : HEALTH_TIPS.filter((t) => t.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-2">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-100">
          <Lightbulb className="w-3.5 h-3.5 text-teal-600" />
          <span>{language === 'ta' ? 'அறிவியல் நலக் குறிப்புகள்' : 'Evidence-Based Wellness Knowledge'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          {language === 'ta' ? 'நலக் குறிப்புகள் & கருவிகள்' : 'Clinical Health Guidance & Interactive Calculators'}
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
          {language === 'ta'
            ? 'தண்ணீர் தேவை, தூக்க சுழற்சி மற்றும் வாழ்க்கை முறை ஆலோசனைகளை சர்வதேச மருத்துவ வழிகாட்டல்களின்படி அறிந்து கொள்ளுங்கள்.'
            : 'Explore practical preventative health guidelines backed by public health literature, alongside personalized hydration and circadian sleep cycle calculators.'}
        </p>

        {/* Filter categories */}
        <div className="pt-4 flex flex-wrap gap-2">
          {[
            { id: 'all', label: language === 'ta' ? 'அனைத்தும்' : 'All Topics', icon: Lightbulb },
            { id: 'hydration', label: language === 'ta' ? 'நீர்ச்சத்து' : 'Hydration', icon: Droplets },
            { id: 'sleep', label: language === 'ta' ? 'தூக்கம்' : 'Sleep Hygiene', icon: Moon },
            { id: 'exercise', label: language === 'ta' ? 'உடற்பயிற்சி' : 'Activity', icon: Activity },
            { id: 'nutrition', label: language === 'ta' ? 'ஊட்டச்சத்து' : 'Nutrition', icon: Apple },
            { id: 'mind', label: language === 'ta' ? 'மன அமைதி' : 'Mind & Stress', icon: Brain },
          ].map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isSelected
                    ? 'bg-teal-600 text-white font-semibold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2 Interactive Calculators */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Calculator 1: Hydration Calculator */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-sky-600" />
              <h2 className="text-sm font-bold text-slate-900">
                {language === 'ta' ? 'நீர் தேவை கணக்கீடு' : 'Daily Hydration Baseline Estimator'}
              </h2>
            </div>
            <span className="text-[11px] font-medium text-slate-400">Clinical Formula</span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span>{language === 'ta' ? 'உடல் எடை (கிலோ):' : 'Body Weight:'}</span>
                <span className="font-mono-numbers font-bold text-slate-900">{weightKg} kg</span>
              </div>
              <input
                type="range"
                min="40"
                max="130"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full accent-teal-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span>{language === 'ta' ? 'தினசரி உடற்பயிற்சி நேரம்:' : 'Exercise minutes daily:'}</span>
                <span className="font-mono-numbers font-bold text-slate-900">{dailyActivityMins} mins</span>
              </div>
              <input
                type="range"
                min="0"
                max="120"
                step="15"
                value={dailyActivityMins}
                onChange={(e) => setDailyActivityMins(Number(e.target.value))}
                className="w-full accent-teal-600"
              />
            </div>

            <div className="p-4 bg-sky-50/70 border border-sky-100 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs text-sky-900 block font-medium">
                  {language === 'ta' ? 'பரிந்துரைக்கப்படும் தினசரி நீர் அளவு:' : 'Recommended Daily Intake:'}
                </span>
                <span className="text-2xl font-bold font-mono-numbers text-sky-700">
                  {estimatedWaterMl}{' '}
                  <span className="text-xs font-normal text-sky-600">ml / day (~{(estimatedWaterMl / 1000).toFixed(1)} L)</span>
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-mono-numbers font-bold text-xs">
                {Math.round(estimatedWaterMl / 250)} 🥛
              </div>
            </div>
          </div>
        </div>

        {/* Calculator 2: Sleep Cycle Calculator */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900">
                {language === 'ta' ? 'உயிரியல் தூக்க சுழற்சி கணக்கீடு' : '90-Minute Circadian Sleep Calculator'}
              </h2>
            </div>
            <span className="text-[11px] font-medium text-slate-400">Sleep Medicine</span>
          </div>

          <div className="space-y-3">
            <span className="text-xs text-slate-600 block">
              {language === 'ta' ? 'நீங்கள் காலையில் எழும் நேரம்:' : 'Select your desired waking time:'}
            </span>
            <div className="flex items-center gap-2">
              <select
                value={wakeHour}
                onChange={(e) => setWakeHour(Number(e.target.value))}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono-numbers"
              >
                {[4, 5, 6, 7, 8, 9, 10].map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
              <span>:</span>
              <select
                value={wakeMinute}
                onChange={(e) => setWakeMinute(Number(e.target.value))}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono-numbers"
              >
                {[0, 15, 30, 45].map((m) => (
                  <option key={m} value={m}>{m === 0 ? '00' : m}</option>
                ))}
              </select>
              <button
                onClick={() => setWakePeriod(wakePeriod === 'AM' ? 'PM' : 'AM')}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold"
              >
                {wakePeriod}
              </button>
            </div>

            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                {language === 'ta' ? 'பரிந்துரைக்கப்படும் படுக்கை நேரங்கள்:' : 'Recommended Bedtimes (to wake refreshed):'}
              </span>
              <div className="grid grid-cols-3 gap-2">
                {bedtimes.map((b, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl border text-center ${
                      idx === 0
                        ? 'bg-indigo-50/70 border-indigo-200 text-indigo-950 font-semibold'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <span className="font-mono-numbers text-xs font-bold block">{b.time}</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">{b.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Curated Health Tips Grid */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-slate-900">
          {language === 'ta' ? 'ஆராய்ச்சி அடிப்படையிலான நல ஆலோசனைகள்' : 'Evidence-Based Wellness Bulletins'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTips.map((tip) => (
            <div
              key={tip.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3 hover:border-teal-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-800 bg-teal-50 border border-teal-100 px-2 py-0.5 rounded capitalize">
                  {tip.category}
                </span>
                <span className="text-[11px] text-slate-400">Clinical Evidence</span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {language === 'ta' ? tip.titleTa : tip.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {language === 'ta' ? tip.summaryTa : tip.summary}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 space-y-1">
                <span className="font-bold text-slate-900 block">
                  {language === 'ta' ? 'செயல்முறை பரிந்துரை:' : 'Actionable Habit:'}
                </span>
                <p>{language === 'ta' ? tip.practicalActionTa : tip.practicalAction}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>{tip.evidenceBase}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

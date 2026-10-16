import React, { useState } from 'react';
import {
  Droplets,
  Moon,
  Activity,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Plus,
  HelpCircle,
  AlertCircle,
  Heart,
  Shield,
  Smile,
} from 'lucide-react';
import { HealthTrackerData, Language, NavigationTab, Theme, DayTrend, ChatMessage } from '../types/index.ts';
import { HEALTH_TIPS, DEFAULT_WEEKLY_TRENDS } from '../data/healthData.ts';
import { WeeklyTrendsChart } from './WeeklyTrendsChart.tsx';

interface DashboardViewProps {
  trackerData: HealthTrackerData;
  onUpdateTracker: (updater: (prev: HealthTrackerData) => HealthTrackerData) => void;
  language: Language;
  theme: Theme;
  onNavigate: (tab: NavigationTab) => void;
  messages?: ChatMessage[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  trackerData,
  onUpdateTracker,
  language,
  theme,
  onNavigate,
  messages = [],
}) => {
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  // Compute live 7-day trend with today's dynamic logs
  const weeklyTrendData: DayTrend[] = [
    ...DEFAULT_WEEKLY_TRENDS.slice(0, 6),
    {
      day: 'Today',
      dayTa: 'இன்று',
      waterMl: trackerData.waterMl,
      waterGoal: trackerData.waterGoalMl,
      sleepHours: trackerData.sleepHours,
      sleepGoal: 8.0,
      exerciseMinutes: trackerData.exerciseMinutes,
    },
  ];

  // Toggle habit item
  const handleToggleHabit = (id: string) => {
    onUpdateTracker((prev) => ({
      ...prev,
      checklist: prev.checklist.map((h) =>
        h.id === id ? { ...h, done: !h.done } : h
      ),
    }));
  };

  // Add water
  const handleAddWater = (amount: number) => {
    onUpdateTracker((prev) => ({
      ...prev,
      waterMl: Math.max(0, Math.min(6000, prev.waterMl + amount)),
    }));
  };

  // Reset water
  const handleResetWater = () => {
    onUpdateTracker((prev) => ({
      ...prev,
      waterMl: 0,
    }));
  };

  // Update sleep
  const handleUpdateSleep = (delta: number) => {
    onUpdateTracker((prev) => ({
      ...prev,
      sleepHours: Math.max(0, Math.min(16, Number((prev.sleepHours + delta).toFixed(1)))),
    }));
  };

  // Update exercise
  const handleAddExercise = (mins: number) => {
    onUpdateTracker((prev) => ({
      ...prev,
      exerciseMinutes: Math.max(0, Math.min(300, prev.exerciseMinutes + mins)),
    }));
  };

  // Request AI Wellness Feedback
  const handleFetchAiFeedback = async () => {
    setIsLoadingFeedback(true);
    setFeedbackError(null);
    try {
      const completedHabits = trackerData.checklist.filter((h) => h.done).length;
      const res = await fetch('/api/wellness-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          waterMl: trackerData.waterMl,
          waterGoalMl: trackerData.waterGoalMl,
          sleepHours: trackerData.sleepHours,
          sleepQuality: trackerData.sleepQuality,
          exerciseMinutes: trackerData.exerciseMinutes,
          exerciseType: trackerData.exerciseType,
          completedHabitsCount: completedHabits,
          totalHabitsCount: trackerData.checklist.length,
          language: language,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to retrieve feedback from Health AI.');
      }

      const data = await res.json();
      setAiFeedback(data.feedback);
    } catch (err: any) {
      setFeedbackError(err.message || 'Unable to connect to AI Wellness Coach.');
    } finally {
      setIsLoadingFeedback(false);
    }
  };

  const completedHabitsCount = trackerData.checklist.filter((h) => h.done).length;
  const waterPercent = Math.min(100, Math.round((trackerData.waterMl / trackerData.waterGoalMl) * 100));
  const exercisePercent = Math.min(100, Math.round((trackerData.exerciseMinutes / trackerData.exerciseGoalMinutes) * 100));

  return (
    <div className="space-y-6">
      {/* Hero Welcome Card */}
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-1 rounded-md border border-teal-100 dark:border-teal-900/60">
                <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>{language === 'ta' ? 'அறிவார்ந்த நல்வாழ்வு உதவியாளர்' : 'Smart Wellness & Preventive Health'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {language === 'ta'
                  ? 'உங்கள் தினசரி நல்வாழ்வுப் பலகை'
                  : 'Your Daily Health & Wellness Dashboard'}
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                {language === 'ta'
                  ? 'சுய-பதிவு செய்யப்பட்ட ஆரோக்கிய விவரங்களைக் கண்காணிக்கவும், எளிய ஊட்டச்சத்து மற்றும் உடற்பயிற்சி வழிகாட்டல்களைப் பெறவும், பொது நலக் கேள்விகளுக்கு AI உதவியாளரிடம் உரையாடவும்.'
                  : 'Track self-reported wellness habits, explore balanced nutrition insights, and consult our conversational AI assistant for trustworthy, general health education.'}
              </p>
            </div>

            {/* Quick Action Badges */}
            <div className="pt-6 flex flex-wrap gap-2.5 items-center">
              <button
                onClick={() => onNavigate('chat')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
              >
                <span>{language === 'ta' ? 'AI நல உதவியாளரிடம் கேட்க' : 'Ask AI Health Assistant'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigate('nutrition')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-lg transition-colors"
              >
                <span>{language === 'ta' ? 'ஊட்டச்சத்து வழிகாட்டி' : 'Explore Nutrition'}</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative min-h-[220px] bg-slate-100 dark:bg-slate-800">
            <img
              src="/src/assets/images/health_dashboard_hero_1792151410720.jpg"
              alt="Health and wellness journal with water and stethoscope"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent lg:hidden" />
          </div>
        </div>
      </div>

      {/* User-Entered Data Notice Banner */}
      <div className="flex items-center justify-between gap-3 p-3 bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-xl text-amber-900 dark:text-amber-200 text-xs">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>
            {language === 'ta'
              ? 'முக்கிய குறிப்பு: இங்குள்ள நீர், தூக்கம் மற்றும் உடற்பயிற்சி தகவல்கள் அனைத்தும் பயனர் உள்ளீடு செய்தவை மட்டுமே.'
              : 'Transparency Notice: All tracker statistics below represent user-entered self-reported information.'}
          </span>
        </div>
        <span className="text-[11px] font-medium text-amber-700 dark:text-amber-300 shrink-0 hidden sm:inline">
          {language === 'ta' ? 'தனிப்பட்ட நல்வாழ்வுப் பதிவு' : 'Self-Reported Log'}
        </span>
      </div>

      {/* 3 Core Trackers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Tracker 1: Hydration */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xs space-y-4 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 flex items-center justify-center">
                <Droplets className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {language === 'ta' ? 'நீர்ச்சத்து கண்காணிப்பு' : 'Daily Hydration'}
                </h3>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {language === 'ta' ? 'பயனர் பதிவு' : 'User-entered'}
                </span>
              </div>
            </div>
            <button
              onClick={handleResetWater}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Reset Water Log"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold font-mono-numbers text-slate-900 dark:text-white">
                {trackerData.waterMl}
                <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-1">ml</span>
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono-numbers">
                {language === 'ta' ? 'இலக்கு: ' : 'Goal: '}
                {trackerData.waterGoalMl} ml ({waterPercent}%)
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sky-500 to-teal-500 rounded-full transition-all duration-300"
                style={{ width: `${waterPercent}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => handleAddWater(250)}
              className="px-2.5 py-1.5 bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-900/50 border border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-300 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+250 ml</span>
            </button>
            <button
              onClick={() => handleAddWater(500)}
              className="px-2.5 py-1.5 bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-900/50 border border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-300 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+500 ml</span>
            </button>
          </div>
        </div>

        {/* Tracker 2: Sleep Duration & Quality */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xs space-y-4 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <Moon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {language === 'ta' ? 'தூக்க நேரம் & தரம்' : 'Rest & Sleep Log'}
                </h3>
                <span className="text-[11px] text-slate-500">
                  {language === 'ta' ? 'பயனர் பதிவு' : 'User-entered'}
                </span>
              </div>
            </div>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 capitalize">
              {trackerData.sleepQuality}
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold font-mono-numbers text-slate-900 dark:text-white">
                {trackerData.sleepHours}
                <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-1">
                  {language === 'ta' ? 'மணி' : 'hours'}
                </span>
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {trackerData.sleepHours >= 7 && trackerData.sleepHours <= 9
                  ? (language === 'ta' ? 'உகந்த தூக்கம் (7-9 மணி)' : 'Optimal Rest Window')
                  : (language === 'ta' ? 'பரிந்துரை: 7-9 மணி' : 'Target: 7–9 hrs')}
              </span>
            </div>
            <div className="flex gap-1.5">
              {(['restful', 'average', 'interrupted'] as const).map((q) => (
                <button
                  key={q}
                  onClick={() => onUpdateTracker((p) => ({ ...p, sleepQuality: q }))}
                  className={`flex-1 py-1 rounded text-[11px] font-medium border transition-colors capitalize ${
                    trackerData.sleepQuality === q
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
              {language === 'ta' ? 'நேரம் மாற்று:' : 'Adjust hours:'}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleUpdateSleep(-0.5)}
                className="w-7 h-7 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-md font-bold text-xs"
              >
                -0.5
              </button>
              <button
                onClick={() => handleUpdateSleep(0.5)}
                className="w-7 h-7 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-md font-bold text-xs"
              >
                +0.5
              </button>
            </div>
          </div>
        </div>

        {/* Tracker 3: Physical Activity */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xs space-y-4 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {language === 'ta' ? 'உடற்பயிற்சி நிமிடங்கள்' : 'Physical Activity'}
                </h3>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {language === 'ta' ? 'பயனர் பதிவு' : 'User-entered'}
                </span>
              </div>
            </div>
            <span className="text-[11px] text-emerald-800 dark:text-emerald-300 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
              {trackerData.exerciseType}
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold font-mono-numbers text-slate-900 dark:text-white">
                {trackerData.exerciseMinutes}
                <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-1">
                  {language === 'ta' ? 'நிமிடம்' : 'mins'}
                </span>
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono-numbers">
                {language === 'ta' ? 'இலக்கு: ' : 'Goal: '}
                {trackerData.exerciseGoalMinutes}m ({exercisePercent}%)
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-300"
                style={{ width: `${exercisePercent}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1.5 pt-1">
            <button
              onClick={() => handleAddExercise(10)}
              className="px-2 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-lg text-xs font-medium transition-colors"
            >
              +10m
            </button>
            <button
              onClick={() => handleAddExercise(20)}
              className="px-2 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-lg text-xs font-medium transition-colors"
            >
              +20m
            </button>
            <button
              onClick={() => handleAddExercise(30)}
              className="px-2 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-lg text-xs font-medium transition-colors"
            >
              +30m
            </button>
          </div>
        </div>
      </div>

      {/* Weekly Trends Chart (Recharts) */}
      <WeeklyTrendsChart
        data={weeklyTrendData}
        theme={theme}
        language={language}
      />

      {/* Wellness Checklist & AI Coach Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Checklist */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xs space-y-4 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {language === 'ta' ? 'தினசரி நல்வாழ்வு சரிபார்ப்புப் பட்டியல்' : 'Daily Wellness Checklist'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {completedHabitsCount} of {trackerData.checklist.length} {language === 'ta' ? 'பழக்கங்கள் முடிக்கப்பட்டது' : 'habits completed today'}
              </p>
            </div>
            <span className="text-xs font-mono-numbers font-semibold text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-1 rounded-md border border-teal-100 dark:border-teal-900/60">
              {Math.round((completedHabitsCount / trackerData.checklist.length) * 100)}%
            </span>
          </div>

          <div className="space-y-2">
            {trackerData.checklist.map((habit) => (
              <button
                key={habit.id}
                onClick={() => handleToggleHabit(habit.id)}
                className={`w-full text-left flex items-start gap-3 p-3 rounded-xl border transition-all ${
                  habit.done
                    ? 'bg-teal-50/50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800/80 text-teal-950 dark:text-teal-200'
                    : 'bg-slate-50/60 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className={`mt-0.5 rounded-full transition-colors ${habit.done ? 'text-teal-600 dark:text-teal-400' : 'text-slate-300 dark:text-slate-600'}`}>
                  <CheckCircle2 className="w-5 h-5 fill-current" />
                </div>
                <span className={`text-xs font-medium leading-relaxed ${habit.done ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200'}`}>
                  {language === 'ta' ? habit.labelTa : habit.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* AI Wellness Coach Feedback Card */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xs flex flex-col justify-between transition-colors">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {language === 'ta' ? 'AI நல்வாழ்வு ஆய்வறிக்கை' : 'AI Daily Wellness Reflection'}
                </h2>
              </div>
              <button
                onClick={handleFetchAiFeedback}
                disabled={isLoadingFeedback}
                className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                {isLoadingFeedback ? (
                  <span>{language === 'ta' ? 'கணிக்கிறது...' : 'Analyzing...'}</span>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3" />
                    <span>{language === 'ta' ? 'ஆய்வு செய்' : 'Generate Summary'}</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {language === 'ta'
                ? 'உங்கள் சுய-பதிவுத் தகவல்களை அடிப்படையாகக் கொண்டு ஊக்கமளிக்கும் ஆரோக்கிய ஆலோசனைகளைப் பெறவும்.'
                : 'Get personalized, encouraging wellness feedback based on your self-reported logs for today.'}
            </p>

            {feedbackError && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{feedbackError}</span>
              </div>
            )}

            {isLoadingFeedback && (
              <div className="p-6 text-center space-y-2">
                <div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {language === 'ta' ? 'நல்வாழ்வுத் தகவல்கள் கணக்கிடப்படுகின்றன...' : 'Reviewing your daily wellness logs with Gemini...'}
                </p>
              </div>
            )}

            {!isLoadingFeedback && aiFeedback && (
              <div className="p-4 bg-teal-50/60 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/80 rounded-xl text-slate-800 dark:text-slate-200 text-xs leading-relaxed space-y-2 max-h-[220px] overflow-y-auto">
                <div className="font-semibold text-teal-950 dark:text-teal-200 flex items-center gap-1.5">
                  <Smile className="w-4 h-4 text-teal-700 dark:text-teal-400" />
                  <span>{language === 'ta' ? 'இன்றைய நல்வாழ்வுப் பார்வை:' : 'Today’s Wellness Reflection:'}</span>
                </div>
                <div className="whitespace-pre-wrap text-slate-700 dark:text-slate-300">{aiFeedback}</div>
              </div>
            )}

            {!isLoadingFeedback && !aiFeedback && !feedbackError && (
              <div className="p-5 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-center text-xs text-slate-500 dark:text-slate-400 space-y-2">
                <Heart className="w-6 h-6 text-slate-300 dark:text-slate-600 mx-auto" />
                <p>
                  {language === 'ta'
                    ? 'இன்றைய நீர், தூக்கம் மற்றும் உடற்பயிற்சி பதிவுகளின் சுருக்கத்தைப் பெற "ஆய்வு செய்" பொத்தானை அழுத்தவும்.'
                    : 'Click "Generate Summary" to get evidence-informed feedback on your logged water, sleep, and activity.'}
                </p>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>{language === 'ta' ? 'அறிவியல் அடிப்படையிலான பொது ஆலோசனை' : 'Evidence-grounded general guidelines'}</span>
            <span className="font-mono-numbers">Gemini 3.5 Flash</span>
          </div>
        </div>
      </div>

      {/* Live AI Health Chat Conversation Preview Bridge */}
      <div className="bg-gradient-to-r from-teal-500/10 via-sky-500/10 to-emerald-500/10 dark:from-teal-950/40 dark:via-sky-950/30 dark:to-emerald-950/40 rounded-2xl border border-teal-200 dark:border-teal-800/80 p-5 sm:p-6 shadow-2xs space-y-4 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {language === 'ta' ? 'AI நல உரையாடல் (நேரலை)' : 'AI Health Assistant Chat'}
                </h2>
                <span className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                  {messages.length} {messages.length === 1 ? 'message' : 'messages'}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {language === 'ta'
                  ? 'Gemini AI மற்றும் குரல் உள்ளீடு (Voice Input) மூலம் இயங்கும் உரையாடல்'
                  : 'Powered by Gemini AI with real-time Speech Recognition & Voice Input'}
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('chat')}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors self-start sm:self-auto"
          >
            <span>{language === 'ta' ? 'முழு உரையாடலைத் திற' : 'Open Full Chat & Voice'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Latest message snippet */}
        {messages.length > 0 && (
          <div className="bg-white/80 dark:bg-slate-900/80 rounded-xl border border-teal-100 dark:border-teal-900/60 p-4 text-xs space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-teal-800 dark:text-teal-300 uppercase tracking-wide">
                {messages[messages.length - 1].role === 'user' ? 'You asked:' : 'AI Health Assistant answered:'}
              </span>
              <span className="font-mono-numbers">{messages[messages.length - 1].timestamp}</span>
            </div>
            <p className="text-slate-800 dark:text-slate-200 line-clamp-3 leading-relaxed font-normal">
              {messages[messages.length - 1].content.replace(/[*#]/g, '')}
            </p>
          </div>
        )}
      </div>

      {/* Daily Curated Health Tip Showcase */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xs space-y-3 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              {language === 'ta' ? 'இன்றைய நல்வாழ்வு பரிந்துரை' : 'Featured Daily Wellness Insight'}
            </h2>
          </div>
          <button
            onClick={() => onNavigate('tips')}
            className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:text-teal-900 dark:hover:text-teal-200 flex items-center gap-1"
          >
            <span>{language === 'ta' ? 'அனைத்து குறிப்புகளும்' : 'View All Tips'}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80 text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 dark:text-white text-sm">
              {language === 'ta' ? HEALTH_TIPS[0].titleTa : HEALTH_TIPS[0].title}
            </span>
            <span className="text-[11px] text-teal-700 dark:text-teal-300 font-semibold bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 px-2 py-0.5 rounded">
              Hydration
            </span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            {language === 'ta' ? HEALTH_TIPS[0].summaryTa : HEALTH_TIPS[0].summary}
          </p>
          <div className="pt-2 flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[11px]">
            <span className="font-medium text-slate-700 dark:text-slate-300">Source:</span>
            <span>{HEALTH_TIPS[0].evidenceBase}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

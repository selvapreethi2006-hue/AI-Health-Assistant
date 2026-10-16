import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Area,
  AreaChart,
} from 'recharts';
import { DayTrend, Language, Theme } from '../types/index.ts';
import { Droplets, Moon, TrendingUp, Info } from 'lucide-react';

interface WeeklyTrendsChartProps {
  data: DayTrend[];
  theme: Theme;
  language: Language;
}

export const WeeklyTrendsChart: React.FC<WeeklyTrendsChartProps> = ({
  data,
  theme,
  language,
}) => {
  const [chartView, setChartView] = useState<'combined' | 'water' | 'sleep'>('combined');

  const isDark = theme === 'dark';

  // Calculate weekly averages
  const avgWater = Math.round(data.reduce((acc, d) => acc + d.waterMl, 0) / data.length);
  const avgSleep = (data.reduce((acc, d) => acc + d.sleepHours, 0) / data.length).toFixed(1);

  // Styling tokens based on theme
  const strokeGrid = isDark ? '#334155' : '#e2e8f0';
  const textMuted = isDark ? '#94a3b8' : '#64748b';
  const tooltipBg = isDark ? '#0f172a' : '#ffffff';
  const tooltipBorder = isDark ? '#1e293b' : '#e2e8f0';
  const tooltipText = isDark ? '#f8fafc' : '#0f172a';

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dayData = data.find((d) => d.day === label);
      const displayLabel = language === 'ta' && dayData ? dayData.dayTa : label;

      return (
        <div
          style={{
            backgroundColor: tooltipBg,
            borderColor: tooltipBorder,
            color: tooltipText,
          }}
          className="p-3 rounded-xl border shadow-lg text-xs space-y-1.5"
        >
          <div className="font-bold border-b border-slate-200 dark:border-slate-800 pb-1 flex items-center justify-between gap-3">
            <span>{displayLabel}</span>
            <span className="text-[10px] text-slate-400 font-normal">
              {language === 'ta' ? 'பதிவு' : 'Logged'}
            </span>
          </div>

          {(chartView === 'combined' || chartView === 'water') && (
            <div className="flex items-center justify-between gap-4 text-sky-600 dark:text-sky-400 font-medium">
              <span className="flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5" />
                <span>{language === 'ta' ? 'நீர்ச்சத்து:' : 'Water:'}</span>
              </span>
              <span className="font-mono-numbers font-bold">
                {payload.find((p: any) => p.dataKey === 'waterMl')?.value ?? 0} ml
              </span>
            </div>
          )}

          {(chartView === 'combined' || chartView === 'sleep') && (
            <div className="flex items-center justify-between gap-4 text-indigo-600 dark:text-indigo-400 font-medium">
              <span className="flex items-center gap-1">
                <Moon className="w-3.5 h-3.5" />
                <span>{language === 'ta' ? 'தூக்கம்:' : 'Sleep:'}</span>
              </span>
              <span className="font-mono-numbers font-bold">
                {payload.find((p: any) => p.dataKey === 'sleepHours')?.value ?? 0} hrs
              </span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-2xs space-y-5 transition-colors">
      {/* Header & View Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {language === 'ta'
                ? 'வாராந்திர நீர் & தூக்கப் போக்குகள்'
                : 'Weekly Water & Sleep Trends'}
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {language === 'ta'
              ? 'பயனர் பதிவு செய்த 7 நாள் நல்வாழ்வு தரவு விளக்கப்படம்'
              : 'Interactive 7-day visualization of self-reported lifestyle logs'}
          </p>
        </div>

        {/* Segmented Chart View Selector */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/60 self-start sm:self-auto">
          <button
            onClick={() => setChartView('combined')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              chartView === 'combined'
                ? 'bg-white dark:bg-slate-900 text-teal-900 dark:text-teal-300 shadow-2xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {language === 'ta' ? 'இரண்டும்' : 'Combined'}
          </button>
          <button
            onClick={() => setChartView('water')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1 ${
              chartView === 'water'
                ? 'bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-300 shadow-2xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Droplets className="w-3 h-3 text-sky-500" />
            <span>{language === 'ta' ? 'நீர்' : 'Water'}</span>
          </button>
          <button
            onClick={() => setChartView('sleep')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1 ${
              chartView === 'sleep'
                ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 shadow-2xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Moon className="w-3 h-3 text-indigo-500" />
            <span>{language === 'ta' ? 'தூக்கம்' : 'Sleep'}</span>
          </button>
        </div>
      </div>

      {/* Metric Highlights Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-sky-50/60 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/50">
          <span className="text-[11px] text-sky-800 dark:text-sky-300 font-medium block">
            {language === 'ta' ? 'வார சராசரி நீர்' : '7-Day Avg Water'}
          </span>
          <span className="font-mono-numbers text-lg font-bold text-slate-900 dark:text-white block mt-0.5">
            {avgWater} <span className="text-xs font-normal text-slate-500">ml/day</span>
          </span>
        </div>

        <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50">
          <span className="text-[11px] text-indigo-800 dark:text-indigo-300 font-medium block">
            {language === 'ta' ? 'வார சராசரி தூக்கம்' : '7-Day Avg Sleep'}
          </span>
          <span className="font-mono-numbers text-lg font-bold text-slate-900 dark:text-white block mt-0.5">
            {avgSleep} <span className="text-xs font-normal text-slate-500">hrs/night</span>
          </span>
        </div>

        <div className="p-3 rounded-xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-900/50">
          <span className="text-[11px] text-teal-800 dark:text-teal-300 font-medium block">
            {language === 'ta' ? 'தினசரி நீர் இலக்கு' : 'Water Target'}
          </span>
          <span className="font-mono-numbers text-lg font-bold text-slate-900 dark:text-white block mt-0.5">
            2,500 <span className="text-xs font-normal text-slate-500">ml</span>
          </span>
        </div>

        <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50">
          <span className="text-[11px] text-emerald-800 dark:text-emerald-300 font-medium block">
            {language === 'ta' ? 'உகந்த தூக்க வரம்பு' : 'Sleep Target'}
          </span>
          <span className="font-mono-numbers text-lg font-bold text-slate-900 dark:text-white block mt-0.5">
            7.0 – 9.0 <span className="text-xs font-normal text-slate-500">hrs</span>
          </span>
        </div>
      </div>

      {/* Main Recharts Area */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {chartView === 'water' ? (
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={strokeGrid} vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fill: textMuted, fontSize: 11 }}
                axisLine={{ stroke: strokeGrid }}
                tickLine={false}
              />
              <YAxis
                domain={[0, 3200]}
                tick={{ fill: textMuted, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine
                y={2500}
                stroke="#0284c7"
                strokeDasharray="4 4"
                label={{
                  value: 'Goal: 2500ml',
                  fill: '#0284c7',
                  fontSize: 10,
                  position: 'insideTopRight',
                }}
              />
              <Area
                type="monotone"
                dataKey="waterMl"
                name={language === 'ta' ? 'நீர் (ml)' : 'Water (ml)'}
                stroke="#0284c7"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#waterGradient)"
                activeDot={{ r: 6, fill: '#0284c7', stroke: isDark ? '#0f172a' : '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          ) : chartView === 'sleep' ? (
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="sleepGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={strokeGrid} vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fill: textMuted, fontSize: 11 }}
                axisLine={{ stroke: strokeGrid }}
                tickLine={false}
              />
              <YAxis
                domain={[4, 11]}
                tick={{ fill: textMuted, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine
                y={8.0}
                stroke="#4f46e5"
                strokeDasharray="4 4"
                label={{
                  value: 'Target: 8h',
                  fill: '#4f46e5',
                  fontSize: 10,
                  position: 'insideTopRight',
                }}
              />
              <Area
                type="monotone"
                dataKey="sleepHours"
                name={language === 'ta' ? 'தூக்கம் (மணி)' : 'Sleep (hrs)'}
                stroke="#4f46e5"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#sleepGradient)"
                activeDot={{ r: 6, fill: '#4f46e5', stroke: isDark ? '#0f172a' : '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          ) : (
            <LineChart data={data} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={strokeGrid} vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fill: textMuted, fontSize: 11 }}
                axisLine={{ stroke: strokeGrid }}
                tickLine={false}
              />
              {/* Left Y Axis for Water (ml) */}
              <YAxis
                yAxisId="left"
                domain={[0, 3200]}
                tick={{ fill: '#0ea5e9', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              {/* Right Y Axis for Sleep (hours) */}
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[4, 11]}
                tick={{ fill: '#6366f1', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 11, paddingTop: 10 }}
                formatter={(value) => (
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    {value}
                  </span>
                )}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="waterMl"
                name={language === 'ta' ? 'நீர்ச்சத்து (ml)' : 'Water Intake (ml)'}
                stroke="#0ea5e9"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#0ea5e9' }}
                activeDot={{ r: 6, fill: '#0284c7' }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="sleepHours"
                name={language === 'ta' ? 'தூக்கம் (மணி)' : 'Sleep Duration (hrs)'}
                stroke="#6366f1"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#6366f1' }}
                activeDot={{ r: 6, fill: '#4f46e5' }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* User-entered metadata note */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>
            {language === 'ta'
              ? 'அனைத்து அளவுகளும் பயனரால் உள்ளீடு செய்யப்பட்ட ஆரோக்கிய விவரங்கள்.'
              : 'All plotted metrics represent user-entered personal lifestyle recordings.'}
          </span>
        </div>
        <span className="font-mono-numbers">Recharts v2</span>
      </div>
    </div>
  );
};

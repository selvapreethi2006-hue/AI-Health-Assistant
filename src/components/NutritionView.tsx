import React, { useState } from 'react';
import {
  Utensils,
  Leaf,
  Beef,
  Sparkles,
  Search,
  CheckCircle2,
  AlertCircle,
  Apple,
  Info,
  ShieldAlert,
} from 'lucide-react';
import { Language, NutritionAnalysisResult } from '../types/index.ts';

interface NutritionViewProps {
  language: Language;
}

const PRESET_MEALS: { labelEn: string; labelTa: string; query: string; pref: 'vegetarian' | 'non-vegetarian' | 'vegan' }[] = [
  {
    labelEn: 'Lentil Dhal & Brown Rice with Greens',
    labelTa: 'பருப்பு சாதம் & கீரை பொரியல்',
    query: 'Lentil dhal with brown basmati rice, spinach stir fry, and cucumber salad',
    pref: 'vegetarian',
  },
  {
    labelEn: 'South Indian Idli with Sambar & Chutney',
    labelTa: 'இட்லி, சாம்பார் மற்றும் புதினா சட்னி',
    query: 'Steamed fermented rice-lentil idlis with vegetable sambar and mint chutney',
    pref: 'vegetarian',
  },
  {
    labelEn: 'Grilled Salmon with Quinoa & Asparagus',
    labelTa: 'கிரில் செய்யப்பட்ட சால்மன் & கினோவா',
    query: 'Grilled salmon fillet with seasoned quinoa, steamed asparagus, and extra virgin olive oil',
    pref: 'non-vegetarian',
  },
  {
    labelEn: 'Chickpea & Avocado Mediterranean Bowl',
    labelTa: 'கொண்டைக்கடலை & அவகேடோ சாலட்',
    query: 'Spiced roasted chickpeas, sliced avocado, baby spinach, cherry tomatoes, and tahini dressing',
    pref: 'vegan',
  },
];

export const NutritionView: React.FC<NutritionViewProps> = ({ language }) => {
  const [preference, setPreference] = useState<'all' | 'vegetarian' | 'non-vegetarian' | 'vegan'>('all');
  const [goal, setGoal] = useState<'balanced' | 'energy' | 'muscle' | 'heart' | 'gut'>('balanced');
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<NutritionAnalysisResult | null>({
    title: 'Balanced Mediterranean Plate with Avocado, Chickpeas & Greens',
    summary:
      'A dense, whole-food meal providing complete plant proteins, heart-healthy monounsaturated fats from avocado and nuts, and complex dietary fiber that stabilizes post-prandial glucose levels.',
    isVegetarianFriendly: true,
    macronutrients: {
      protein: '~22g (roasted chickpeas, seeds & nuts)',
      carbohydrates: '~44g (complex dietary fiber & slow-burning carbs)',
      healthyFats: '~18g (avocado & cold-pressed oil)',
      fiber: '~12g (leafy greens, legumes & raw veggies)',
    },
    keyMicronutrients: [
      {
        nutrient: 'Dietary Fiber',
        benefit: 'Feeds microbiome, lowers LDL cholesterol, and promotes satiety',
        foodSources: 'Chickpeas, chia seeds, dark leafy greens',
      },
      {
        nutrient: 'Monounsaturated Fatty Acids',
        benefit: 'Supports arterial flexibility and fat-soluble vitamin absorption (A, D, E, K)',
        foodSources: 'Hass avocado, extra virgin olive oil, walnuts',
      },
      {
        nutrient: 'Plant Iron & Vitamin C',
        benefit: 'Vitamin C in lemon and peppers triples non-heme iron absorption',
        foodSources: 'Spinach paired with fresh lemon squeeze',
      },
    ],
    healthyTips: [
      'Pair plant-based iron sources (greens, lentils) with Vitamin C (citrus, tomatoes) for optimal absorption.',
      'Chew slowly and hydrate 30 minutes before or after meals to support natural gastric enzymes.',
      'Aim to eat at least 3 distinct vegetable colors daily to acquire varied polyphenols.',
    ],
    caution: 'Avoid extreme single-food cleanses or zero-carb deprivations. Whole balanced plates foster sustainable cardiometabolic health.',
  });

  const handleAnalyze = async (searchQuery?: string) => {
    const q = searchQuery || query;
    if (!q.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/nutrition-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          preference,
          goal,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to analyze nutrition.');
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Error connecting to nutrition educator.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Image */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs transition-colors">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-1 rounded-md border border-teal-100 dark:border-teal-900/60">
                <Utensils className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>{language === 'ta' ? 'அறிவியல் பூர்வமான ஊட்டச்சத்து' : 'Evidence-Based Nutrition Guide'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {language === 'ta' ? 'ஊட்டச்சத்து & சரிவிகித உணவு' : 'Nourish Your Body With Balanced Food'}
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                {language === 'ta'
                  ? 'தீவிர உணவுக்கட்டுப்பாடுகளைத் தவிர்த்து, முழு தானியங்கள், காய்கறிகள், புரதம் மற்றும் நல்ல கொழுப்புகள் நிறைந்த சமச்சீர் உணவை அறிந்துகொள்ளுங்கள். சைவம் மற்றும் அசைவ உணவு முறைகள் இரண்டிற்கும் ஏற்ற ஆலோசனைகள்.'
                  : 'Reject extreme fad diets and unsustainable cleanses. Learn how balanced proteins, dietary fiber, vitamins, and minerals come together to fuel lasting human vitality.'}
              </p>
            </div>

            {/* Quick Preference Tabs */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="font-semibold text-slate-500 dark:text-slate-400 mr-1">
                {language === 'ta' ? 'உணவு முறை:' : 'Preference:'}
              </span>
              <button
                onClick={() => setPreference('all')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  preference === 'all'
                    ? 'bg-teal-600 text-white font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {language === 'ta' ? 'அனைத்தும்' : 'All Diets'}
              </button>
              <button
                onClick={() => setPreference('vegetarian')}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  preference === 'vegetarian'
                    ? 'bg-teal-600 text-white font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <Leaf className="w-3.5 h-3.5" />
                <span>{language === 'ta' ? 'சைவம் (Veg)' : 'Vegetarian'}</span>
              </button>
              <button
                onClick={() => setPreference('non-vegetarian')}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  preference === 'non-vegetarian'
                    ? 'bg-teal-600 text-white font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <Beef className="w-3.5 h-3.5" />
                <span>{language === 'ta' ? 'அசைவம் (Non-Veg)' : 'Non-Vegetarian'}</span>
              </button>
              <button
                onClick={() => setPreference('vegan')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  preference === 'vegan'
                    ? 'bg-teal-600 text-white font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>{language === 'ta' ? 'முற்றிலும் தாவர உணவு (Vegan)' : 'Vegan'}</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative min-h-[220px] bg-slate-100 dark:bg-slate-800">
            <img
              src="/src/assets/images/nutrition_fresh_plate_1792151412442.jpg"
              alt="Healthy colorful balanced Mediterranean meal plate with avocado, greens, roasted chickpeas"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Interactive AI Nutrition Analyzer Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xs space-y-3 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              {language === 'ta' ? 'AI உணவு & சத்து பகுப்பாய்வி' : 'AI Nutrition & Meal Assessment'}
            </h2>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {language === 'ta' ? 'இயற்கை மொழி ஆய்வு' : 'Nutritional breakdown via Gemini'}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
              placeholder={
                language === 'ta'
                  ? 'உதாரணம்: கொண்டைக்கடலை சாலட், இட்லி சாம்பார் அல்லது கிரில் சிக்கன்...'
                  : 'Enter a meal or food combination (e.g., Tofu stir fry with quinoa, Brown rice with dhal)...'
              }
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:bg-white dark:focus:bg-slate-800"
            />
          </div>
          <button
            onClick={() => handleAnalyze()}
            disabled={isLoading || !query.trim()}
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs shrink-0"
          >
            {isLoading ? (
              <span>{language === 'ta' ? 'ஆராய்கிறது...' : 'Analyzing...'}</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{language === 'ta' ? 'சத்துக்களை அறிய' : 'Analyze Nutrition'}</span>
              </>
            )}
          </button>
        </div>

        {/* Preset Meal Quick Buttons */}
        <div className="pt-1 flex flex-wrap gap-1.5 items-center">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mr-1">
            {language === 'ta' ? 'உதாரண உணவுகள்:' : 'Popular examples:'}
          </span>
          {PRESET_MEALS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(preset.query);
                setPreference(preset.pref);
                handleAnalyze(preset.query);
              }}
              className="text-[11px] bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-slate-700 hover:text-teal-900 dark:hover:text-teal-300 hover:border-teal-200 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-md transition-colors"
            >
              {language === 'ta' ? preset.labelTa : preset.labelEn}
            </button>
          ))}
        </div>

        {error && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Analysis Result Display */}
      {result && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xs space-y-6 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{result.title}</h3>
                {result.isVegetarianFriendly && (
                  <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded">
                    Veg Friendly
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{result.summary}</p>
            </div>
            <span className="text-[11px] text-slate-400 self-start sm:self-auto shrink-0 font-mono-numbers">
              Nutrient Profile
            </span>
          </div>

          {/* Macronutrients Grid */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              {language === 'ta' ? 'முதன்மை ஊட்டச்சத்துக்கள் (Macronutrients)' : 'Macronutrient Distribution'}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-teal-50/50 border border-teal-100">
                <span className="text-xs text-teal-800 font-semibold block">Protein (புரதம்)</span>
                <span className="font-mono-numbers text-sm font-bold text-slate-900 block mt-1">
                  {result.macronutrients.protein}
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">Cellular repair & muscle</span>
              </div>
              <div className="p-3.5 rounded-xl bg-sky-50/50 border border-sky-100">
                <span className="text-xs text-sky-800 font-semibold block">Complex Carbs (மாவுச்சத்து)</span>
                <span className="font-mono-numbers text-sm font-bold text-slate-900 block mt-1">
                  {result.macronutrients.carbohydrates}
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">Steady brain & body fuel</span>
              </div>
              <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-100">
                <span className="text-xs text-amber-800 font-semibold block">Healthy Fats (கொழுப்பு)</span>
                <span className="font-mono-numbers text-sm font-bold text-slate-900 block mt-1">
                  {result.macronutrients.healthyFats}
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">Hormone balance & brain</span>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100">
                <span className="text-xs text-emerald-800 font-semibold block">Fiber (நார்ச்சத்து)</span>
                <span className="font-mono-numbers text-sm font-bold text-slate-900 block mt-1">
                  {result.macronutrients.fiber}
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">Microbiome & glycemic control</span>
              </div>
            </div>
          </div>

          {/* Micronutrients */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              {language === 'ta' ? 'முக்கிய வைட்டமின்கள் & தாதுக்கள்' : 'Key Vitamins & Minerals'}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {result.keyMicronutrients.map((micro, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="font-bold text-xs text-slate-900">{micro.nutrient}</div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{micro.benefit}</p>
                  <div className="text-[11px] text-teal-700 font-medium pt-1">
                    <span className="text-slate-400">Sources: </span>
                    {micro.foodSources}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Practical Healthy Tips */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              {language === 'ta' ? 'ஆரோக்கிய உணவு நடைமுறைகள்' : 'Actionable Dietary Best Practices'}
            </h4>
            <div className="space-y-1.5">
              {result.healthyTips.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Caution against extremes */}
          {result.caution && (
            <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">{language === 'ta' ? 'அறிவியல் எச்சரிக்கை:' : 'Anti-Fad Guideline:'} </span>
                <span>{result.caution}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* The Balanced Plate Educational Infographic Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            {language === 'ta' ? 'ஆரோக்கியமான உணவுத் தட்டு மாதிரி' : 'The Clinical Balanced Plate Model'}
          </h2>
          <p className="text-xs text-slate-500">
            {language === 'ta'
              ? 'ஹார்வர்ட் பொது சுகாதாரத்துறை மற்றும் உலக சுகாதார அமைப்பு பரிந்துரைக்கும் சரிவிகித உணவு வடிவம்.'
              : 'Endorsed by Harvard T.H. Chan School of Public Health & WHO.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-1">
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-900 text-sm">50% Plate</span>
              <Apple className="w-4 h-4 text-emerald-600" />
            </div>
            <h4 className="text-xs font-bold text-emerald-950">
              {language === 'ta' ? 'காய்கறிகள் & கீரைகள்' : 'Vegetables & Leafy Greens'}
            </h4>
            <p className="text-[11px] text-emerald-800 leading-relaxed">
              Fill half your meal with deep greens, cruciferous broccoli, carrots, and peppers for antioxidant polyphenols.
            </p>
          </div>

          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-900 text-sm">25% Plate</span>
              <Utensils className="w-4 h-4 text-amber-600" />
            </div>
            <h4 className="text-xs font-bold text-amber-950">
              {language === 'ta' ? 'முழு தானியங்கள்' : 'Whole Complex Grains'}
            </h4>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Oats, brown rice, whole wheat, millets (ragi, bajra), or quinoa to ensure sustained glucose release without insulin spikes.
            </p>
          </div>

          <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-teal-900 text-sm">25% Plate</span>
              <Leaf className="w-4 h-4 text-teal-600" />
            </div>
            <h4 className="text-xs font-bold text-teal-950">
              {language === 'ta' ? 'தரமான புரதம்' : 'Quality Healthy Protein'}
            </h4>
            <p className="text-[11px] text-teal-800 leading-relaxed">
              Lentils, beans, tofu, eggs, paneer, or lean fish/poultry. Critical for immune enzymes, neurotransmitters, and cellular repair.
            </p>
          </div>

          <div className="p-4 bg-sky-50/70 border border-sky-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sky-900 text-sm">Essential Dash</span>
              <Info className="w-4 h-4 text-sky-600" />
            </div>
            <h4 className="text-xs font-bold text-sky-950">
              {language === 'ta' ? 'ஆரோக்கிய கொழுப்புகள் & நீர்' : 'Good Fats & Hydration'}
            </h4>
            <p className="text-[11px] text-sky-800 leading-relaxed">
              A light dressing of olive or mustard oil, handful of seeds/nuts, and a tall glass of pure filtered water.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

import { HabitItem, HealthTip, DayTrend } from '../types/index.ts';

export const DEFAULT_WEEKLY_TRENDS: DayTrend[] = [
  { day: 'Mon', dayTa: 'திங்கள்', waterMl: 2100, waterGoal: 2500, sleepHours: 7.2, sleepGoal: 8.0, exerciseMinutes: 25 },
  { day: 'Tue', dayTa: 'செவ்வாய்', waterMl: 2300, waterGoal: 2500, sleepHours: 7.6, sleepGoal: 8.0, exerciseMinutes: 35 },
  { day: 'Wed', dayTa: 'புதன்', waterMl: 1950, waterGoal: 2500, sleepHours: 6.8, sleepGoal: 8.0, exerciseMinutes: 20 },
  { day: 'Thu', dayTa: 'வியாழன்', waterMl: 2400, waterGoal: 2500, sleepHours: 8.0, sleepGoal: 8.0, exerciseMinutes: 40 },
  { day: 'Fri', dayTa: 'வெள்ளி', waterMl: 2250, waterGoal: 2500, sleepHours: 7.0, sleepGoal: 8.0, exerciseMinutes: 30 },
  { day: 'Sat', dayTa: 'சனி', waterMl: 2600, waterGoal: 2500, sleepHours: 8.5, sleepGoal: 8.0, exerciseMinutes: 45 },
  { day: 'Today', dayTa: 'இன்று', waterMl: 1500, waterGoal: 2500, sleepHours: 7.5, sleepGoal: 8.0, exerciseMinutes: 20 },
];

export const INITIAL_HABITS: HabitItem[] = [
  {
    id: 'habit-1',
    label: 'Morning hydration: 1 large glass of water',
    labelTa: 'காலை எழுந்ததுமே ஒரு பெரிய டம்ளர் தண்ணீர் குடித்தல்',
    done: true,
    category: 'water',
  },
  {
    id: 'habit-2',
    label: '30 minutes of brisk movement or walking',
    labelTa: '30 நிமிடங்கள் சுறுசுறுப்பான நடைபயிற்சி அல்லது உடற்பயிற்சி',
    done: false,
    category: 'exercise',
  },
  {
    id: 'habit-3',
    label: 'Eat a colorful plate with fiber and protein',
    labelTa: 'நார்ச்சத்து மற்றும் புரதம் நிறைந்த சத்தான உணவு உட்கொள்ளுதல்',
    done: true,
    category: 'food',
  },
  {
    id: 'habit-4',
    label: '10-minute posture stretch or mindful deep breaths',
    labelTa: '10 நிமிடங்கள் உடல் அசைவு அல்லது ஆழ்ந்த மூச்சுப் பயிற்சி',
    done: false,
    category: 'mind',
  },
  {
    id: 'habit-5',
    label: 'Screen-free relaxation 45 mins before bedtime',
    labelTa: 'தூங்குவதற்கு 45 நிமிடங்களுக்கு முன் திரைப் பயன்பாட்டை தவிர்த்தல்',
    done: false,
    category: 'sleep',
  },
];

export const HEALTH_TIPS: HealthTip[] = [
  {
    id: 'tip-1',
    category: 'hydration',
    title: 'Hydration & Cognitive Clarity',
    titleTa: 'நீர்ச்சத்தும் மூளையின் செயல்திறனும்',
    summary: 'Mild dehydration (even 1-2% body weight loss) can reduce alertness, increase headache frequency, and impair short-term memory.',
    summaryTa: 'உடலில் 1-2% நீர்ச்சத்து குறைவது கூட சோர்வு, தலைவலி மற்றும் கவனக்குறைவை ஏற்படுத்தும்.',
    practicalAction: 'Keep a reusable water bottle near your workspace and take mindful sips every 45 minutes.',
    practicalActionTa: 'உங்கள் மேஜை அருகே தண்ணீர் பாட்டில் வைத்து 45 நிமிடங்களுக்கு ஒருமுறை சிறிது அருந்தவும்.',
    evidenceBase: 'European Journal of Clinical Nutrition & WHO Guidelines',
  },
  {
    id: 'tip-2',
    category: 'sleep',
    title: 'Consistent Circadian Sleep Windows',
    titleTa: 'சீரான தூக்க நேரம் & உயிரியல் கடிகாரம்',
    summary: 'Going to sleep and waking up at the same hour stabilizes your internal circadian clock, facilitating deeper restorative slow-wave sleep.',
    summaryTa: 'தினமும் ஒரே நேரத்தில் தூங்கி எழுவது ஆழ்ந்த தூக்கத்திற்கும் மன அமைதிக்கும் வழிவகுக்கும்.',
    practicalAction: 'Aim for a consistent bedtime within 30 minutes every night, even on weekends.',
    practicalActionTa: 'வார இறுதி நாட்களிலும் கூட 30 நிமிட வித்தியாசத்திற்குள் ஒரே நேரத்தில் தூங்க முயற்சிக்கவும்.',
    evidenceBase: 'Sleep Medicine Reviews & National Sleep Foundation',
  },
  {
    id: 'tip-3',
    category: 'exercise',
    title: 'The 150-Minute Moderate Activity Rule',
    titleTa: 'வாரத்திற்கு 150 நிமிட மிதமான உடற்பயிற்சி',
    summary: 'Achieving 150 minutes of moderate aerobic physical activity weekly lowers cardiovascular risk by up to 30%.',
    summaryTa: 'வாரத்திற்கு 150 நிமிட நடைபயிற்சி இதய நோய்கள் மற்றும் சர்க்கரை நோய் அபாயத்தை வெகுவாகக் குறைக்கும்.',
    practicalAction: 'A brisk 20-30 minute walk 5 days a week fulfills the international clinical benchmark.',
    practicalActionTa: 'வாரத்தில் 5 நாட்கள் தினமும் 20 முதல் 30 நிமிட விறுவிறுப்பான நடைபயிற்சி போதுமானது.',
    evidenceBase: 'AHA & World Health Organization Physical Activity Guidelines',
  },
  {
    id: 'tip-4',
    category: 'nutrition',
    title: 'The 30g Daily Fiber Target',
    titleTa: 'தினசரி 30 கிராம் நார்ச்சத்து தேவை',
    summary: 'Dietary fiber feeds beneficial gut microbiota, regulates blood sugar spikes, and naturally manages LDL cholesterol levels.',
    summaryTa: 'நார்ச்சத்து நிறைந்த உணவுகள் குடல் நலத்தைப் பாதுகாப்பதுடன் இரத்த சர்க்கரை மற்றும் கொழுப்பை சீராக்க உதவும்.',
    practicalAction: 'Incorporate lentils, beans, oats, flaxseed, chia, and seasonal leafy greens daily.',
    practicalActionTa: 'தினசரி உணவில் பருப்பு வகைகள், வெண்டைக்காய், கீரைகள், முழு தானியங்களைச் சேர்க்கவும்.',
    evidenceBase: 'The Lancet Meta-Analysis on Dietary Fibre & Cardiometabolic Health',
  },
  {
    id: 'tip-5',
    category: 'mind',
    title: 'The 4-7-8 Parasympathetic Reset',
    titleTa: 'மன அமைதிக்கான 4-7-8 மூச்சுப் பயிற்சி',
    summary: 'Rhythmic diaphragmatic breathing stimulates the vagus nerve, reducing circulating cortisol and lowering acute stress responses.',
    summaryTa: 'சீராக மூச்சை இழுத்து விடுவது நரம்பு மண்டலத்தை அமைதிப்படுத்தி மன அழுத்த ஹார்மோனைக் குறைக்கிறது.',
    practicalAction: 'Inhale through nose for 4 counts, hold for 7 counts, exhale slowly through mouth for 8 counts. Repeat 4 cycles.',
    practicalActionTa: '4 வினாடிகள் மூச்சை இழுத்து, 7 வினாடிகள் நிறுத்தி, 8 வினாடிகள் மெதுவாக வெளியிடவும். 4 முறை செய்யவும்.',
    evidenceBase: 'Frontiers in Human Neuroscience & Harvard Health',
  },
];

export const EMERGENCY_WARNING_SIGNS = [
  {
    symptom: 'Crushing Chest Pain / Pressure',
    symptomTa: 'மார்பில் கடுமையான வலி அல்லது அழுத்தம் (இடது கை/தாடை வரை பரவுதல்)',
    urgency: 'Immediate 911 / 108 / 112 Call',
    details: 'Pain radiating to neck, jaw, shoulder, or left arm, often accompanied by cold sweating and shortness of breath.',
  },
  {
    symptom: 'Sudden Stroke Signs (F.A.S.T.)',
    symptomTa: 'திடீர் பக்கவாதம் (முகம் ஒருபுறம் சாய்வது, கை பலவீனம், பேச்சுக் குழறல்)',
    urgency: 'Emergency EMS Immediate',
    details: 'Face drooping, Arm weakness, Speech difficulty, Time to call emergency services without delaying.',
  },
  {
    symptom: 'Acute Difficulty Breathing or Choking',
    symptomTa: 'திடீரென மூச்சுத் திணறல் அல்லது சுவாசிக்க இயலாமை',
    urgency: 'Critical Emergency',
    details: 'Inability to speak in full sentences, blue lips or fingernails, severe audible wheezing or stridor.',
  },
  {
    symptom: 'Sudden Unbearable Severe Abdominal Pain',
    symptomTa: 'தாங்க முடியாத திடீர் கடுமையான வயிற்று வலி',
    urgency: 'Urgent Hospital Evaluation',
    details: 'Rigid belly, vomiting blood, black tarry stools, or high fever with sharp localized pain.',
  },
  {
    symptom: 'Severe Allergic Reaction (Anaphylaxis)',
    symptomTa: 'தீவிர ஒவ்வாமை (உதடு, நாக்கு வீக்கம், தொண்டை அடைப்பு)',
    urgency: 'EpiPen & Immediate Emergency Care',
    details: 'Swollen lips, tongue, or throat, rapid hives, dizzy spells, sudden drop in blood pressure.',
  },
];

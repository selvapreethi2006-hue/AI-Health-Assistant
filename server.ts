import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '2mb' }));

// Server-side Gemini client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const SYSTEM_HEALTH_PROMPT = `You are AI HEALTH ASSISTANT, a certified, compassionate, and trustworthy Health Information and Wellness Assistant.
Language support: English and Tamil (தமிழ்).
Language Instruction:
- If the user writes in Tamil or explicitly requests Tamil, provide your response in warm, natural, and accurate Tamil (தமிழ்). You may include standard English terms in parentheses where helpful for clarity.
- If the user writes in English, reply in clear, friendly, and accessible English.

CRITICAL SAFETY & MEDICAL DIRECTIVES (STRICT COMPLIANCE REQUIRED):
1. NOT A MEDICAL DOCTOR & NO DIAGNOSIS: You provide general educational health, nutrition, wellness, and lifestyle information only. Never claim to diagnose illnesses, prescribe medicines, provide pharmaceutical dosages, or replace a licensed medical doctor or healthcare professional.
2. EMERGENCY PROTOCOL:
   If the user reports any emergency red-flag warning signs (e.g., crushing chest pain/pressure radiating to the arm/jaw, acute shortness of breath or choking, sudden numbness/paralysis/facial drooping/slurred speech, severe unbearable sudden abdominal pain, coughing up blood, anaphylaxis swelling of lips/throat, seizure, loss of consciousness, or suicidal thoughts), you MUST IMMEDIATELY start your response with:
   "⚠️ **URGENT MEDICAL NOTICE**: The symptoms you described may indicate a medical emergency. Please contact emergency services immediately (such as 112, 108, 911, 999 or your local emergency room) without delay."
   (In Tamil: "⚠️ **அவசர மருத்துவ அறிவிப்பு**: நீங்கள் குறிப்பிட்டுள்ள அறிகுறிகள் தீவிர அவசர நிலையைக் குறிக்கலாம். தாமதிக்காமல் உடனடியாக அவசர ஊர்தி (108 / 112) அல்லது அருகில் உள்ள அவசர சிகிச்சைப் பிரிவை உடனடியாகத் தொடர்பு கொள்ளவும்.")
3. FOLLOW-UP QUESTIONS: Where relevant, ask 1-2 thoughtful, gentle follow-up questions to understand their context (e.g. how long have they felt this, daily hydration, sleep pattern, stress level).
4. NO EXTREME DIETS OR FABRICATION: Do not support extreme fad diets, starvation diets, or unverified miracle cures. Stick to balanced evidence-based wellness guidelines (WHO, AHA, Dietary Guidelines).
5. CLARITY & STRUCTURE: Use bullet points, bold key insights, and conversational warmth.
6. MANDATORY DISCLAIMER: Always conclude with:
   "ℹ️ *Disclaimer: AI HEALTH ASSISTANT provides general health and wellness information for educational purposes only and is not a substitute for professional medical diagnosis or treatment. Always consult a qualified physician for personal medical questions.*"`;

// Resilient Gemini generator with fallback to responsive models
async function generateGeminiContent(options: any) {
  // Use models verified available in this runtime environment
  const models = [
    'gemini-3.5-flash',
    'gemini-3.5-flash-lite',
    'gemini-3.7-flash',
    'gemini-3.8-flash',
  ];
  let lastError: any = null;

  for (const modelName of models) {
    try {
      const response = await ai.models.generateContent({
        ...options,
        model: modelName,
      });
      return response;
    } catch (err: any) {
      console.warn(`Attempt with ${modelName} encountered issue:`, err?.message || err);
      lastError = err;
      // Sleep briefly before trying fallback
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  throw lastError || new Error('All model attempts failed');
}

// API Routes
app.get('/api/health-status', (_req, res) => {
  res.json({
    status: 'ok',
    hasKey: Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY'),
    app: 'AI HEALTH ASSISTANT',
    timestamp: new Date().toISOString(),
  });
});

// Chatbot endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, language = 'en' } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      return res.status(500).json({
        error: 'Gemini API key is not configured on the server. Please check your environment configuration.',
      });
    }

    // Format contents for Gemini SDK
    // Note: Gemini multiturn requires alternating turns and MUST start with a 'user' turn.
    // Filter out empty messages and skip any initial system/assistant greeting from the history.
    const rawTurns = messages
      .filter((m: any) => m && typeof m.content === 'string' && m.content.trim().length > 0)
      .map((m: any) => ({
        role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
        text: m.content.trim(),
      }));

    // Find the first user message turn so contents starts strictly with 'user'
    const firstUserIndex = rawTurns.findIndex((m: any) => m.role === 'user');
    if (firstUserIndex === -1) {
      return res.status(400).json({ error: 'Please enter a health question or topic.' });
    }

    const conversationSlice = rawTurns.slice(firstUserIndex).slice(-10);

    // Merge consecutive same-role turns into a single turn to avoid alternating-turn validation errors
    const contents: any[] = [];
    for (const turn of conversationSlice) {
      if (contents.length > 0 && contents[contents.length - 1].role === turn.role) {
        contents[contents.length - 1].parts[0].text += `\n\n${turn.text}`;
      } else {
        contents.push({
          role: turn.role,
          parts: [{ text: turn.text }],
        });
      }
    }

    const langDirective = language === 'ta'
      ? 'Note: Please provide the response in Tamil (தமிழ்).'
      : 'Note: Please provide the response in English.';

    const response = await generateGeminiContent({
      contents: contents,
      config: {
        systemInstruction: `${SYSTEM_HEALTH_PROMPT}\n${langDirective}`,
        temperature: 0.7,
      },
    });

    const replyText = response.text || (language === 'ta'
      ? 'மன்னிக்கவும், பதிலைத் தயார் செய்ய முடியவில்லை. மீண்டும் கேட்கவும்.'
      : 'I could not generate a response. Please try asking again.');
    res.json({ text: replyText });
  } catch (error: any) {
    console.error('Gemini chat error:', error);
    res.status(500).json({
      error: error?.message || 'An error occurred while communicating with the health AI assistant.',
    });
  }
});

// Nutrition analysis endpoint
app.post('/api/nutrition-analysis', async (req, res) => {
  try {
    const { query, preference = 'all', goal = 'balanced' } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Nutrition query is required.' });
    }

    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      return res.status(500).json({
        error: 'Gemini API key is not configured on the server.',
      });
    }

    const prompt = `Analyze this nutrition or meal query: "${query}".
Dietary Preference: ${preference} (e.g. vegetarian, non-vegetarian, vegan, or any).
Health Focus: ${goal}.

Provide a structured, evidence-backed nutritional assessment. Avoid extreme diets or unsupported detox/miracle claims. Include practical, balanced foods.`;

    const response = await generateGeminiContent({
      contents: prompt,
      config: {
        systemInstruction: `You are an expert Nutritional & Dietetic Educator for HEALTH AI. Return JSON matching the requested schema. Provide realistic macronutrient breakdown estimations, vital micronutrients, practical food swaps, and wholesome suggestions. Never prescribe medical diet therapies for severe clinical conditions without advising a registered dietitian.`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'Short descriptive title of the meal/nutrition topic' },
            summary: { type: Type.STRING, description: '2-3 sentence balanced overview' },
            isVegetarianFriendly: { type: Type.BOOLEAN },
            macronutrients: {
              type: Type.OBJECT,
              properties: {
                protein: { type: Type.STRING, description: 'e.g. ~24g (lentils, paneer or lean protein)' },
                carbohydrates: { type: Type.STRING, description: 'e.g. ~48g (complex fiber-rich whole grains)' },
                healthyFats: { type: Type.STRING, description: 'e.g. ~14g (olive oil, seeds, nuts)' },
                fiber: { type: Type.STRING, description: 'e.g. ~8g (leafy greens, vegetables)' },
              },
              required: ['protein', 'carbohydrates', 'healthyFats', 'fiber'],
            },
            keyMicronutrients: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  nutrient: { type: Type.STRING, description: 'e.g., Iron, Vitamin C, Calcium' },
                  benefit: { type: Type.STRING, description: 'What this nutrient supports' },
                  foodSources: { type: Type.STRING, description: 'Top natural food sources' },
                },
                required: ['nutrient', 'benefit', 'foodSources'],
              },
            },
            healthyTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3-4 practical healthy eating tips or easy food substitutions',
            },
            caution: {
              type: Type.STRING,
              description: 'Any balanced moderation note or safety caution against fad extremes',
            },
          },
          required: ['title', 'summary', 'isVegetarianFriendly', 'macronutrients', 'keyMicronutrients', 'healthyTips'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Nutrition endpoint error:', error);
    res.status(500).json({ error: error?.message || 'Failed to analyze nutrition' });
  }
});

// Daily Wellness Coach summary endpoint
app.post('/api/wellness-feedback', async (req, res) => {
  try {
    const { waterMl, waterGoalMl, sleepHours, sleepQuality, exerciseMinutes, exerciseType, completedHabitsCount, totalHabitsCount } = req.body;

    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      return res.status(500).json({ error: 'Gemini API key is not configured.' });
    }

    const prompt = `The user recorded the following self-reported wellness logs for today:
- Water intake: ${waterMl || 0} ml (Goal: ${waterGoalMl || 2500} ml)
- Sleep duration: ${sleepHours || 0} hours (Sleep quality: ${sleepQuality || 'average'})
- Physical Activity: ${exerciseMinutes || 0} minutes of ${exerciseType || 'general activity'}
- Completed wellness habits: ${completedHabitsCount || 0} out of ${totalHabitsCount || 5}

Provide an encouraging, scientifically grounded daily wellness summary and 3 practical recommendations for the rest of their day and tomorrow. Keep it motivating, balanced, and remind them that health is built through gradual consistency.`;

    const response = await generateGeminiContent({
      contents: prompt,
      config: {
        systemInstruction: 'You are a warm, encouraging preventive wellness coach. Deliver supportive, practical lifestyle advice. Emphasize that all logs are self-reported and celebrate small wins.',
        temperature: 0.6,
      },
    });

    res.json({ feedback: response.text });
  } catch (error: any) {
    console.error('Wellness coach error:', error);
    res.status(500).json({ error: error?.message || 'Failed to generate wellness feedback' });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`HEALTH AI server is running on http://0.0.0.0:${port}`);
  });
}

startServer();

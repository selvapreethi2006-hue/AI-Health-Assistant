/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { NavigationTab, Language, HealthTrackerData, Theme, ChatMessage } from './types/index.ts';
import { INITIAL_HABITS } from './data/healthData.ts';
import { Sidebar } from './components/Sidebar.tsx';
import { Header } from './components/Header.tsx';
import { DashboardView } from './components/DashboardView.tsx';
import { ChatView } from './components/ChatView.tsx';
import { NutritionView } from './components/NutritionView.tsx';
import { FitnessView } from './components/FitnessView.tsx';
import { TipsView } from './components/TipsView.tsx';
import { AboutView } from './components/AboutView.tsx';
import { EmergencyModal } from './components/EmergencyModal.tsx';
import { ShieldCheck } from 'lucide-react';

const getInitialWelcomeMessage = (lang: Language): ChatMessage => ({
  id: 'welcome-msg',
  role: 'assistant',
  content:
    lang === 'ta'
      ? `வணக்கம்! நான் உங்கள் **AI HEALTH ASSISTANT** நல்வாழ்வு தகவல் உதவியாளர்.

உடல்நலம், சீரான ஊட்டச்சத்து, முறையான உடற்பயிற்சி, தூக்கம் மற்றும் வாழ்க்கை முறை பற்றிய பொதுவான சந்தேகங்களைக் கேட்கலாம். நீங்கள் **மைக்ரோஃபோன்** பொத்தானைப் பயன்படுத்தி உங்கள் கேள்வியைப் பேசவும் செய்யலாம்!

⚠️ **முக்கிய அறிவிப்பு**: நான் ஒரு AI உதவியாளர் மட்டுமே. நான் எந்த நோயையும் கண்டறிவதோ, மருந்துகளை பரிந்துரைப்பதோ இல்லை. இது மருத்துவ ஆலோசனைகளுக்கு மாற்றாகாது.`
      : `Hello! I am **AI HEALTH ASSISTANT**, your preventive health and wellness information assistant.

Feel free to ask me anything about balanced nutrition, physical activity, sleep hygiene, hydration, and general wellness habits. You can also use the **Microphone** button to speak your question!

⚠️ **Important Notice**: I provide general health and wellness information for educational purposes only. I cannot diagnose conditions, prescribe medications, or replace a consultation with a qualified doctor.`,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
});

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');
  const [language, setLanguage] = useState<Language>('en');
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ai_health_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sync theme with document element for Tailwind dark mode
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('ai_health_theme', theme);
    } catch {}
  }, [theme]);

  // Persistent Chat Messages Across Tabs & Page Navigation
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('ai_health_chat_messages');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch {}
    }
    return [getInitialWelcomeMessage('en')];
  });

  // Save chat messages to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem('ai_health_chat_messages', JSON.stringify(messages));
    } catch {}
  }, [messages]);

  // If user changes language and hasn't started a multi-turn chat yet, update the welcome greeting
  useEffect(() => {
    if (messages.length === 1 && messages[0].id === 'welcome-msg') {
      setMessages([getInitialWelcomeMessage(language)]);
    }
  }, [language]);

  const handleClearMessages = () => {
    setMessages([getInitialWelcomeMessage(language)]);
  };

  // Core User-Entered Health Tracking State
  const [trackerData, setTrackerData] = useState<HealthTrackerData>({
    waterMl: 1500,
    waterGoalMl: 2500,
    sleepHours: 7.5,
    sleepQuality: 'restful',
    exerciseMinutes: 20,
    exerciseGoalMinutes: 30,
    exerciseType: 'Brisk Walking',
    checklist: INITIAL_HABITS,
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col text-slate-900 dark:text-slate-100 font-sans selection:bg-teal-100 dark:selection:bg-teal-900/60 selection:text-teal-900 dark:selection:text-teal-100 transition-colors">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        language={language}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
      />

      {/* Main Workspace Frame */}
      <div className="lg:pl-64 flex flex-col flex-1 min-w-0">
        {/* Sticky Top Header adhering to Top Bar Contract */}
        <Header
          currentTab={currentTab}
          language={language}
          onLanguageChange={(lang) => setLanguage(lang)}
          theme={theme}
          onThemeChange={(newTheme) => setTheme(newTheme)}
          onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        {/* Viewport Content Area */}
        <main className={`flex-1 ${currentTab === 'chat' ? 'p-2 sm:p-4 lg:p-6' : 'p-4 sm:p-6 lg:p-8'} max-w-7xl w-full mx-auto`}>
          {currentTab === 'home' && (
            <DashboardView
              trackerData={trackerData}
              onUpdateTracker={setTrackerData}
              language={language}
              theme={theme}
              onNavigate={(tab) => setCurrentTab(tab)}
              messages={messages}
            />
          )}

          {currentTab === 'chat' && (
            <ChatView
              language={language}
              onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
              messages={messages}
              onUpdateMessages={setMessages}
              onClearMessages={handleClearMessages}
            />
          )}

          {currentTab === 'nutrition' && (
            <NutritionView language={language} />
          )}

          {currentTab === 'fitness' && (
            <FitnessView
              trackerData={trackerData}
              onUpdateTracker={setTrackerData}
              language={language}
            />
          )}

          {currentTab === 'tips' && (
            <TipsView language={language} />
          )}

          {currentTab === 'about' && (
            <AboutView
              language={language}
              onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
            />
          )}
        </main>

        {/* Global Footer Legal & Transparency Strip */}
        <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-4 px-6 text-xs text-slate-500 dark:text-slate-400 transition-colors">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
              <span>
                {language === 'ta'
                  ? 'AI HEALTH ASSISTANT: பொதுவான சுகாதாரத் தகவல் மட்டுமே. மருத்துவ பரிசோதனைக்கு மருத்துவரை அணுகவும்.'
                  : 'AI HEALTH ASSISTANT: Educational health assistant only. Not a substitute for professional medical diagnosis or treatment.'}
              </span>
            </div>
            <div className="flex items-center gap-3 text-slate-400 dark:text-slate-500">
              <button
                onClick={() => setCurrentTab('about')}
                className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
              >
                {language === 'ta' ? 'விளக்கம் & மறுப்புரை' : 'Disclaimer'}
              </button>
              <span>·</span>
              <button
                onClick={() => setIsEmergencyModalOpen(true)}
                className="hover:text-rose-600 dark:hover:text-rose-400 font-medium text-rose-700 dark:text-rose-400 transition-colors"
              >
                {language === 'ta' ? 'அவசர உதவி 112 / 108' : 'Emergency 112 / 108'}
              </button>
            </div>
          </div>
        </footer>
      </div>

      {/* Emergency Warning & Contacts Modal */}
      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        language={language}
      />
    </div>
  );
}

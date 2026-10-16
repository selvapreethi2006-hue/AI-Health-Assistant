import React from 'react';
import { ShieldAlert, Globe, Menu, Sun, Moon } from 'lucide-react';
import { Language, NavigationTab, Theme } from '../types/index.ts';
import { Logo } from './Logo.tsx';

interface HeaderProps {
  currentTab: NavigationTab;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  onOpenEmergencyModal: () => void;
  onToggleMobileMenu: () => void;
}

const TAB_TITLES: Record<NavigationTab, { en: string; ta: string }> = {
  home: { en: 'Dashboard', ta: 'முகப்பு பலகை' },
  chat: { en: 'AI Health Chat', ta: 'AI நல உரையாடல்' },
  nutrition: { en: 'Nutrition Guide', ta: 'ஊட்டச்சத்து வழிகாட்டி' },
  fitness: { en: 'Fitness & Movement', ta: 'உடற்பயிற்சி & இயக்கம்' },
  tips: { en: 'Health Tips', ta: 'நலக் குறிப்புகள்' },
  about: { en: 'About & Safety', ta: 'பாதுகாப்பு & விளக்கம்' },
};

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  language,
  onLanguageChange,
  theme,
  onThemeChange,
  onOpenEmergencyModal,
  onToggleMobileMenu,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="flex items-center justify-between gap-3 sm:gap-4 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Mobile Hamburger + Brand & Context Breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onToggleMobileMenu}
            className="p-1.5 -ml-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 truncate">
            <Logo size="sm" />
            <div className="flex items-baseline gap-2 min-w-0">
              <span className="font-bold text-slate-900 dark:text-white tracking-tight text-sm sm:text-base whitespace-nowrap">
                AI HEALTH ASSISTANT
              </span>
              <span className="text-slate-300 dark:text-slate-700 hidden sm:inline" aria-hidden="true">/</span>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400 hidden sm:inline truncate">
                {TAB_TITLES[currentTab][language]}
              </span>
            </div>
          </div>
        </div>

        {/* Zone 2: Theme Selector & Language Selector */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Theme Toggle (Dark / Light) */}
          <button
            onClick={() => onThemeChange(theme === 'dark' ? 'light' : 'dark')}
            className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1.5 text-xs font-medium shadow-2xs"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-600" />
                <span className="hidden sm:inline">Dark</span>
              </>
            )}
          </button>

          {/* Language Selector */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <Globe className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 ml-1.5 mr-1 hidden sm:block" />
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                language === 'en'
                  ? 'bg-white dark:bg-slate-900 text-teal-800 dark:text-teal-300 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              English
            </button>
            <button
              onClick={() => onLanguageChange('ta')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                language === 'ta'
                  ? 'bg-white dark:bg-slate-900 text-teal-800 dark:text-teal-300 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              தமிழ்
            </button>
          </div>
        </div>

        {/* Zone 3: 1 Primary Action (Emergency Guidance SOS) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenEmergencyModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 hover:text-rose-800 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 shadow-2xs"
            title="Emergency Medical Warnings and Hotlines"
          >
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span className="hidden md:inline">
              {language === 'ta' ? 'அவசர மருத்துவ உதவி' : 'Emergency Signs & EMS'}
            </span>
            <span className="md:hidden">
              {language === 'ta' ? 'அவசரம்' : 'SOS'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

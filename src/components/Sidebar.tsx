import React from 'react';
import {
  LayoutDashboard,
  MessageSquareHeart,
  UtensilsCrossed,
  Activity,
  Lightbulb,
  Info,
  ShieldCheck,
  X,
} from 'lucide-react';
import { NavigationTab, Language } from '../types/index.ts';
import { Logo } from './Logo.tsx';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  language: Language;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onOpenEmergencyModal: () => void;
}

interface NavItem {
  id: NavigationTab;
  labelEn: string;
  labelTa: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'home',
    labelEn: 'Dashboard',
    labelTa: 'முகப்பு பலகை',
    icon: LayoutDashboard,
  },
  {
    id: 'chat',
    labelEn: 'AI Health Chat',
    labelTa: 'AI நல உரையாடல்',
    icon: MessageSquareHeart,
  },
  {
    id: 'nutrition',
    labelEn: 'Nutrition',
    labelTa: 'ஊட்டச்சத்து',
    icon: UtensilsCrossed,
  },
  {
    id: 'fitness',
    labelEn: 'Fitness & Movement',
    labelTa: 'உடற்பயிற்சி',
    icon: Activity,
  },
  {
    id: 'tips',
    labelEn: 'Health Tips',
    labelTa: 'நலக் குறிப்புகள்',
    icon: Lightbulb,
  },
  {
    id: 'about',
    labelEn: 'About & Disclaimer',
    labelTa: 'பாதுகாப்பு & விளக்கம்',
    icon: Info,
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  language,
  isOpenMobile,
  onCloseMobile,
  onOpenEmergencyModal,
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Area */}
        <div className="h-16 px-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <Logo size="md" showText={true} />
          <button
            onClick={onCloseMobile}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                  isActive
                    ? 'bg-teal-50 dark:bg-teal-950/50 text-teal-900 dark:text-teal-200 border border-teal-200 dark:border-teal-800/80 shadow-2xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-teal-700 dark:text-teal-400' : 'text-slate-500 dark:text-slate-400'
                  }`}
                />
                <span className="truncate">
                  {language === 'ta' ? item.labelTa : item.labelEn}
                </span>
                {item.id === 'chat' && (
                  <span className="ml-auto text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300">
                    AI
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Safety & Emergency Section */}
        <div className="p-3.5 border-t border-slate-100 dark:border-slate-800 space-y-2.5 shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
          {/* Medical Notice Card */}
          <div className="p-3 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl">
            <div className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  {language === 'ta' ? 'மருத்துவ மறுப்பு' : 'General Health Info'}
                </p>
                <p className="mt-0.5 text-slate-500 dark:text-slate-400">
                  {language === 'ta'
                    ? 'இது பொதுவான நலத் தகவல் மட்டுமே. மருத்துவ பரிசோதனைக்கு மருத்துவரை அணுகவும்.'
                    : 'Informational only. Not a medical diagnosis or treatment.'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick SOS Trigger */}
          <button
            onClick={onOpenEmergencyModal}
            className="w-full text-left flex items-center justify-between px-3 py-2 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 rounded-lg text-xs font-medium transition-colors"
          >
            <span className="truncate font-semibold">
              {language === 'ta' ? 'அவசர எண்கள் & அறிகுறிகள்' : 'Emergency Signs & Numbers'}
            </span>
            <span className="font-mono-numbers text-[11px] font-bold text-rose-600 dark:text-rose-400">112 / 108</span>
          </button>
        </div>
      </aside>
    </>
  );
};

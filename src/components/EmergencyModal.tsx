import React from 'react';
import { AlertTriangle, PhoneCall, ShieldAlert, X, HeartPulse } from 'lucide-react';
import { EMERGENCY_WARNING_SIGNS } from '../data/healthData.ts';
import { Language } from '../types/index.ts';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose, language }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full border border-rose-200 dark:border-rose-900/60 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col text-slate-800 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-rose-600 px-6 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {language === 'ta' ? 'அவசர மருத்துவ எச்சரிக்கை & வழிகாட்டல்' : 'Emergency Medical Protocol & Helpline'}
              </h2>
              <p className="text-xs text-rose-100">
                {language === 'ta'
                  ? 'உடனடி மருத்துவ உதவி தேவைப்படும் ஆபத்தான அறிகுறிகள்'
                  : 'Recognize critical warning signs and contact local emergency teams immediately'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1 rounded-lg hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700 dark:text-slate-300">
          {/* Urgent Warning Banner */}
          <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl text-rose-900 dark:text-rose-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-rose-950 dark:text-rose-100">
                  {language === 'ta'
                    ? 'AI HEALTH ASSISTANT ஒரு கணினி உதவியாளர் மட்டுமே. இது அவசர மருத்துவ பிரிவுக்கு மாற்றாகாது!'
                    : 'AI HEALTH ASSISTANT is an educational assistant only and cannot replace hospital emergency services!'}
                </p>
                <p className="text-xs text-rose-800 dark:text-rose-300 mt-1 leading-relaxed">
                  {language === 'ta'
                    ? 'உங்களுக்கோ அல்லது வேறு ஒருவருக்கோ கடுமையான மார்பு வலி, மூச்சுத் திணறல், பக்கவாதம் போன்ற அறிகுறிகள் இருந்தால் உடனடியாக அவசர ஊர்தியை அழையுங்கள்.'
                    : 'If you or someone around you is experiencing life-threatening symptoms, do not rely on chat. Call your national emergency number or go to the nearest emergency ward.'}
                </p>
              </div>
            </div>
          </div>

          {/* Emergency Helplines Grid */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
              {language === 'ta' ? 'முக்கிய அவசர எண்கள்' : 'Emergency Contact Numbers'}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80 text-center">
                <span className="text-xs text-slate-500 dark:text-slate-400 block">India</span>
                <span className="font-mono-numbers text-xl font-bold text-rose-600 dark:text-rose-400">108 / 112</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">Ambulance</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80 text-center">
                <span className="text-xs text-slate-500 dark:text-slate-400 block">USA & Canada</span>
                <span className="font-mono-numbers text-xl font-bold text-rose-600 dark:text-rose-400">911</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">Emergency</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80 text-center">
                <span className="text-xs text-slate-500 dark:text-slate-400 block">UK</span>
                <span className="font-mono-numbers text-xl font-bold text-rose-600 dark:text-rose-400">999 / 111</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">EMS / NHS</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80 text-center">
                <span className="text-xs text-slate-500 dark:text-slate-400 block">Europe</span>
                <span className="font-mono-numbers text-xl font-bold text-rose-600 dark:text-rose-400">112</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">Universal SOS</span>
              </div>
            </div>
          </div>

          {/* Red Flag Symptoms */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
              {language === 'ta' ? 'உடனடி மருத்துவ ஆலோசனைக்கான சிவப்பு எச்சரிக்கை அறிகுறிகள்' : 'Red-Flag Medical Emergency Signs'}
            </h3>
            <div className="space-y-2.5">
              {EMERGENCY_WARNING_SIGNS.map((item, idx) => (
                <div key={idx} className="p-3 bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 rounded-xl hover:border-rose-300 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <HeartPulse className="w-4 h-4 text-rose-500 shrink-0" />
                      <span className="font-medium text-slate-900 dark:text-white text-sm">
                        {language === 'ta' ? item.symptomTa : item.symptom}
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-md whitespace-nowrap">
                      {item.urgency}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 pl-6 leading-relaxed">
                    {item.details}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Calm Action Steps */}
          <div className="p-4 bg-teal-50/60 dark:bg-teal-950/30 rounded-xl border border-teal-100 dark:border-teal-900/50 text-teal-950 dark:text-teal-200 text-xs space-y-1.5">
            <p className="font-semibold text-teal-900 dark:text-teal-100">
              {language === 'ta' ? 'அவசர கால வழிகாட்டல்:' : 'What to do while waiting for medical personnel:'}
            </p>
            <ul className="list-disc list-inside space-y-1 text-teal-800 dark:text-teal-300">
              <li>{language === 'ta' ? 'அமைதியாக இருந்து நோயாளியை வசதியாக அமர வைக்கவும்.' : 'Stay calm, keep the patient seated upright or in a comfortable resting posture.'}</li>
              <li>{language === 'ta' ? 'ஆடைகளை தளர்த்தி, போதிய காற்று வெளிச்சத்தை உறுதிப்படுத்தவும்.' : 'Loosen restrictive clothing and ensure unobstructed airway and ventilation.'}</li>
              <li>{language === 'ta' ? 'மருத்துவ ஆலோசனை இன்றி எந்த மருந்தையும் சுயமாக உட்கொள்ள வேண்டாம்.' : 'Do not administer unknown prescription medication without doctor approval.'}</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {language === 'ta' ? 'பொது நலம் & உயிர்ப் பாதுகாப்பு வழிகாட்டல்' : 'Public health safety protocol'}
          </span>
          <div className="flex gap-2">
            <a
              href="tel:112"
              className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{language === 'ta' ? 'அவசர எண் 112 அழையுங்கள்' : 'Call Emergency 112'}</span>
            </a>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors"
            >
              {language === 'ta' ? 'மூடுக' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

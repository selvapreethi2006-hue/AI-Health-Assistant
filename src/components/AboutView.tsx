import React from 'react';
import {
  ShieldAlert,
  Lock,
  HeartHandshake,
  Stethoscope,
  PhoneCall,
  CheckCircle2,
  AlertTriangle,
  FileText,
} from 'lucide-react';
import { Language } from '../types/index.ts';

interface AboutViewProps {
  language: Language;
  onOpenEmergencyModal: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({
  language,
  onOpenEmergencyModal,
}) => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Prominent Medical Disclaimer Banner */}
      <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-6 shadow-2xs space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-600 text-white rounded-xl">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-rose-950">
              {language === 'ta' ? 'அதிகாரப்பூர்வ மருத்துவ மறுப்புரை' : 'Official Medical Disclaimer'}
            </h1>
            <p className="text-xs text-rose-700">
              {language === 'ta' ? 'அனைத்து பயனர்களுக்கான கட்டாய அறிவிப்பு' : 'Mandatory Clinical & Legal Transparency'}
            </p>
          </div>
        </div>

        <p className="text-sm text-rose-900 leading-relaxed">
          {language === 'ta'
            ? '“AI HEALTH ASSISTANT செயலி பொதுவான நல்வாழ்வு, ஊட்டச்சத்து, தூக்கம் மற்றும் உடற்பயிற்சி பற்றிய தகவல்களை மட்டுமே வழங்குகிறது. இது தகுதிவாய்ந்த மருத்துவரின் நேரடி ஆலோசனை, நோய் கண்டறிதல் அல்லது மருத்துவ சிகிச்சைக்கு மாற்றாகாது.”'
            : '“AI HEALTH ASSISTANT provides general health information and is not a substitute for professional medical advice, clinical diagnosis, or treatment.”'}
        </p>

        <p className="text-xs text-rose-800 leading-relaxed">
          {language === 'ta'
            ? 'உங்களுக்கு ஏதேனும் தீவிர உடல்நலக் குறைபாடுகள் அல்லது நீடித்த அறிகுறிகள் இருந்தால், உடனடியாக தகுதியுள்ள மருத்துவரை அணுகவும். அவசர மருத்துவ நிலைகளில் உடனடியாக 108 / 112 அல்லது அருகில் உள்ள அவசர சிகிச்சைப் பிரிவைத் தொடர்பு கொள்ளவும்.'
            : 'Never disregard professional medical advice or delay seeking it because of something you have read on this application. If you think you may have a medical emergency, immediately call emergency services or go to the nearest hospital.'}
        </p>
      </div>

      {/* Privacy Guarantees */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2.5">
          <Lock className="w-5 h-5 text-teal-600" />
          <h2 className="text-base font-bold text-slate-900">
            {language === 'ta' ? 'தனியுரிமை & தரவுப் பாதுகாப்பு' : 'Privacy & Data Governance Principles'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span>{language === 'ta' ? 'தற்காலிக அமர்வு மட்டுமே' : 'Session-Scoped Privacy'}</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              We do not permanently store your health chats or personal conversations on central databases without explicit user consent. Tracking logs reside safely within your current browser session.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span>{language === 'ta' ? 'தேவையற்ற தகவல் கோரப்படாது' : 'No Sensitive Data Harvesting'}</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              AI HEALTH ASSISTANT does not ask for or collect sensitive personally identifiable records, social security numbers, government IDs, or private health insurance numbers.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span>{language === 'ta' ? 'அறிவியல் பூர்வ உண்மைத்தன்மை' : 'Zero Medical Fabrication'}</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              The AI model is strictly instructed never to fabricate laboratory reports, scientific trial numbers, or invent miracle cure claims. All advice adheres to balanced evidence-based wellness guidelines.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span>{language === 'ta' ? 'சுய உள்ளீடு வெளிப்படைத்தன்மை' : 'Self-Reported Transparency'}</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              All hydration, sleep, and physical activity values displayed across the dashboard are clearly marked as user-entered information for personal wellness reflection.
            </p>
          </div>
        </div>
      </div>

      {/* When to see a doctor checklist */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2.5">
          <Stethoscope className="w-5 h-5 text-teal-600" />
          <h2 className="text-base font-bold text-slate-900">
            {language === 'ta' ? 'எப்போது மருத்துவரை அணுக வேண்டும்?' : 'When to Consult a Qualified Doctor'}
          </h2>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          While preventative habits build resilience, please consult a healthcare professional in-person if you observe any of the following:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {[
            'Fever persisting beyond 3 days or exceeding 103°F (39.4°C)',
            'Unexplained or unintentional rapid weight loss',
            'Persistent cough lasting longer than 3-4 weeks',
            'Severe or unusual chronic headaches not relieved by hydration',
            'Changes in bowel or urinary habits lasting more than 2 weeks',
            'Unexplained shortness of breath during routine light tasks',
            'Non-healing sores, skin lesions, or irregular changing moles',
            'Ongoing chronic joint pain or localized inflammation',
          ].map((item, idx) => (
            <div key={idx} className="flex items-start gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-slate-700">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Global Emergency Help Access */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-base font-bold text-white">
            {language === 'ta' ? 'உடனடி அவசர வழிகாட்டல் தேவையா?' : 'Need Urgent Medical Contacts?'}
          </h3>
          <p className="text-xs text-slate-300">
            Access international emergency hotlines and red-flag symptom protocols instantly.
          </p>
        </div>
        <button
          onClick={onOpenEmergencyModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs shrink-0"
        >
          <PhoneCall className="w-4 h-4" />
          <span>{language === 'ta' ? 'அவசர நெறிமுறையை பார்க்க' : 'Open Emergency Protocol'}</span>
        </button>
      </div>
    </div>
  );
};

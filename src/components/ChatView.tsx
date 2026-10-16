import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  RotateCcw,
  Copy,
  Check,
  AlertTriangle,
  HeartPulse,
  Info,
  PhoneCall,
  Mic,
  MicOff,
  Volume2,
  StopCircle,
  MessageSquare,
} from 'lucide-react';
import { ChatMessage, Language } from '../types/index.ts';

interface ChatViewProps {
  language: Language;
  onOpenEmergencyModal: () => void;
  messages: ChatMessage[];
  onUpdateMessages: (updater: (prev: ChatMessage[]) => ChatMessage[]) => void;
  onClearMessages: () => void;
}

const SAMPLE_QUESTIONS: { en: string; ta: string }[] = [
  {
    en: 'What are healthy plant-based protein sources for daily meals?',
    ta: 'தினசரி உணவில் சேர்க்க வேண்டிய சிறந்த தாவர அடிப்படையிலான புரத உணவுகள் யாவை?',
  },
  {
    en: 'How can I naturally improve my deep sleep and sleep hygiene?',
    ta: 'ஆழ்ந்த தூக்கத்தைப் பெற உதவும் இயற்கை வாழ்க்கை முறை பழக்கங்கள் என்ன?',
  },
  {
    en: 'What is the talk-test for checking safe cardiovascular exercise intensity?',
    ta: 'உடற்பயிற்சியின் போது இதயத் துடிப்பு பாதுகாப்பாக உள்ளதா என்பதை அறியும் பேசிப் பார்க்கும் முறை என்ன?',
  },
  {
    en: 'How does daily water intake affect headache frequency and energy levels?',
    ta: 'தினசரி போதிய அளவு தண்ணீர் குடிப்பது தலைவலி மற்றும் உடற்சோர்வைத் தடுக்குமா?',
  },
];

const EMERGENCY_KEYWORDS = [
  'chest pain',
  'heart attack',
  'shortness of breath',
  'cannot breathe',
  'stroke',
  'slurred speech',
  'face drooping',
  'anaphylaxis',
  'suicide',
  'suicidal',
  'bleeding uncontrollably',
  'fainted',
  'unconscious',
  'மார்பு வலி',
  'மூச்சு திணறல்',
  'பக்கவாதம்',
  'தற்கொலை',
];

// Helper to format assistant markdown-like text with bolding and lists
function FormattedMessage({ content }: { content: string }) {
  const lines = content.split('\n');

  return (
    <div className="space-y-2 leading-relaxed text-slate-900 dark:text-slate-100 text-sm">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        // Section header e.g. ###
        if (trimmed.startsWith('### ')) {
          return (
            <h4
              key={idx}
              className="font-bold text-sm sm:text-base text-slate-950 dark:text-white pt-2 pb-0.5 border-b border-slate-200/60 dark:border-slate-700/60"
            >
              {trimmed.replace(/^###\s+/, '')}
            </h4>
          );
        }

        // Horizontal divider e.g. ---
        if (trimmed === '---') {
          return <hr key={idx} className="my-2 border-slate-200 dark:border-slate-700" />;
        }

        // Bullet point
        if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
          const itemText = trimmed.slice(2);
          return (
            <div key={idx} className="flex items-start gap-2.5 pl-1">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-600 dark:bg-teal-400 shrink-0 mt-2" />
              <div className="flex-1 text-slate-800 dark:text-slate-200">
                {renderFormattedInline(itemText)}
              </div>
            </div>
          );
        }

        // Numbered list
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2.5 pl-1">
              <span className="font-mono-numbers font-bold text-teal-700 dark:text-teal-400 shrink-0">
                {numMatch[1]}.
              </span>
              <div className="flex-1 text-slate-800 dark:text-slate-200">
                {renderFormattedInline(numMatch[2])}
              </div>
            </div>
          );
        }

        // Disclaimer italicized note
        if (trimmed.startsWith('ℹ️') || trimmed.toLowerCase().includes('disclaimer')) {
          return (
            <div
              key={idx}
              className="mt-3 p-3 rounded-xl bg-slate-200/60 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs italic leading-normal"
            >
              {renderFormattedInline(trimmed)}
            </div>
          );
        }

        return (
          <p key={idx} className="text-slate-800 dark:text-slate-200">
            {renderFormattedInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

// Inline parser for **bold** text
function renderFormattedInline(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-bold text-slate-950 dark:text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

export const ChatView: React.FC<ChatViewProps> = ({
  language,
  onOpenEmergencyModal,
  messages,
  onUpdateMessages,
  onClearMessages,
}) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showEmergencyNotice, setShowEmergencyNotice] = useState(false);

  // Web Speech API Voice States
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [speechInterim, setSpeechInterim] = useState('');
  const recognitionRef = useRef<any>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, speechInterim]);

  // Check Web Speech API availability on mount
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      setSpeechSupported(true);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, []);

  // Web Speech Recognition Handler
  const startRecording = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError(
        language === 'ta'
          ? 'உங்கள் உலாவியில் குரல் உள்ளீடு (Voice Input) ஆதரவு இல்லை. தயவுசெய்து தட்டச்சு செய்யவும்.'
          : 'Voice input is not supported in this browser. Please type your question.'
      );
      return;
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      // Select language (ta-IN for Tamil, en-US for English)
      recognition.lang = language === 'ta' ? 'ta-IN' : 'en-US';
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsRecording(true);
        setSpeechInterim('');
        setError(null);
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let finalTranscript = '';

        for (let i = 0; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + ' ';
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        const totalSpoken = (finalTranscript + interim).trim();
        setSpeechInterim(totalSpoken);
        if (totalSpoken) {
          setInput(totalSpoken);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setIsRecording(false);
          setError(
            language === 'ta'
              ? 'மைக்ரோஃபோன் அனுமதி மறுக்கப்பட்டது. உலாவியில் மைக் அனுமதியை வழங்கவும்.'
              : 'Microphone access was denied. Please allow microphone permissions in your browser.'
          );
        } else if (event.error !== 'no-speech') {
          setIsRecording(false);
          setError(
            language === 'ta'
              ? 'குரலைப் பதிவு செய்வதில் சிக்கல். தயவுசெய்து மீண்டும் பேசவும்.'
              : 'Unable to capture speech clearly. Please try speaking again.'
          );
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } catch (err: any) {
      console.error('Failed to start speech recognition:', err);
      setIsRecording(false);
      setError('Could not access microphone.');
    }
  };

  const stopRecording = (autoSend: boolean = false) => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsRecording(false);

    if (autoSend && (speechInterim || input).trim()) {
      handleSendMessage((speechInterim || input).trim());
    }
  };

  // Check if input contains emergency warning words
  const checkForEmergencyInput = (text: string) => {
    const lower = text.toLowerCase();
    return EMERGENCY_KEYWORDS.some((kw) => lower.includes(kw.toLowerCase()));
  };

  const handleSendMessage = async (userPrompt?: string) => {
    if (isRecording) {
      stopRecording(false);
    }

    const messageToSend = (userPrompt || input).trim();
    if (!messageToSend || isLoading) return;

    setError(null);
    const isEmerg = checkForEmergencyInput(messageToSend);
    if (isEmerg) {
      setShowEmergencyNotice(true);
    }

    const newUserMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isEmergency: isEmerg,
    };

    const updatedMessages = [...messages, newUserMsg];
    onUpdateMessages(() => updatedMessages);
    setInput('');
    setSpeechInterim('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          language,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Server responded with an error');
      }

      const data = await response.json();
      const assistantText = data.text;
      const isResponseEmergency =
        assistantText.includes('URGENT MEDICAL') ||
        assistantText.includes('அவசர மருத்துவ') ||
        assistantText.includes('112') ||
        assistantText.includes('108');

      const newAssistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: assistantText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isEmergency: isResponseEmergency,
      };

      onUpdateMessages((prev) => [...prev, newAssistantMsg]);
      if (isResponseEmergency) {
        setShowEmergencyNotice(true);
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      setError(
        err.message ||
          (language === 'ta'
            ? 'தகவலைப் பெறுவதில் சிக்கல் ஏற்பட்டது. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.'
            : 'Failed to communicate with Health AI. Please try again.')
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] min-h-[540px] max-w-5xl mx-auto w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden transition-colors">
      {/* Chat Header Bar */}
      <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                {language === 'ta' ? 'AI நல உதவியாளர்' : 'AI HEALTH ASSISTANT'}
              </h2>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-teal-800 dark:text-teal-300 bg-teal-100 dark:bg-teal-950/80 px-2 py-0.5 rounded-full border border-teal-200 dark:border-teal-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Gemini 3.5
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {language === 'ta'
                ? 'ஊட்டச்சத்து, தூக்கம், நீரேற்றம் & உடற்பயிற்சி நல்வாழ்வு தகவல்'
                : 'General health, sleep, nutrition & fitness education'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onClearMessages}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
            title="Reset conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {language === 'ta' ? 'அழித்து தொடங்கு' : 'Clear Chat'}
            </span>
          </button>
        </div>
      </div>

      {/* Emergency Notice Floating Banner if detected */}
      {showEmergencyNotice && (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/70 border-b border-rose-200 dark:border-rose-900 flex items-center justify-between gap-3 text-rose-950 dark:text-rose-100 text-xs shrink-0">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
            <span className="font-semibold">
              {language === 'ta'
                ? 'அவசர மருத்துவ அறிகுறிகள் தென்பட்டால் உடனடியாக 108 / 112 அழையுங்கள் அல்லது அவசர சிகிச்சைப் பிரிவை நாடுங்கள்.'
                : 'Emergency signs detected: If you or someone is in acute distress, call 112 / 911 / 108 or go to the nearest emergency ward.'}
            </span>
          </div>
          <button
            onClick={onOpenEmergencyModal}
            className="px-2.5 py-1 bg-rose-600 text-white text-[11px] font-bold rounded-md hover:bg-rose-700 whitespace-nowrap transition-colors flex items-center gap-1 shrink-0"
          >
            <PhoneCall className="w-3 h-3" />
            <span>{language === 'ta' ? 'அவசர எண்கள்' : 'View Helplines'}</span>
          </button>
        </div>
      )}

      {/* Visual Microphone Pulse Animation Banner while Recording */}
      {isRecording && (
        <div className="p-3 bg-rose-50/95 dark:bg-rose-950/80 border-b border-rose-200 dark:border-rose-900 flex items-center justify-between gap-3 text-xs shrink-0 transition-all">
          <div className="flex items-center gap-3">
            {/* Live pulsating audio wave visualizer */}
            <div className="relative flex items-center justify-center w-8 h-8">
              <span className="absolute w-8 h-8 rounded-full bg-rose-500/30 animate-ping" />
              <span className="absolute w-6 h-6 rounded-full bg-rose-500/50 animate-pulse" />
              <div className="w-4 h-4 rounded-full bg-rose-600 flex items-center justify-center text-white relative z-10 shadow-xs">
                <Mic className="w-2.5 h-2.5" />
              </div>
            </div>

            {/* Audio equalizer animated bars */}
            <div className="flex items-end gap-1 h-5 px-1">
              <div className="w-1 bg-rose-500 rounded-full animate-bounce [animation-delay:0.1s] h-3" />
              <div className="w-1 bg-rose-500 rounded-full animate-bounce [animation-delay:0.3s] h-5" />
              <div className="w-1 bg-rose-500 rounded-full animate-bounce [animation-delay:0.2s] h-4" />
              <div className="w-1 bg-rose-500 rounded-full animate-bounce [animation-delay:0.4s] h-5" />
              <div className="w-1 bg-rose-500 rounded-full animate-bounce [animation-delay:0.15s] h-3" />
            </div>

            <div>
              <span className="font-bold text-rose-950 dark:text-rose-100 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                {language === 'ta' ? 'குரல் கேட்கிறது...' : 'Listening... Speak clearly'}
              </span>
              <p className="text-[11px] text-rose-800 dark:text-rose-300 italic font-mono-numbers truncate max-w-sm sm:max-w-md">
                {speechInterim ||
                  (language === 'ta'
                    ? 'உங்கள் கேள்வியைப் பேசுங்கள் (Speak now in Tamil or English)'
                    : 'Speak now, your speech will appear here...')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => stopRecording(true)}
              className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold text-xs flex items-center gap-1 transition-colors shadow-xs"
              title="Finish speaking and send"
            >
              <Send className="w-3 h-3" />
              <span>{language === 'ta' ? 'கேள்' : 'Ask'}</span>
            </button>
            <button
              onClick={() => stopRecording(false)}
              className="px-2.5 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg font-medium text-xs flex items-center gap-1 transition-colors"
              title="Cancel recording"
            >
              <StopCircle className="w-3.5 h-3.5 text-rose-600" />
              <span>{language === 'ta' ? 'நிறுத்து' : 'Stop'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Message List - Guaranteed visible, scrollable container */}
      <div className="flex-1 min-h-[300px] overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 flex items-center justify-center mx-auto">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white">
              {language === 'ta' ? 'உரையாடலைத் தொடங்குங்கள்' : 'Start Your Health Conversation'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              {language === 'ta'
                ? 'கீழே உள்ள பரிந்துரைக்கப்பட்ட கேள்விகளில் ஒன்றை அழுத்தவும் அல்லது உங்கள் கேள்வியைப் பேசவும்.'
                : 'Ask anything about nutrition, exercise, hydration, or sleep hygiene.'}
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                    isUser
                      ? 'bg-slate-800 dark:bg-teal-700 text-white'
                      : msg.isEmergency
                      ? 'bg-rose-600 text-white'
                      : 'bg-teal-600 text-white'
                  }`}
                >
                  {isUser ? (
                    <User className="w-4 h-4" />
                  ) : msg.isEmergency ? (
                    <HeartPulse className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>

                {/* Message Bubble with Crisp High-Contrast Colors */}
                <div
                  className={`max-w-[88%] sm:max-w-[82%] rounded-2xl px-4 py-3.5 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-teal-600 text-white rounded-tr-xs shadow-xs font-normal'
                      : msg.isEmergency
                      ? 'bg-rose-50 dark:bg-rose-950/70 border border-rose-300 dark:border-rose-900 text-rose-950 dark:text-rose-100 rounded-tl-xs shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-tl-xs shadow-xs'
                  }`}
                >
                  {/* Message Content */}
                  {isUser ? (
                    <div className="whitespace-pre-wrap font-medium text-white">{msg.content}</div>
                  ) : (
                    <FormattedMessage content={msg.content} />
                  )}

                  {/* Bubble Footer */}
                  <div
                    className={`mt-2.5 pt-1.5 border-t flex items-center justify-between text-[11px] ${
                      isUser
                        ? 'border-teal-500/60 text-teal-100'
                        : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    <span className="font-mono-numbers">{msg.timestamp}</span>
                    {!isUser && (
                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="p-1 hover:text-slate-900 dark:hover:text-slate-100 rounded transition-colors"
                        title="Copy response"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Loading Animated State */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-tl-xs flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 shadow-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-600 animate-bounce [animation-delay:-0.3s]" />
                <span className="w-2.5 h-2.5 rounded-full bg-teal-600 animate-bounce [animation-delay:-0.15s]" />
                <span className="w-2.5 h-2.5 rounded-full bg-teal-600 animate-bounce" />
              </div>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {language === 'ta'
                  ? 'AI நல உதவியாளர் பதிலளிக்கிறார்...'
                  : 'AI HEALTH ASSISTANT is formulating evidence-based guidance...'}
              </span>
            </div>
          </div>
        )}

        {/* Error notification */}
        {error && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-900 rounded-xl text-rose-900 dark:text-rose-200 text-xs flex items-center justify-between shadow-xs">
            <span>{error}</span>
            <button
              onClick={() => handleSendMessage()}
              className="text-rose-900 dark:text-rose-100 font-bold underline ml-2"
            >
              Retry
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      {messages.length <= 3 && (
        <div className="px-4 py-2.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70 shrink-0">
          <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-teal-600 dark:text-teal-400" />
            {language === 'ta' ? 'பரிந்துரைக்கப்படும் கேள்விகள்:' : 'Suggested topics to ask:'}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {SAMPLE_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(language === 'ta' ? q.ta : q.en)}
                className="text-left text-xs text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-slate-700 hover:text-teal-900 dark:hover:text-teal-300 hover:border-teal-300 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg transition-colors truncate max-w-full shadow-2xs"
              >
                {language === 'ta' ? q.ta : q.en}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form with Web Speech Voice Input */}
      <div className="p-3.5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0 space-y-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          {/* Web Speech API Voice Button */}
          <button
            type="button"
            onClick={isRecording ? () => stopRecording(true) : startRecording}
            className={`p-2.5 rounded-xl border transition-all flex items-center justify-center shrink-0 shadow-2xs ${
              isRecording
                ? 'bg-rose-600 border-rose-600 text-white animate-pulse ring-4 ring-rose-500/30'
                : 'bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-slate-700 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-teal-700 dark:hover:text-teal-300'
            }`}
            title={
              isRecording
                ? 'Stop recording voice'
                : speechSupported
                ? language === 'ta'
                  ? 'குரல் மூலம் கேட்க (Voice Input)'
                  : 'Speak your question (Voice Input)'
                : 'Voice input not supported in this browser'
            }
          >
            {isRecording ? (
              <MicOff className="w-4 h-4 text-white" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              isRecording
                ? language === 'ta'
                  ? 'பேசுங்கள்... பதிவு செய்யப்படுகிறது...'
                  : 'Listening to your voice... Speak now...'
                : language === 'ta'
                ? 'உங்கள் நலக் கேள்வியை தட்டச்சு செய்யவும் அல்லது மைக் மூலம் பேசவும்...'
                : 'Ask a health question, or click the mic to speak...'
            }
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={isLoading || (!input.trim() && !isRecording)}
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 shadow-xs shrink-0"
          >
            <span>{language === 'ta' ? 'அனுப்பு' : 'Send'}</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Persistent bottom disclaimer & status */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 px-1">
          <div className="flex items-center gap-1">
            <Info className="w-3 h-3 text-slate-400 dark:text-slate-500 shrink-0" />
            <span>
              {language === 'ta'
                ? 'பொதுவான நலத் தகவல் மட்டுமே. மருத்துவ சிகிச்சை அல்லது மருந்து பரிந்துரைகளுக்கு மாற்றாகாது.'
                : 'AI HEALTH ASSISTANT provides general health education only. Not a substitute for medical diagnosis.'}
            </span>
          </div>
          <span className="font-medium text-slate-500 dark:text-slate-400 hidden sm:inline flex items-center gap-1">
            <Volume2 className="w-3 h-3 text-teal-600 dark:text-teal-400" />
            <span>Voice & Text</span>
          </span>
        </div>
      </div>
    </div>
  );
};

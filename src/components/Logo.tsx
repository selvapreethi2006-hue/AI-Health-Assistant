import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showText = false,
}) => {
  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  }[size];

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Dynamic Healthcare + AI Emblem */}
      <div
        className={`relative ${sizeClasses} rounded-xl overflow-hidden shrink-0 flex items-center justify-center bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-700 shadow-sm shadow-teal-500/20 border border-teal-400/30 group`}
      >
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.35),transparent_70%)]" />

        {/* Crisp SVG Logo: Medical Cross + Cardiac ECG Pulse + AI Sparkle */}
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-4/5 h-4/5 text-white relative z-10 drop-shadow-xs"
        >
          {/* Rounded Medical Cross Base */}
          <path
            d="M14 6C14 4.89543 14.8954 4 16 4H20C21.1046 4 22 4.89543 22 6V14H30C31.1046 14 32 14.8954 32 16V20C32 21.1046 31.1046 22 30 22H22V30C22 31.1046 21.1046 32 20 32H16C14.8954 32 14 31.1046 14 30V22H6C4.89543 22 4 21.1046 4 20V16C4 14.8954 4.89543 14 6 14H14V6Z"
            fill="white"
            fillOpacity="0.22"
          />

          {/* ECG Pulse Heartbeat Line Across Center */}
          <path
            d="M5 18H11L13.5 12L17.5 24L20.5 15L22.5 19.5L24 18H31"
            stroke="white"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* AI Intelligence Sparkle Star in Top-Right */}
          <path
            d="M26 6C26 8.2 27.8 10 30 10C27.8 10 26 11.8 26 14C26 11.8 24.2 10 22 10C24.2 10 26 8.2 26 6Z"
            fill="#FEF08A"
            className="animate-pulse"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-tight min-w-0">
          <span className="font-bold text-slate-900 dark:text-white tracking-tight text-sm sm:text-base whitespace-nowrap">
            AI HEALTH ASSISTANT
          </span>
          <span className="text-[11px] text-teal-700 dark:text-teal-400 font-medium tracking-wide whitespace-nowrap">
            Wellness & Medical Intelligence
          </span>
        </div>
      )}
    </div>
  );
};

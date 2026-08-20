import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true }) => {
  const sizeMap = {
    sm: { box: 'w-8 h-8 p-1', icon: 'w-6 h-6', text: 'text-xl' },
    md: { box: 'w-10 h-10 p-1.5', icon: 'w-7 h-7', text: 'text-2xl' },
    lg: { box: 'w-14 h-14 p-2', icon: 'w-10 h-10', text: 'text-3xl' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className="flex items-center gap-3.5 group cursor-pointer select-none">
      {/* Contained box/frame with lighter background so it doesn't blend into dark sections */}
      <div 
        id="moreman-logo-frame"
        className={`${currentSize.box} rounded-lg bg-[#00281e] border border-[#73e6cb]/40 flex items-center justify-center shadow-[0_0_15px_rgba(115,230,203,0.18)] transition-all duration-300 group-hover:border-[#73e6cb] group-hover:shadow-[0_0_20px_rgba(115,230,203,0.35)]`}
      >
        <svg 
          viewBox="0 0 512 512" 
          className={`${currentSize.icon} w-full h-full`}
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* M network lines connecting nodes */}
          <path 
            d="M 120 340 L 120 180 L 256 280 L 392 180 L 392 340" 
            stroke="#73e6cb" 
            strokeWidth="36" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          {/* Top-left node */}
          <circle cx="120" cy="180" r="26" fill="#3ebb9e" />
          {/* Bottom-left node */}
          <circle cx="120" cy="340" r="26" fill="#3ebb9e" />
          {/* Top-right node */}
          <circle cx="392" cy="180" r="26" fill="#3ebb9e" />
          {/* Bottom-right node */}
          <circle cx="392" cy="340" r="26" fill="#3ebb9e" />
          {/* Center concentric node ring */}
          <circle cx="256" cy="280" r="64" fill="#00281e" stroke="#00513e" strokeWidth="18" />
          {/* Center core pulse circle */}
          <circle cx="256" cy="280" r="44" fill="#73e6cb" />
          {/* Plus sign in center */}
          <path 
            d="M 256 260 L 256 300 M 236 280 L 276 280" 
            stroke="#003829" 
            strokeWidth="14" 
            strokeLinecap="round" 
          />
        </svg>
      </div>

      {showText && (
        <span 
          id="moreman-brand-name"
          className={`${currentSize.text} font-bold text-[#85d6b8] tracking-tight font-sans drop-shadow-[0_0_10px_rgba(133,214,184,0.2)]`}
        >
          Moreman
        </span>
      )}
    </div>
  );
};

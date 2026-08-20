import React from 'react';

interface AnimatedRadarProps {
  className?: string;
}

export const AnimatedRadar: React.FC<AnimatedRadarProps> = ({ className = '' }) => {
  return (
    <div className={`relative w-full h-full flex items-center justify-center overflow-hidden bg-[#070c0a] ${className}`}>
      {/* Scanlines overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20 z-10"
        style={{
          backgroundImage: 'linear-gradient(rgba(115, 230, 203, 0.15) 1px, transparent 1px)',
          backgroundSize: '100% 4px',
        }}
      />

      {/* Grid circular rings background */}
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full max-h-40 transform scale-110"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background coordinate grid */}
        <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(115, 230, 203, 0.08)" strokeWidth="0.5" strokeDasharray="2,2" />
        <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(115, 230, 203, 0.08)" strokeWidth="0.5" strokeDasharray="2,2" />
        <circle cx="50" cy="50" r="15" fill="none" stroke="rgba(115, 230, 203, 0.12)" strokeWidth="0.5" />
        <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(115, 230, 203, 0.1)" strokeWidth="0.5" />
        <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(115, 230, 203, 0.08)" strokeWidth="0.5" />

        {/* Central static node */}
        <circle cx="50" cy="50" fill="#73E6CB" r="3.5" />

        {/* Pulse ring 1 */}
        <circle cx="50" cy="50" fill="none" r="4" stroke="#73E6CB" strokeWidth="1.8">
          <animate 
            attributeName="r" 
            begin="0s; pulse.end+0.4s" 
            dur="1.8s" 
            fill="freeze" 
            from="4" 
            id="pulse" 
            to="44" 
            repeatCount="indefinite"
          />
          <animate 
            attributeName="opacity" 
            begin="0s; pulse.end+0.4s" 
            dur="1.8s" 
            fill="freeze" 
            from="0.9" 
            to="0" 
            repeatCount="indefinite"
          />
          <animate 
            attributeName="stroke-width" 
            begin="0s; pulse.end+0.4s" 
            dur="1.8s" 
            fill="freeze" 
            from="2" 
            to="0.3" 
            repeatCount="indefinite"
          />
        </circle>

        {/* Pulse ring 2 (delayed secondary echo) */}
        <circle cx="50" cy="50" fill="none" r="4" stroke="#3EBB9E" strokeWidth="1.2">
          <animate 
            attributeName="r" 
            begin="0.4s" 
            dur="1.8s" 
            fill="freeze" 
            from="4" 
            to="36" 
            repeatCount="indefinite"
          />
          <animate 
            attributeName="opacity" 
            begin="0.4s" 
            dur="1.8s" 
            fill="freeze" 
            from="0.7" 
            to="0" 
            repeatCount="indefinite"
          />
        </circle>

        {/* Outer subtle wave */}
        <circle cx="50" cy="50" fill="none" r="4" stroke="#85d6b8" strokeWidth="0.8">
          <animate 
            attributeName="r" 
            begin="0.8s" 
            dur="2.2s" 
            fill="freeze" 
            from="4" 
            to="48" 
            repeatCount="indefinite"
          />
          <animate 
            attributeName="opacity" 
            begin="0.8s" 
            dur="2.2s" 
            fill="freeze" 
            from="0.5" 
            to="0" 
            repeatCount="indefinite"
          />
        </circle>

        {/* Shelby stream indicator text */}
        <text x="50" y="92" textAnchor="middle" fill="#73E6CB" fontSize="3.8" fontFamily="monospace" opacity="0.65" letterSpacing="0.4">
          SHELBY PROTOCOL STREAM // ACTIVE
        </text>
      </svg>
    </div>
  );
};

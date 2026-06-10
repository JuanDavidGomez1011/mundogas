import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = 'h-10 w-10', showText = true }) => {
  return (
    <div className="flex items-center gap-2 select-none">
      {/* SVG Icon resembling Earth + Gas Flame ring */}
      <svg
        className={className}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Earth Gradient: Light green to vibrante emerald */}
          <radialGradient id="earthGrad" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#86efac" /> {/* green-300 */}
            <stop offset="70%" stopColor="#22c55e" /> {/* green-500 */}
            <stop offset="100%" stopColor="#15803d" /> {/* green-700 */}
          </radialGradient>
          
          {/* Ocean Path Gradient: Deep Ocean Blue */}
          <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" /> {/* blue-500 */}
            <stop offset="100%" stopColor="#1d4ed8" /> {/* blue-700 */}
          </linearGradient>

          {/* Gas Flame Ring Glow */}
          <linearGradient id="flameGrad" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#06b6d4" /> {/* cyan-500 */}
            <stop offset="50%" stopColor="#0ea5e9" /> {/* sky-500 */}
            <stop offset="100%" stopColor="#2563eb" /> {/* blue-600 */}
          </linearGradient>

          {/* Glow filter */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer/Behind part of the gas flame ring to give 3D overlap effect */}
        <path
          d="M 15 65 C 10 40, 90 20, 85 45"
          stroke="url(#flameGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          filter="url(#glow)"
          opacity="0.85"
        />

        {/* Planet Earth Base (Green Sphere) */}
        <circle cx="50" cy="50" r="38" fill="url(#earthGrad)" />

        {/* Ocean continents details (abstract representations in blue) */}
        <path
          d="M 32 20 Q 42 22 45 30 T 35 48 T 22 52 Q 18 42 22 30 Z"
          fill="url(#oceanGrad)"
          opacity="0.9"
        />
        <path
          d="M 68 35 Q 78 30 82 45 T 75 68 T 58 75 Q 48 65 52 50 T 68 35 Z"
          fill="url(#oceanGrad)"
          opacity="0.9"
        />
        <path
          d="M 45 42 Q 52 45 48 55 T 38 68 Q 30 72 32 60 Z"
          fill="url(#oceanGrad)"
          opacity="0.8"
        />

        {/* Front part of the gas flame ring (simulating orbit) */}
        <path
          d="M 85 45 C 80 70, 10 60, 15 65"
          stroke="url(#flameGrad)"
          strokeWidth="8"
          strokeLinecap="round"
          filter="url(#glow)"
        />

        {/* Flame particles on the ring */}
        <circle cx="28" cy="65" r="3" fill="#67e8f9" filter="url(#glow)" />
        <circle cx="50" cy="61" r="2.5" fill="#e0f7fa" filter="url(#glow)" />
        <circle cx="72" cy="53" r="3" fill="#67e8f9" filter="url(#glow)" />
        
        {/* Core gas center flame */}
        <path
          d="M 46 54 Q 50 42 54 54 Z"
          fill="#e0f7fa"
          filter="url(#glow)"
        />
      </svg>

      {/* Brand Text styling */}
      {showText && (
        <div className="flex flex-col leading-none">
          <span className="font-extrabold text-xl tracking-tight text-current">
            Mundo<span className="text-cyan-500">Gas</span>
          </span>
          <span className="text-[9px] uppercase tracking-widest text-emerald-600 font-bold">
            Calentadores
          </span>
        </div>
      )}
    </div>
  );
};

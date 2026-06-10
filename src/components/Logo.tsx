import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = 'h-10 w-10' }) => {
  return (
    <div className="flex items-center gap-2 select-none">
      <img 
        src="/logo.jpg" 
        alt="Mundo Gas Logo" 
        className={`${className} object-contain`}
      />
    </div>
  );
};

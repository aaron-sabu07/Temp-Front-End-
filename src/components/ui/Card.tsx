import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = true
}) => {
  // Base classes that apply to all cards
  const baseClasses = [
    'backdrop-blur-md', // Glass effect
    'border', 
    'rounded-[30px]', // More rounded corners to match design
    'p-6', // Padding
    'flex',
    'flex-col',
    'relative',
    'overflow-hidden',
    'transition-all duration-300 ease-in-out',
    // Dynamic classes for light/dark mode
    'dark:bg-[#212121] dark:border-[#212121] bg-primary-light border-border-light',
    'dark:text-highlight-dark text-highlight-light',
    // Neomorphic shadow effect for dark mode
    'dark:shadow-[15px_15px_30px_rgb(25,25,25),-15px_-15px_30px_rgb(60,60,60)]',
    // Light mode shadow
    'shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.8)]'
  ];

  // Hover effect classes - only applied if hoverable is true
  const hoverClasses = hoverable ? [
    'hover:scale-[1.02]',
    'hover:transition-transform',
    'dark:hover:shadow-[20px_20px_40px_rgb(20,20,20),-20px_-20px_40px_rgb(65,65,65)]',
    'hover:shadow-[12px_12px_20px_rgba(0,0,0,0.15),-12px_-12px_20px_rgba(255,255,255,0.9)]'
  ] : [];

  // Merge all classes together with any custom classes passed in
  const cardClasses = [...baseClasses, ...hoverClasses, className].join(' ');

  return (
    <div 
      className={cardClasses}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
};

export default Card;

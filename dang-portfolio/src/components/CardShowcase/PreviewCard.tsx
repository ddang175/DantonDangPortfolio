import React, { useState } from 'react';
import { CardData } from './types';

interface PreviewCardProps {
  card: CardData;
  isActive: boolean;
  onClick: () => void;
  isMobile?: boolean;
}

const PreviewCard: React.FC<PreviewCardProps> = ({ 
  card, 
  isActive, 
  onClick, 
  isMobile = false 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative flex items-center
        ${isMobile 
          ? 'w-full h-32 px-4' 
          : 'min-w-[220px] max-w-[370px] h-35 px-4'
        }
        text-white font-sans
        transition-all duration-300 ease-out
        cursor-pointer
        backdrop-blur-md bg-black/20 
        border border-white/10
        rounded-xl
        overflow-hidden
        ${isActive ? 'border-purple-400/50 bg-purple-900/20 scale-105 shadow-lg shadow-purple-500/20' : 'scale-100'}
        ${isHovered && !isActive ? 'border-white/30 bg-white/10 scale-101' : ''}
        transform-gpu
        flex-shrink-0
      `}
      style={{
        fontFamily: 'Inter, Arial, sans-serif',
      }}
    >
      {/* Text Content - Left Side */}
      <div className="flex-1 text-left pr-2">
        <h3 className={`
          font-semibold text-sm tracking-wide uppercase
          transition-all duration-300 ease-out
          ${isActive ? 'text-purple-300' : 'text-gray-300'}
          ${isHovered && !isActive ? 'text-white' : ''}
          transform-gpu
          line-clamp-2
        `}>
          {card.title}
        </h3>
        {card.company && (
          <p className={`
            text-purple-400 mt-1 text-xs font-medium tracking-wider
            transition-opacity duration-300 ease-out
            ${isActive ? 'opacity-100' : 'opacity-90'}
          `}>
            {card.company}
          </p>
        )}
        {card.date && (
          <p className={`
            text-purple-300 mt-1 text-xs font-medium tracking-wider uppercase
            transition-opacity duration-300 ease-out
            ${isActive ? 'opacity-100' : 'opacity-80'}
          `}>
            {card.date}
          </p>
        )}
        <p className={`
          text-gray-400 mt-1 text-xs leading-tight
          transition-all duration-300 ease-out
          ${isHovered ? 'text-gray-300' : ''}
          ${isActive ? 'opacity-100' : 'opacity-80'}
          line-clamp-3
        `}>
          {card.shortDescription}
        </p>
      </div>

      {/* Image - Right Side */}
      <div className={`
        w-28 h-28 rounded-lg overflow-hidden bg-black/30 border border-white/10 flex-shrink-0
        transition-all duration-300 ease-out
        ${isActive ? 'border-purple-400/30 shadow-md' : ''}
        ${isHovered && !isActive ? 'border-white/20' : ''}
      `}>
        {(card.previewImageUrl || card.imageUrl) ? (
          <img
            src={card.previewImageUrl || card.imageUrl}
            alt={card.title}
            className="w-full h-full object-cover"
          />
        ) : (
          // Fallback icon if no image
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
        )}
      </div>

      {/* Active indicator */}
      <div className={`
        absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 to-purple-300
        transition-all duration-300 ease-out
        ${isActive ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}
        transform-gpu origin-left
      `} />
    </button>
  );
};

export default PreviewCard;
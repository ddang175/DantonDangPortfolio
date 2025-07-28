import React, { useState, useEffect } from 'react';
import { CardData } from './types';

interface CardModalProps {
  card: CardData;
  onClose: () => void;
  isTransitioning?: boolean;
  isClosing?: boolean;
  isMobile?: boolean;
}

const CardModal: React.FC<CardModalProps> = ({ 
  card, 
  onClose, 
  isTransitioning = false, 
  isClosing = false,
  isMobile = false 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [contentOpacity, setContentOpacity] = useState(1);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Handle content transitions when card changes
  useEffect(() => {
    if (isTransitioning) {
      setContentOpacity(0.3);
    } else {
      setContentOpacity(1);
    }
  }, [isTransitioning]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  // Calculate dynamic positioning to sit just above CardShowcase without overlap
  const getModalPositioning = () => {
    if (isMobile) {
      return {
        bottom: 'calc(340px + 1rem + 1rem)', // CardShowcase height + bottom gap + modal gap
        maxHeight: 'calc(100vh - 340px - 1rem - 1rem - 2rem)', // Screen - CardShowcase - gaps - padding
      };
    } else {
      return {
        bottom: 'calc(17vh + 15vh + 1rem)', // CardShowcase position + height + gap
        maxHeight: 'calc(100vh - 17vh - 15vh - 1rem - 2rem)', // Screen - CardShowcase space - gaps - padding
      };
    }
  };

  const modalPositioning = getModalPositioning();

  return (
    <div 
      className="fixed inset-x-0 z-[70] flex items-end justify-center p-4 pointer-events-none"
      style={{ 
        bottom: modalPositioning.bottom
      }}
    >
      <div 
        className="absolute inset-0 pointer-events-auto"
        onClick={handleClose}
      />
      
      <div 
        className={`
          relative w-full max-w-4xl bg-black/70 border border-white/20 rounded-2xl
          shadow-2xl overflow-hidden pointer-events-auto
          transition-all duration-300 ease-out
          ${isVisible && !isClosing ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
        `}
        style={{ 
          maxHeight: modalPositioning.maxHeight,
          height: modalPositioning.maxHeight
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-black/80 backdrop-blur-sm">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-wider uppercase">
            {card.title}
          </h2>
          <button
            onClick={handleClose}
            className="
              w-8 h-8 sm:w-10 sm:h-10
              flex items-center justify-center
              text-gray-400 hover:text-white
              transition-colors duration-200
              rounded-full hover:bg-white/10 cursor-pointer
            "
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div 
          className="overflow-y-auto custom-scrollbar transition-opacity duration-150 ease-out"
          style={{ 
            opacity: contentOpacity,
            height: 'calc(100% - 89px)', 
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(255, 255, 255, 0.2) rgba(255, 255, 255, 0.05)'
          }}
        >
          <div className="p-6 space-y-6">
            {(card.modalImageUrl || card.imageUrl) && (
              <div className="w-full">
                <div className="relative aspect-video rounded-lg overflow-hidden bg-black/20">
                  <img
                    src={card.modalImageUrl || card.imageUrl}
                    alt={card.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            <div className="space-y-4">
              {(card.company || card.date) && (
                <div className="flex items-center justify-between">
                  {card.company && (
                    <p className="text-purple-400 text-xl font-medium tracking-wider">
                      {card.company}
                    </p>
                  )}
                  {card.date && (
                    <p className="text-purple-300 text-sm font-medium tracking-wider uppercase">
                      {card.date}
                    </p>
                  )}
                </div>
              )}

              <p className="text-gray-300 leading-relaxed text-base sm:text-lg">
                {card.description}
              </p>

              {card.technologies && card.technologies.length > 0 && (
                <div>
                  <h4 className="text-white font-semibold mb-2 tracking-wider uppercase text-sm">
                    Technologies
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {card.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="
                          px-3 py-1
                          bg-purple-900/30 border border-purple-400/30
                          text-purple-300 text-xs font-medium
                          rounded-full
                          tracking-wider
                        "
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {card.link && (
                <div className="pt-4">
                  <a
                    href={card.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      inline-flex items-center gap-2
                      px-4 py-2
                      bg-purple-600 hover:bg-purple-700
                      text-white font-medium
                      rounded-lg
                      transition-colors duration-200
                      tracking-wider uppercase text-sm
                    "
                  >
                    View Project
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardModal;
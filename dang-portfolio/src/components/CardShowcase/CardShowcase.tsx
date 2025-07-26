import React, { useState, useEffect, useRef } from 'react';
import { CardData } from './types';
import PreviewCard from './PreviewCard';
import CardModal from './CardModal';

interface CardShowcaseProps {
  cards: CardData[];
  onClose: () => void;
  isMobile?: boolean;
}

const CardShowcase: React.FC<CardShowcaseProps> = ({ 
  cards, 
  onClose, 
  isMobile = false 
}) => {
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  const handleCardClick = (index: number) => {
    if (index === activeCardIndex || isTransitioning) return; // Prevent clicks during transition
    
    // Clear any existing timeout
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }
    
    setIsTransitioning(true);
    
    // Faster, smoother transition timing
    transitionTimeoutRef.current = setTimeout(() => {
      setActiveCardIndex(index);
      setIsTransitioning(false);
    }, 100); // Much faster timing for smoother transition
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300); // Match the CardModal transition duration
  };

  const activeCard = cards[activeCardIndex];

  return (
    <>
      {/* Preview Cards Row - Fixed at bottom with higher z-index */}
      <div className={`
        fixed z-60 transition-all duration-300 ease-out
        ${isVisible && !isClosing ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'}
        ${isMobile 
          ? 'bottom-4 left-1/2 transform -translate-x-1/2 w-[90vw] sm:w-[85vw] md:w-[80vw] max-w-[600px]' 
          : 'bottom-[17vh] left-1/2 transform -translate-x-1/2 max-w-[90vw]'
        }
      `}>
        <div className={`
          backdrop-blur-md bg-black/20 
          border border-white/10
          rounded-2xl sm:rounded-3xl
          p-2 sm:p-3 md:p-4
          transition-all duration-300 ease-out
          ${isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
          shadow-2xl shadow-black/50
        `}>
          <div className={`
            ${isMobile 
              ? 'flex flex-col gap-3 sm:gap-4' 
              : 'flex flex-wrap items-center justify-center gap-3 sm:gap-4'
            }
          `}>
            {cards.map((card, index) => (
              <PreviewCard
                key={card.id}
                card={card}
                isActive={index === activeCardIndex}
                onClick={() => handleCardClick(index)}
                isMobile={isMobile}
              />
            ))}
            
            {/* Back Button */}
            <button
              onClick={handleClose}
              className={`
                flex items-center justify-center
                ${isMobile 
                  ? 'w-full h-20' 
                  : 'min-w-[140px] h-20'
                }
                text-white font-sans tracking-widest uppercase
                transition-all duration-300 ease-out
                cursor-pointer
                backdrop-blur-md bg-black/20 
                border border-white/10
                rounded-lg
                hover:border-white/30 hover:bg-white/10
                flex-shrink-0
              `}
              style={{
                fontFamily: 'Inter, Arial, sans-serif',
              }}
            >
              <span className="text-sm font-medium">Back</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Card Modal - Positioned above the CardShowcase */}
      {(isVisible || isClosing) && (
        <CardModal
          card={activeCard}
          onClose={handleClose}
          isTransitioning={isTransitioning}
          isClosing={isClosing}
          isMobile={isMobile}
        />
      )}
    </>
  );
};

export default CardShowcase;
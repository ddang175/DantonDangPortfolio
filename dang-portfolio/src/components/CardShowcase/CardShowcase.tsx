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
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  const handleCardClick = (index: number) => {
    if (index === activeCardIndex || isTransitioning) return; 
    
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }
    
    setIsTransitioning(true);
    
    transitionTimeoutRef.current = setTimeout(() => {
      setActiveCardIndex(index);
      setIsTransitioning(false);
    }, 100); 
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300); 
  };

  const activeCard = cards[activeCardIndex];

  return (
    <>
      <div className={`
        fixed z-60 transition-all duration-300 ease-out
        ${isVisible && !isClosing ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'}
        ${isMobile 
          ? 'bottom-4 left-1/2 transform -translate-x-1/2 w-[92vw] max-w-[92vw]' 
          : 'bottom-[17vh] left-1/2 transform -translate-x-1/2 w-[90vw] max-w-[90vw]'
        }
      `}>
        <div className={`
          transition-all duration-300 ease-out
          ${isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
          ${isMobile ? 'max-h-[340px]' : 'max-h-[20vh]'}
        `}>
          <div className={`
            ${isMobile 
              ? 'max-h-[calc(340px-2rem)] overflow-y-auto custom-scrollbar' 
              : 'max-h-[calc(20vh-2rem)] overflow-y-auto custom-scrollbar'
            }
          `}
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(255, 255, 255, 0.2) rgba(255, 255, 255, 0.05)'
          }}>
            <div className={`
              ${isMobile 
                ? 'flex flex-col gap-3 sm:gap-4 pb-2 w-full px-2 py-2' 
                : 'flex flex-wrap items-center justify-center gap-4 lg:gap-5 xl:gap-6 pb-2 w-full py-2'
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
      </div>

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
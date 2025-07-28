'use client';

import { useEffect, useState, useRef } from 'react';

interface PortfolioButtonProps {
  onButtonClick: () => void;
  className?: string;
}

export default function PortfolioButton({ onButtonClick, className = '' }: PortfolioButtonProps) {
  const ANIMATION_CONFIG = {
    FADE_OUT_DURATION: 300,
    TEXT_ANIMATION_DELAY: 300,
    CURSOR_RETURN_SPEED: 0.9,
    
    CURSOR_INFLUENCE_RADIUS: 150,
    CURSOR_FOLLOW_SPEED: 0.03,
    
    HOVER_SCALE: 1.05,
    HOVER_GLOW_INTENSITY: 1.3,
  };

  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const animate = () => {
      if (buttonRef.current && isVisible) {
        const buttonRect = buttonRef.current.getBoundingClientRect();
        const buttonCenter = {
          x: buttonRect.left + buttonRect.width / 2,
          y: buttonRect.top + buttonRect.height / 2,
        };

        const distance = Math.sqrt(
          Math.pow(mousePosition.x - buttonCenter.x, 2) +
          Math.pow(mousePosition.y - buttonCenter.y, 2)
        );

        if (distance < ANIMATION_CONFIG.CURSOR_INFLUENCE_RADIUS) {
          const influence = 1 - (distance / ANIMATION_CONFIG.CURSOR_INFLUENCE_RADIUS);
          const moveX = (mousePosition.x - buttonCenter.x) * influence * ANIMATION_CONFIG.CURSOR_FOLLOW_SPEED;
          const moveY = (mousePosition.y - buttonCenter.y) * influence * ANIMATION_CONFIG.CURSOR_FOLLOW_SPEED;

          setButtonPosition(prev => ({
            x: prev.x + moveX,
            y: prev.y + moveY,
          }));
        } else {
          setButtonPosition(prev => ({
            x: prev.x * ANIMATION_CONFIG.CURSOR_RETURN_SPEED,
            y: prev.y * ANIMATION_CONFIG.CURSOR_RETURN_SPEED,
          }));
        }
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mousePosition, isVisible]);

  const [shouldRender, setShouldRender] = useState(true);

  const handleClick = () => {
    setIsVisible(false);
    
    setTimeout(() => {
      setShouldRender(false);
      onButtonClick();
    }, ANIMATION_CONFIG.FADE_OUT_DURATION + ANIMATION_CONFIG.TEXT_ANIMATION_DELAY);
  };

  if (!shouldRender) return null;

  return (
    <div 
      className={`absolute inset-0 z-[70] flex items-center justify-center transition-opacity ease-out ${className}`}
      style={{ 
        opacity: isVisible ? 1 : 0,
        transitionDuration: `${ANIMATION_CONFIG.FADE_OUT_DURATION}ms`
      }}
    >
      <button
        ref={buttonRef}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          relative px-12 py-6 sm:px-16 sm:py-8 lg:px-20 lg:py-10
          backdrop-blur-md bg-white/5
          border border-white/20
          rounded-full
          transition-all duration-300 ease-out
          hover:cursor-pointer
          text-lg sm:text-xl lg:text-2xl xl:text-3xl
          font-sans tracking-widest uppercase
          shadow-lg shadow-black/20
        `}
        style={{
          fontFamily: 'Inter, Arial, sans-serif',
          transform: `
            translate(${buttonPosition.x}px, ${buttonPosition.y}px) 
            scale(${isHovered ? ANIMATION_CONFIG.HOVER_SCALE : 1})
          `,
        }}
      >
        <span className={`
          relative z-10 transition-all duration-300 whitespace-nowrap
          ${isHovered ? 'text-white drop-shadow-lg' : 'text-gray-200'}
        `}>
          View Portfolio
        </span>
        
        {/* Underline effect similar to navbar */}
        <div
          className={`
            absolute left-1/2 bottom-3 transform -translate-x-1/2
            w-3/4 h-0.5
            bg-gradient-to-r from-purple-400 to-purple-300
            transition-all duration-300 ease-out
            ${isHovered ? 'opacity-100' : 'opacity-0'}
          `}
        />
      </button>
    </div>
  );
}
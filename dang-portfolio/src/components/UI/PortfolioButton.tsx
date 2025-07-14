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
    
    HOVER_SCALE: 1.1,
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
          relative px-12 py-6 rounded-3xl border-2 transition-all duration-300 ease-out
          bg-transparent border-cyan-50/60 text-cyan-50
          hover:border-cyan-50/80 hover:cursor-pointer
          transform transition-transform duration-300
          backdrop-blur-sm
        `}
        style={{
          fontFamily: 'Zekton, sans-serif',
          fontSize: '2rem',
          fontWeight: 'bold',
          transform: `
            translate(${buttonPosition.x}px, ${buttonPosition.y}px) 
            scale(${isHovered ? ANIMATION_CONFIG.HOVER_SCALE : 1})
          `,
          boxShadow: `
            0 0 10px rgba(236, 254, 255, ${isHovered ? 0.6 * ANIMATION_CONFIG.HOVER_GLOW_INTENSITY : 0.6}),
            0 0 30px rgba(236, 254, 255, ${isHovered ? 0.4 * ANIMATION_CONFIG.HOVER_GLOW_INTENSITY : 0.4}),
            0 0 20px rgba(236, 254, 255, ${isHovered ? 0.2 * ANIMATION_CONFIG.HOVER_GLOW_INTENSITY : 0.2}),
            inset 0 0 30px rgba(236, 254, 255, ${isHovered ? 0.3 : 0.15}),
            inset 0 0 30px rgba(236, 254, 255, ${isHovered ? 0.2 : 0.1})
          `,
          textShadow: `
            0 0 0px rgba(236, 254, 255, ${isHovered ? 0.8 * ANIMATION_CONFIG.HOVER_GLOW_INTENSITY : 0.8}),
            0 0 0px rgba(236, 254, 255, ${isHovered ? 0.6 * ANIMATION_CONFIG.HOVER_GLOW_INTENSITY : 0.6})
          `,
        }}
      >
        View Portfolio
      </button>
    </div>
  );
} 
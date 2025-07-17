"use client";

import { useEffect, useState, useRef } from 'react';

interface ContactButtonProps {
  onButtonClick: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export default function ContactButton({ onButtonClick, className = '', style }: ContactButtonProps) {
  const ANIMATION_CONFIG = {
    FADE_OUT_DURATION: 300,
    TEXT_ANIMATION_DELAY: 300,
    CURSOR_RETURN_SPEED: 0.97,
    CURSOR_INFLUENCE_RADIUS_X: 150,
    CURSOR_INFLUENCE_RADIUS_Y: 80,
    CURSOR_FOLLOW_SPEED: 0.005,
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

        const dx = mousePosition.x - buttonCenter.x;
        const dy = mousePosition.y - buttonCenter.y;
        const withinX = Math.abs(dx) < ANIMATION_CONFIG.CURSOR_INFLUENCE_RADIUS_X;
        const withinY = Math.abs(dy) < ANIMATION_CONFIG.CURSOR_INFLUENCE_RADIUS_Y;

        if (withinX && withinY) {
          const influenceX = 1 - (Math.abs(dx) / ANIMATION_CONFIG.CURSOR_INFLUENCE_RADIUS_X);
          const influenceY = 1 - (Math.abs(dy) / ANIMATION_CONFIG.CURSOR_INFLUENCE_RADIUS_Y);
          const moveX = dx * influenceX * ANIMATION_CONFIG.CURSOR_FOLLOW_SPEED;
          const moveY = dy * influenceY * ANIMATION_CONFIG.CURSOR_FOLLOW_SPEED;

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

  const handleClick = () => {
    onButtonClick();
  };

  const NEON_COLOR = '#6060ff';
  const NEON_SHADOW = '6px 5px 6px rgb(222, 198, 255), -6px 5px 6px rgb(222, 198, 255), 0 10px 70px rgb(111, 0, 255), 0 0px 2px rgb(255, 255, 255)';
  const NEON_SHADOW_HOVER = '5px 3px 15px rgb(222, 198, 255), -5px 3px 15px rgb(222, 198, 255), 0 15px 80px rgb(111, 0, 255), 0 0px 4px rgb(255, 255, 255)';
  const NEON_INSET_SHADOW = 'inset 0 -2px 8px rgb(222, 198, 255), inset 0 0px 20px rgb(72, 0, 167)';
  const NEON_INSET_SHADOW_HOVER = 'inset 0 -3px 5px rgb(222, 198, 255), inset 0 0px 15px rgb(72, 0, 167)';

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative px-10 py-5 rounded-full border-2 transition-all duration-300 ease-out
        bg-black border-[0px] text-white font-bold
        hover:scale-105 hover:cursor-pointer
        shadow-none
        backdrop-blur-sm
        ${className}
      `}
      style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: '2rem',
        fontWeight: '400',
        borderColor: NEON_COLOR,
        background: 'rgba(0,0,0,0.7)',
        backgroundImage: 'linear-gradient(to top, rgb(153, 107, 212) 40%, #ffffff 53%)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        color: 'transparent',
        transform: `translate(${buttonPosition.x}px, ${buttonPosition.y}px) scale(${isHovered ? ANIMATION_CONFIG.HOVER_SCALE : 1})`,
        boxShadow: isHovered ? `${NEON_SHADOW_HOVER}, ${NEON_INSET_SHADOW_HOVER}` : `${NEON_SHADOW}, ${NEON_INSET_SHADOW}`,
        ...style,
      }}
    >
      Contact
    </button>
  );
} 
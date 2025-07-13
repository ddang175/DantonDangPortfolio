'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';

export default function CursorGlow() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [lerpPosition, setLerpPosition] = useState({ x: 0, y: 0 });
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const animate = () => {
      setLerpPosition(prev => ({
        x: prev.x + (position.x - prev.x) * 0.05,
        y: prev.y + (position.y - prev.y) * 0.05,
      }));
      animationRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [position]);

  return (
    <div
      className="pointer-events-none fixed z-[9]"
      style={{
        left: lerpPosition.x - 400,
        top: lerpPosition.y - 400,
        transform: 'translate(0, 0)',
      }}
    >
      <Image
        src="/glow.webp"
        alt="Cursor glow effect"
        width={800}
        height={800}
        className="w-[800px] h-[800px] opacity-80"
        priority
      />
    </div>
  );
} 
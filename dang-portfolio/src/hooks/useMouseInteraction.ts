import { useState, useEffect, useRef } from 'react';

interface MousePosition {
  x: number;
  y: number;
}

export const useMouseInteraction = () => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  
  const lastMousePosition = useRef<MousePosition>({ x: 0, y: 0 });
  const mouseMovementThreshold = 0.001;
  const isMouseMoving = useRef(false);
  const mouseIdleTimeout = useRef<NodeJS.Timeout | null>(null);
  const carTargetIntensity = useRef(0);

  useEffect(() => {
    let lastUpdate = 0;
    const throttleDelay = 32;
    
    const handleMouseMove = (event: MouseEvent) => {
      const now = Date.now();
      if (now - lastUpdate < throttleDelay) return;
      lastUpdate = now;
      
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      const mouseDistance = Math.sqrt(
        (x - lastMousePosition.current.x) ** 2 + 
        (y - lastMousePosition.current.y) ** 2
      );
      
      if (mouseDistance > mouseMovementThreshold) {
        isMouseMoving.current = true;
        carTargetIntensity.current = 1;
        
        if (mouseIdleTimeout.current) {
          clearTimeout(mouseIdleTimeout.current);
        }
        
        mouseIdleTimeout.current = setTimeout(() => {
          isMouseMoving.current = false;
          carTargetIntensity.current = 0;
        }, 1000);
        
        setMousePosition({ x, y });
      }
      
      lastMousePosition.current = { x, y };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (mouseIdleTimeout.current) {
        clearTimeout(mouseIdleTimeout.current);
      }
    };
  }, []);

  return {
    mousePosition,
    isMouseMoving: isMouseMoving.current,
    carTargetIntensity: carTargetIntensity.current,
  };
}; 
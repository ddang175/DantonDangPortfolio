import { useState, useEffect, useRef, useCallback } from 'react';

interface MousePosition {
  x: number;
  y: number;
}

interface MouseInteractionState {
  mousePosition: MousePosition;
  smoothMousePosition: MousePosition;
  isMouseMoving: boolean;
  carTargetIntensity: number;
}

export const useMouseInteraction = () => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  const [smoothMousePosition, setSmoothMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  
  const lastMousePosition = useRef<MousePosition>({ x: 0, y: 0 });
  const mouseMovementThreshold = 0.001;
  const isMouseMoving = useRef(false);
  const mouseIdleTimeout = useRef<NodeJS.Timeout | null>(null);
  const carTargetIntensity = useRef(0);
  const animationRefs = useRef<number[]>([]);
  const isMountedRef = useRef(true);

  const cleanupAnimations = useCallback(() => {
    animationRefs.current.forEach(rafId => {
      if (rafId) cancelAnimationFrame(rafId);
    });
    animationRefs.current = [];
  }, []);

  useEffect(() => {
    let lastUpdate = 0;
    const throttleDelay = 16;
    
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
        }, 100);
        
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

  useEffect(() => {
    const lerpFactor = 0.4;
    let rafId: number;
    
    const animate = () => {
      if (!isMouseMoving.current) {
        rafId = requestAnimationFrame(animate);
        animationRefs.current.push(rafId);
        return;
      }
      
      setSmoothMousePosition(prev => ({
        x: prev.x + (mousePosition.x - prev.x) * lerpFactor,
        y: prev.y + (mousePosition.y - prev.y) * lerpFactor
      }));
      rafId = requestAnimationFrame(animate);
      animationRefs.current.push(rafId);
    };

    rafId = requestAnimationFrame(animate);
    animationRefs.current.push(rafId);
    
    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        animationRefs.current = animationRefs.current.filter(id => id !== rafId);
      }
    };
  }, [mousePosition.x, mousePosition.y]);

  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
      cleanupAnimations();
      if (mouseIdleTimeout.current) {
        clearTimeout(mouseIdleTimeout.current);
      }
    };
  }, [cleanupAnimations]);

  return {
    mousePosition,
    smoothMousePosition,
    isMouseMoving: isMouseMoving.current,
    carTargetIntensity: carTargetIntensity.current,
    cleanupAnimations
  };
}; 
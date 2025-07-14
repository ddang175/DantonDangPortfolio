import { useState, useEffect, useRef } from 'react';
import { useFrameRateLimit } from './useFrameRateLimit';

interface CarAnimationState {
  carRotationX: number;
  carRotationY: number;
  targetRotation: { x: number; y: number };
}

export const useCarAnimation = (isMouseMoving: boolean, carTargetIntensity: number, mousePosition: { x: number; y: number }) => {
  const [carRotationX, setCarRotationX] = useState(0);
  const [carRotationY, setCarRotationY] = useState(0);
  const targetRotationRef = useRef({ x: 0, y: 0 });
  
  const carAnimationIntensity = useRef(0);
  const carEasingSpeed = 0.08;
  const animationRefs = useRef<number[]>([]);

  const { shouldRenderFrame } = useFrameRateLimit({ targetFPS: 45, enabled: true });

  useEffect(() => {
    if (isMouseMoving) {
      const rotationY = Math.atan2(mousePosition.x, 0.5) * 0.5; 
      const rotationX = Math.atan2(-mousePosition.y, 0.5) * 0.3; 
      targetRotationRef.current = { x: rotationX, y: rotationY };
    }
  }, [mousePosition.x, mousePosition.y, isMouseMoving]);

  useEffect(() => {
    const lerpFactor = 0.05;
    let rafId: number;
    
    const animate = () => {
      const currentTime = performance.now();
      
      if (!shouldRenderFrame(currentTime)) {
        rafId = requestAnimationFrame(animate);
        animationRefs.current.push(rafId);
        return;
      }
      
      const currentRotationX = carRotationX;
      const currentRotationY = carRotationY;
      const targetX = targetRotationRef.current.x;
      const targetY = targetRotationRef.current.y;
      
      carAnimationIntensity.current += (carTargetIntensity - carAnimationIntensity.current) * carEasingSpeed;
      
      const distanceToTarget = Math.sqrt(
        (targetX - currentRotationX) ** 2 + 
        (targetY - currentRotationY) ** 2
      );
      
      if (isMouseMoving || distanceToTarget > 0.001) {
        const easedLerpFactor = lerpFactor * carAnimationIntensity.current;
        setCarRotationX(prev => prev + (targetX - prev) * easedLerpFactor);
        setCarRotationY(prev => prev + (targetY - prev) * easedLerpFactor);
      }
      
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
  }, [carRotationX, carRotationY, isMouseMoving, carTargetIntensity]);

  return {
    carRotationX,
    carRotationY
  };
}; 
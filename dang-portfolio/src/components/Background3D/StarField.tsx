'use client';

import { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { useFrameRateLimit } from '../../hooks/useFrameRateLimit';

class StarPool {
  private pool: THREE.Mesh[] = [];
  private activeStars: THREE.Mesh[] = [];
  private maxStars = 70;

  constructor(geometry: THREE.BufferGeometry, material: THREE.Material) {
    for (let i = 0; i < this.maxStars; i++) {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.visible = false;
      this.pool.push(mesh);
    }
  }

  getStar(): THREE.Mesh | null {
    const star = this.pool.pop();
    if (star) {
      star.visible = true;
      this.activeStars.push(star);
      return star;
    }
    return null;
  }

  returnStar(star: THREE.Mesh) {
    star.visible = false;
    this.activeStars = this.activeStars.filter(s => s !== star);
    this.pool.push(star);
  }

  getActiveStars(): THREE.Mesh[] {
    return this.activeStars;
  }

  cleanup() {
    this.pool.forEach(mesh => {
      mesh.geometry.dispose();
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach(mat => mat.dispose());
      } else {
        mesh.material.dispose();
      }
    });
    this.pool = [];
    this.activeStars = [];
  }
}

export default function StarField() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const starPoolRef = useRef<StarPool | null>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const lastMouseUpdate = useRef(0);
  const isMountedRef = useRef(true);
  
  const lastMousePosition = useRef({ x: 0, y: 0 });
  const mouseVelocity = useRef({ x: 0, y: 0 });
  const smoothedMouseVelocity = useRef({ x: 0, y: 0 });
  const mouseMovementThreshold = 0.001;
  const isMouseMoving = useRef(false);
  const mouseIdleTimeout = useRef<NodeJS.Timeout | null>(null);
  
  const animationIntensity = useRef(0);
  const targetIntensity = useRef(0);
  const easingSpeed = 0.08;
  const velocityLerpFactor = 0.15;

  const { shouldRenderFrame } = useFrameRateLimit({ targetFPS: 45, enabled: true });

  const { geometry, material } = useMemo(() => {
    const geo = new THREE.PlaneGeometry(0.04, 0.04);
    const mat = new THREE.MeshBasicMaterial({ 
      color: '#ffffff', 
      transparent: true, 
      opacity: 0.7,
      depthWrite: false,
      depthTest: true
    });
    return { geometry: geo, material: mat };
  }, []);

  useEffect(() => {
    if (!starPoolRef.current) {
      starPoolRef.current = new StarPool(geometry, material);
      
      for (let i = 0; i < 70; i++) {
        const star = starPoolRef.current.getStar();
        if (star) {
          let x, y;
          
          if (i < 50) {
            x = (Math.random() - 0.5) * 12;
            y = (Math.random() - 0.5) * 6;
          } else if (i < 65) {
            x = (Math.random() - 0.5) * 18;
            y = (Math.random() - 0.5) * 10;
          } else {
            x = (Math.random() - 0.5) * 24;
            y = (Math.random() - 0.5) * 14;
          }
          
          const z = -7 + Math.random() * 3;
          
          star.position.set(x, y, z);
          
          (star as any).originalPosition = [x, y, z];
          (star as any).boundary = {
            minX: x - (0.6 + Math.random() * 0.4),
            maxX: x + (0.6 + Math.random() * 0.4),
            minY: y - (0.6 + Math.random() * 0.4),
            maxY: y + (0.6 + Math.random() * 0.4)
          };
          (star as any).parallaxFactor = 0.3 + Math.random() * 0.4;
          (star as any).velocityMultiplier = 0.8 + Math.random() * 1.2;
          (star as any).baseAnimationIntensity = 0.1 + Math.random() * 1.2;
          (star as any).animationIntensity = 0.3 + Math.random() * 0.7;
          (star as any).targetPosition = { x: star.position.x, y: star.position.y };
        }
      }
    }

    return () => {
      if (starPoolRef.current) {
        starPoolRef.current.cleanup();
        starPoolRef.current = null;
      }
    };
  }, [geometry, material]);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!isMountedRef.current) return;
    
    const now = performance.now();
    if (now - lastMouseUpdate.current < 16) return;
    lastMouseUpdate.current = now;
    
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    const mouseDistance = Math.sqrt(
      (x - lastMousePosition.current.x) ** 2 + 
      (y - lastMousePosition.current.y) ** 2
    );
    
    if (mouseDistance > mouseMovementThreshold) {
      isMouseMoving.current = true;
      targetIntensity.current = 1;
      
      if (mouseIdleTimeout.current) {
        clearTimeout(mouseIdleTimeout.current);
      }
      
      mouseIdleTimeout.current = setTimeout(() => {
        isMouseMoving.current = false;
        targetIntensity.current = 0;
      }, 800);
      
      setMousePosition({ x, y });
      
      const deltaX = x - lastMousePosition.current.x;
      const deltaY = y - lastMousePosition.current.y;
      
      mouseVelocity.current.x = deltaX * 0.3;
      mouseVelocity.current.y = deltaY * 0.3;
    }
    
    lastMousePosition.current = { x, y };
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (mouseIdleTimeout.current) {
        clearTimeout(mouseIdleTimeout.current);
      }
    };
  }, [handleMouseMove]);

  useEffect(() => {
    if (!isMountedRef.current) return;
    
    let animationId: number;
    let lastUpdate = 0;
    const throttleInterval = 32;
    
    const animate = (currentTime: number) => {
      if (!isMountedRef.current) return;
      
      if (!shouldRenderFrame(currentTime)) {
        animationId = requestAnimationFrame(animate);
        return;
      }
      
      if (currentTime - lastUpdate < throttleInterval) {
        animationId = requestAnimationFrame(animate);
        return;
      }
      lastUpdate = currentTime;
      
      animationIntensity.current += (targetIntensity.current - animationIntensity.current) * easingSpeed;
      
      smoothedMouseVelocity.current.x += (mouseVelocity.current.x - smoothedMouseVelocity.current.x) * velocityLerpFactor;
      smoothedMouseVelocity.current.y += (mouseVelocity.current.y - smoothedMouseVelocity.current.y) * velocityLerpFactor;
      
      if (animationIntensity.current > 0.001) {
        const mouseDistance = Math.sqrt(mousePosition.x * mousePosition.x + mousePosition.y * mousePosition.y);
        const velocityMagnitude = Math.sqrt(
          smoothedMouseVelocity.current.x * smoothedMouseVelocity.current.x + 
          smoothedMouseVelocity.current.y * smoothedMouseVelocity.current.y
        );
        
        if (mouseDistance > 0.001 || velocityMagnitude > 0.001) {
          const normalizedX = mouseDistance > 0 ? mousePosition.x / mouseDistance : 0;
          const normalizedY = mouseDistance > 0 ? mousePosition.y / mouseDistance : 0;
          
          const velocityX = smoothedMouseVelocity.current.x * 2;
          const velocityY = smoothedMouseVelocity.current.y * 2;
          
          const edgeSlowdown = Math.max(0.6, 1.0 - mouseDistance * 0.2);
          
          if (starPoolRef.current) {
            const activeStars = starPoolRef.current.getActiveStars();
            const activeStarsLength = activeStars.length;
            
            for (let i = 0; i < activeStarsLength; i++) {
              const star = activeStars[i];
              const starData = star as any;
              
              const dynamicIntensity = Math.max(0.1, starData.baseAnimationIntensity - (animationIntensity.current * 0.3));
              const baseMovement = 0.12 * edgeSlowdown * animationIntensity.current * dynamicIntensity;
              const parallaxX = (normalizedX + velocityX) * starData.parallaxFactor * baseMovement * starData.velocityMultiplier;
              const parallaxY = (normalizedY + velocityY) * starData.parallaxFactor * baseMovement * starData.velocityMultiplier * 1.4;
              
              const newX = star.position.x + parallaxX;
              const newY = star.position.y + parallaxY;
              
              const distanceFromMinX = Math.abs(newX - starData.boundary.minX);
              const distanceFromMaxX = Math.abs(newX - starData.boundary.maxX);
              const distanceFromMinY = Math.abs(newY - starData.boundary.minY);
              const distanceFromMaxY = Math.abs(newY - starData.boundary.maxY);
              
              const decelZone = 0.5;
              const boundarySizeX = starData.boundary.maxX - starData.boundary.minX;
              const boundarySizeY = starData.boundary.maxY - starData.boundary.minY;
              const decelDistanceX = boundarySizeX * decelZone;
              const decelDistanceY = boundarySizeY * decelZone;
              
              let decelFactorX = 1.0;
              let decelFactorY = 1.0;
              
              if (newX < starData.boundary.minX + decelDistanceX) {
                const distanceFromMin = newX - starData.boundary.minX;
                decelFactorX = Math.max(0.0, distanceFromMin / decelDistanceX);
              } else if (newX > starData.boundary.maxX - decelDistanceX) {
                const distanceFromMax = starData.boundary.maxX - newX;
                decelFactorX = Math.max(0.0, distanceFromMax / decelDistanceX);
              }
              
              if (newY < starData.boundary.minY + decelDistanceY) {
                const distanceFromMin = newY - starData.boundary.minY;
                decelFactorY = Math.max(0.0, distanceFromMin / decelDistanceY);
              } else if (newY > starData.boundary.maxY - decelDistanceY) {
                const distanceFromMax = starData.boundary.maxY - newY;
                decelFactorY = Math.max(0.0, distanceFromMax / decelDistanceY);
              }
              
              const adjustedX = star.position.x + (parallaxX * decelFactorX);
              const adjustedY = star.position.y + (parallaxY * decelFactorY);
              
              const finalX = Math.max(starData.boundary.minX, Math.min(starData.boundary.maxX, adjustedX));
              const finalY = Math.max(starData.boundary.minY, Math.min(starData.boundary.maxY, adjustedY));

              starData.targetPosition.x = finalX;
              starData.targetPosition.y = finalY;
              
              const lerpFactor = 0.08 + (starData.animationIntensity * 0.12);
              star.position.x += (starData.targetPosition.x - star.position.x) * lerpFactor;
              star.position.y += (starData.targetPosition.y - star.position.y) * lerpFactor;
            }
          }
        }
      }
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate(0);
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [mousePosition.x, mousePosition.y]);

  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (mouseIdleTimeout.current) {
        clearTimeout(mouseIdleTimeout.current);
      }
    };
  }, []);

  return (
    <>
      {starPoolRef.current?.getActiveStars().map((star, index) => (
        <primitive key={index} object={star} />
      ))}
    </>
  );
} 
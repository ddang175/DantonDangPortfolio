'use client';

import { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { useFrameRateLimit } from '../../hooks/useFrameRateLimit';

class StarPool {
  private pool: THREE.Mesh[] = [];
  private activeStars: THREE.Mesh[] = [];
  private maxStars = 60;

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
  const [mouseVelocity, setMouseVelocity] = useState({ x: 0, y: 0 });
  const starPoolRef = useRef<StarPool | null>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const lastMouseUpdate = useRef(0);
  const isMountedRef = useRef(true);
  
  const lastMousePosition = useRef({ x: 0, y: 0 });
  const mouseMovementThreshold = 0.001;
  const isMouseMoving = useRef(false);
  const mouseIdleTimeout = useRef<NodeJS.Timeout | null>(null);
  
  const animationIntensity = useRef(0);
  const targetIntensity = useRef(0);
  const easingSpeed = 0.05;

  const { shouldRenderFrame } = useFrameRateLimit({ targetFPS: 60, enabled: true });

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
      
      for (let i = 0; i < 60; i++) {
        const star = starPoolRef.current.getStar();
        if (star) {
          const x = (Math.random() - 0.5) * 20;
          const y = (Math.random() - 0.5) * 12;
          const z = -10 + Math.random() * 4;
          
          star.position.set(x, y, z);
          
          (star as any).originalPosition = [x, y, z];
          (star as any).boundary = {
            minX: x - (0.3 + Math.random() * 0.15),
            maxX: x + (0.3 + Math.random() * 0.15),
            minY: y - (0.3 + Math.random() * 0.15),
            maxY: y + (0.3 + Math.random() * 0.15)
          };
          (star as any).parallaxFactor = 0.15 + Math.random() * 0.2;
          (star as any).velocityMultiplier = 0.5 + Math.random() * 1.0;
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
      }, 150);
      
      setMousePosition({ x, y });
      
      if (Math.abs(x) > 0.01 || Math.abs(y) > 0.01) {
        setMouseVelocity({ x: x * 0.1, y: y * 0.1 });
      }
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
    const throttleInterval = 20;
    
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
      
      if (animationIntensity.current > 0.001) {
        const mouseDistance = Math.sqrt(mousePosition.x * mousePosition.x + mousePosition.y * mousePosition.y);
        
        if (mouseDistance > 0.001) {
          const normalizedX = mouseDistance > 0 ? mousePosition.x / mouseDistance : 0;
          const normalizedY = mouseDistance > 0 ? mousePosition.y / mouseDistance : 0;
          
          const edgeSlowdown = Math.max(0.3, 1.0 - mouseDistance * 0.5);
          
          if (starPoolRef.current) {
            const activeStars = starPoolRef.current.getActiveStars();
            
            activeStars.forEach(star => {
              const starData = star as any;
              const baseMovement = 0.03 * edgeSlowdown * animationIntensity.current;
              const parallaxX = normalizedX * starData.parallaxFactor * baseMovement * starData.velocityMultiplier;
              const parallaxY = normalizedY * starData.parallaxFactor * baseMovement * starData.velocityMultiplier * 1.2;
              
              const newX = star.position.x + parallaxX;
              const newY = star.position.y + parallaxY;
              
              const distanceFromMinX = Math.abs(newX - starData.boundary.minX);
              const distanceFromMaxX = Math.abs(newX - starData.boundary.maxX);
              const distanceFromMinY = Math.abs(newY - starData.boundary.minY);
              const distanceFromMaxY = Math.abs(newY - starData.boundary.maxY);
              
              const decelZone = 0.3;
              const boundarySizeX = starData.boundary.maxX - starData.boundary.minX;
              const boundarySizeY = starData.boundary.maxY - starData.boundary.minY;
              const decelDistanceX = boundarySizeX * decelZone;
              const decelDistanceY = boundarySizeY * decelZone;
              
              let decelFactorX = 1.0;
              let decelFactorY = 1.0;
              
              if (newX < starData.boundary.minX + decelDistanceX) {
                decelFactorX = Math.max(0.01, (newX - starData.boundary.minX) / decelDistanceX);
              } else if (newX > starData.boundary.maxX - decelDistanceX) {
                decelFactorX = Math.max(0.01, (starData.boundary.maxX - newX) / decelDistanceX);
              }
              
              if (newY < starData.boundary.minY + decelDistanceY) {
                decelFactorY = Math.max(0.01, (newY - starData.boundary.minY) / decelDistanceY);
              } else if (newY > starData.boundary.maxY - decelDistanceY) {
                decelFactorY = Math.max(0.01, (starData.boundary.maxY - newY) / decelDistanceY);
              }
              
              const adjustedX = star.position.x + (parallaxX * decelFactorX);
              const adjustedY = star.position.y + (parallaxY * decelFactorY);
              
              const finalX = Math.max(starData.boundary.minX, Math.min(starData.boundary.maxX, adjustedX));
              const finalY = Math.max(starData.boundary.minY, Math.min(starData.boundary.maxY, adjustedY));

              star.position.set(finalX, finalY, star.position.z);
            });
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
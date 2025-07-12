'use client';

import { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import * as THREE from 'three';

export default function StarField() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mouseVelocity, setMouseVelocity] = useState({ x: 0, y: 0 });
  const starsRef = useRef<Array<{
    mesh: THREE.Mesh;
    light: THREE.PointLight | null;
    originalPosition: [number, number, number];
    boundary: { minX: number; maxX: number; minY: number; maxY: number };
    parallaxFactor: number;
    velocityMultiplier: number;
    velocity: { x: number; y: number };
  }>>([]);
  const animationRef = useRef<number | undefined>(undefined);

  // Create shared geometry and materials for better performance
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

  // Memoize star creation to prevent recreation
  const createStars = useCallback(() => {
    const newStars = Array.from({ length: 80 }, () => { // Further reduced from 100 to 80
      const x = (Math.random() - 0.5) * 20; // Reduced spread for better performance
      const y = (Math.random() - 0.5) * 12; // Reduced spread for better performance
      const z = -10 + Math.random() * 4; // Reduced depth range for better performance
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, y, z);
      
      // Only add lights to a very small subset of stars for optimal performance
      const light = Math.random() > 0.98 ? new THREE.PointLight('#ffffff', 0.008, 0.8) : null; // Further reduced
      if (light) {
        light.position.set(x, y, z);
      }
      
      // Create boundary for each star
      const boundarySize = 0.3 + Math.random() * 0.15; // Smaller boundaries for better performance
      const boundary = {
        minX: x - boundarySize,
        maxX: x + boundarySize,
        minY: y - boundarySize,
        maxY: y + boundarySize
      };
      
      return {
        mesh,
        light,
        originalPosition: [x, y, z] as [number, number, number],
        boundary,
        parallaxFactor: 0.15 + Math.random() * 0.2,
        velocityMultiplier: 0.5 + Math.random() * 1.0,
        velocity: { x: 0, y: 0 }
      };
    });
    
    starsRef.current = newStars;
  }, [geometry, material]);

  useEffect(() => {
    createStars();
  }, [createStars]);

  // Optimized mouse event handling
  const handleMouseMove = useCallback((event: MouseEvent) => {
    const currentTime = performance.now();
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    setMousePosition({ x, y });
    
    // Only calculate velocity if needed
    if (Math.abs(x) > 0.01 || Math.abs(y) > 0.01) {
      setMouseVelocity({ x: x * 0.1, y: y * 0.1 });
    }
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  // Optimized animation loop
  useEffect(() => {
    let animationId: number;
    let lastUpdate = 0;
    const throttleInterval = 20; // Reduced from 16 to 20ms for better performance
    
    const animate = (currentTime: number) => {
      // Throttle updates for better performance
      if (currentTime - lastUpdate < throttleInterval) {
        animationId = requestAnimationFrame(animate);
        return;
      }
      lastUpdate = currentTime;
      
      const mouseDistance = Math.sqrt(mousePosition.x * mousePosition.x + mousePosition.y * mousePosition.y);
      
      // Only animate if mouse has moved significantly
      if (mouseDistance < 0.001) {
        animationId = requestAnimationFrame(animate);
        return;
      }
      
      const normalizedX = mouseDistance > 0 ? mousePosition.x / mouseDistance : 0;
      const normalizedY = mouseDistance > 0 ? mousePosition.y / mouseDistance : 0;
      
      // Apply distance-based slowdown when mouse is near screen edges
      const edgeSlowdown = Math.max(0.3, 1.0 - mouseDistance * 0.5);
      
      starsRef.current.forEach(star => {
        // Direct movement based on mouse position with edge slowdown
        const baseMovement = 0.03 * edgeSlowdown; // Reduced movement for better performance
        const parallaxX = normalizedX * star.parallaxFactor * baseMovement * star.velocityMultiplier;
        const parallaxY = normalizedY * star.parallaxFactor * baseMovement * star.velocityMultiplier * 1.2;
        
        const newX = star.mesh.position.x + parallaxX;
        const newY = star.mesh.position.y + parallaxY;
        
        // Calculate distance from boundary edges for smooth deceleration
        const distanceFromMinX = Math.abs(newX - star.boundary.minX);
        const distanceFromMaxX = Math.abs(newX - star.boundary.maxX);
        const distanceFromMinY = Math.abs(newY - star.boundary.minY);
        const distanceFromMaxY = Math.abs(newY - star.boundary.maxY);
        
        // Define deceleration zone
        const decelZone = 0.3;
        const boundarySizeX = star.boundary.maxX - star.boundary.minX;
        const boundarySizeY = star.boundary.maxY - star.boundary.minY;
        const decelDistanceX = boundarySizeX * decelZone;
        const decelDistanceY = boundarySizeY * decelZone;
        
        // Calculate deceleration factors
        let decelFactorX = 1.0;
        let decelFactorY = 1.0;
        
        if (newX < star.boundary.minX + decelDistanceX) {
          decelFactorX = Math.max(0.01, (newX - star.boundary.minX) / decelDistanceX);
        } else if (newX > star.boundary.maxX - decelDistanceX) {
          decelFactorX = Math.max(0.01, (star.boundary.maxX - newX) / decelDistanceX);
        }
        
        if (newY < star.boundary.minY + decelDistanceY) {
          decelFactorY = Math.max(0.01, (newY - star.boundary.minY) / decelDistanceY);
        } else if (newY > star.boundary.maxY - decelDistanceY) {
          decelFactorY = Math.max(0.01, (star.boundary.maxY - newY) / decelDistanceY);
        }
        
        // Apply deceleration to movement
        const adjustedX = star.mesh.position.x + (parallaxX * decelFactorX);
        const adjustedY = star.mesh.position.y + (parallaxY * decelFactorY);
        
        // Clamp position within star's boundary
        const finalX = Math.max(star.boundary.minX, Math.min(star.boundary.maxX, adjustedX));
        const finalY = Math.max(star.boundary.minY, Math.min(star.boundary.maxY, adjustedY));

        // Update positions directly
        star.mesh.position.set(finalX, finalY, star.mesh.position.z);
        if (star.light) {
          star.light.position.set(finalX, finalY, star.light.position.z);
        }
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate(0);
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [mousePosition.x, mousePosition.y]);

  return (
    <>
      {starsRef.current.map((star, index) => (
        <primitive key={index} object={star.mesh} />
      ))}
      {starsRef.current.map((star, index) => (
        star.light && <primitive key={`light-${index}`} object={star.light} />
      ))}
    </>
  );
} 
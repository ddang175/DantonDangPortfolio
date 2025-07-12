'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense, useState, useEffect, useRef, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import StarField from './StarField';
import ModelLoader from './ModelLoader';
import NeonText3D from './NeonText3D';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

// Memoized letter configurations to prevent recreation
const NAME_LETTERS_CONFIG = [
  { char: 'D', position: [-0.4, 0.46, 0], baseRotation: [0.25, 0.15, 0.1] },
  { char: 'A', position: [-0.24, 0.46, 0], baseRotation: [0.45, 0.4, -0.15] },
  { char: 'N', position: [-0.08, 0.46, 0], baseRotation: [0.28, -0.13, 0.15] },
  { char: 'T', position: [0.08, 0.46, 0], baseRotation: [-0.12, 0.27, -0.13] },
  { char: 'O', position: [0.24, 0.46, 0], baseRotation: [0.35, -0.1, 0.05] },
  { char: 'N', position: [0.4, 0.46, 0], baseRotation: [-0.18, 0.22, -0.12] },
  { char: 'D', position: [-0.24, 0.32, 0], baseRotation: [0.32, -0.18, 0.13] },
  { char: 'A', position: [-0.08, 0.32, 0], baseRotation: [0.45, -0.4, -0.15] },
  { char: 'N', position: [0.08, 0.32, 0], baseRotation: [0.26, 0.12, 0.2] },
  { char: 'G', position: [0.24, 0.32, 0], baseRotation: [-0.2, -0.22, 0.14] },
];

const SWE_LETTERS_CONFIG = [
  // "SOFTWARE" on top row
  { char: 'S', position: [-1.06, -1.34, -2.5], baseRotation: [-0.58, 0.17, 0.14] },
  { char: 'O', position: [-0.78, -1.34, -2.5], baseRotation: [-0.61, -0.13, -0.12] },
  { char: 'F', position: [-0.50, -1.34, -2.5], baseRotation: [-0.56, 0.19, 0.16] },
  { char: 'T', position: [-0.22, -1.34, -2.5], baseRotation: [-0.63, 0.12, -0.13] },
  { char: 'W', position: [0.06, -1.34, -2.5], baseRotation: [-0.59, -0.16, 0.15] },
  { char: 'A', position: [0.34, -1.34, -2.5], baseRotation: [-0.62, 0.15, -0.14] },
  { char: 'R', position: [0.62, -1.34, -2.5], baseRotation: [-0.57, -0.14, 0.13] },
  { char: 'E', position: [0.90, -1.34, -2.5], baseRotation: [-0.60, 0.18, -0.15] },
  // "ENGINEER" on bottom row
  { char: 'E', position: [-1.06, -1.68, -2.5], baseRotation: [-0.68, 0.14, 0.17] },
  { char: 'N', position: [-0.78, -1.68, -2.5], baseRotation: [-0.71, -0.15, -0.11] },
  { char: 'G', position: [-0.50, -1.68, -2.5], baseRotation: [-0.66, 0.20, 0.19] },
  { char: 'I', position: [-0.22, -1.68, -2.5], baseRotation: [-0.73, 0.11, -0.14] },
  { char: 'N', position: [0.06, -1.68, -2.5], baseRotation: [-0.69, -0.17, 0.16] },
  { char: 'E', position: [0.34, -1.68, -2.5], baseRotation: [-0.72, 0.16, -0.13] },
  { char: 'E', position: [0.62, -1.68, -2.5], baseRotation: [-0.67, -0.13, 0.15] },
  { char: 'R', position: [0.90, -1.68, -2.5], baseRotation: [-0.70, 0.19, -0.16] },
];

// Pre-calculated constants for better performance
const NAME_COLORS = { text: '#796094', light: '#d09eff' };
const SWE_COLORS = { text: '#796094', light: '#d09eff' };

function Background3D({ modelPath }: { modelPath: string }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [carRotationX, setCarRotationX] = useState(0);
  const [carRotationY, setCarRotationY] = useState(0);
  const targetRotationRef = useRef({ x: 0, y: 0 });
  
  // Smooth mouse position for delayed letter reactions
  const [smoothMousePosition, setSmoothMousePosition] = useState({ x: 0, y: 0 });

  // Memoized reactive rotation functions to prevent recreation
  const getReactiveRotationName = useCallback((baseRotation: [number, number, number], position: [number, number, number]) => {
    const mouseInfluence = 0.9;
    const proximityRadius = 1;
    const maxDistance = 1.2;
    
    // Pre-calculate values for better performance
    const letterScreenX = position[0] * 0.5;
    const letterScreenY = position[1] * 0.5;
    const adjustedMouseY = smoothMousePosition.y - 0.4;
    
    const mouseToLetterDistance = Math.sqrt(
      (smoothMousePosition.x - letterScreenX) ** 2 + 
      (adjustedMouseY - letterScreenY) ** 2
    );
    
    let proximityInfluence = 0;
    if (mouseToLetterDistance < proximityRadius) {
      proximityInfluence = Math.pow(1 - (mouseToLetterDistance / proximityRadius), 3);
      proximityInfluence = Math.max(0, Math.min(1, proximityInfluence));
    } else if (mouseToLetterDistance < maxDistance) {
      proximityInfluence = 0.05 * (1 - (mouseToLetterDistance - proximityRadius) / (maxDistance - proximityRadius));
      proximityInfluence = Math.max(0, Math.min(0.05, proximityInfluence));
    }
    
    // Optimized calculation - single influence value
    const influence = mouseInfluence * proximityInfluence;
    const smoothedX = smoothMousePosition.x * influence;
    const smoothedY = smoothMousePosition.y * influence;
    const smoothedZ = (smoothMousePosition.x + smoothMousePosition.y) * influence * 0.5;
    
    return [
      Math.max(-1, Math.min(1, baseRotation[0] + smoothedY)),
      Math.max(-1, Math.min(1, baseRotation[1] + smoothedX)),
      Math.max(-1, Math.min(1, baseRotation[2] + smoothedZ))
    ] as [number, number, number];
  }, [smoothMousePosition.x, smoothMousePosition.y]);

  const getReactiveRotationSWE = useCallback((baseRotation: [number, number, number], position: [number, number, number]) => {
    const mouseInfluence = 0.9;
    const proximityRadius = 1.0;
    const maxDistance = 1.5;
    
    // Pre-calculate values for better performance
    const letterScreenX = position[0] * 0.5;
    const letterScreenY = position[1] * 0.5;
    
    const mouseToLetterDistance = Math.sqrt(
      (smoothMousePosition.x - letterScreenX) ** 2 + 
      (smoothMousePosition.y - letterScreenY) ** 2
    );
    
    let proximityInfluence = 0;
    if (mouseToLetterDistance < proximityRadius) {
      proximityInfluence = Math.pow(1 - (mouseToLetterDistance / proximityRadius), 3);
      proximityInfluence = Math.max(0, Math.min(1, proximityInfluence));
    } else if (mouseToLetterDistance < maxDistance) {
      proximityInfluence = 0.05 * (1 - (mouseToLetterDistance - proximityRadius) / (maxDistance - proximityRadius));
      proximityInfluence = Math.max(0, Math.min(0.05, proximityInfluence));
    }
    
    // Optimized calculation - single influence value
    const influence = mouseInfluence * proximityInfluence;
    const smoothedX = smoothMousePosition.x * influence;
    const smoothedY = smoothMousePosition.y * influence;
    const smoothedZ = (smoothMousePosition.x + smoothMousePosition.y) * influence * 0.5;
    
    return [
      Math.max(-1, Math.min(1, baseRotation[0] + smoothedY)),
      Math.max(-1, Math.min(1, baseRotation[1] + smoothedX)),
      Math.max(-1, Math.min(1, baseRotation[2] + smoothedZ))
    ] as [number, number, number];
  }, [smoothMousePosition.x, smoothMousePosition.y]);

  // Memoized letter arrays to prevent recreation
  const nameLetters = useMemo(() => 
    NAME_LETTERS_CONFIG.map(config => ({
      char: config.char,
      position: config.position as [number, number, number],
      rotation: getReactiveRotationName(config.baseRotation as [number, number, number], config.position as [number, number, number])
    })), [getReactiveRotationName]);

  const sweLetters = useMemo(() => 
    SWE_LETTERS_CONFIG.map(config => ({
      char: config.char,
      position: config.position as [number, number, number],
      rotation: getReactiveRotationSWE(config.baseRotation as [number, number, number], config.position as [number, number, number])
    })), [getReactiveRotationSWE]);

  // Optimized mouse event handling with throttling
  useEffect(() => {
    let lastUpdate = 0;
    const throttleDelay = 16; // ~60fps throttling
    
    const handleMouseMove = (event: MouseEvent) => {
      const now = Date.now();
      if (now - lastUpdate < throttleDelay) return;
      lastUpdate = now;
      
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      setMousePosition({ x, y });
      
      const rotationY = Math.atan2(x, 0.5) * 0.5; 
      const rotationX = Math.atan2(-y, 0.5) * 0.3; 
      
      targetRotationRef.current = { x: rotationX, y: rotationY };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Optimized smooth mouse position for delayed letter reactions
  useEffect(() => {
    const lerpFactor = 0.4;
    let rafId: number;
    
    const animate = () => {
      setSmoothMousePosition(prev => ({
        x: prev.x + (mousePosition.x - prev.x) * lerpFactor,
        y: prev.y + (mousePosition.y - prev.y) * lerpFactor
      }));
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [mousePosition.x, mousePosition.y]);

  // Optimized car rotation animation
  useEffect(() => {
    const lerpFactor = 0.025;
    let rafId: number;
    
    const animate = () => {
      setCarRotationX(prev => prev + (targetRotationRef.current.x - prev) * lerpFactor);
      setCarRotationY(prev => prev + (targetRotationRef.current.y - prev) * lerpFactor);
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ 
          position: [0, 0, 1],
          fov: 65,
          near: 0.1, 
          far: 40
        }}
        style={{ background: 'transparent' }}
        gl={{ 
          alpha: true,
          powerPreference: "low-power",
          stencil: false,
          depth: true,
          logarithmicDepthBuffer: false,
          precision: "lowp",
          preserveDrawingBuffer: false,
          failIfMajorPerformanceCaveat: false,
          antialias: false,
        }}
        shadows={false}
        dpr={[0.5, 0.6]}
        frameloop="demand"
        performance={{ min: 0.5 }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          gl.toneMapping = THREE.NoToneMapping;
          gl.outputColorSpace = THREE.SRGBColorSpace;
        }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.0} color="#000000" />
          
          <StarField />
          
          {/* Optimized lights with reduced intensity for better performance */}
          <pointLight 
            position={[-0.24, 0.39, 1.2]}
            intensity={4}
            distance={5}
            color="#d9b8ff"
          />
          
          <pointLight 
            position={[0.24, 0.39, 1.2]} 
            intensity={4}
            distance={5}
            color="#d9b8ff"
          />

          {/* Lights for SOFTWARE ENGINEER text - using point lights for better performance */}
          <pointLight 
            position={[-0.64, -1.51, -1.5]} 
            intensity={4.7}
            distance={4}
            color="#d9b8ff"
          />
          
          <pointLight 
            position={[0.64, -1.51, -1.5]} 
            intensity={4.7}
            distance={4}
            color="#d9b8ff"
          />

          <NeonText3D
            letters={nameLetters}
            fontSize={0.07}
            height={0.02}
            color={NAME_COLORS.text}
            lightColor={NAME_COLORS.light}
          />
          
          <NeonText3D
            letters={sweLetters}
            fontSize={0.1}
            height={0.02}
            color={SWE_COLORS.text}
            lightColor={SWE_COLORS.light}
          />
          
          <ModelLoader modelPath={modelPath} rotationX={carRotationX} rotationY={carRotationY} />
          
          <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            enableRotate={false} 
            autoRotate={false} 
            target={[0, 0, 0]}
          />
          
          {/* Optimized post-processing effects */}
          <EffectComposer multisampling={0}>
            <Bloom
              intensity={1.3}
              luminanceThreshold={0.85}
              luminanceSmoothing={0.25}
              radius={0.7}
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}

export default dynamic(() => Promise.resolve(Background3D), {
  ssr: false,
  loading: () => <div className="absolute inset-0 z-0 bg-black" />
}); 
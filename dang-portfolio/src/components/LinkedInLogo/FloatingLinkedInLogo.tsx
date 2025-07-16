'use client';

import { useGLTF } from '@react-three/drei';
import { useRef, useMemo, useCallback, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useFrameRateLimit } from '../../hooks/useFrameRateLimit';

interface FloatingLinkedInLogoProps {
  linkedInUrl?: string;
  boundarySize?: number;
  glowColor?: string;
  emissiveColor?: string;
}

const FLOATING_CONFIG = {
  PITCH_SPEED: 0.4,
  YAW_SPEED: 0.6,
  ROLL_SPEED: 0.3,
  PITCH_AMPLITUDE: 0.05,
  YAW_AMPLITUDE: 0.07,
  ROLL_AMPLITUDE: 0.03,
  POSITION_SPEED: 0.15,
  POSITION_AMPLITUDE: 0.12,
  PHASE_OFFSET: 2.5,
  HOVER_SCALE: 1.2,
  HOVER_INTENSITY: 6.0,
  BASE_EMISSIVE_INTENSITY: 7,
  BASE_COLOR: '#0077b5', // LinkedIn blue, lighter than #003366
  HOVER_COLOR: '#38b6ff', // light blue
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function lerpColor(a: string, b: string, t: number) {
  // a, b are hex strings
  const ah = parseInt(a.replace('#', ''), 16);
  const bh = parseInt(b.replace('#', ''), 16);
  const ar = (ah >> 16) & 0xff, ag = (ah >> 8) & 0xff, ab = ah & 0xff;
  const br = (bh >> 16) & 0xff, bg = (bh >> 8) & 0xff, bb = bh & 0xff;
  const rr = Math.round(lerp(ar, br, t));
  const rg = Math.round(lerp(ag, bg, t));
  const rb = Math.round(lerp(ab, bb, t));
  return `#${((1 << 24) + (rr << 16) + (rg << 8) + rb).toString(16).slice(1)}`;
}

function LinkedInModel({ 
  url, 
  boundarySize = 0.005,
  onLogoClick 
}: { 
  url: string; 
  boundarySize: number;
  onLogoClick: () => void;
}) {
  const { scene } = useGLTF(url);
  const groupRef = useRef<THREE.Group>(null);
  const basePosition = useRef<[number, number, number]>([-0.74, -1, -1.3]);
  const isHovered = useRef(false);
  const materialsRef = useRef<THREE.Material[]>([]);

  // Animation state for smooth transitions
  const hoverT = useRef(0); // 0 = not hovered, 1 = hovered
  const targetHoverT = useRef(0);

  // Track hover state for cursor
  const [isHoveredState, setIsHoveredState] = useState(false);

  // Set cursor style on hover using effect
  useEffect(() => {
    if (isHoveredState) {
      document.body.style.cursor = 'pointer';
    } else {
      document.body.style.cursor = '';
    }
    return () => {
      document.body.style.cursor = '';
    };
  }, [isHoveredState]);

  const { shouldRenderFrame } = useFrameRateLimit({ targetFPS: 30, enabled: true });

  const material = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: FLOATING_CONFIG.BASE_COLOR,
      emissive: FLOATING_CONFIG.BASE_COLOR,
      emissiveIntensity: FLOATING_CONFIG.BASE_EMISSIVE_INTENSITY,
      metalness: 0.9,
      roughness: 0.1,
      envMapIntensity: 1.5,
      transparent: false,
      opacity: 1.0,
      alphaTest: 0.5,
      depthWrite: true,
      depthTest: true,
      fog: false,
    });
    return mat;
  }, []);

  const optimizedScene = useMemo(() => {
    const optimizedScene = scene.clone();
    optimizedScene.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = false;
        child.receiveShadow = false;
        child.frustumCulled = true;
        child.material = material;
      }
    });
    return optimizedScene;
  }, [scene, material]);

  const handleClick = useCallback((event: any) => {
    event.stopPropagation();
    onLogoClick();
  }, [onLogoClick]);

  const handlePointerEnter = useCallback(() => {
    isHovered.current = true;
    targetHoverT.current = 1;
    setIsHoveredState(true);
  }, []);

  const handlePointerLeave = useCallback(() => {
    isHovered.current = false;
    targetHoverT.current = 0;
    setIsHoveredState(false);
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    if (!shouldRenderFrame(state.clock.elapsedTime * 1000)) return;
    const time = state.clock.elapsedTime;

    // Smoothly interpolate hoverT (no React state update)
    hoverT.current += (targetHoverT.current - hoverT.current) * 0.15;

    // Rotation animation only
    const pitchOffset = Math.sin(time * FLOATING_CONFIG.PITCH_SPEED) * FLOATING_CONFIG.PITCH_AMPLITUDE;
    const yawOffset = Math.cos(time * FLOATING_CONFIG.YAW_SPEED) * FLOATING_CONFIG.YAW_AMPLITUDE;
    const rollOffset = Math.sin(time * FLOATING_CONFIG.ROLL_SPEED) * FLOATING_CONFIG.ROLL_AMPLITUDE;
    groupRef.current.rotation.x = pitchOffset;
    groupRef.current.rotation.y = yawOffset;
    groupRef.current.rotation.z = rollOffset;

    // Fixed position (no floating)
    groupRef.current.position.set(
      basePosition.current[0],
      basePosition.current[1],
      basePosition.current[2]
    );

    // Smooth scale
    const baseScale = 0.15;
    const scale = lerp(baseScale, baseScale * FLOATING_CONFIG.HOVER_SCALE, hoverT.current);
    groupRef.current.scale.setScalar(scale);

    // Always-on glow with subtle pulse
    const basePulse = 0.2 * Math.sin(time * 2) + 1; // ranges from 0.8 to 1.2
    const currentColor = lerpColor(FLOATING_CONFIG.BASE_COLOR, FLOATING_CONFIG.HOVER_COLOR, hoverT.current);
    const currentEmissive = lerp(
      FLOATING_CONFIG.BASE_EMISSIVE_INTENSITY * basePulse,
      FLOATING_CONFIG.HOVER_INTENSITY,
      hoverT.current
    );
    if (material.emissive.getHexString() !== new THREE.Color(currentColor).getHexString()) {
      material.emissive = new THREE.Color(currentColor);
    }
    if (material.emissiveIntensity !== currentEmissive) {
      material.emissiveIntensity = currentEmissive;
    }
  });

  return (
    <group 
      ref={groupRef}
      position={basePosition.current}
    >
      <primitive object={optimizedScene} />
      {/* Invisible clickable area that covers the entire logo space */}
      <mesh
        onClick={handleClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        position={[0, 0, 0]}
      >
        <boxGeometry args={[2.3, 2.3, 0.1]} />
        <meshBasicMaterial 
          transparent={true} 
          opacity={0} 
          colorWrite={false}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

export default function FloatingLinkedInLogo({
  linkedInUrl = "https://www.linkedin.com/in/ddang175",
  boundarySize = 0.005,
  glowColor = '#0077b5',
  emissiveColor = '#00a0dc'
}: FloatingLinkedInLogoProps) {
  const handleLogoClick = useCallback(() => {
    window.open(linkedInUrl, '_blank', 'noopener,noreferrer');
  }, [linkedInUrl]);
  return (
    <LinkedInModel 
      url="/linkedin_3d/scene.gltf"
      boundarySize={boundarySize}
      onLogoClick={handleLogoClick}
    />
  );
}

useGLTF.preload('/linkedin_3d/scene.gltf'); 
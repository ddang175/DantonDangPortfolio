// FloatingResumeLogo.tsx
'use client';

import { useGLTF } from '@react-three/drei';
import { useRef, useMemo, useCallback, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useFrameRateLimit } from '../../hooks/useFrameRateLimit';
import { GLTF } from 'three-stdlib';

interface FloatingResumeLogoProps {
  resumeUrl?: string;
  boundarySize?: number;
  glowColor?: string;
  emissiveColor?: string;
  baseRotation?: [number, number, number];
  clickBoxScale?: [number, number, number];
}

const FLOATING_CONFIG = {
  PITCH_SPEED: 0.4,
  YAW_SPEED: 0.7,
  ROLL_SPEED: 0.5,
  PITCH_AMPLITUDE: 0.15,
  YAW_AMPLITUDE: 0.15,
  ROLL_AMPLITUDE: 0.15,
  POSITION_SPEED: 0.15,
  POSITION_AMPLITUDE: 0.03,
  PHASE_OFFSET: 2.5,
  HOVER_SCALE: 1.2,
  HOVER_INTENSITY: 3.0,
  BASE_EMISSIVE_INTENSITY: 1.0,
  BASE_COLOR: '#ffffff', // white
  HOVER_COLOR: '#ffffff', // white
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function lerpColor(a: string, b: string, t: number) {
  const ah = parseInt(a.replace('#', ''), 16);
  const bh = parseInt(b.replace('#', ''), 16);
  const ar = (ah >> 16) & 0xff, ag = (ah >> 8) & 0xff, ab = ah & 0xff;
  const br = (bh >> 16) & 0xff, bg = (bh >> 8) & 0xff, bb = bh & 0xff;
  const rr = Math.round(lerp(ar, br, t));
  const rg = Math.round(lerp(ag, bg, t));
  const rb = Math.round(lerp(ab, bb, t));
  return `#${((1 << 24) + (rr << 16) + (rg << 8) + rb).toString(16).slice(1)}`;
}

function ResumeModel({ 
  url, 
  boundarySize = 0.005,
  onLogoClick,
  baseRotation = [0, 0, 0],
  clickBoxScale = [0.06, 0.06, 0.02],
}: {
  url: string;
  boundarySize?: number;
  onLogoClick: () => void;
  baseRotation?: [number, number, number];
  clickBoxScale?: [number, number, number];
}) {
  const { scene } = useGLTF(url) as GLTF & { scene: THREE.Group };
  const groupRef = useRef<THREE.Group>(null);
  const basePosition = useRef<[number, number, number]>([0, 0, -1.3]);
  const isHovered = useRef(false);

  const hoverT = useRef(0);
  const targetHoverT = useRef(0);

  const [isHoveredState, setIsHoveredState] = useState(false);

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

    hoverT.current += (targetHoverT.current - hoverT.current) * 0.15;

    const pitchOffset = Math.sin(time * FLOATING_CONFIG.PITCH_SPEED) * FLOATING_CONFIG.PITCH_AMPLITUDE;
    const yawOffset = Math.cos(time * FLOATING_CONFIG.YAW_SPEED) * FLOATING_CONFIG.YAW_AMPLITUDE;
    const rollOffset = Math.sin(time * FLOATING_CONFIG.ROLL_SPEED) * FLOATING_CONFIG.ROLL_AMPLITUDE;
    groupRef.current.rotation.x = baseRotation[0] + pitchOffset;
    groupRef.current.rotation.y = baseRotation[1] + yawOffset;
    groupRef.current.rotation.z = baseRotation[2] + rollOffset;

    groupRef.current.position.set(
      basePosition.current[0],
      basePosition.current[1],
      basePosition.current[2]
    );

    const baseScale = 0.0035;
    const scale = lerp(baseScale, baseScale * FLOATING_CONFIG.HOVER_SCALE, hoverT.current);
    groupRef.current.scale.setScalar(scale);

    const basePulse = 0.03 * Math.sin(time * 2) + 1;
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
    <>
      <group 
        ref={groupRef}
        position={basePosition.current}
      >
        <primitive object={optimizedScene} />
      </group>
      <mesh
        onClick={handleClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        position={basePosition.current}
      >
        <boxGeometry args={clickBoxScale as [number, number, number]} />
        <meshBasicMaterial 
          transparent={true}
          opacity={0}
          colorWrite={false}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}

export default function FloatingResumeLogo({
  resumeUrl = "/resume/resume.gltf",
  boundarySize = 0.005,
  glowColor = '#ffffff',
  emissiveColor = '#ffffff',
  baseRotation = [0, 0, 0],
  clickBoxScale = [0.4, 0.4, 0.02],
}: FloatingResumeLogoProps) {
  const handleLogoClick = useCallback(() => {
    window.open(resumeUrl, '_blank', 'noopener,noreferrer');
  }, [resumeUrl]);
  return (
    <ResumeModel 
      url={resumeUrl}
      boundarySize={boundarySize}
      onLogoClick={handleLogoClick}
      baseRotation={baseRotation}
      clickBoxScale={clickBoxScale}
    />
  );
}

useGLTF.preload('/resume/resume.gltf'); 
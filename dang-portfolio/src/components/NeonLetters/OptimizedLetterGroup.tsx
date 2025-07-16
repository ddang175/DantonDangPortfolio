'use client';

import { Text3D, Center } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useFrameRateLimit } from '../../hooks/useFrameRateLimit';

const fontUrl = '/font/Chromia_Bold.json';

interface LetterConfig {
  char: string;
  position: [number, number, number];
  baseRotation: [number, number, number];
  fontSize: number;
  height: number;
  letterSpacing: number;
  index: number;
}

interface OptimizedLetterGroupProps {
  letters: LetterConfig[];
  color: string;
  lightColor: string;
  animationIntensity?: number;
  emissiveIntensity?: number; // new prop
}

const createMaterial = (color: string, lightColor: string, emissiveIntensity = 3.5): THREE.MeshStandardMaterial => {
  return new THREE.MeshStandardMaterial({
    color,
    emissive: lightColor,
    emissiveIntensity,
    fog: false,
    transparent: false,
    depthWrite: true,
    depthTest: true,
  });
};

const FLOATING_CONFIG = {
  PITCH_SPEED: 0.8,
  YAW_SPEED: 0.8,
  ROLL_SPEED: 0.8,
  PITCH_AMPLITUDE: 0.2,
  YAW_AMPLITUDE: 0.2,
  ROLL_AMPLITUDE: 0.2,
  PHASE_OFFSET: 4,
  SECONDARY_PITCH_MULT: 0.4,
  SECONDARY_YAW_MULT: 0.4,
  SECONDARY_ROLL_MULT: 0.4,
  SECONDARY_PITCH_SPEED: 0.4,
  SECONDARY_YAW_SPEED: 0.3,
  SECONDARY_ROLL_SPEED: 0.25,
};

export default function OptimizedLetterGroup({
  letters,
  color,
  lightColor,
  animationIntensity = 1.0,
  emissiveIntensity = 3.5 // default
}: OptimizedLetterGroupProps) {
  const groupRef = useRef<THREE.Group>(null);
  const material = useMemo(() => createMaterial(color, lightColor, emissiveIntensity), [color, lightColor, emissiveIntensity]);
  
  const secondaryPitchAmplitude = useMemo(() => FLOATING_CONFIG.PITCH_AMPLITUDE * FLOATING_CONFIG.SECONDARY_PITCH_MULT, []);
  const secondaryYawAmplitude = useMemo(() => FLOATING_CONFIG.YAW_AMPLITUDE * FLOATING_CONFIG.SECONDARY_YAW_MULT, []);
  const secondaryRollAmplitude = useMemo(() => FLOATING_CONFIG.ROLL_AMPLITUDE * FLOATING_CONFIG.SECONDARY_ROLL_MULT, []);

  const { shouldRenderFrame } = useFrameRateLimit({ targetFPS: 45, enabled: true });

  useFrame((state) => {
    if (!groupRef.current) return;
    
    if (!shouldRenderFrame(state.clock.elapsedTime * 1000)) return;
    
    const time = state.clock.elapsedTime;
    
    groupRef.current.children.forEach((child, index) => {
      const letter = letters[index];
      if (!letter) return;
      
      const letterTime = time + (letter.index * FLOATING_CONFIG.PHASE_OFFSET);
      
      const pitchOffset = Math.sin(letterTime * FLOATING_CONFIG.PITCH_SPEED) * FLOATING_CONFIG.PITCH_AMPLITUDE * animationIntensity;
      const yawOffset = Math.cos(letterTime * FLOATING_CONFIG.YAW_SPEED) * FLOATING_CONFIG.YAW_AMPLITUDE * animationIntensity;
      const rollOffset = Math.sin(letterTime * FLOATING_CONFIG.ROLL_SPEED) * FLOATING_CONFIG.ROLL_AMPLITUDE * animationIntensity;
      
      const secondaryPitch = Math.sin(letterTime * FLOATING_CONFIG.SECONDARY_PITCH_SPEED) * secondaryPitchAmplitude * animationIntensity;
      const secondaryYaw = Math.cos(letterTime * FLOATING_CONFIG.SECONDARY_YAW_SPEED) * secondaryYawAmplitude * animationIntensity;
      const secondaryRoll = Math.cos(letterTime * FLOATING_CONFIG.SECONDARY_ROLL_SPEED) * secondaryRollAmplitude * animationIntensity;
      
      child.rotation.x = letter.baseRotation[0] + pitchOffset + secondaryPitch;
      child.rotation.y = letter.baseRotation[1] + yawOffset + secondaryYaw;
      child.rotation.z = letter.baseRotation[2] + rollOffset + secondaryRoll;
    });
  });

  return (
    <group ref={groupRef}>
      {letters.map((letter, index) => (
        <group 
          key={`${letter.char}-${letter.position[0]}-${letter.position[1]}-${index}`}
          position={letter.position}
          rotation={letter.baseRotation}
        >
          <Center>
            <Text3D
              font={fontUrl}
              size={letter.fontSize}
              height={letter.height}
              letterSpacing={letter.letterSpacing}
              castShadow={false}
              receiveShadow={false}
              material={material}
            >
              {letter.char}
            </Text3D>
          </Center>
        </group>
      ))}
    </group>
  );
} 
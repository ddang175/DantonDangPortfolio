'use client';

import { Text3D, Center } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useFrameRateLimit } from '../../hooks/useFrameRateLimit';

const fontUrl = '/font/Chromia_Bold.json';

interface AnimatedLetterProps {
  char: string;
  position: [number, number, number];
  baseRotation: [number, number, number];
  fontSize: number;
  height: number;
  letterSpacing: number;
  material: THREE.MeshStandardMaterial;
  index: number;
}

const FLOATING_CONFIG = {
  PITCH_SPEED: 0.8,
  YAW_SPEED: 0.8,
  ROLL_SPEED: 0.8,
  PITCH_AMPLITUDE: 0.15,
  YAW_AMPLITUDE: 0.2,
  ROLL_AMPLITUDE: 0.4,
  PHASE_OFFSET: 4,
  SECONDARY_PITCH_MULT: 0.5,
  SECONDARY_YAW_MULT: 0.5,
  SECONDARY_ROLL_MULT: 0.5,
  SECONDARY_PITCH_SPEED: 0.5,
  SECONDARY_YAW_SPEED: 0.5,
  SECONDARY_ROLL_SPEED: 0.5,
};

export default function AnimatedLetter({
  char,
  position,
  baseRotation,
  fontSize,
  height,
  letterSpacing,
  material,
  index
}: AnimatedLetterProps) {
  const groupRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);
  
  const phaseOffset = useMemo(() => index * FLOATING_CONFIG.PHASE_OFFSET, [index]);
  const secondaryPitchAmplitude = useMemo(() => FLOATING_CONFIG.PITCH_AMPLITUDE * FLOATING_CONFIG.SECONDARY_PITCH_MULT, []);
  const secondaryYawAmplitude = useMemo(() => FLOATING_CONFIG.YAW_AMPLITUDE * FLOATING_CONFIG.SECONDARY_YAW_MULT, []);
  const secondaryRollAmplitude = useMemo(() => FLOATING_CONFIG.ROLL_AMPLITUDE * FLOATING_CONFIG.SECONDARY_ROLL_MULT, []);

  const { shouldRenderFrame } = useFrameRateLimit({ targetFPS: 60, enabled: true });

  useFrame((state) => {
    if (!groupRef.current) return;
    
    if (!shouldRenderFrame(state.clock.elapsedTime * 1000)) return;
    
    const time = state.clock.elapsedTime + phaseOffset;
    
    const pitchOffset = Math.sin(time * FLOATING_CONFIG.PITCH_SPEED) * FLOATING_CONFIG.PITCH_AMPLITUDE;
    const yawOffset = Math.cos(time * FLOATING_CONFIG.YAW_SPEED) * FLOATING_CONFIG.YAW_AMPLITUDE;
    const rollOffset = Math.sin(time * FLOATING_CONFIG.ROLL_SPEED) * FLOATING_CONFIG.ROLL_AMPLITUDE;
    
    const secondaryPitch = Math.sin(time * FLOATING_CONFIG.SECONDARY_PITCH_SPEED) * secondaryPitchAmplitude;
    const secondaryYaw = Math.cos(time * FLOATING_CONFIG.SECONDARY_YAW_SPEED) * secondaryYawAmplitude;
    const secondaryRoll = Math.cos(time * FLOATING_CONFIG.SECONDARY_ROLL_SPEED) * secondaryRollAmplitude;
    
    groupRef.current.rotation.x = baseRotation[0] + pitchOffset + secondaryPitch;
    groupRef.current.rotation.y = baseRotation[1] + yawOffset + secondaryYaw;
    groupRef.current.rotation.z = baseRotation[2] + rollOffset + secondaryRoll;
  });

  return (
    <group 
      ref={groupRef}
      position={position}
      rotation={baseRotation}
    >
      <Center>
        <Text3D
          font={fontUrl}
          size={fontSize}
          height={height}
          letterSpacing={letterSpacing}
          castShadow={false}
          receiveShadow={false}
          material={material}
        >
          {char}
        </Text3D>
      </Center>
    </group>
  );
} 
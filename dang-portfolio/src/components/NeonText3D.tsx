'use client';

import { Text3D, Center } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';

const fontUrl = '/font/PixelFont.json';

interface LetterConfig {
  char: string;
  position: [number, number, number];
  rotation?: [number, number, number]; // pitch
}

interface NeonText3DProps {
  letters: LetterConfig[];
  fontSize?: number;
  height?: number;
  letterSpacing?: number;
  color?: string;
  lightColor?: string;
}

export default function NeonText3D({
  letters,
  fontSize = 0.6,
  height = 0.15,
  letterSpacing = 0.04,
  color = '#796094',
  lightColor = '#d09eff',
}: NeonText3DProps) {
  // Memoize material to prevent recreation on every render
  const material = useMemo(() => (
    <meshStandardMaterial
      color={color}
      emissive={lightColor}
      emissiveIntensity={1.8}
      side={THREE.FrontSide}
      fog={false}
    />
  ), [color, lightColor]);

  return (
    <group>
      {letters.map((letter, i) => (
        <group 
          key={`${letter.char}-${i}`} 
          position={letter.position}
          rotation={letter.rotation || [0, 0, 0]}
        >
          <Center>
            <Text3D
              font={fontUrl}
              size={fontSize}
              height={height}
              letterSpacing={letterSpacing}
              castShadow={false}
              receiveShadow={false}
            >
              {letter.char}
              {material}
            </Text3D>
          </Center>
        </group>
      ))}
    </group>
  );
}
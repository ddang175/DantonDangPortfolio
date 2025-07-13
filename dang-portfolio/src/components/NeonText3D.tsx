'use client';

import { Text3D, Center } from '@react-three/drei';
import { useMemo, useCallback, useEffect } from 'react';
import * as THREE from 'three';

const fontUrl = '/font/Chromia_Bold.json';

interface LetterConfig {
  char: string;
  position: [number, number, number];
  rotation?: [number, number, number];
}

interface NeonText3DProps {
  letters: LetterConfig[];
  fontSize?: number;
  height?: number;
  letterSpacing?: number;
  color?: string;
  lightColor?: string;
}

const materialCache = new Map<string, THREE.MeshStandardMaterial>();
const MAX_CACHE_SIZE = 10;

const getOrCreateMaterial = (color: string, lightColor: string): THREE.MeshStandardMaterial => {
  const key = `${color}-${lightColor}`;
  
  if (!materialCache.has(key)) {
    if (materialCache.size >= MAX_CACHE_SIZE) {
      const firstKey = materialCache.keys().next().value;
      if (firstKey) {
        const materialToDispose = materialCache.get(firstKey);
        if (materialToDispose) {
          materialToDispose.dispose();
        }
        materialCache.delete(firstKey);
      }
    }
    
    const material = new THREE.MeshStandardMaterial({
      color,
      emissive: lightColor,
      emissiveIntensity: 2,
      fog: false,
    });
    materialCache.set(key, material);
  }
  
  return materialCache.get(key)!;
};

const cleanupMaterialCache = () => {
  materialCache.forEach(material => {
    material.dispose();
  });
  materialCache.clear();
};

export default function NeonText3D({
  letters,
  fontSize = 0.6,
  height = 0.15,
  letterSpacing = 0.04,
  color = '#796094',
  lightColor = '#d09eff',
}: NeonText3DProps) {
  const material = useMemo(() => 
    getOrCreateMaterial(color, lightColor), 
    [color, lightColor]
  );

  const letterGroups = useMemo(() => 
    letters.map((letter, i) => (
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
            material={material}
          >
            {letter.char}
          </Text3D>
        </Center>
      </group>
    )), [letters, fontSize, height, letterSpacing, material]);

  useEffect(() => {
    return () => {
    };
  }, []);

  return <group>{letterGroups}</group>;
}

export { cleanupMaterialCache };
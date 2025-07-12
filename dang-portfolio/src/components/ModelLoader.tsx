'use client';

import { useGLTF } from '@react-three/drei';
import { Suspense, useMemo, useCallback } from 'react';
import * as THREE from 'three';

interface ModelLoaderProps {
  modelPath: string;
  rotationX: number;
  rotationY: number;
}

function Model({ url, rotationX, rotationY }: { url: string; rotationX: number; rotationY: number }) {
  const { scene } = useGLTF(url);
  
  // Optimize the scene once on load with useCallback for better performance
  const optimizedScene = useMemo(() => {
    const optimizedScene = scene.clone();
    
    optimizedScene.traverse((child: any) => {
      if (child.isMesh) {
        // Optimize geometry
        if (child.geometry) {
          child.geometry.computeBoundingSphere();
          child.geometry.computeBoundingBox();
          child.frustumCulled = true;
        }
        
        // Disable shadows for better performance
        child.castShadow = false;
        child.receiveShadow = false;
      
        if (child.material) {
          // Optimize material for performance
          child.material.transparent = false;
          child.material.opacity = 1.0;
          child.material.alphaTest = 0.5;
          child.material.depthWrite = true;
          child.material.depthTest = true;
          child.material.needsUpdate = true;
          
          // Performance optimizations
          child.material.side = THREE.FrontSide;
          child.material.fog = false;
          child.material.flatShading = false;
          
          // Optimize texture settings for better performance
          const optimizeTexture = (texture: THREE.Texture) => {
            texture.generateMipmaps = false;
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.wrapS = THREE.ClampToEdgeWrapping;
            texture.wrapT = THREE.ClampToEdgeWrapping;
            texture.flipY = false; // Disable flip for better performance
          };
          
          // Reduce texture quality if present
          if (child.material.map) {
            optimizeTexture(child.material.map);
          }
          
          if (child.material.normalMap) {
            optimizeTexture(child.material.normalMap);
          }
          
          if (child.material.roughnessMap) {
            optimizeTexture(child.material.roughnessMap);
          }
          
          if (child.material.metalnessMap) {
            optimizeTexture(child.material.metalnessMap);
          }
          
          if (child.material.emissiveMap) {
            optimizeTexture(child.material.emissiveMap);
          }
        }
      }
    });
    
    return optimizedScene;
  }, [scene]);
  
  return <primitive object={optimizedScene} rotation={[rotationX, rotationY + Math.PI, 0]} position={[0, -.8, -4]} />;
}

export default function ModelLoader({ modelPath, rotationX, rotationY }: ModelLoaderProps) {
  return (
    <Suspense fallback={null}>
      <Model url={modelPath} rotationX={rotationX} rotationY={rotationY} />
    </Suspense>
  );
}

// Preload the model
useGLTF.preload('/ae86pixel/scene.gltf'); 
'use client';

import { useGLTF } from '@react-three/drei';
import { Suspense, useMemo, useCallback, useEffect } from 'react';
import * as THREE from 'three';

interface ModelLoaderProps {
  modelPath: string;
  rotationX: number;
  rotationY: number;
}

const geometryCache = new Map<string, THREE.BufferGeometry>();
const MAX_GEOMETRY_CACHE_SIZE = 5;

const optimizeGeometry = (geometry: THREE.BufferGeometry): THREE.BufferGeometry => {
  const key = geometry.uuid;
  
  if (!geometryCache.has(key)) {
    if (geometryCache.size >= MAX_GEOMETRY_CACHE_SIZE) {
      const firstKey = geometryCache.keys().next().value;
      if (firstKey) {
        const geometryToDispose = geometryCache.get(firstKey);
        if (geometryToDispose) {
          geometryToDispose.dispose();
        }
        geometryCache.delete(firstKey);
      }
    }
    
    const optimizedGeometry = geometry.clone();
    
    optimizedGeometry.computeBoundingSphere();
    optimizedGeometry.computeBoundingBox();
    
    if (optimizedGeometry.attributes.position) {
      optimizedGeometry.attributes.position.needsUpdate = true;
    }
    
    geometryCache.set(key, optimizedGeometry);
  }
  
  return geometryCache.get(key)!;
};

const optimizeTexture = (texture: THREE.Texture): void => {
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.flipY = false;
  texture.premultiplyAlpha = false;
  texture.anisotropy = 4;
};

const cleanupGeometryCache = () => {
  geometryCache.forEach(geometry => {
    geometry.dispose();
  });
  geometryCache.clear();
};

function Model({ url, rotationX, rotationY }: { url: string; rotationX: number; rotationY: number }) {
  const { scene } = useGLTF(url);
  
  const optimizedScene = useMemo(() => {
    const optimizedScene = scene.clone();
    
    optimizedScene.traverse((child: any) => {
      if (child.isMesh) {
        if (child.geometry) {
          child.geometry = optimizeGeometry(child.geometry);
          child.frustumCulled = true;
        }
        
        child.castShadow = false;
        child.receiveShadow = false;
      
        if (child.material) {
          child.material.transparent = false;
          child.material.opacity = 1.0;
          child.material.alphaTest = 0.5;
          child.material.depthWrite = true;
          child.material.depthTest = true;
          child.material.needsUpdate = true;
          
          child.material.side = THREE.FrontSide;
          child.material.fog = false;
          child.material.flatShading = false;
          
          if (child.material.roughness !== undefined) {
            child.material.roughness = Math.max(0.1, child.material.roughness || 0.5);
          }
          if (child.material.metalness !== undefined) {
            child.material.metalness = Math.min(1.0, child.material.metalness || 0.0);
          }
          
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
  
  useEffect(() => {
    return () => {
      if (geometryCache.size > MAX_GEOMETRY_CACHE_SIZE) {
        const keys = Array.from(geometryCache.keys());
        for (let i = 0; i < Math.min(2, keys.length); i++) {
          const key = keys[i];
          const geometry = geometryCache.get(key);
          if (geometry) {
            geometry.dispose();
            geometryCache.delete(key);
          }
        }
      }
    };
  }, []);
  
  return <primitive object={optimizedScene} rotation={[rotationX, rotationY + Math.PI, 0]} position={[0, -.8, -4]} />;
}

export default function ModelLoader({ modelPath, rotationX, rotationY }: ModelLoaderProps) {
  return (
    <Suspense fallback={null}>
      <Model url={modelPath} rotationX={rotationX} rotationY={rotationY} />
    </Suspense>
  );
}

useGLTF.preload('/ae86pixel/scene.gltf');

export { cleanupGeometryCache }; 
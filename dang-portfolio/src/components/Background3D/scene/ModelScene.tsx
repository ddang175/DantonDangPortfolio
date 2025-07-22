import { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { GLTF } from 'three-stdlib';
import { useFrameRateLimit } from '@/hooks/useFrameRateLimit';

interface ModelSceneProps {
  modelPath: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

interface GLTFResult extends GLTF {
  nodes: Record<string, THREE.Mesh>;
  materials: Record<string, THREE.Material>;
}

export const ModelScene: React.FC<ModelSceneProps> = ({ 
  modelPath,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1
}) => {
  const modelRef = useRef<THREE.Group>(null);
  const gltf = useGLTF(modelPath) as unknown as GLTFResult;
  const { shouldRenderFrame } = useFrameRateLimit({ targetFPS: 60 });

  // Mouse tracking for rotation only (not position)
  const mouse = useRef({ x: 0, y: 0 });
  const lastUpdate = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = ((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (!modelRef.current) return;

    gltf.scene.traverse((child: THREE.Object3D) => {
      if (child instanceof THREE.Mesh) {
        if (child.material) {
          child.material.transparent = false;
          child.material.side = THREE.FrontSide;
          child.material.alphaTest = 0.5;
          child.material.depthWrite = true;
          child.material.depthTest = true;
          
          child.material.needsUpdate = true;
        }
      }
    });

    gltf.scene.position.set(...position);
    gltf.scene.rotation.set(...rotation);
    gltf.scene.scale.setScalar(scale);
    
    modelRef.current.add(gltf.scene);
  }, [gltf.scene, position, rotation, scale]);

  useFrame((_, delta) => {
    if (!modelRef.current || !shouldRenderFrame(performance.now())) return;
    const now = performance.now();
    if (now - lastUpdate.current < 16) return;
    lastUpdate.current = now;

    const maxY = Math.PI / 6; 
    const maxX = Math.PI / 12; 
    const targetY = mouse.current.x * maxY;
    const targetX = mouse.current.y * maxX;

    modelRef.current.rotation.y += (targetY - modelRef.current.rotation.y) * 0.06;
    modelRef.current.rotation.x += (targetX - modelRef.current.rotation.x) * 0.06;
  });

  return (
    <group ref={modelRef}>
      <spotLight
        position={[0, 0, 8]}
        intensity={4}
        color={0xdcb9f5} 
        angle={Math.PI / 1} 
        penumbra={0.5}
        distance={10} 
        decay={0.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
    </group>
  );
};

useGLTF.preload('/ae86pixel/scene.glb');
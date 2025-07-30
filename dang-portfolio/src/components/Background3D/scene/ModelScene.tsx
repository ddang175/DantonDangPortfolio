import { useRef, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Group, Object3D, Mesh, Material, FrontSide } from "three";
import type { GLTF } from "three-stdlib";
import { useFrameRateLimit } from "@/hooks/useFrameRateLimit";

interface ModelSceneProps {
  modelPath: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  enableMouseRotation?: boolean;
  maxRotationX?: number;
  maxRotationY?: number;
  rotationSensitivity?: number;
  rotationSmoothness?: number;
  onReady?: () => void;
}

interface GLTFResult extends GLTF {
  nodes: Record<string, Mesh>;
  materials: Record<string, Material>;
}

export const ModelScene: React.FC<ModelSceneProps> = ({
  modelPath,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  enableMouseRotation = true,
  maxRotationX = Math.PI / 12,
  maxRotationY = Math.PI / 6,
  rotationSensitivity = 1.0,
  rotationSmoothness = 0.06,
  onReady,
}) => {
  const modelRef = useRef<Group>(null);
  const gltf = useGLTF(modelPath) as unknown as GLTFResult;
  const { shouldRenderFrame } = useFrameRateLimit({ targetFPS: 60 });
  const hasNotifiedReady = useRef(false);

  const mouse = useRef({ x: 0, y: 0 });
  const lastUpdate = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    if (!modelRef.current) return;

    gltf.scene.traverse((child: Object3D) => {
      if (child instanceof Mesh) {
        if (child.material) {
          child.material.transparent = false;
          child.material.side = FrontSide;
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

    if (onReady && !hasNotifiedReady.current) {
      hasNotifiedReady.current = true;
      onReady();
    }
  }, [gltf.scene, position, rotation, scale, onReady]);

  useFrame((_, delta) => {
    if (!modelRef.current || !shouldRenderFrame(performance.now())) return;
    if (!enableMouseRotation) return;
    const now = performance.now();
    if (now - lastUpdate.current < 16) return;
    lastUpdate.current = now;

    const targetY = mouse.current.x * maxRotationY * rotationSensitivity;
    const targetX = mouse.current.y * maxRotationX * rotationSensitivity;

    modelRef.current.rotation.y +=
      (targetY - modelRef.current.rotation.y) * rotationSmoothness;
    modelRef.current.rotation.x +=
      (targetX - modelRef.current.rotation.x) * rotationSmoothness;
  });

  return <group ref={modelRef}></group>;
};

useGLTF.preload("/ae86/initialdcarmesh.glb");

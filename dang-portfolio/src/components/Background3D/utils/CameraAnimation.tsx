import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { useFrameRateLimit } from '@/hooks/useFrameRateLimit';
import * as THREE from 'three';

interface CameraAnimationProps {
  onAnimationComplete?: () => void;
  duration?: number;
  initialPosition?: [number, number, number];
  targetPosition?: [number, number, number];
  initialFov?: number;
  targetFov?: number;
}

export const CameraAnimation: React.FC<CameraAnimationProps> = ({
  onAnimationComplete,
  duration = 3000,
  initialPosition = [0, 0, 20],
  targetPosition = [0, 0, 0],
  initialFov = 85,
  targetFov = 45
}) => {
  const { camera } = useThree();
  const perspectiveCamera = camera as THREE.PerspectiveCamera;
  const startTime = useRef<number | null>(null);
  const { shouldRenderFrame } = useFrameRateLimit({ targetFPS: 60 });
  const isComplete = useRef(false);

  const initialCameraPosition = useRef(new THREE.Vector3(...initialPosition));
  const targetCameraPosition = useRef(new THREE.Vector3(...targetPosition));

  useEffect(() => {
    camera.position.copy(initialCameraPosition.current);
    perspectiveCamera.fov = initialFov;
    
    camera.lookAt(0, 0, 0);
    camera.up.set(0, 0, 0);
    
    perspectiveCamera.updateProjectionMatrix();
    
    let animationFrameId: number;

    const animate = (currentTime: number) => {
      if (startTime.current === null) {
        startTime.current = currentTime;
      }

      if (!shouldRenderFrame(currentTime)) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      const elapsed = currentTime - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      
      const eased = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      camera.position.lerpVectors(
        initialCameraPosition.current,
        targetCameraPosition.current,
        eased
      );

      camera.lookAt(0, 0, 0);

      // Interpolate FOV
      perspectiveCamera.fov = initialFov + (targetFov - initialFov) * eased;
      perspectiveCamera.updateProjectionMatrix();

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else if (!isComplete.current) {
        camera.position.copy(targetCameraPosition.current);
        perspectiveCamera.fov = targetFov;
        camera.lookAt(0, 0, 0);
        perspectiveCamera.updateProjectionMatrix();
        
        isComplete.current = true;
        onAnimationComplete?.();
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [camera, perspectiveCamera, duration, initialFov, targetFov, onAnimationComplete, shouldRenderFrame]);

  return null;
}; 
import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Vector3 } from 'three';

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
  duration = 2500,
  initialPosition = [0, 0, 10],
  targetPosition = [0, 0, 0],
  initialFov = 300,
  targetFov = 45
}) => {
  const { camera } = useThree();
  const perspectiveCamera = camera as PerspectiveCamera;

  const startTime = useRef<number | null>(null);
  const isComplete = useRef(false);

  const initialCameraPosition = useRef(new Vector3(...initialPosition));
  const targetCameraPosition = useRef(new Vector3(...targetPosition));

  useEffect(() => {
    camera.position.copy(initialCameraPosition.current);
    perspectiveCamera.fov = initialFov;
    camera.lookAt(0, 0, 0);
    camera.up.set(0, 0, 0);
    perspectiveCamera.updateProjectionMatrix();
  }, [camera, initialFov]);

  useFrame(({ clock }) => {
    if (isComplete.current) return;

    if (startTime.current === null) {
      startTime.current = clock.getElapsedTime() * 1000;
    }

    const elapsed = clock.getElapsedTime() * 1000 - startTime.current;
    const progress = Math.min(elapsed / duration, 1);

    const eased = progress < 0.5
    ? 8 * Math.pow(progress, 4)
    : 1 - 8 * Math.pow(1 - progress, 4);


    camera.position.lerpVectors(
      initialCameraPosition.current,
      targetCameraPosition.current,
      eased
    );

    perspectiveCamera.fov = initialFov + (targetFov - initialFov) * eased;
    camera.lookAt(0, 0, 0);
    perspectiveCamera.updateProjectionMatrix();

    if (progress >= 1 && !isComplete.current) {
      isComplete.current = true;
      onAnimationComplete?.();
    }
  });

  return null;
};

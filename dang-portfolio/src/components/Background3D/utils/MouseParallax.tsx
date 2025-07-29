import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { useFrameRateLimit } from "@/hooks/useFrameRateLimit";

interface MouseParallaxProps {
  enabled?: boolean;
  intensity?: number;
  smoothness?: number;
}

export const MouseParallax: React.FC<MouseParallaxProps> = ({
  enabled = true,
  intensity = 0.01,
  smoothness = 0.1,
}) => {
  const { camera } = useThree();
  const targetPosition = useRef({ x: 0, y: camera.position.y });
  const initialPosition = useRef({
    x: camera.position.x,
    y: camera.position.y,
  });
  const { shouldRenderFrame } = useFrameRateLimit({ targetFPS: 60, enabled });

  useEffect(() => {
    if (!enabled) {
      camera.position.x = initialPosition.current.x;
      return;
    }

    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      const { innerWidth, innerHeight } = window;

      targetPosition.current = {
        x: ((clientX - innerWidth / 2) / innerWidth) * intensity,
        y: camera.position.y,
      };
    };

    let animationFrameId: number;
    const animate = () => {
      if (shouldRenderFrame(performance.now())) {
        camera.position.x +=
          (initialPosition.current.x +
            targetPosition.current.x -
            camera.position.x) *
          smoothness;
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [camera, enabled, intensity, smoothness, shouldRenderFrame]);

  return null;
};

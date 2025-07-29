import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";

interface FrameRateLimitProps {
  fps?: number;
  enabled?: boolean;
}

export const FrameRateLimit: React.FC<FrameRateLimitProps> = ({
  fps = 60,
  enabled = true,
}) => {
  const { invalidate } = useThree();
  const frameTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled) return;

    const interval = 1000 / fps;
    let animationFrameId: number;

    const animate = (time: number) => {
      if (time - frameTimeRef.current >= interval) {
        frameTimeRef.current = time;
        invalidate();
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [fps, invalidate, enabled]);

  return null;
};

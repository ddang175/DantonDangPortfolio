import { useRef, useCallback, useEffect } from "react";

interface UseFrameRateLimitOptions {
  targetFPS?: number;
  enabled?: boolean;
}

export const useFrameRateLimit = ({
  targetFPS = 60,
  enabled = true,
}: UseFrameRateLimitOptions = {}) => {
  const lastFrameTime = useRef(0);
  const frameInterval = useRef(1000 / targetFPS);

  useEffect(() => {
    frameInterval.current = 1000 / targetFPS;
  }, [targetFPS]);

  const shouldRenderFrame = useCallback(
    (currentTime: number) => {
      if (!enabled) return true;

      if (currentTime - lastFrameTime.current >= frameInterval.current) {
        lastFrameTime.current = currentTime;
        return true;
      }

      return false;
    },
    [enabled]
  );

  const updateTargetFPS = useCallback((newFPS: number) => {
    frameInterval.current = 1000 / newFPS;
  }, []);

  return {
    shouldRenderFrame,
    updateTargetFPS,
  };
};

'use client';

import { useEffect, useState, useCallback, useRef } from "react";
import Background3D from "../components/Background3D";
import { BlurMask, LoadingPanel, ShojiDoor } from "../components/openingSequence";
import CursorGlow from "../components/CursorGlow";

export default function Home() {
  const [isDoorOpen, setIsDoorOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

  const handleLoadingComplete = useCallback(() => setIsLoading(false), []);
  const handleDoorOpen = useCallback(() => setIsDoorOpen(true), []);

  useEffect(() => {
    const loadingTimer = setTimeout(handleLoadingComplete, 500);
    timeoutRefs.current.push(loadingTimer);

    const doorTimer = setTimeout(handleDoorOpen, 1250); 
    timeoutRefs.current.push(doorTimer);

    return () => {
      timeoutRefs.current.forEach(clearTimeout);
      timeoutRefs.current = [];
    };
  }, [handleLoadingComplete, handleDoorOpen]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      <Background3D modelPath="/ae86pixel/scene.gltf" />

      {/* Shoji Doors */}
      <div className="absolute inset-0 z-10">
        <ShojiDoor side="left" isOpen={isDoorOpen} />
        <ShojiDoor side="right" isOpen={isDoorOpen} />
      </div>

      {/* Shoji Blur Masks */}
      <div className="absolute inset-0 z-20">
        <BlurMask position="left" isVisible={!isDoorOpen} />
        <BlurMask position="right" isVisible={!isDoorOpen} />
      </div>

      {/* Blur masks */}
      <div className="absolute inset-0 z-40">
        <BlurMask position="top" isVisible={isLoading} />
        <BlurMask position="bottom" isVisible={isLoading} />
      </div>

      {/* Loading Panels */}
      <div className="absolute inset-0 z-50">
        <LoadingPanel position="top" isVisible={isLoading} />
        <LoadingPanel position="bottom" isVisible={isLoading} />
      </div>

      {/* Cursor Glow Effect */}
      <CursorGlow />
    </div>
  );
}

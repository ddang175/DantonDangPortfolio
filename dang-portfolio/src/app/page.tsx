'use client';

import { useEffect, useState, useCallback, useRef } from "react";
import { BlurMask, LoadingPanel, IntroText } from "@/components/openingSequence";
import { CursorGlow, PortfolioButton } from "@/components/UI";
import Background3D from "@/components/Background3D";
import { useAudioControl } from "@/hooks/useAudioControl";
import { FloatingLinkedInLogo } from "@/components/LinkedInLogo";
import { FloatingGitHubLogo } from "@/components/GitHubLogo";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [showPortfolioButton, setShowPortfolioButton] = useState(true);
  const [showIntroText, setShowIntroText] = useState(false);
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

  const {
    startIntroMusic,
    completeIntroMusic,
    startLoadingMusic,
    completeLoadingMusic,
  } = useAudioControl();

  const handleButtonClick = useCallback(() => {
    setShowPortfolioButton(false);
    setShowIntroText(true);
  }, []);

  const handleIntroComplete = useCallback(() => {
    setShowIntroText(false);
    const loadingTimer = setTimeout(() => setIsLoading(false), 500);
    timeoutRefs.current.push(loadingTimer);
  }, []);

  const handleAnimationStart = useCallback(() => {
    startIntroMusic();
  }, [startIntroMusic]);

  const handleIntroCompleteWithAudio = useCallback(() => {
    completeIntroMusic();
    handleIntroComplete();
  }, [completeIntroMusic, handleIntroComplete]);

  const handleLoadingStart = useCallback(() => {
    startLoadingMusic();
  }, [startLoadingMusic]);

  const handleLoadingComplete = useCallback(() => {
    completeLoadingMusic();
  }, [completeLoadingMusic]);

  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach(clearTimeout);
      timeoutRefs.current = [];
    };
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      <Background3D modelPath="/ae86pixel/scene.gltf" />

      {/* Remove Social 3D Logos from DOM overlay. They are rendered inside Background3D/Canvas. */}

      {/* Intro Sequence overlays - do not block pointer events for logo buttons */}
      {showPortfolioButton && (
        <PortfolioButton onButtonClick={handleButtonClick} className="pointer-events-auto" />
      )}

      {showIntroText && (
        <IntroText 
          onComplete={handleIntroCompleteWithAudio} 
          onAnimationStart={handleAnimationStart}
        />
      )}

      <div className="absolute inset-0 z-40 pointer-events-none">
        <BlurMask position="top" isVisible={isLoading} />
        <BlurMask position="bottom" isVisible={isLoading} />
      </div>

      <div className="absolute inset-0 z-50 pointer-events-none">
        <LoadingPanel position="top" isVisible={isLoading} onAnimationStart={handleLoadingStart} onAnimationComplete={handleLoadingComplete} />
        <LoadingPanel position="bottom" isVisible={isLoading} onAnimationStart={handleLoadingStart} onAnimationComplete={handleLoadingComplete} />
      </div>

      <CursorGlow />
    </div>
  );
}

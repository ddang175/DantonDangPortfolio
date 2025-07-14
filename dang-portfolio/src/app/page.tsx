'use client';

import { useEffect, useState, useCallback, useRef } from "react";
import { BlurMask, LoadingPanel, IntroText } from "@/components/openingSequence";
import { CursorGlow, PortfolioButton } from "@/components/UI";
import Background3D from "@/components/Background3D";
import { useAudioControl } from "@/hooks/useAudioControl";

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
  } = useAudioControl({
    onIntroStart: () => {
      console.log('Intro music started');
    },
    onIntroComplete: () => {
      console.log('Intro music completed');
    },
    onLoadingStart: () => {
      console.log('Loading music started');
    },
    onLoadingComplete: () => {
      console.log('Loading music completed');
    },
  });

  const handleButtonClick = useCallback(() => {
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

      {showPortfolioButton && (
        <PortfolioButton onButtonClick={handleButtonClick} />
      )}

      {showIntroText && (
        <IntroText 
          onComplete={handleIntroCompleteWithAudio} 
          onAnimationStart={handleAnimationStart}
        />
      )}

      <div className="absolute inset-0 z-40">
        <BlurMask position="top" isVisible={isLoading} />
        <BlurMask position="bottom" isVisible={isLoading} />
      </div>

      <div className="absolute inset-0 z-50">
        <LoadingPanel position="top" isVisible={isLoading} onAnimationStart={handleLoadingStart} onAnimationComplete={handleLoadingComplete} />
        <LoadingPanel position="bottom" isVisible={isLoading} onAnimationStart={handleLoadingStart} onAnimationComplete={handleLoadingComplete} />
      </div>

      <CursorGlow />
    </div>
  );
}

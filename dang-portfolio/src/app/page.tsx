'use client';

import { useEffect, useState, useCallback, useRef } from "react";
import { BlurMask, LoadingPanel, IntroText } from "@/components/openingSequence";
import { CursorGlow, PortfolioButton } from "@/components/UI";
import { useAudioControl } from "@/hooks/useAudioControl";
import { FloatingLinkedInLogo } from "@/components/LinkedInLogo";
import { FloatingGitHubLogo } from "@/components/GitHubLogo";
import { BackgroundCanvas } from "@/components/Background3D";
import { useGLTF } from '@react-three/drei';
import MinimalistNavbar from "@/components/UI/MinimalistNavbar";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [showPortfolioButton, setShowPortfolioButton] = useState(true);
  const [showIntroText, setShowIntroText] = useState(false);
  const [show3D, setShow3D] = useState(false); // New state to control when 3D scene is mounted
  const [canStartCameraAnimation, setCanStartCameraAnimation] = useState(false);
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
    setShow3D(true); 
    handleIntroComplete();
  }, [completeIntroMusic, handleIntroComplete]);

  const handleLoadingStart = useCallback(() => {
    startLoadingMusic();
  }, [startLoadingMusic]);

  const handleLoadingComplete = useCallback(() => {
    completeLoadingMusic();
    setCanStartCameraAnimation(true);
  }, [completeLoadingMusic]);

  // Navigation handlers
  const handleExperienceClick = useCallback(() => {
    console.log('Experience button clicked');
  }, []);

  const handleProjectsClick = useCallback(() => {
    console.log('Projects button clicked');
  }, []);

  const handleLeadershipClick = useCallback(() => {
    console.log('Leadership button clicked');
  }, []);

  const handleAboutMeClick = useCallback(() => {
    console.log('About Me button clicked');
  }, []);

  useEffect(() => {
    useGLTF.preload('/ae86/initialdcarmesh.glb');
    return () => {
      timeoutRefs.current.forEach(clearTimeout);
      timeoutRefs.current = [];
    };
  }, []);

  return (
    <main className="w-full h-screen relative overflow-hidden bg-black">

      {show3D && (
        <div className="absolute inset-0 w-full h-full">
          <BackgroundCanvas 
            modelPath="/ae86/initialdcarmesh.glb" 
            startAnimation={canStartCameraAnimation}
          />
        </div>
      )}

      <MinimalistNavbar
        onExperienceClick={handleExperienceClick}
        onProjectsClick={handleProjectsClick}
        onLeadershipClick={handleLeadershipClick}
        onAboutMeClick={handleAboutMeClick}
      />

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
    </main>
  );
};
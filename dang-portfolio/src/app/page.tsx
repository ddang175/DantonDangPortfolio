'use client';

import { useEffect, useState, useCallback, useRef } from "react";
import { BlurMask, LoadingPanel, IntroText } from "@/components/openingSequence";
import { CursorGlow, PortfolioButton, ExperienceButton, ProjectsButton, EducationButton, SkillsButton, LeadershipButton, AboutMeButton } from "@/components/UI";
import { useAudioControl } from "@/hooks/useAudioControl";
import { FloatingLinkedInLogo } from "@/components/LinkedInLogo";
import { FloatingGitHubLogo } from "@/components/GitHubLogo";
import { BackgroundCanvas } from "@/components/Background3D";
import { useGLTF } from '@react-three/drei';

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

  // When the intro text starts deleting, show the 3D scene (but don't start animation yet)
  const handleIntroCompleteWithAudio = useCallback(() => {
    completeIntroMusic();
    setShow3D(true); // Mount the 3D scene as soon as intro text starts deleting
    handleIntroComplete();
  }, [completeIntroMusic, handleIntroComplete]);

  const handleLoadingStart = useCallback(() => {
    startLoadingMusic();
  }, [startLoadingMusic]);

  const handleLoadingComplete = useCallback(() => {
    completeLoadingMusic();
    setCanStartCameraAnimation(true);
  }, [completeLoadingMusic]);

  useEffect(() => {
    useGLTF.preload('/ae86pixel/scene.glb');
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
            modelPath="/ae86pixel/scene.glb" 
            startAnimation={canStartCameraAnimation}
          />
        </div>
      )}

      <div
        className="fixed bottom-1/5 left-1/2 transform -translate-x-1/2 flex flex-row justify-center items-center gap-8 z-50"
      >
        <div className="flex flex-row gap-12">
          <ExperienceButton onButtonClick={() => { console.log('Experience button clicked'); }} />
          <ProjectsButton onButtonClick={() => { console.log('Projects button clicked'); }} />
          <SkillsButton onButtonClick={() => { console.log('Skills button clicked'); }} />
          <LeadershipButton onButtonClick={() => { console.log('Leadership button clicked'); }} />
          <AboutMeButton onButtonClick={() => { console.log('About Me button clicked'); }} />
        </div>
      </div>


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

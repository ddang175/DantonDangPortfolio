'use client';

import { useEffect, useState, useCallback, useRef } from "react";
import { BlurMask, LoadingPanel, IntroText } from "@/components/openingSequence";
import { CursorGlow, PortfolioButton, ExperienceButton, ProjectsButton, EducationButton, SkillsButton, LeadershipButton, AboutMeButton } from "@/components/UI";
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

      {/* Nav Bar with three buttons centered at the bottom */}
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

      {/* Remove standalone ExperienceButton from here */}

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

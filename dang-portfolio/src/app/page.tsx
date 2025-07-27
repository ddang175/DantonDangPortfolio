'use client';

import { useEffect, useState, useCallback, useRef } from "react";
import { BlurMask, LoadingPanel, LoadingIndicator } from "@/components/openingSequence";
import { CursorGlow, PortfolioButton } from "@/components/UI";
import { useAudioControl } from "@/hooks/useAudioControl";
import { FloatingLinkedInLogo } from "@/components/LinkedInLogo";
import { FloatingGitHubLogo } from "@/components/GitHubLogo";
import { BackgroundCanvas } from "@/components/Background3D";
import { useGLTF } from '@react-three/drei';
import MinimalistNavbar from "@/components/UI/MinimalistNavbar";
import { CardShowcase } from "@/components/CardShowcase";
import { CardData } from "@/components/CardShowcase/types";
import { AboutMe } from "@/components/AboutMe";

// Sample data for projects
const projectsData: CardData[] = [
  {
    id: 'project-1',
    title: 'Portfolio Website',
    description: 'A modern, interactive portfolio website built with Next.js, Three.js, and TypeScript. Features 3D animations, custom audio controls, and a responsive design that showcases my work in an engaging way.',
    shortDescription: 'Modern portfolio with 3D animations',
    previewImageUrl: '/backgroundpattern.webp',
    modalImageUrl: '/glow.webp',
    technologies: ['Next.js', 'Three.js', 'TypeScript', 'Tailwind CSS'],
    date: '2024',
    link: 'https://github.com/yourusername/portfolio'
  },
  {
    id: 'project-2',
    title: 'E-Commerce Platform',
    description: 'A full-stack e-commerce platform with user authentication, payment processing, and admin dashboard. Built with modern web technologies and follows best practices for security and performance.',
    shortDescription: 'Full-stack e-commerce solution',
    previewImageUrl: '/glow.webp',
    modalImageUrl: '/backgroundpattern.webp',
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    date: '2023',
    link: 'https://github.com/yourusername/ecommerce'
  },
  
];

// Sample data for experience
const experienceData: CardData[] = [
  {
    id: 'exp-1',
    title: 'Software Engineer',
    company: 'John Deere',
    description: "At John Deere Financial, I contributed to two major internal applications that improved operational efficiency and data integrity. For a global Security Access Management app used by over 470 managers, I helped build the front end using Next.js and MUI, improved UI/UX, and supported backend integration with API Gateway and AWS Lambda. Also, I created a TypeScript CRON job using Prisma and Deere's HR API to automate the cleanup of terminated employee records and fix invalid IDs across a 2,000+ entry database.. This tool reduced manual effort and saved the company over $18,000 annually. Separately, I developed an internal data management tool for the Database team. I automated JIRA ticket creation, managed AWS EC2 lifecycle events, and documented secure API integrations using Deere's internal SALAD standards.",
    shortDescription: 'Full stack engineer on the CyCloud team at ISU Research Park.',
    previewImageUrl: '/experience/johndeere.gif',
    modalImageUrl: '/experience/deereIN.webp',
    technologies: ['React', 'MUI', 'TypeScript', 'AWS', 'PostgreSQL', "Jenkins", "Prisma"],
    date: 'May 2024 - Present'
  },
  {
    id: 'exp-2',
    title: 'Site Reliability Engineer Intern',
    company: 'Principal Financial Group',
    description: "At Principal, I led several key infrastructure initiatives to improve scalability, automation, and compliance. I migrated over 100 AWS resources across regions by modifying Infrastructure as Code and deploying updated CloudFormation stacks using the AWS CDK, ensuring alignment with regional standards. I also automated the synchronization of labels between Nobl9 and ServiceNow using a daily AWS Lambda CRON job, which eliminated manual effort and improved data accuracy. Additionally, I upgraded more than 300 AWS Lambda functions across 10 accounts by updating code and infrastructure configurations, testing functionality, and adjusting Lambda layers to maintain compatibility and avoid deprecated runtimes.",
    shortDescription: "Ensured uptime and performance of internal and external applications.",
    previewImageUrl: '/experience/principal.gif',
    modalImageUrl: '/experience/backgroundpattern.webp',
    technologies: ['TypeScript', 'Python', 'AWS', 'PostgreSQL', 'Nobl9', 'ServiceNow'],
    date: 'May 2025 - August 2025'
  }
];

//leadership data
const leadershipData: CardData[] = [
  {
    id: 'lead-1',
    title: 'Vice President',
    company: 'Asian Student Union',
    description: "At John Deerfffffffffffff ffffffffff f f f f ff f f ff f f ff f f f ffffffff   ffffffffffff f f fffff  ffff fffff fffff ff ffffffff fffffffffffff f ff ffffffffff f  f f f  ffff ffffff ffe Financial, I worked on two internal apps.\nFor the Security Access Management app, I enhanced UX, integrated AWS APIs, and automated HR record cleanup.\nFor the Database team, I automated JIRA tickets, managed EC2 events, and maintained data integrity.\nAlso wrote API documentation following SALAD standards.",
    shortDescription: 'Full stack engineer on the CyCloud team at ISU Research Park.',
    previewImageUrl: '/experience/johndeere.gif',
    modalImageUrl: '/experience/deereIN.webp',
    date: 'May 2025 - Present'
  },
  
];

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [showPortfolioButton, setShowPortfolioButton] = useState(true);
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);
  const [show3D, setShow3D] = useState(false);
  const [start3DLoading, setStart3DLoading] = useState(false);
  const [canStartCameraAnimation, setCanStartCameraAnimation] = useState(false);
  const [showCardShowcase, setShowCardShowcase] = useState(false);
  const [showAboutMe, setShowAboutMe] = useState(false);
  const [currentCards, setCurrentCards] = useState<CardData[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

  const {
    startIntroMusic,
    completeIntroMusic,
    startLoadingMusic,
    completeLoadingMusic,
  } = useAudioControl();

  // Check if mobile
  useEffect(() => {
    const updateScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  const handleButtonClick = useCallback(() => {
    setShowPortfolioButton(false);
    setStart3DLoading(true);
    startIntroMusic();
    
    const loadingDelay = setTimeout(() => {
      setShowLoadingIndicator(true);
    }, 250);
    timeoutRefs.current.push(loadingDelay);
  }, [startIntroMusic]);

  const handle3DReady = useCallback(() => {
    timeoutRefs.current.forEach((timer, index) => {
      if (timer && typeof timer === 'number') {
        clearTimeout(timer);
        timeoutRefs.current[index] = null as any;
      }
    });
    
    setShowLoadingIndicator(false);
    setShow3D(true);
    const loadingTimer = setTimeout(() => setIsLoading(false), 250);
    timeoutRefs.current.push(loadingTimer);
    
    const fallbackTimer = setTimeout(() => {
      console.log('Fallback: Forcing loading doors to open');
      setIsLoading(false);
      setCanStartCameraAnimation(true);
    }, 8000);
    timeoutRefs.current.push(fallbackTimer);
  }, []);

  const handleLoadingStart = useCallback(() => {
    startLoadingMusic();
  }, [startLoadingMusic]);

  const handleLoadingComplete = useCallback(() => {
    completeIntroMusic(); 
    setCanStartCameraAnimation(true);
  }, [completeIntroMusic]);

  const handleExperienceClick = useCallback(() => {
    setCurrentCards(experienceData);
    setShowCardShowcase(true);
  }, []);

  const handleProjectsClick = useCallback(() => {
    setCurrentCards(projectsData);
    setShowCardShowcase(true);
  }, []);

  const handleLeadershipClick = useCallback(() => {
    setCurrentCards(leadershipData);
    setShowCardShowcase(true);
  }, []);

  const handleAboutMeClick = useCallback(() => {
    setShowAboutMe(true);
  }, []);

  const handleCardShowcaseClose = useCallback(() => {
    setShowCardShowcase(false);
  }, []);

  const handleAboutMeClose = useCallback(() => {
    setShowAboutMe(false);
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

      {start3DLoading && (
        <div className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${show3D ? 'opacity-100' : 'opacity-0'}`}>
          <BackgroundCanvas 
            modelPath="/ae86/initialdcarmesh.glb" 
            startAnimation={canStartCameraAnimation}
            onReady={handle3DReady}
          />
        </div>
      )}

      <div className={`
        transition-all duration-500 ease-out
        ${showCardShowcase ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'}
      `}>
        <MinimalistNavbar
          onExperienceClick={handleExperienceClick}
          onProjectsClick={handleProjectsClick}
          onLeadershipClick={handleLeadershipClick}
          onAboutMeClick={handleAboutMeClick}
        />
      </div>

      {showCardShowcase && (
        <CardShowcase
          cards={currentCards}
          onClose={handleCardShowcaseClose}
          isMobile={isMobile}
        />
      )}

      {showAboutMe && (
        <AboutMe
          onClose={handleAboutMeClose}
          isMobile={isMobile}
        />
      )}

      {showPortfolioButton && (
        <PortfolioButton onButtonClick={handleButtonClick} className="pointer-events-auto" />
      )}

      <div className={`absolute inset-0 z-[60] transition-opacity duration-500 ${showLoadingIndicator ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <LoadingIndicator />
      </div>

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
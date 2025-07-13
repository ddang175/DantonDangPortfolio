'use client';

import Image from "next/image";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import Background3D from "../components/Background3D";
import { performanceMonitor } from "../utils/performance";

export default function Home() {
  const [isDoorOpen, setIsDoorOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

  //prevent recalc
  const transitionClasses = useMemo(() => ({
    topBlur: isLoading ? 'translate-y-0' : '-translate-y-full',
    bottomBlur: isLoading ? 'translate-y-0' : 'translate-y-full',
    leftDoor: isDoorOpen ? '-translate-x-full' : 'translate-x-0',
    rightDoor: isDoorOpen ? 'translate-x-full' : 'translate-x-0',
  }), [isLoading, isDoorOpen]);


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

  const shojiLeftImage = useMemo(() => (
    <Image
      src="/shojiLeft.webp"
      alt="Shoji door left panel"
      fill
      className="object-cover"
      style={{ objectPosition: 'right center' }}
      priority
      sizes="50vw"
    />
  ), []);

  const shojiRightImage = useMemo(() => (
    <Image
      src="/shojiRight.webp"
      alt="Shoji door right panel"
      fill
      className="object-cover"
      style={{ objectPosition: 'left center' }}
      priority
      sizes="50vw"
    />
  ), []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      <Background3D modelPath="/ae86pixel/scene.gltf" />

      {/*Blur masks */}
      <div className="absolute inset-0 z-40">
        <div 
          className={`absolute top-0 left-0 w-full h-1/2 transition-transform duration-1000 ease-in-out backdrop-blur-md bg-black/20 ${transitionClasses.topBlur}`}
        />
        
        <div 
          className={`absolute bottom-0 left-0 w-full h-1/2 transition-transform duration-1000 ease-in-out backdrop-blur-md bg-black/20 ${transitionClasses.bottomBlur}`}
        />
      </div>

      {/* Loading Panels */}
      <div className="absolute inset-0 z-50">
        <div 
          className={`absolute top-0 left-0 w-full h-1/2 bg-black transition-transform duration-1000 ease-in-out ${transitionClasses.topBlur}`}
        />
          
        <div 
          className={`absolute bottom-0 left-0 w-full h-1/2 bg-black transition-transform duration-1000 ease-in-out ${transitionClasses.bottomBlur}`}
        />
      </div>


      {/* Shoji Blur Masks */}
      <div className="absolute inset-0 z-5">
        <div 
          className={`absolute left-0 top-0 w-1/2 h-full transition-transform duration-1000 ease-in-out backdrop-blur-md bg-black/20 ${transitionClasses.leftDoor}`}
        />
        
        <div 
          className={`absolute right-0 top-0 w-1/2 h-full transition-transform duration-1000 ease-in-out backdrop-blur-md bg-black/20 ${transitionClasses.rightDoor}`}
        />
      </div>

      {/* Shoji Doors */}
      <div className="absolute inset-0 z-10">
        <div 
          className={`absolute left-0 top-0 w-1/2 h-full transition-transform duration-1000 ease-in-out ${transitionClasses.leftDoor}`}
        >
          {shojiLeftImage}
        </div>

        <div 
          className={`absolute right-0 top-0 w-1/2 h-full transition-transform duration-1000 ease-in-out ${transitionClasses.rightDoor}`}
        >
          {shojiRightImage}
        </div>
      </div>
    </div>
  );
}

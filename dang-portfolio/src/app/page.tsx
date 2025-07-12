'use client';

import Image from "next/image";
import { useEffect, useState } from "react";
import Background3D from "../components/Background3D";

export default function Home() {
  const [isDoorOpen, setIsDoorOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Loading Delay
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    // Shoji Door Opening Animation
    const doorTimer = setTimeout(() => {
      setIsDoorOpen(true);
    }, 1250); 

    return () => {
      clearTimeout(loadingTimer);
      clearTimeout(doorTimer);
    };
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      <Background3D modelPath="/ae86pixel/scene.gltf" />

      {/*Blur masks */}
      <div className="absolute inset-0 z-40">
        {/* Top */}
        <div 
          className={`absolute top-0 left-0 w-full h-1/2 transition-transform duration-1000 ease-in-out backdrop-blur-md bg-black/20 ${
            isLoading ? 'translate-y-0' : '-translate-y-full'
          }`}
        />
        
        {/* Bottom */}
        <div 
          className={`absolute bottom-0 left-0 w-full h-1/2 transition-transform duration-1000 ease-in-out backdrop-blur-md bg-black/20 ${
            isLoading ? 'translate-y-0' : 'translate-y-full'
          }`}
        />
      </div>

      {/* Loading Panels */}
      <div className="absolute inset-0 z-50">
        {/* Top */}
        <div 
          className={`absolute top-0 left-0 w-full h-1/2 bg-black transition-transform duration-1000 ease-in-out ${
            isLoading ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          </div> 
          
        {/* Bottom */}
        <div 
          className={`absolute bottom-0 left-0 w-full h-1/2 bg-black transition-transform duration-1000 ease-in-out ${
            isLoading ? 'translate-y-0' : 'translate-y-full'
          }`}
        />
      </div>

      {/* Content */}
      <div className="min-h-screen flex items-center justify-center relative z-1">
        <div className="text-center text-white">
          <h1 className="text-6xl md:text-8xl font-light mb-6 tracking-wider">
            Danton Dang
          </h1>
          <p className="text-xl md:text-2xl font-light tracking-wide">
            Welcome to my work
          </p>
        </div>
      </div>

      {/* Shoji Blur Masks */}
      <div className="absolute inset-0 z-5">
        {/* Left */}
        <div 
          className={`absolute left-0 top-0 w-1/2 h-full transition-transform duration-1000 ease-in-out backdrop-blur-md bg-black/20 ${
            isDoorOpen ? '-translate-x-full' : 'translate-x-0'
          }`}
        />
        
        {/* Right */}
        <div 
          className={`absolute right-0 top-0 w-1/2 h-full transition-transform duration-1000 ease-in-out backdrop-blur-md bg-black/20 ${
            isDoorOpen ? 'translate-x-full' : 'translate-x-0'
          }`}
        />
      </div>

      {/* Shoji Doors */}
      <div className="absolute inset-0 z-10">
        {/* Left */}
        <div 
          className={`absolute left-0 top-0 w-1/2 h-full transition-transform duration-1000 ease-in-out ${
            isDoorOpen ? '-translate-x-full' : 'translate-x-0'
          }`}
        >
          <Image
            src="/shojiLeft.webp"
            alt="Shoji door left panel"
            fill
            className="object-cover"
            style={{ objectPosition: 'right center' }}
          />
        </div>

        {/* Right */}
        <div 
          className={`absolute right-0 top-0 w-1/2 h-full transition-transform duration-1000 ease-in-out ${
            isDoorOpen ? 'translate-x-full' : 'translate-x-0'
          }`}
        >
          <Image
            src="/shojiRight.webp"
            alt="Shoji door right panel"
            fill
            className="object-cover"
            style={{ objectPosition: 'left center' }}
          />
        </div>
      </div>
    </div>
  );
}

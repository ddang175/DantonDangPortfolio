'use client';

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [isDoorOpen, setIsDoorOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Show loading panels for 500ms to allow shoji screens to load
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    // Start the door opening animation after loading panels slide away
    const doorTimer = setTimeout(() => {
      setIsDoorOpen(true);
    }, 1250); 

    return () => {
      clearTimeout(loadingTimer);
      clearTimeout(doorTimer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0D0E12] relative overflow-hidden">
      {/* Vertical Blur Masks - Follow the Black Door Movement */}
      <div className="absolute inset-0 z-40">
        {/* Top Blur Mask */}
        <div 
          className={`absolute top-0 left-0 w-full h-1/2 transition-transform duration-1000 ease-in-out backdrop-blur-md bg-black/20 ${
            isLoading ? 'translate-y-0' : '-translate-y-full'
          }`}
        />
        
        {/* Bottom Blur Mask */}
        <div 
          className={`absolute bottom-0 left-0 w-full h-1/2 transition-transform duration-1000 ease-in-out backdrop-blur-md bg-black/20 ${
            isLoading ? 'translate-y-0' : 'translate-y-full'
          }`}
        />
      </div>

      {/* Loading Panels - Slide Vertically Like Doors */}
      <div className="absolute inset-0 z-50">
        {/* Top Loading Panel */}
        <div 
          className={`absolute top-0 left-0 w-full h-1/2 bg-black transition-transform duration-1000 ease-in-out opacity-80 ${
            isLoading ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          </div> 
          
        {/* Bottom Loading Panel */}
        <div 
          className={`absolute bottom-0 left-0 w-full h-1/2 bg-black transition-transform duration-1000 ease-in-out opacity-80 ${
            isLoading ? 'translate-y-0' : 'translate-y-full'
          }`}
        />
      </div>

      {/* Portfolio Content - Always Visible Behind the Doors */}
      <div className="min-h-screen flex items-center justify-center relative z-1">
        <div className="text-center text-white">
          <h1 className="text-6xl md:text-8xl font-light mb-6 tracking-wider">
            Portfolio
          </h1>
          <p className="text-xl md:text-2xl font-light tracking-wide">
            Welcome to my work
          </p>
        </div>
      </div>

      {/* Horizontal Blur Masks - Follow the Shoji Door Movement */}
      <div className="absolute inset-0 z-5">
        {/* Left Blur Mask */}
        <div 
          className={`absolute left-0 top-0 w-1/2 h-full transition-transform duration-1000 ease-in-out backdrop-blur-md bg-black/20 ${
            isDoorOpen ? '-translate-x-full' : 'translate-x-0'
          }`}
        />
        
        {/* Right Blur Mask */}
        <div 
          className={`absolute right-0 top-0 w-1/2 h-full transition-transform duration-1000 ease-in-out backdrop-blur-md bg-black/20 ${
            isDoorOpen ? 'translate-x-full' : 'translate-x-0'
          }`}
        />
      </div>

      {/* Shoji Door Overlay */}
      <div className="absolute inset-0 z-10">
        {/* Left Door Panel */}
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

        {/* Right Door Panel */}
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

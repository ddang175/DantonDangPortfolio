import { useEffect, useState } from "react";

interface LoadingIndicatorProps {
  onComplete?: () => void;
  className?: string;
}

export default function LoadingIndicator({ onComplete, className = '' }: LoadingIndicatorProps) {
  const [progress, setProgress] = useState(0);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    // Smooth progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          // Start fade out when complete
          setOpacity(0);
          setTimeout(() => onComplete?.(), 600);
          return 100;
        }
        return prev + Math.random() * 2 + 1; // Gradual, slightly random progress
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-500 ${className}`}
      style={{ opacity }}
    >
      <div className="flex flex-col items-center space-y-8">
        {/* Minimalist text */}
        <div className="text-white/90 text-lg font-light tracking-wider">
          Loading
        </div>
        
        {/* Clean progress bar */}
        <div className="w-64 h-0.5 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-white/60 to-white rounded-full transition-all duration-300 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        
        {/* Subtle percentage indicator */}
        <div className="text-white/60 text-sm font-mono tabular-nums">
          {Math.floor(Math.min(progress, 100))}%
        </div>
      </div>
      
      {/* Optional subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent animate-pulse" />
      </div>
    </div>
  );
}
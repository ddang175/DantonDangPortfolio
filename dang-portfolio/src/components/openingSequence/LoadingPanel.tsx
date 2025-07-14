import { useEffect, useState } from "react";

interface LoadingPanelProps {
  position: 'top' | 'bottom';
  isVisible: boolean;
  onAnimationStart?: () => void;
  onAnimationComplete?: () => void;
  className?: string;
}

export default function LoadingPanel({ position, isVisible, onAnimationStart, onAnimationComplete, className = '' }: LoadingPanelProps) {
  const [hasTriggeredStart, setHasTriggeredStart] = useState(false);
  const [hasTriggeredComplete, setHasTriggeredComplete] = useState(false);

  useEffect(() => {
    if (isVisible && !hasTriggeredStart && onAnimationStart) {
      onAnimationStart();
      setHasTriggeredStart(true);
    }
  }, [isVisible, hasTriggeredStart, onAnimationStart]);

  useEffect(() => {
    if (!isVisible && hasTriggeredStart && !hasTriggeredComplete && onAnimationComplete) {
      onAnimationComplete();
      setHasTriggeredComplete(true);
    }
  }, [isVisible, hasTriggeredStart, hasTriggeredComplete, onAnimationComplete]);

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'top-0 left-0 w-full h-1/2';
      case 'bottom':
        return 'bottom-0 left-0 w-full h-1/2';
      default:
        return '';
    }
  };

  const getTransformClass = () => {
    if (position === 'top') {
      return isVisible ? 'translate-y-0' : '-translate-y-full';
    } else {
      return isVisible ? 'translate-y-0' : 'translate-y-full';
    }
  };

  return (
    <div 
      className={`absolute ${getPositionClasses()} transition-transform duration-1000 ease-in-out bg-black ${getTransformClass()} ${className}`}
    />
  );
} 
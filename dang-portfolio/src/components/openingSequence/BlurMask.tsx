interface BlurMaskProps {
  position: 'top' | 'bottom' | 'left' | 'right';
  isVisible: boolean;
  className?: string;
}

export default function BlurMask({ position, isVisible, className = '' }: BlurMaskProps) {
  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'top-0 left-0 w-full h-1/2';
      case 'bottom':
        return 'bottom-0 left-0 w-full h-1/2';
      case 'left':
        return 'left-0 top-0 w-1/2 h-full';
      case 'right':
        return 'right-0 top-0 w-1/2 h-full';
      default:
        return '';
    }
  };

  const getTransformClass = () => {
    if (position === 'top') {
      return isVisible ? 'translate-y-0' : '-translate-y-full';
    } else if (position === 'bottom') {
      return isVisible ? 'translate-y-0' : 'translate-y-full';
    } else if (position === 'left') {
      return isVisible ? 'translate-x-0' : '-translate-x-full';
    } else {
      return isVisible ? 'translate-x-0' : 'translate-x-full';
    }
  };

  return (
    <div 
      className={`absolute ${getPositionClasses()} transition-transform duration-1000 ease-in-out backdrop-blur-md bg-black/20 ${getTransformClass()} ${className}`}
    />
  );
} 
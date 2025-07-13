interface LoadingPanelProps {
  position: 'top' | 'bottom';
  isVisible: boolean;
  className?: string;
}

export default function LoadingPanel({ position, isVisible, className = '' }: LoadingPanelProps) {
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
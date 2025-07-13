import Image from "next/image";
import { useMemo } from "react";

interface ShojiDoorProps {
  side: 'left' | 'right';
  isOpen: boolean;
  className?: string;
}

export default function ShojiDoor({ side, isOpen, className = '' }: ShojiDoorProps) {
  const getPositionClasses = () => {
    return side === 'left' ? 'left-0 top-0 w-1/2 h-full' : 'right-0 top-0 w-1/2 h-full';
  };

  const getTransformClass = () => {
    if (side === 'left') {
      return isOpen ? '-translate-x-full' : 'translate-x-0';
    } else {
      return isOpen ? 'translate-x-full' : 'translate-x-0';
    }
  };

  const doorImage = useMemo(() => (
    <Image
      src={side === 'left' ? "/shojiLeft.webp" : "/shojiRight.webp"}
      alt={`Shoji door ${side} panel`}
      fill
      className="object-cover"
      style={{ objectPosition: side === 'left' ? 'right center' : 'left center' }}
      priority
      sizes="50vw"
    />
  ), [side]);

  return (
    <div 
      className={`absolute ${getPositionClasses()} transition-transform duration-1000 ease-in-out ${getTransformClass()} ${className}`}
    >
      {doorImage}
    </div>
  );
} 
import React, { useState, useEffect } from 'react';

interface NavButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  isVertical?: boolean;
  isMobile?: boolean;
  isGrid?: boolean;
}

const NavButton: React.FC<NavButtonProps> = ({ 
  children, 
  onClick, 
  disabled = false, 
  isVertical = false,
  isMobile = false,
  isGrid = false
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative flex items-center justify-center
        ${isGrid
          ? 'w-full h-16 text-lg sm:h-20 sm:text-xl md:h-24 md:text-2xl'
          : 'min-w-[12vw] max-w-[20vw] h-12 text-base sm:min-w-[10vw] sm:h-14 sm:text-lg lg:min-w-[8vw] lg:h-16 lg:text-xl xl:text-2xl'
        }
        text-white font-sans tracking-widest uppercase
        transition-all duration-300 ease-out
        disabled:opacity-50 disabled:cursor-not-allowed
        cursor-pointer
      `}
      style={{
        fontFamily: 'Inter, Arial, sans-serif',
      }}
    >
      <span className={`
        relative z-10 transition-all duration-300 whitespace-nowrap px-4 sm:px-6 lg:px-8
        ${isHovered ? 'text-white drop-shadow-lg' : 'text-gray-300'}
      `}>
        {children}
      </span>
      {/* underline */}
      <div
        className={`
          absolute left-0 bottom-0 w-full h-0.5
          bg-gradient-to-r from-purple-400 to-purple-300
          transition-all duration-300 ease-out
          ${isHovered ? 'opacity-100' : 'opacity-0'}
        `}
      />
    </button>
  );
};

const Divider: React.FC<{ isVertical?: boolean; isHorizontal?: boolean }> = ({ 
  isVertical = false, 
  isHorizontal = false 
}) => (
  <div className="relative flex items-center justify-center h-8 sm:h-10 lg:h-12">
    <div 
      className="w-px bg-gradient-to-b from-transparent via-gray-400 to-transparent h-full"
      style={{
        background: 'linear-gradient(to bottom, transparent 0%, rgba(156, 163, 175, 0.4) 20%, rgba(156, 163, 175, 0.6) 50%, rgba(156, 163, 175, 0.4) 80%, transparent 100%)',
      }}
    />
  </div>
);

const GridDivider: React.FC<{ orientation: 'vertical' | 'horizontal' }> = ({ orientation }) => (
  <div className={`
    absolute 
    ${orientation === 'vertical' 
      ? 'left-1/2 top-3 bottom-3 w-px transform -translate-x-1/2 sm:top-4 sm:bottom-4 md:top-5 md:bottom-5' 
      : 'top-1/2 left-3 right-3 h-px transform -translate-y-1/2 sm:left-4 sm:right-4 md:left-5 md:right-5'
    }
  `}>
    <div 
      className="w-full h-full"
      style={{
        background: orientation === 'vertical'
          ? 'linear-gradient(to bottom, transparent 0%, rgba(156, 163, 175, 0.4) 20%, rgba(156, 163, 175, 0.6) 50%, rgba(156, 163, 175, 0.4) 80%, transparent 100%)'
          : 'linear-gradient(to right, transparent 0%, rgba(156, 163, 175, 0.4) 20%, rgba(156, 163, 175, 0.6) 50%, rgba(156, 163, 175, 0.4) 80%, transparent 100%)',
      }}
    />
  </div>
);

interface MinimalistNavbarProps {
  onExperienceClick: () => void;
  onProjectsClick: () => void;
  onLeadershipClick: () => void;
  onAboutMeClick: () => void;
  className?: string;
}

const MinimalistNavbar: React.FC<MinimalistNavbarProps> = ({
  onExperienceClick,
  onProjectsClick,
  onLeadershipClick,
  onAboutMeClick,
  className = '',
}) => {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      setIsDesktop(width >= 1024);
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  const isGrid = !isDesktop;

  if (isGrid) {
    return (
      <nav className={`
        fixed 
        bottom-4 left-1/2 transform -translate-x-1/2
        backdrop-blur-md bg-black/20 
        border border-white/10
        rounded-2xl sm:rounded-3xl
        p-3 sm:p-4 md:p-5
        z-50
        w-[90vw] sm:w-[85vw] md:w-[80vw] max-w-[600px]
        ${className}
      `}>
        <div className="relative grid grid-cols-2 gap-3 sm:gap-4 md:gap-5">
          <NavButton 
            onClick={onExperienceClick}
            isGrid={isGrid}
          >
            Experience
          </NavButton>
          
          <NavButton 
            onClick={onProjectsClick}
            isGrid={isGrid}
          >
            Projects
          </NavButton>
          
          <NavButton 
            onClick={onLeadershipClick}
            isGrid={isGrid}
          >
            Leadership
          </NavButton>
          
          <NavButton 
            onClick={onAboutMeClick}
            isGrid={isGrid}
          >
            About Me
          </NavButton>
          
          <GridDivider orientation="vertical" />
          <GridDivider orientation="horizontal" />
        </div>
      </nav>
    );
  }

  // desktop horizontal layout
  return (
    <nav className={`
      fixed 
      bottom-[17vh] left-1/2 transform -translate-x-1/2
      flex items-center justify-center
      backdrop-blur-md bg-black/20 
      border border-white/10
      rounded-full
      px-4 py-3 sm:px-6 sm:py-4 lg:px-8 lg:py-5
      z-50
      w-auto max-w-[90vw]
      ${className}
    `}>
      <div className="flex flex-row items-center gap-1 sm:gap-2">
        <NavButton 
          onClick={onExperienceClick}
        >
          Experience
        </NavButton>
        
        <Divider />
        
        <NavButton 
          onClick={onProjectsClick}
        >
          Projects
        </NavButton>
        
        <Divider />
        
        <NavButton 
          onClick={onLeadershipClick}
        >
          Leadership
        </NavButton>
        
        <Divider />
        
        <NavButton 
          onClick={onAboutMeClick}
        >
          About Me
        </NavButton>
      </div>
    </nav>
  );
};

export default MinimalistNavbar;
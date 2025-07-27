import React, { useState, useEffect } from 'react';

interface AboutMeProps {
  onClose: () => void;
  isTransitioning?: boolean;
  isClosing?: boolean;
  isMobile?: boolean;
}

const AboutMe: React.FC<AboutMeProps> = ({ 
  onClose, 
  isTransitioning = false, 
  isClosing = false,
  isMobile = false 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [contentOpacity, setContentOpacity] = useState(1);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Handle content transitions when card changes
  useEffect(() => {
    if (isTransitioning) {
      setContentOpacity(0.3);
    } else {
      setContentOpacity(1);
    }
  }, [isTransitioning]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  // Calculate dynamic positioning to sit just above CardShowcase without overlap
  const getModalPositioning = () => {
    if (isMobile) {
      return {
        bottom: 'calc(32vh + 1rem + 1rem)', // CardShowcase space + bottom gap + modal gap
        maxHeight: 'calc(100vh - 32vh - 1rem - 1rem - 2rem)', // Screen - CardShowcase - gaps - padding
      };
    } else {
      return {
        bottom: 'calc(17vh + 15vh + 1rem)', // CardShowcase position + height + gap
        maxHeight: 'calc(100vh - 17vh - 15vh - 1rem - 2rem)', // Screen - CardShowcase space - gaps - padding
      };
    }
  };

  const modalPositioning = getModalPositioning();

  return (
    <div 
      className="fixed inset-x-0 z-[70] flex items-end justify-center p-4 pointer-events-none"
      style={{ 
        bottom: modalPositioning.bottom
      }}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 pointer-events-auto"
        onClick={handleClose}
      />
      
      {/* Modal Container */}
      <div 
        className={`
          relative w-full max-w-4xl bg-black/90 border border-white/20 rounded-2xl
          shadow-2xl overflow-hidden pointer-events-auto
          transition-all duration-300 ease-out
          ${isVisible && !isClosing ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
        `}
        style={{ 
          maxHeight: modalPositioning.maxHeight,
          height: modalPositioning.maxHeight
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-black/80 backdrop-blur-sm">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-wider uppercase">
            About Me
          </h2>
          <button
            onClick={handleClose}
            className="
              w-8 h-8 sm:w-10 sm:h-10
              flex items-center justify-center
              text-gray-400 hover:text-white
              transition-colors duration-200
              rounded-full hover:bg-white/10 cursor-pointer
            "
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div 
          className="overflow-y-auto custom-scrollbar transition-opacity duration-150 ease-out"
          style={{ 
            opacity: contentOpacity,
            height: 'calc(100% - 89px)', // Full height minus header height
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(255, 255, 255, 0.2) rgba(255, 255, 255, 0.05)'
          }}
        >
          <div className="p-6 space-y-8">
            {/* About Me / Bio Section */}
            <div className="space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-wider uppercase border-b border-white/10 pb-2">
                Bio
              </h3>
              <div className="flex flex-col md:flex-row gap-6">
                {/* Image Space */}
                <div className="md:w-64 md:flex-shrink-0">
                  <div className="
                    w-full h-64 md:h-80
                    bg-white/5 border border-white/10 rounded-lg
                    flex items-center justify-center
                    overflow-hidden
                  ">
                    {/* Placeholder for image - replace with actual image */}
                    <div className="text-gray-400 text-center p-4">
                      <svg className="w-16 h-16 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-sm">Profile Image</span>
                    </div>
                    {/* To use an actual image, replace the placeholder div above with:
                    <img 
                      src="/path/to/your/image.jpg" 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                    */}
                  </div>
                </div>
                
                {/* Bio Text */}
                <div className="flex-1 text-gray-300 leading-relaxed text-base sm:text-lg space-y-4">
                  <p>
                    I'm a passionate software engineer with a strong foundation in full-stack development and site reliability engineering. 
                    I love building robust, scalable applications and solving complex technical challenges.
                  </p>
                  <p>
                    Currently working at John Deere as a Software Engineer, I focus on developing internal applications that improve 
                    business processes and user experiences. My experience spans from frontend development with React and TypeScript 
                    to backend services with AWS and PostgreSQL.
                  </p>
                  <p>
                    I'm always eager to learn new technologies and best practices, and I enjoy collaborating with cross-functional 
                    teams to deliver high-quality solutions that make a real impact.
                  </p>
                </div>
              </div>
            </div>

            {/* Education Section */}
            <div className="space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-wider uppercase border-b border-white/10 pb-2">
                Education
              </h3>
              <div className="space-y-6">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-semibold text-white">
                      Bachelor of Science in Computer Engineering
                    </h4>
                    <span className="text-purple-300 text-sm font-medium tracking-wider uppercase">
                      2020 - 2024
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-purple-400 text-sm font-medium tracking-wider">
                      Iowa State University
                    </p>
                    <span className="text-white text-sm font-semibold">
                      GPA: 3.X
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Graduated with honors. Focused on software engineering, computer architecture, and embedded systems. 
                    Completed coursework in data structures, algorithms, software design, and computer networks.
                  </p>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-semibold text-white">
                      Relevant Coursework
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {[
                      'Data Structures & Algorithms',
                      'Software Engineering',
                      'Computer Architecture',
                      'Database Systems',
                      'Operating Systems',
                      'Computer Networks',
                      'Embedded Systems',
                      'Digital Logic Design'
                    ].map((course, index) => (
                      <span
                        key={index}
                        className="
                          px-3 py-1
                          bg-purple-900/30 border border-purple-400/30
                          text-purple-300 text-xs font-medium
                          rounded-full
                          tracking-wider
                        "
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-lg font-semibold text-white mb-2">Skills & Technologies</h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className="text-purple-300 font-medium mb-2">Frontend</h5>
                      <div className="flex flex-wrap gap-2">
                        {['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Three.js'].map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-900/30 border border-blue-400/30 text-blue-300 text-xs rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h5 className="text-purple-300 font-medium mb-2">Backend</h5>
                      <div className="flex flex-wrap gap-2">
                        {['Node.js', 'AWS', 'PostgreSQL', 'MongoDB', 'Docker'].map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-green-900/30 border border-green-400/30 text-green-300 text-xs rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h5 className="text-purple-300 font-medium mb-2">Tools & Others</h5>
                      <div className="flex flex-wrap gap-2">
                        {['Git', 'Jenkins', 'Prisma', 'JIRA', 'ServiceNow'].map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-orange-900/30 border border-orange-400/30 text-orange-300 text-xs rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-8"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutMe;
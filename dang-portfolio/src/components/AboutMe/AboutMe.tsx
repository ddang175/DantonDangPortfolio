import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

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
  isMobile = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [contentOpacity, setContentOpacity] = useState(1);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const imagePosition = {
    mobile: { x: 50, y: 25 },
    desktop: { x: 50, y: 50 },
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isTransitioning) {
      setContentOpacity(0.3);
    } else {
      setContentOpacity(1);
    }
  }, [isTransitioning]);

  useEffect(() => {
    const checkScrollable = () => {
      if (scrollContainerRef.current) {
        const { scrollHeight, clientHeight, scrollTop } =
          scrollContainerRef.current;
        const hasOverflow = scrollHeight > clientHeight;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10; // 10px threshold

        setShowScrollIndicator(hasOverflow && !isAtBottom);
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", checkScrollable);
    }

    checkScrollable();
    window.addEventListener("resize", checkScrollable);

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", checkScrollable);
      }
      window.removeEventListener("resize", checkScrollable);
    };
  }, [contentOpacity]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const getModalPositioning = () => {
    if (isMobile) {
      return {
        bottom: "calc(100px)",
        maxHeight: "calc(80vh - 1rem - 1rem - 2rem)",
      };
    } else {
      return {
        bottom: "calc(27vh + 1rem)",
        maxHeight: "calc(100vh - 27vh - 1rem - 2rem)",
      };
    }
  };

  const modalPositioning = getModalPositioning();

  const currentPosition = isMobile
    ? imagePosition.mobile
    : imagePosition.desktop;

  return (
    <div
      className="fixed inset-x-0 z-[70] flex items-end justify-center p-4 pointer-events-none"
      style={{
        bottom: modalPositioning.bottom,
      }}
    >
      <div
        className="absolute inset-0 pointer-events-auto"
        onClick={handleClose}
      />

      <div
        className={`
          relative w-full max-w-4xl bg-black/90 border border-white/20 rounded-2xl
          shadow-2xl overflow-hidden pointer-events-auto
          transition-all duration-300 ease-out
          ${
            isVisible && !isClosing
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95"
          }
        `}
        style={{
          maxHeight: modalPositioning.maxHeight,
          height: modalPositioning.maxHeight,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-2 sm:p-4 border-b border-white/10 bg-black/10 backdrop-blur-sm">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white tracking-wider uppercase">
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
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div
          ref={scrollContainerRef}
          className="overflow-y-auto modal-scrollbar transition-opacity duration-150 ease-out relative"
          style={{
            opacity: contentOpacity,
            height: "calc(100% - 75px)",
            scrollbarWidth: "thin",
            scrollbarColor:
              "rgba(255, 255, 255, 0.4) rgba(255, 255, 255, 0.15)",
          }}
        >
          <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white tracking-wider uppercase border-b border-white/10 pb-2">
                Bio
              </h3>

              <div className="relative">
                <div
                  className={`
                  ${isMobile ? "w-full mb-6" : "w-70 float-left mr-6 mb-4"}
                  flex-shrink-0
                `}
                >
                  <div
                    className="
                    w-full h-90 md:h-120
                    bg-white/5 border border-white/10 rounded-lg
                    flex items-center justify-center
                    overflow-hidden
                    relative
                  "
                  >
                    <Image
                      src="/me.webp"
                      alt="Profile"
                      fill
                      className="object-cover"
                      style={{
                        objectPosition: `${currentPosition.x}% ${currentPosition.y}%`,
                      }}
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                </div>

                <div className="text-gray-300 leading-relaxed text-base sm:text-lg space-y-4">
                  <p>
                    Hi! My name is Danton Dang, and I am a Software Engineer and
                    student based out of Iowa. I am passionate about developing,
                    problem-solving, and lifelong learning.
                  </p>
                  <p>
                    Currently, I am a Software Engineer at John Deere team
                    called CyCloud. I focus on developing internal applications
                    that improve workflows, reduce manual work, and help people
                    adhere to enterprise standards (all while saving John Deere
                    some money). My role at Deere requires front and backend
                    development, exposing me to many different technologies and
                    skills.
                  </p>
                  <p>
                    I took a little break in the Summer of 2025 to intern at
                    Principal Financial Group on the Site Reliability
                    Engineering (SRE) team. Unlike Deere, my work at Principal
                    was all backend, throwing me into the deep end of cloud
                    services and system architecture. Through this internship, I
                    learned a lot about AWS and the best practices to ensure
                    systems/applications stay up for those who need it the most.
                  </p>
                  <p>
                    Outside of software engineering, I love playing volleyball,
                    hanging out with friends, building keyboards, helping run
                    Iowa State&apos;s Asian Student Union as Vice President, and
                    continuously learning. I am always eager to learn and grow
                    while collaborating/meeting with others, so let&apos;s
                    connect!
                  </p>
                </div>

                <div className="clear-left"></div>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white tracking-wider uppercase border-b border-white/10 pb-2">
                Education
              </h3>
              <div className="space-y-6">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-base sm:text-lg font-semibold text-white">
                      Bachelor&apos;s in Software Engineering
                    </h4>
                    <span className="text-purple-300 text-sm font-medium tracking-wider uppercase">
                      August 2023 - May 2027
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-purple-400 text-sm font-medium tracking-wider">
                      Iowa State University
                    </p>
                    <span className="text-white text-sm font-semibold">
                      GPA: 4.0
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    4x Dean&apos;s List | 2x President&apos;s List | George
                    Washington Carver Scholar (Full-Tuition Scholarship)
                  </p>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-base sm:text-lg font-semibold text-white">
                      Relevant Coursework
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {[
                      "Data Structures & Algorithms",
                      "Website Development",
                      "Embedded Systems",
                      "Discrete Mathematics",
                      "Digital Logic Design",
                      "Object Oriented Programming",
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
                  <h4 className="text-base sm:text-lg font-semibold text-white mb-2">
                    Skills & Technologies
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className="text-purple-300 font-medium mb-2">
                        Programming Languages
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "JavaScript",
                          "TypeScript",
                          "Python",
                          "Java",
                          "HTML",
                          "CSS",
                        ].map((language, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-purple-900/30 border border-purple-400/30 text-purple-300 text-xs rounded"
                          >
                            {language}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h5 className="text-purple-300 font-medium mb-2">
                        Frontend
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "React",
                          "ThreeJS",
                          "Tailwind CSS",
                          "MUI",
                          "JavaScript XML",
                        ].map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-900/30 border border-blue-400/30 text-blue-300 text-xs rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h5 className="text-purple-300 font-medium mb-2">
                        Backend & Cloud
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "AWS",
                          "PostgreSQL",
                          "MongoDB",
                          "Express",
                          "AWS Bedrock",
                          "AWS Lambda",
                          "AWS CDK",
                          "CloudFormation",
                        ].map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-green-900/30 border border-green-400/30 text-green-300 text-xs rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h5 className="text-purple-300 font-medium mb-2">
                        Tools & Others
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "Git",
                          "Jenkins",
                          "Prisma",
                          "ServiceNow",
                          "Nobl9",
                        ].map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-orange-900/30 border border-orange-400/30 text-orange-300 text-xs rounded"
                          >
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

        <div
          className={`scroll-arrow-container absolute left-1/2 pointer-events-none z-10 ${
            showScrollIndicator ? "visible" : ""
          }`}
          style={{ bottom: `0px` }}
        >
          <div className="animate-pulse">
            <svg
              className="w-6 h-6 text-white/80 drop-shadow-lg animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{
                animationDuration: "2s",
                filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5))",
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </div>

      <div
        className={`
        fixed z-80 transition-all duration-400 ease-in-out pointer-events-auto
        ${
          isVisible && !isClosing
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-full"
        }
        ${
          isMobile
            ? "bottom-[10] left-1/2 transform -translate-x-1/2 w-[90vw] max-w-[90vw]"
            : "bottom-[19vh] left-1/2 transform -translate-x-1/2 w-[90vw] max-w-[90vw]"
        }
      `}
      >
        <div
          className={`
          transition-all duration-400 ease-in-out
          ${isClosing ? "opacity-0 scale-95" : "opacity-100 scale-100"}
          ${isMobile ? "max-h-[340px]" : "max-h-[20vh]"}
        `}
        >
          <div
            className={`
            ${
              isMobile
                ? "max-h-[calc(220px)] overflow-y-auto custom-scrollbar"
                : "max-h-[calc(20vh-2rem)] overflow-y-auto custom-scrollbar"
            }
          `}
            style={{
              scrollbarWidth: "thin",
              scrollbarColor:
                "rgba(255, 255, 255, 0.2) rgba(255, 255, 255, 0.05)",
            }}
          >
            <div
              className={`
              ${
                isMobile
                  ? "flex flex-col gap-3 sm:gap-4 pb-2 w-full px-2 py-2"
                  : "flex flex-wrap items-center justify-center gap-4 lg:gap-5 xl:gap-6 pb-2 w-full py-2"
              }
            `}
            >
              <button
                onClick={handleClose}
                className={`
                  flex items-center justify-center
                  ${isMobile ? "w-full h-20" : "min-w-[140px] h-20"}
                  text-white font-sans tracking-widest uppercase
                  transition-all duration-400 ease-in-out
                  cursor-pointer
                  backdrop-blur-md bg-black/20 
                  border border-white/10
                  rounded-lg
                  hover:border-white/30 hover:bg-white/10
                  flex-shrink-0
                `}
                style={{
                  fontFamily: "Inter, Arial, sans-serif",
                }}
              >
                <span className="text-sm font-medium">Back</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutMe;

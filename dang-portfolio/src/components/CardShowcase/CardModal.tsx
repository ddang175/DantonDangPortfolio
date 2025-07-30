import React, { useState, useEffect, useRef } from "react";
import { CardData } from "./types";

interface CardModalProps {
  card: CardData;
  onClose: () => void;
  isTransitioning?: boolean;
  isClosing?: boolean;
  isMobile?: boolean;
  scrollArrowOffset?: number;
}

const CardModal: React.FC<CardModalProps> = ({
  card,
  onClose,
  isTransitioning = false,
  isClosing = false,
  isMobile = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [contentOpacity, setContentOpacity] = useState(1);
  const [isContentVisible, setIsContentVisible] = useState(true);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const containerHeight = isMobile ? "85%" : "90%";

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isClosing) {
      setIsVisible(false);
    }
  }, [isClosing]);

  useEffect(() => {
    if (isTransitioning) {
      setContentOpacity(0);
      setIsContentVisible(false);
    } else {
      setTimeout(() => {
        setIsContentVisible(true);
        setContentOpacity(1);
      }, 100);
    }
  }, [isTransitioning]);

  useEffect(() => {
    const checkScrollable = () => {
      if (scrollContainerRef.current) {
        const { scrollHeight, clientHeight, scrollTop } =
          scrollContainerRef.current;
        const hasOverflow = scrollHeight > clientHeight;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;

        setShowScrollIndicator(hasOverflow && !isAtBottom);
      }
    };

    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }

    checkScrollable();

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", checkScrollable);
    }

    window.addEventListener("resize", checkScrollable);

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", checkScrollable);
      }
      window.removeEventListener("resize", checkScrollable);
    };
  }, [card, contentOpacity]);

  const handleClose = () => {
    onClose();
  };

  const getModalPositioning = () => {
    if (isMobile) {
      return {
        bottom: "calc(240px - 1rem)",
        maxHeight: "calc(100vh - 270px - 1rem - 1rem - 2rem)",
      };
    } else {
      return {
        bottom: "calc(25vh + 5rem)",
        maxHeight: "calc(100vh - 17vh - 15vh - 1rem - 2rem)",
      };
    }
  };

  const modalPositioning = getModalPositioning();

  return (
    <div
      className={`fixed inset-x-0 z-[70] flex items-end justify-center p-4 pointer-events-none transition-opacity duration-500 ${
        isVisible && !isClosing ? "opacity-100" : "opacity-0"
      }`}
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
          relative w-full max-w-4xl bg-black/80 border border-white/20 rounded-2xl
          shadow-2xl overflow-hidden pointer-events-auto
          transition-all duration-500 ease-out
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
        <div className="flex items-center justify-between p-2 border-b border-white/10 bg-black/10">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white tracking-wider uppercase">
            {card.title}
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
          className="overflow-y-auto modal-scrollbar relative"
          style={{
            height: containerHeight,
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(255, 255, 255, 0.4) rgba(255, 255, 255, 0)",
          }}
        >
          <div
            className="p-4 sm:p-6 space-y-4 sm:space-y-6 transition-opacity duration-200 ease-out"
            style={{ opacity: contentOpacity }}
          >
            {(card.modalImageUrl || card.imageUrl) && (
              <div className="w-full">
                <div className="relative rounded-lg overflow-hidden bg-black/20">
                  <img
                    src={card.modalImageUrl || card.imageUrl}
                    alt={card.title}
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>
            )}

            <div className="space-y-4">
              {(card.company || card.date || card.link) && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {card.company && (
                      <p className="text-purple-400 text-base sm:text-lg font-medium tracking-wider">
                        {card.company}
                      </p>
                    )}
                    {card.link && (
                      <a
                        href={card.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                          inline-flex items-center gap-2
                          px-4 py-2
                          bg-purple-600 hover:bg-purple-700
                          text-white font-medium
                          rounded-lg
                          transition-colors duration-200
                          tracking-wider uppercase text-sm
                        "
                      >
                        View Project
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                    )}
                  </div>
                  {card.date && (
                    <p className="text-purple-300 text-sm font-medium tracking-wider uppercase">
                      {card.date}
                    </p>
                  )}
                </div>
              )}

              <p className="text-gray-300 leading-relaxed text-base sm:text-lg whitespace-pre-line">
                {card.description}
              </p>

              {card.technologies && card.technologies.length > 0 && (
                <div>
                  <h4 className="text-white font-semibold mb-2 tracking-wider uppercase text-xs sm:text-sm">
                    Technologies
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {card.technologies.map((tech, index) => (
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
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
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
    </div>
  );
};

export default CardModal;

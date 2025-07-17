import { useEffect, useState, useRef } from "react";

interface IntroTextProps {
  onComplete: () => void;
  onAnimationStart?: () => void;
  className?: string;
}

export default function IntroText({ onComplete, onAnimationStart, className = '' }: IntroTextProps) {
  const TIMING = {
    NORMAL_CHAR_DELAY: 50,
    DOT_CHAR_DELAY: 100,
    
    LINE_TRANSITION_DELAY: 800,
    
    FINAL_PAUSE: 1100,
    COMPLETION_DELAY: 200,
    
    DELETE_CHAR_DELAY: 25,
  };

  const [currentText, setCurrentText] = useState('');
  const [currentLine, setCurrentLine] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showText, setShowText] = useState(true);
  
  const lines = [
    "Hi!",
    "I'm Danton...",
    "here's who I am"
  ];
  
  const currentLineText = lines[currentLine];
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);
  const audioRefs = useRef<HTMLAudioElement[]>([]);

  useEffect(() => {
    const audioFiles = [];
    for (let i = 1; i <= 12; i++) {
      const audio = new Audio(`/audio/keys/${i}.mp3`);
      audio.preload = 'metadata';
      audio.volume = 0.8;
      audioFiles.push(audio);
    }
    audioRefs.current = audioFiles;

    return () => {
      audioRefs.current.forEach(audio => {
        audio.pause();
        audio.src = '';
      });
    };
  }, []);

  const playRandomKeySound = () => {
    if (audioRefs.current.length > 0) {
      const randomIndex = Math.floor(Math.random() * audioRefs.current.length);
      const audio = audioRefs.current[randomIndex];
      
      audio.currentTime = 0;
      audio.play().catch(err => {
        console.log('Audio play failed:', err);
      });
    }
  };

  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    if (!showText) return;

    if (!isDeleting) {
      if (currentText.length < currentLineText.length) {
        const nextChar = currentLineText[currentText.length];
        const delay = nextChar === '.' ? TIMING.DOT_CHAR_DELAY : TIMING.NORMAL_CHAR_DELAY;
        
        const timer = setTimeout(() => {
          setCurrentText(currentLineText.slice(0, currentText.length + 1));
          playRandomKeySound();
        }, delay);
        timeoutRefs.current.push(timer);
        
        if (currentLine === 0 && currentText.length === 0) {
          onAnimationStart?.();
        }
      } else {
        if (currentLine < lines.length - 1) {
          const timer = setTimeout(() => {
            setCurrentLine(currentLine + 1);
            setCurrentText('');
          }, TIMING.LINE_TRANSITION_DELAY);
          timeoutRefs.current.push(timer);
        } else {
          const timer = setTimeout(() => {
            setIsDeleting(true);
          }, TIMING.FINAL_PAUSE);
          timeoutRefs.current.push(timer);
        }
      }
    } else {
      if (currentText.length > 0) {
        const timer = setTimeout(() => {
          setCurrentText(currentText.slice(0, -1));
          playRandomKeySound();
        }, TIMING.DELETE_CHAR_DELAY);
        timeoutRefs.current.push(timer);
      } else {
        if (currentLine > 0) {
          setCurrentLine(currentLine - 1);
          setCurrentText(lines[currentLine - 1]);
        } else {
          const timer = setTimeout(() => {
            setShowText(false);
            onComplete();
          }, TIMING.COMPLETION_DELAY);
          timeoutRefs.current.push(timer);
        }
      }
    }
  }, [currentText, currentLine, isDeleting, showText, currentLineText, lines, onComplete]);

  if (!showText) return null;

  return (
    <div className={`absolute inset-0 z-[60] flex flex-col justify-center items-center text-white ${className}`}>
      <div 
        className="text-4xl md:text-6xl text-center leading-relaxed"
        style={{ fontFamily: 'Inter, sans-serif', 
          fontWeight: '400',
        }}
      >
        {lines.map((line, index) => (
          <div key={index} className="mb-4 relative h-[1.2em]">
            <div className="absolute inset-0 flex justify-center">
              <div className="relative">
                <span 
                  className="invisible whitespace-nowrap"
                  style={{ fontFamily: 'Inter, sans-serif', 
                    fontWeight: '400',
                  }}
                >
                  {line}
                </span>
                <span className="absolute left-0 top-0 whitespace-nowrap">
                  {index < currentLine ? line : index === currentLine ? currentText : ''}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
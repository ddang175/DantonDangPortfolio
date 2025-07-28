import { useEffect, useRef, useCallback } from 'react';

export const VOLUME_CONFIG = {
  INTRO_START: 0,
  INTRO_END: 0.05,
  LOADING_START: 0.05,
  LOADING_END: 0.1,
  WHOOSH_VOLUME: 0.3,
};

interface UseAudioControlProps {
  onIntroStart?: () => void;
  onIntroComplete?: () => void;
  onLoadingStart?: () => void;
  onLoadingComplete?: () => void;
}

export const useAudioControl = ({
  onIntroStart,
  onIntroComplete,
  onLoadingStart,
  onLoadingComplete,
}: UseAudioControlProps = {}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const whooshAudioRef = useRef<HTMLAudioElement | null>(null);
  const volumeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('/audio/loop.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0;

    whooshAudioRef.current = new Audio('/audio/whoosh.mp3');
    whooshAudioRef.current.volume = VOLUME_CONFIG.WHOOSH_VOLUME;
    whooshAudioRef.current.preload = 'auto';

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      if (whooshAudioRef.current) {
        whooshAudioRef.current.pause();
        whooshAudioRef.current.src = '';
      }
      if (volumeIntervalRef.current) {
        clearInterval(volumeIntervalRef.current);
      }
    };
  }, []);

  const startMusic = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(err => {
        console.log('Audio play failed:', err);
      });
    }
  }, []);

  const playWhoosh = useCallback((delayMs: number = 0) => {
    if (!whooshAudioRef.current) return;

    const playWithDelay = () => {
      whooshAudioRef.current!.currentTime = 0;
      whooshAudioRef.current!.play().catch(err => {
        console.log('Whoosh audio play failed:', err);
      });
    };

    if (delayMs > 0) {
      setTimeout(playWithDelay, delayMs);
    } else {
      playWithDelay();
    }
  }, []);

  const fadeVolume = useCallback((startVolume: number, endVolume: number, duration: number) => {
    if (!audioRef.current) return;

    const startTime = Date.now();
    const volumeDiff = endVolume - startVolume;
    
    if (volumeIntervalRef.current) {
      clearInterval(volumeIntervalRef.current);
    }

    volumeIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const currentVolume = startVolume + (volumeDiff * progress);
      audioRef.current!.volume = currentVolume;

      if (progress >= 1) {
        if (volumeIntervalRef.current) {
          clearInterval(volumeIntervalRef.current);
          volumeIntervalRef.current = null;
        }
      }
    }, 32);
  }, []);

  const startIntroMusic = useCallback(() => {
    startMusic();
    fadeVolume(VOLUME_CONFIG.INTRO_START, VOLUME_CONFIG.INTRO_END, 2000);
    onIntroStart?.();
  }, [startMusic, fadeVolume, onIntroStart]);

  const completeIntroMusic = useCallback(() => {
    fadeVolume(VOLUME_CONFIG.INTRO_END, VOLUME_CONFIG.LOADING_END, 1000);
    onIntroComplete?.();
  }, [fadeVolume, onIntroComplete]);

  const startLoadingMusic = useCallback(() => {
    fadeVolume(VOLUME_CONFIG.LOADING_START, VOLUME_CONFIG.LOADING_END, 1000);
    onLoadingStart?.();
  }, [fadeVolume, onLoadingStart]);

  const completeLoadingMusic = useCallback(() => {
    onLoadingComplete?.();
  }, [onLoadingComplete]);

  return {
    startIntroMusic,
    completeIntroMusic,
    startLoadingMusic,
    completeLoadingMusic,
    playWhoosh,
  };
}; 
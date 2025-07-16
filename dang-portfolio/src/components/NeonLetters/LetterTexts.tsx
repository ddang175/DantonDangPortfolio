import { useMemo } from 'react';
import OptimizedLetterGroup from './OptimizedLetterGroup';
import { NAME_LETTERS_CONFIG, SWE_LETTERS_CONFIG, NAME_COLORS, SWE_COLORS } from './letterConfigs';

export const LetterTexts = () => {
  const nameLetters = useMemo(() => 
    NAME_LETTERS_CONFIG.map(config => ({
      char: config.char,
      position: config.position as [number, number, number],
      rotation: config.baseRotation as [number, number, number]
    })), []);

  const sweLetters = useMemo(() => 
    SWE_LETTERS_CONFIG.map(config => ({
      char: config.char,
      position: config.position as [number, number, number],
      rotation: config.baseRotation as [number, number, number]
    })), []);

  const optimizedNameLetters = useMemo(() => 
    nameLetters.map((letter, index) => ({
      char: letter.char,
      position: letter.position,
      baseRotation: letter.rotation,
      fontSize: 0.1,
      height: 0.02,
      letterSpacing: 0.04,
      index
    })), [nameLetters]);

  const optimizedSweLetters = useMemo(() => {
    const fontSize = 0.15;
    const compress = 0.9;
    const xs = sweLetters.map(l => l.position[0]);
    const meanX = xs.reduce((a, b) => a + b, 0) / xs.length;
    return sweLetters.map((letter, index) => ({
      char: letter.char,
      position: [
        (letter.position[0] - meanX) * compress,
        letter.position[1],
        letter.position[2]
      ] as [number, number, number],
      baseRotation: letter.rotation,
      fontSize,
      height: 0.02,
      letterSpacing: 0.009,
      index
    }));
  }, [sweLetters]);

  return (
    <>
      <OptimizedLetterGroup
        letters={optimizedNameLetters}
        color={NAME_COLORS.text}
        lightColor={NAME_COLORS.light}
      />
      
      <OptimizedLetterGroup
        letters={optimizedSweLetters}
        color={SWE_COLORS.text}
        lightColor={SWE_COLORS.light}
        animationIntensity={0.4}
        emissiveIntensity={1.95}
      />
    </>
  );
}; 
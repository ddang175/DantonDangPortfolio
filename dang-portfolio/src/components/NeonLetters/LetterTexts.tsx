import { useMemo } from 'react';
import OptimizedLetterGroup from './OptimizedLetterGroup';
import { NAME_LETTERS_CONFIG, NAME_COLORS, SWE_COLORS } from './letterConfigs';

export const LetterTexts = () => {
  const nameLetters = useMemo(() => 
    NAME_LETTERS_CONFIG.map(config => ({
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

  return (
    <>
      <OptimizedLetterGroup
        letters={optimizedNameLetters}
        color={NAME_COLORS.text}
        lightColor={NAME_COLORS.light}
      />
    </>
  );
}; 
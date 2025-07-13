import { useMemo } from 'react';
import NeonText3D from './NeonText3D';
import { NAME_LETTERS_CONFIG, SWE_LETTERS_CONFIG, NAME_COLORS, SWE_COLORS } from '../utils/letterConfigs';
import { calculateReactiveRotation } from '../utils/rotationUtils';

interface LetterTextsProps {
  smoothMousePosition: { x: number; y: number };
}

export const LetterTexts = ({ smoothMousePosition }: LetterTextsProps) => {
  const nameLetters = useMemo(() => 
    NAME_LETTERS_CONFIG.map(config => ({
      char: config.char,
      position: config.position as [number, number, number],
      rotation: calculateReactiveRotation(
        config.baseRotation as [number, number, number], 
        config.position as [number, number, number],
        smoothMousePosition.x,
        smoothMousePosition.y,
        true
      )
    })), [smoothMousePosition.x, smoothMousePosition.y]);

  const sweLetters = useMemo(() => 
    SWE_LETTERS_CONFIG.map(config => ({
      char: config.char,
      position: config.position as [number, number, number],
      rotation: calculateReactiveRotation(
        config.baseRotation as [number, number, number], 
        config.position as [number, number, number],
        smoothMousePosition.x,
        smoothMousePosition.y,
        false
      )
    })), [smoothMousePosition.x, smoothMousePosition.y]);

  return (
    <>
      <NeonText3D
        letters={nameLetters}
        fontSize={0.1}
        height={0.02}
        color={NAME_COLORS.text}
        lightColor={NAME_COLORS.light}
      />
      
      <NeonText3D
        letters={sweLetters}
        fontSize={0.15}
        height={0.02}
        color={SWE_COLORS.text}
        lightColor={SWE_COLORS.light}
      />
    </>
  );
}; 
const previousRotations = new WeakMap<object, [number, number, number]>();

const letterKeyCache = new Map<string, object>();

const getLetterKey = (position: [number, number, number], isName: boolean): object => {
  const keyString = `${position[0]}-${position[1]}-${position[2]}-${isName}`;
  
  if (!letterKeyCache.has(keyString)) {
    letterKeyCache.set(keyString, {});
  }
  
  return letterKeyCache.get(keyString)!;
};

export const calculateReactiveRotation = (
  baseRotation: [number, number, number], 
  position: [number, number, number],
  mouseX: number,
  mouseY: number,
  isName: boolean = true
): [number, number, number] => {
  const lerpFactor = 0.04;
  const mouseInfluence = 0.9;
  const proximityRadius = isName ? 1 : 1.0;
  const maxDistance = isName ? 1.2 : 1.5;
  
  const letterX = position[0] * 0.5;
  const letterY = position[1] * 0.5;
  const adjustedMouseY = isName ? mouseY - 0.4 : mouseY;
  
  const distance = Math.sqrt(
    (mouseX - letterX) ** 2 + 
    (adjustedMouseY - letterY) ** 2
  );
  
  if (distance > maxDistance) {
    return getLerpedRotation(position, isName, baseRotation, baseRotation, lerpFactor);
  }
  
  const influence = getProximityInfluence(distance, proximityRadius, maxDistance, mouseInfluence);
  
  const targetRotation: [number, number, number] = [
    Math.max(-1, Math.min(1, baseRotation[0] + mouseY * influence * 1.5)),
    Math.max(-1, Math.min(1, baseRotation[1] + mouseX * influence * 1.5)),
    Math.max(-1, Math.min(1, baseRotation[2] + (mouseX + mouseY) * influence * 0.75))
  ];

  return getLerpedRotation(position, isName, baseRotation, targetRotation, lerpFactor);
};

const getProximityInfluence = (
  distance: number, 
  proximityRadius: number, 
  maxDistance: number, 
  mouseInfluence: number
): number => {
  if (distance < proximityRadius) {
    const proximityInfluence = Math.pow(1 - (distance / proximityRadius), 3);
    return mouseInfluence * Math.max(0, Math.min(1, proximityInfluence));
  } else if (distance < maxDistance) {
    const falloffInfluence = 0.05 * (1 - (distance - proximityRadius) / (maxDistance - proximityRadius));
    return mouseInfluence * Math.max(0, Math.min(0.05, falloffInfluence));
  }
  return 0;
};

const getLerpedRotation = (
  position: [number, number, number],
  isName: boolean,
  baseRotation: [number, number, number],
  targetRotation: [number, number, number],
  lerpFactor: number
): [number, number, number] => {
  const letterKey = getLetterKey(position, isName);
  const previousRotation = previousRotations.get(letterKey) || baseRotation;
  
  const lerpedRotation: [number, number, number] = [
    previousRotation[0] + (targetRotation[0] - previousRotation[0]) * lerpFactor,
    previousRotation[1] + (targetRotation[1] - previousRotation[1]) * lerpFactor,
    previousRotation[2] + (targetRotation[2] - previousRotation[2]) * lerpFactor
  ];
  
  previousRotations.set(letterKey, lerpedRotation);
  return lerpedRotation;
};

// Cleanup function to clear memory when needed
export const cleanupRotationCache = () => {
  letterKeyCache.clear();
}; 
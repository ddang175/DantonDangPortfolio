export const calculateReactiveRotation = (
  baseRotation: [number, number, number], 
  position: [number, number, number],
  mouseX: number,
  mouseY: number,
  isName: boolean = true
): [number, number, number] => {
  const mouseInfluence = 0.9;
  const proximityRadius = isName ? 1 : 1.0;
  const maxDistance = isName ? 1.2 : 1.5;
  
  const letterScreenX = position[0] * 0.5;
  const letterScreenY = position[1] * 0.5;
  const adjustedMouseY = isName ? mouseY - 0.4 : mouseY;
  
  const mouseToLetterDistance = Math.sqrt(
    (mouseX - letterScreenX) ** 2 + 
    (adjustedMouseY - letterScreenY) ** 2
  );
  
  let proximityInfluence = 0;
  if (mouseToLetterDistance < proximityRadius) {
    proximityInfluence = Math.pow(1 - (mouseToLetterDistance / proximityRadius), 3);
    proximityInfluence = Math.max(0, Math.min(1, proximityInfluence));
  } else if (mouseToLetterDistance < maxDistance) {
    proximityInfluence = 0.05 * (1 - (mouseToLetterDistance - proximityRadius) / (maxDistance - proximityRadius));
    proximityInfluence = Math.max(0, Math.min(0.05, proximityInfluence));
  }
  
  const influence = mouseInfluence * proximityInfluence;
  const smoothedX = mouseX * influence;
  const smoothedY = mouseY * influence;
  const smoothedZ = (mouseX + mouseY) * influence * 0.5;
  
  return [
    Math.max(-1, Math.min(1, baseRotation[0] + smoothedY)),
    Math.max(-1, Math.min(1, baseRotation[1] + smoothedX)),
    Math.max(-1, Math.min(1, baseRotation[2] + smoothedZ))
  ] as [number, number, number];
}; 
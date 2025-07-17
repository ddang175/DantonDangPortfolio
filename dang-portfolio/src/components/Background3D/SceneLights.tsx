import { NAME_COLORS, SWE_COLORS } from '../NeonLetters/letterConfigs';

export const SceneLights = () => {
  return (
    <>
      <pointLight 
        position={[-0.24, 0.39, 1.2]}
        intensity={5}
        distance={5.2}
        color={NAME_COLORS.light}
      />
      
      <pointLight 
        position={[0.24, 0.39, 1.2]} 
        intensity={5}
        distance={5.2}
        color={NAME_COLORS.light}
      />
      <pointLight 
        position={[-0, -0.4, 2]} 
        intensity={7}
        distance={4.5}
        decay={0}
        color={SWE_COLORS.light}
      />
      
      
    </>
  );
}; 
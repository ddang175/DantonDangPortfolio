import { NAME_COLORS, SWE_COLORS } from '../utils/letterConfigs';

export const SceneLights = () => {
  return (
    // light for danton dang
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
{/* light for software engineer */}
      <pointLight 
        position={[-0.64, -1.51, -1.5]} 
        intensity={3}
        distance={2}
        color={SWE_COLORS.light}
      />
      
      <pointLight 
        position={[0.64, -1.51, -1.5]} 
        intensity={1.7}
        distance={2}
        color={SWE_COLORS.light}
      />
    </>
  );
}; 
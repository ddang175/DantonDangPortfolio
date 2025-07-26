import { Suspense, useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import { ModelScene } from './scene/ModelScene';
import { NeonTextModelScene } from './scene/NeonTextModelScene';
import { FrameRateLimit } from './utils/FrameRateLimit';
import { CameraAnimation } from './utils/CameraAnimation';
import { MouseParallax } from './utils/MouseParallax';
import FloatingGitHubLogo from '@/components/GitHubLogo/FloatingGitHubLogo';
import FloatingLinkedInLogo from '@/components/LinkedInLogo/FloatingLinkedInLogo';
import FloatingEmailLogo from '@/components/EmailLogo/FloatingEmailLogo';
import FloatingResumeLogo from '@/components/ResumeLogo/FloatingResumeLogo';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

interface BackgroundCanvasProps {
  modelPath: string;
  startAnimation?: boolean;
  onReady?: () => void;
}

const neonLetters = [
  { char: 'D', position: [-1.1, -1.5, 0] as [number, number, number] },
  { char: 'A', position: [-0.66, -1.5, 0] as [number, number, number] },
  { char: 'N', position: [-0.22, -1.5, 0] as [number, number, number] },
  { char: 'T', position: [0.22, -1.5, 0] as [number, number, number] },
  { char: 'O', position: [0.66, -1.5, 0] as [number, number, number] },
  { char: 'N', position: [1.1, -1.5, 0] as [number, number, number] },
  { char: 'D', position: [-0.66, -2, 0] as [number, number, number] },
  { char: 'A', position: [-0.22, -2, 0] as [number, number, number] },
  { char: 'N', position: [0.22, -2, 0] as [number, number, number] },
  { char: 'G', position: [0.66, -2, 0] as [number, number, number] },
];

const BackgroundCanvasComponent: React.FC<BackgroundCanvasProps> = ({ 
  modelPath,
  startAnimation = false,
  onReady
}) => {
  const [cameraAnimationComplete, setCameraAnimationComplete] = useState(false);
  const [modelsReady, setModelsReady] = useState({ city: false, car: false, neonText: false });
  const modelsReadyRef = useRef({ city: false, car: false, neonText: false });

  const sceneY = 0;
  const initialCameraPos: [number, number, number] = [0, 0, 50];
  const targetCameraPos: [number, number, number] = [0, 0, 5];
  const initialFov = 160;
  const targetFov = 70;

  const handleModelReady = (modelType: 'city' | 'car' | 'neonText') => {
    console.log(`Model ready: ${modelType}`);
    modelsReadyRef.current[modelType] = true;
    setModelsReady(prev => ({ ...prev, [modelType]: true }));
  };

  const allModelsReady = modelsReady.city && modelsReady.car && modelsReady.neonText;
  const [shouldStartAnimation, setShouldStartAnimation] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log('Models ready state:', modelsReady);
    console.log('Start animation:', startAnimation);
    console.log('All models ready:', allModelsReady);
    console.log('Should start animation:', shouldStartAnimation);
  }, [modelsReady, startAnimation, allModelsReady, shouldStartAnimation]);

  // Start animation immediately when all models are ready
  useEffect(() => {
    if (startAnimation && allModelsReady && !shouldStartAnimation) {
      console.log('All models ready, starting camera animation now');
      setShouldStartAnimation(true);
    }
  }, [startAnimation, allModelsReady, shouldStartAnimation]);

  // Notify parent when all models are ready
  useEffect(() => {
    if (allModelsReady && onReady) {
      console.log('All models ready, notifying parent');
      onReady();
    }
  }, [allModelsReady, onReady]);

  return (
    <div className="absolute inset-0 w-full h-full z-0">
      <Canvas
        dpr={1}
        shadows
        frameloop="demand"
        camera={{ 
          position: initialCameraPos,
          fov: initialFov,
          rotation: [0, 0, 0],
          up: [0, 1, 0]
        }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      >
        <EffectComposer>
          <Bloom intensity={2} luminanceThreshold={0.1} luminanceSmoothing={0.025} radius={0.7} />
        </EffectComposer>
        
        
        <spotLight
          position={[0, 8, 0]}
          intensity={5}
          color={0x4fc3f7} 
          angle={Math.PI / 4} 
          penumbra={0.3}
          distance={20} 
          decay={1.5}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        
        {/* left side  - warm white */}
        <spotLight
          position={[-2, 1, 2]}
          intensity={2}
          color={0xfff4e6} 
          angle={Math.PI / 8} 
          penumbra={0.3}
          distance={8} 
          decay={1.2}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        
        {/* right neon light - cyan/teal */}
        <spotLight
          position={[4, 3, 6]}
          intensity={4}
          color={0x00bcd4} 
          angle={Math.PI / 6} 
          penumbra={0.4}
          distance={15} 
          decay={1.2}
          castShadow
          shadow-mapSize-width={512}
          shadow-mapSize-height={512}
        />
        
        {/* left neon light - purple */}
        <spotLight
          position={[-3, 2, -4]}
          intensity={3.5}
          color={0x9c27b0} 
          angle={Math.PI / 5} 
          penumbra={0.5}
          distance={12} 
          decay={1.4}
          castShadow
          shadow-mapSize-width={512}
          shadow-mapSize-height={512}
        />
        
        {/* right neon light - orange/amber */}
        <spotLight
          position={[3, 2, -4]}
          intensity={3.5}
          color={0xff9800} 
          angle={Math.PI / 5} 
          penumbra={0.5}
          distance={12} 
          decay={1.4}
          castShadow
          shadow-mapSize-width={512}
          shadow-mapSize-height={512}
        />
        
       
        <spotLight
          position={[0, 6, -2]}
          intensity={3}
          color={0xe91e63} 
          angle={Math.PI / 10} 
          penumbra={0.3}
          distance={10} 
          decay={1.2}
          castShadow
          shadow-mapSize-width={512}
          shadow-mapSize-height={512}
        />
        
        
        <group position={[0, 0, 1]}>
          <Stars
            radius={0.1}
            depth={30}
            count={2000}
            factor={0.7}
            saturation={2}
            fade
            speed={2}
          />
        </group>
        <Suspense fallback={null}>
          <group position={[0, sceneY, 0]}>
            <group rotation={[0, 0, 0]}>
              
              <ModelScene
                modelPath={'/city/city.glb'}
                position={[0,-0.65, 4]} 
                rotation={[0, 0, 0]}
                scale={1.3} 
                enableMouseRotation={true}
                maxRotationX={Math.PI / 30}
                maxRotationY={Math.PI / 14}
                rotationSensitivity={0.8}
                rotationSmoothness={0.06}
                onReady={() => handleModelReady('city')}
              />

              <ModelScene 
                modelPath={modelPath}
                position={[0, -0.7, 0]}
                rotation={[0, 0, 0]}
                scale={0.012}
                enableMouseRotation={true}
                maxRotationX={Math.PI / 30}
                maxRotationY={Math.PI / 14}
                rotationSensitivity={0.8}
                rotationSmoothness={0.06}
                onReady={() => handleModelReady('car')}
              />
              {shouldStartAnimation && (
                        <CameraAnimation
          onAnimationComplete={() => setCameraAnimationComplete(true)}
                  initialPosition={initialCameraPos}
                  targetPosition={targetCameraPos}
                  initialFov={initialFov}
                  targetFov={targetFov}
                  duration={3000}
                />
              )}
              <FrameRateLimit fps={60} />
            </group>

            <group>
              <group position={[-0.15, -0.27, 4.5]}>
                <FloatingEmailLogo />
              </group>
              <group position={[-0.05, -0.27, 4.5]}>
                <FloatingResumeLogo />
              </group>
              <group position={[0.05, -0.27, 4.5]}>
                <FloatingLinkedInLogo />
              </group>
              
              <group position={[0.15, -0.27, 4.5]}>
                <FloatingGitHubLogo />
              </group>
            </group>

            <NeonTextModelScene
              letters={neonLetters}
              position={[0, 3, 0]}
              enableMouseRotation={true}
              maxRotationX={Math.PI / 30}
                maxRotationY={Math.PI / 14}
                rotationSensitivity={0.8}
                rotationSmoothness={0.06}
                onReady={() => handleModelReady('neonText')}
            />
          </group>
        </Suspense>
      </Canvas>
    </div>
  );
}; 

const BackgroundCanvas = dynamic(() => Promise.resolve(BackgroundCanvasComponent), { ssr: false });
export default BackgroundCanvas;
export { BackgroundCanvasComponent as BackgroundCanvas };
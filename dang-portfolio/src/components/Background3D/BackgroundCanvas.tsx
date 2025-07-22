import { Suspense, useState } from 'react';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { ModelScene } from './scene/ModelScene';
import { FrameRateLimit } from './utils/FrameRateLimit';
import { CameraAnimation } from './utils/CameraAnimation';
import { MouseParallax } from './utils/MouseParallax';
import FloatingGitHubLogo from '@/components/GitHubLogo/FloatingGitHubLogo';
import FloatingLinkedInLogo from '@/components/LinkedInLogo/FloatingLinkedInLogo';
import FloatingEmailLogo from '@/components/EmailLogo/FloatingEmailLogo';
import FloatingResumeLogo from '@/components/ResumeLogo/FloatingResumeLogo';
import NeonText3D from '@/components/NeonLetters/NeonText3D';

interface BackgroundCanvasProps {
  modelPath: string;
  startAnimation?: boolean;
}

const neonLetters = [
  { char: 'D', position: [-2, 0, 0] as [number, number, number] },
  { char: 'A', position: [-1, 0, 0] as [number, number, number] },
  { char: 'N', position: [0, 0, 0] as [number, number, number] },
  { char: 'T', position: [1, 0, 0] as [number, number, number] },
  { char: 'O', position: [2, 0, 0] as [number, number, number] },
  { char: 'N', position: [3, 0, 0] as [number, number, number] },
];

const BackgroundCanvasComponent: React.FC<BackgroundCanvasProps> = ({ 
  modelPath,
  startAnimation = false 
}) => {
  const [cameraAnimationComplete, setCameraAnimationComplete] = useState(false);

  const sceneY = 0;
  const initialCameraPos: [number, number, number] = [0, 0, 20];
  const targetCameraPos: [number, number, number] = [0, 0, 5];
  const initialFov = 120;
  const targetFov = 70;

  const modelPosition: [number, number, number] = [0, -0.7, 0]; 
  const modelRotation: [number, number, number] = [0, 0, 0]; 
  const modelScale = 1; 

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
        <group position={[0, 0, 0]}>
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
                modelPath={modelPath}
                position={modelPosition}
                rotation={modelRotation}
                scale={modelScale}
              />
              {startAnimation && (
                <CameraAnimation
                  onAnimationComplete={() => setCameraAnimationComplete(true)}
                  initialPosition={initialCameraPos}
                  targetPosition={targetCameraPos}
                  initialFov={initialFov}
                  targetFov={targetFov}
                  duration={3000}
                />
              )}
              <MouseParallax enabled={cameraAnimationComplete} />
              <FrameRateLimit fps={60} />
            </group>

            <group>
              <group position={[-5, 2, 0]}>
                <FloatingGitHubLogo />
              </group>
              <group position={[5, 2, 0]}>
                <FloatingLinkedInLogo />
              </group>
              <group position={[-5, -2, 0]}>
                <FloatingEmailLogo />
              </group>
              <group position={[5, -2, 0]}>
                <FloatingResumeLogo />
              </group>
            </group>

            <group position={[0, 3, 0]}>
              <NeonText3D letters={neonLetters} />
            </group>
          </group>
        </Suspense>
      </Canvas>
    </div>
  );
}; 

const BackgroundCanvas = dynamic(() => Promise.resolve(BackgroundCanvasComponent), { ssr: false });
export default BackgroundCanvas;
export { BackgroundCanvasComponent as BackgroundCanvas };
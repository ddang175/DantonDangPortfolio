import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { ModelScene } from './scene/ModelScene';
import { FrameRateLimit } from './utils/FrameRateLimit';
import { CameraAnimation } from './utils/CameraAnimation';
import { MouseParallax } from './utils/MouseParallax';

interface BackgroundCanvasProps {
  modelPath: string;
}

export const BackgroundCanvas: React.FC<BackgroundCanvasProps> = ({ modelPath }) => {
  const [sceneStarted, setSceneStarted] = useState(false);
  const [cameraAnimationComplete, setCameraAnimationComplete] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);

  const startScene = () => {
    setSceneStarted(true);
    setTimeout(() => setShowLoadingScreen(false), 200);
  };

  return (
    <>
      <Canvas
        dpr={1}
        shadows
        frameloop="demand"
        camera={{ position: [0, 0, 0], fov: 75 }}
      >
        <Stars
          radius={0.1}
          depth={30}
          count={2000}
          factor={0.7}
          saturation={2}
          fade
          speed={2}
        />
        <Suspense fallback={null}>
          {sceneStarted && (
            <>
              <ModelScene modelPath={modelPath} />
              <CameraAnimation
                onAnimationComplete={() => setCameraAnimationComplete(true)}
              />
              <MouseParallax enabled={cameraAnimationComplete} />
              <FrameRateLimit fps={60} />
            </>
          )}
        </Suspense>
      </Canvas>

     
    </>
  );
}; 
'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import * as THREE from 'three';
import StarField from './StarField';
import ModelLoader from './ModelLoader';
import { SceneLights } from './SceneLights';
import { LetterTexts } from './LetterTexts';
import { useMouseInteraction } from '../hooks/useMouseInteraction';
import { useCarAnimation } from '../hooks/useCarAnimation';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

function Background3D({ modelPath }: { modelPath: string }) {
  const { smoothMousePosition, isMouseMoving, carTargetIntensity, mousePosition } = useMouseInteraction();
  const { carRotationX, carRotationY } = useCarAnimation(isMouseMoving, carTargetIntensity, mousePosition);

  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ 
          position: [0, 0, 1],
          fov: 65,
          near: 0.1, 
          far: 40
        }}
        style={{ background: 'transparent' }}
        gl={{ 
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
          logarithmicDepthBuffer: false,
          precision: "mediump",
          preserveDrawingBuffer: false,
          failIfMajorPerformanceCaveat: false,
          antialias: true,
        }}
        shadows={false}
        dpr={[1, 2]}
        frameloop="demand"
        performance={{ min: 0.5 }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 0;
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }}
      >
        <Suspense fallback={null}>
          <StarField />
          <SceneLights />
          <LetterTexts smoothMousePosition={smoothMousePosition} />
          <ModelLoader modelPath={modelPath} rotationX={carRotationX} rotationY={carRotationY} />
          
          <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            enableRotate={false} 
            autoRotate={false} 
            target={[0, 0, 0]}
          />
          
          <EffectComposer multisampling={4}>
            <Bloom
              intensity={1.5}
              luminanceThreshold={0.8}
              luminanceSmoothing={0.3}
              radius={0.8}
              mipmapBlur={true}
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}

export default dynamic(() => Promise.resolve(Background3D), {
  ssr: false,
  loading: () => <div className="absolute inset-0 z-0 bg-black" />
}); 
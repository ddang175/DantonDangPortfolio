'use client';

import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, useEnvironment } from '@react-three/drei';
import { Suspense, useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

function Model({ url, rotationX, rotationY }: { url: string; rotationX: number; rotationY: number }) {
  const { scene } = useGLTF(url);
  
  scene.traverse((child: any) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      
      if (child.material) {
        child.material.transparent = false;
        child.material.opacity = 1.0;
        child.material.alphaTest = 0.5;
        child.material.depthWrite = true;
        child.material.depthTest = true;
        child.material.needsUpdate = true;
      }
    }
  });
  
  return <primitive object={scene} rotation={[rotationX, rotationY + Math.PI, 0]} />;
}

function Background3D({ modelPath }: { modelPath: string }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [carRotationX, setCarRotationX] = useState(0);
  const [carRotationY, setCarRotationY] = useState(0);
  const targetRotationRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      setMousePosition({ x, y });
      
      const rotationY = Math.atan2(x, 0.5) * 0.5; 
      
      const rotationX = Math.atan2(-y, 0.5) * 0.3; 
      
      targetRotationRef.current = { x: rotationX, y: rotationY };
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const lerpFactor = 0.03; //(0.01 = very slow, 0.1 = fast)
    
    const animate = () => {
      setCarRotationX(prev => prev + (targetRotationRef.current.x - prev) * lerpFactor);
      setCarRotationY(prev => prev + (targetRotationRef.current.y - prev) * lerpFactor);
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
    
    return () => {
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ 
          position: [0, .8, 4], // x y z
          fov: 80, 
          near: 0.1, 
          far: 5 
        }}
        style={{ background: 'transparent' }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
          logarithmicDepthBuffer: true,
        }}
        shadows
        dpr={[1, 2]} 
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.0} color="#000000" />
          
          {/* focused on front of car */}
          <spotLight 
            position={[0, 0, 8]} 
            target-position={[0, 0, 0]} 
            intensity={3.0} 
            angle={0.6} 
            penumbra={0.3} 
            distance={10} 
            color="#ffffff"
            castShadow={false}
          />
          
          {/* overhead lighting, more focused on front */}
          <spotLight 
            position={[0, 4, 4]} 
            target-position={[0, 0, 0]}
            intensity={2.5} 
            angle={0.5} 
            penumbra={0.1}
            distance={8} 
            color="#ffffff"
          />
          
          {/* focused on front hood area */}
          <spotLight 
            position={[0, 0, 8]} 
            target-position={[0, 0.3, 0]} 
            intensity={20.0} 
            angle={0.7} 
            penumbra={0.05} 
            distance={10} 
            color="#ffffff"
          />
          
          {/* Left side lighting */}
          <spotLight 
            position={[6, 0, 6]}
            target-position={[0, 0, 0]} 
            intensity={0.8} 
            angle={0.3} 
            penumbra={0.1}
            distance={10} 
            color="#ffffff"
          />
          
          {/* Right side lighting */}
          <spotLight 
            position={[-6, 0, 6]} 
            target-position={[0, 0, 0]} 
            intensity={0.8} 
            angle={0.3} 
            penumbra={0.1} 
            distance={10} 
            color="#ffffff"
          />
          
          {/* back lighting */}
          <spotLight 
            position={[0, 0, -6]}
            target-position={[0, 0, 0]} 
            intensity={0.02} 
            angle={0.5} 
            penumbra={0.3} 
            distance={8}
            color="#ffffff"
          />
          
          <Model url={modelPath} rotationX={carRotationX} rotationY={carRotationY} />
          
          
          <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            enableRotate={false} 
            autoRotate={false} 
            target={[0, .8, 2]}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default dynamic(() => Promise.resolve(Background3D), {
  ssr: false,
  loading: () => <div className="absolute inset-0 z-0 bg-black" />
}); 
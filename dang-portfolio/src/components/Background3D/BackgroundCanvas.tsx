import { Suspense, useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { ModelScene } from "./scene/ModelScene";
import { NeonTextModelScene } from "./scene/NeonTextModelScene";
import { FrameRateLimit } from "./utils/FrameRateLimit";
import { CameraAnimation } from "./utils/CameraAnimation";
import FloatingGitHubLogo from "@/components/GitHubLogo/FloatingGitHubLogo";
import FloatingLinkedInLogo from "@/components/LinkedInLogo/FloatingLinkedInLogo";
import FloatingEmailLogo from "@/components/EmailLogo/FloatingEmailLogo";
import FloatingResumeLogo from "@/components/ResumeLogo/FloatingResumeLogo";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

interface BackgroundCanvasProps {
  modelPath: string;
  startAnimation?: boolean;
  onReady?: () => void;
}

const neonLetters = [
  { char: "D", position: [-1.1, -1.5, 0] as [number, number, number] },
  { char: "A", position: [-0.66, -1.5, 0] as [number, number, number] },
  { char: "N", position: [-0.22, -1.5, 0] as [number, number, number] },
  { char: "T", position: [0.22, -1.5, 0] as [number, number, number] },
  { char: "O", position: [0.66, -1.5, 0] as [number, number, number] },
  { char: "N", position: [1.1, -1.5, 0] as [number, number, number] },
  { char: "D", position: [-0.66, -2, 0] as [number, number, number] },
  { char: "A", position: [-0.22, -2, 0] as [number, number, number] },
  { char: "N", position: [0.22, -2, 0] as [number, number, number] },
  { char: "G", position: [0.66, -2, 0] as [number, number, number] },
];

const BackgroundCanvasComponent: React.FC<BackgroundCanvasProps> = ({
  modelPath,
  startAnimation = false,
  onReady,
}) => {
  const [modelsReady, setModelsReady] = useState({
    city: false,
    car: false,
    neonText: false,
  });
  const modelsReadyRef = useRef({ city: false, car: false, neonText: false });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);
    return () => window.removeEventListener("resize", updateScreenSize);
  }, []);

  const emailx = () => {
    return isMobile ? -0.12 : -0.15;
  };
  const emaily = () => {
    return isMobile ? 0.1 : -0.27;
  };
  const resumex = () => {
    return isMobile ? -0.12 : -0.05;
  };
  const resumey = () => {
    return isMobile ? 0.05 : -0.27;
  };

  const linkedinx = () => {
    return isMobile ? 0.12 : 0.15;
  };
  const linkediny = () => {
    return isMobile ? 0.1 : -0.27;
  };
  const githubx = () => {
    return isMobile ? 0.12 : 0.05;
  };
  const githuby = () => {
    return isMobile ? 0.05 : -0.27;
  };

  const sceneY = 0;
  const initialCameraPos: [number, number, number] = [0, 0, 60];
  const targetCameraPos: [number, number, number] = [0, 0, 5];
  const initialFov = 170;
  const targetFov = 70;

  const handleModelReady = (modelType: "city" | "car" | "neonText") => {
    modelsReadyRef.current[modelType] = true;
    setModelsReady((prev) => ({ ...prev, [modelType]: true }));
  };

  const allModelsReady =
    modelsReady.city && modelsReady.car && modelsReady.neonText;
  const [shouldStartAnimation, setShouldStartAnimation] = useState(false);

  useEffect(() => {}, [
    modelsReady,
    startAnimation,
    allModelsReady,
    shouldStartAnimation,
  ]);

  useEffect(() => {
    if (startAnimation && allModelsReady && !shouldStartAnimation) {
      setShouldStartAnimation(true);
    }
  }, [startAnimation, allModelsReady, shouldStartAnimation]);

  useEffect(() => {
    if (allModelsReady && onReady) {
      onReady();
    }
  }, [allModelsReady, onReady]);

  return (
    <div className="absolute inset-0 w-full h-full z-0">
      <Canvas
        dpr={Math.min(window.devicePixelRatio || 1, 2)}
        shadows
        frameloop="demand"
        camera={{
          position: initialCameraPos,
          fov: initialFov,
          rotation: [0, 0, 0],
          up: [0, 1, 0],
        }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
      >
        <EffectComposer>
          <Bloom
            intensity={1}
            luminanceThreshold={0}
            luminanceSmoothing={0}
            radius={0.5}
          />
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
          shadow-mapSize-width={512}
          shadow-mapSize-height={512}
        />

        <spotLight
          position={[-2, 1, 2]}
          intensity={2}
          color={0xfff4e6}
          angle={Math.PI / 8}
          penumbra={0.3}
          distance={8}
          decay={1.2}
          castShadow
          shadow-mapSize-width={512}
          shadow-mapSize-height={512}
        />

        <spotLight
          position={[4, 3, 6]}
          intensity={3}
          color={0x00bcd4}
          angle={Math.PI / 6}
          penumbra={0.4}
          distance={15}
          decay={1.2}
          castShadow
          shadow-mapSize-width={512}
          shadow-mapSize-height={512}
        />

        <spotLight
          position={[-3, 2, -4]}
          intensity={5}
          color={0x9c27b0}
          angle={Math.PI / 5}
          penumbra={0.5}
          distance={12}
          decay={1.4}
          castShadow
          shadow-mapSize-width={512}
          shadow-mapSize-height={512}
        />

        <spotLight
          position={[3, 2, -4]}
          intensity={4}
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
          color={0xff672b}
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
                modelPath={"/city/city.glb"}
                position={[0, -0.65, 4]}
                rotation={[0, 0, 0]}
                scale={1.3}
                enableMouseRotation={true}
                maxRotationX={Math.PI / 30}
                maxRotationY={Math.PI / 14}
                rotationSensitivity={0.8}
                rotationSmoothness={0.06}
                onReady={() => handleModelReady("city")}
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
                onReady={() => handleModelReady("car")}
              />
              {shouldStartAnimation && (
                <CameraAnimation
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
              <group position={[emailx(), emaily(), 4.5]}>
                <FloatingEmailLogo />
              </group>
              <group position={[resumex(), resumey(), 4.5]}>
                <FloatingResumeLogo />
              </group>
              <group position={[linkedinx(), linkediny(), 4.5]}>
                <FloatingLinkedInLogo />
              </group>

              <group position={[githubx(), githuby(), 4.5]}>
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
              onReady={() => handleModelReady("neonText")}
            />
          </group>
        </Suspense>
      </Canvas>
    </div>
  );
};

const BackgroundCanvas = dynamic(
  () => Promise.resolve(BackgroundCanvasComponent),
  { ssr: false }
);
export default BackgroundCanvas;
export { BackgroundCanvasComponent as BackgroundCanvas };

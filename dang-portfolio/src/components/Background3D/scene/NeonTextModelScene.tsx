import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Group, MeshStandardMaterial } from "three";
import { Text3D, Center } from "@react-three/drei";
import { useFrameRateLimit } from "@/hooks/useFrameRateLimit";

interface LetterConfig {
  char: string;
  position: [number, number, number];
  rotation?: [number, number, number];
}

interface NeonTextModelSceneProps {
  letters: LetterConfig[];
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  enableMouseRotation?: boolean;
  fontSize?: number;
  height?: number;
  letterSpacing?: number;
  color?: string;
  lightColor?: string;
  pitchSpeed?: number;
  yawSpeed?: number;
  rollSpeed?: number;
  pitchAmplitude?: number;
  yawAmplitude?: number;
  rollAmplitude?: number;
  phaseOffset?: number;
  secondaryPitchMult?: number;
  secondaryYawMult?: number;
  secondaryRollMult?: number;
  secondaryPitchSpeed?: number;
  secondaryYawSpeed?: number;
  secondaryRollSpeed?: number;
  maxRotationX?: number;
  maxRotationY?: number;
  rotationSensitivity?: number;
  rotationSmoothness?: number;
  onReady?: () => void;
}

const FLOATING_CONFIG = {
  PITCH_SPEED: 0.8,
  YAW_SPEED: 0.8,
  ROLL_SPEED: 0.8,
  PITCH_AMPLITUDE: 0.1,
  YAW_AMPLITUDE: 0.1,
  ROLL_AMPLITUDE: 0.2,
  PHASE_OFFSET: 5,
  SECONDARY_PITCH_MULT: 0.3,
  SECONDARY_YAW_MULT: 0.3,
  SECONDARY_ROLL_MULT: 0.3,
  SECONDARY_PITCH_SPEED: 0.3,
  SECONDARY_YAW_SPEED: 0.3,
  SECONDARY_ROLL_SPEED: 0.3,
};

const materialCache = new Map<string, MeshStandardMaterial>();
const MAX_CACHE_SIZE = 5;

const getOrCreateMaterial = (
  color: string,
  lightColor: string
): MeshStandardMaterial => {
  const key = `${color}-${lightColor}`;

  if (!materialCache.has(key)) {
    if (materialCache.size >= MAX_CACHE_SIZE) {
      const firstKey = materialCache.keys().next().value;
      if (firstKey) {
        const materialToDispose = materialCache.get(firstKey);
        if (materialToDispose) {
          materialToDispose.dispose();
        }
        materialCache.delete(firstKey);
      }
    }

    const material = new MeshStandardMaterial({
      color: "#ffffff",
      emissive: "#ff8657",
      emissiveIntensity: 4,
      roughness: 1,
    });
    materialCache.set(key, material);
  }

  return materialCache.get(key)!;
};

const cleanupMaterialCache = () => {
  materialCache.forEach((material) => {
    material.dispose();
  });
  materialCache.clear();
};

interface AnimatedLetterProps {
  char: string;
  position: [number, number, number];
  baseRotation: [number, number, number];
  fontSize: number;
  height: number;
  letterSpacing: number;
  material: MeshStandardMaterial;
  index: number;
  enableMouseRotation: boolean;
  pitchSpeed: number;
  yawSpeed: number;
  rollSpeed: number;
  pitchAmplitude: number;
  yawAmplitude: number;
  rollAmplitude: number;
  phaseOffset: number;
  secondaryPitchMult: number;
  secondaryYawMult: number;
  secondaryRollMult: number;
  secondaryPitchSpeed: number;
  secondaryYawSpeed: number;
  secondaryRollSpeed: number;
}

const AnimatedLetter: React.FC<AnimatedLetterProps> = ({
  char,
  position,
  baseRotation,
  fontSize,
  height,
  letterSpacing,
  material,
  index,
  pitchSpeed,
  yawSpeed,
  rollSpeed,
  pitchAmplitude,
  yawAmplitude,
  rollAmplitude,
  phaseOffset,
  secondaryPitchMult,
  secondaryYawMult,
  secondaryRollMult,
  secondaryPitchSpeed,
  secondaryYawSpeed,
  secondaryRollSpeed,
}) => {
  const groupRef = useRef<Group>(null);

  const phaseOffsetValue = useMemo(
    () => index * phaseOffset,
    [index, phaseOffset]
  );
  const secondaryPitchAmplitude = useMemo(
    () => pitchAmplitude * secondaryPitchMult,
    [pitchAmplitude, secondaryPitchMult]
  );
  const secondaryYawAmplitude = useMemo(
    () => yawAmplitude * secondaryYawMult,
    [yawAmplitude, secondaryYawMult]
  );
  const secondaryRollAmplitude = useMemo(
    () => rollAmplitude * secondaryRollMult,
    [rollAmplitude, secondaryRollMult]
  );

  const { shouldRenderFrame } = useFrameRateLimit({
    targetFPS: 60,
    enabled: true,
  });

  useFrame((state) => {
    if (!groupRef.current) return;

    if (!shouldRenderFrame(state.clock.elapsedTime * 1000)) return;

    const time = state.clock.elapsedTime + phaseOffsetValue;

    const pitchOffset = Math.sin(time * pitchSpeed) * pitchAmplitude;
    const yawOffset = Math.cos(time * yawSpeed) * yawAmplitude;
    const rollOffset = Math.sin(time * rollSpeed) * rollAmplitude;

    const secondaryPitch =
      Math.sin(time * secondaryPitchSpeed) * secondaryPitchAmplitude;
    const secondaryYaw =
      Math.cos(time * secondaryYawSpeed) * secondaryYawAmplitude;
    const secondaryRoll =
      Math.cos(time * secondaryRollSpeed) * secondaryRollAmplitude;

    const floatingRotation: [number, number, number] = [
      baseRotation[0] + pitchOffset + secondaryPitch,
      baseRotation[1] + yawOffset + secondaryYaw,
      baseRotation[2] + rollOffset + secondaryRoll,
    ];

    groupRef.current.rotation.x = floatingRotation[0];
    groupRef.current.rotation.y = floatingRotation[1];
    groupRef.current.rotation.z = floatingRotation[2];
  });

  return (
    <group ref={groupRef} position={position} rotation={baseRotation}>
      <Center>
        <Text3D
          font="/font/Chromia_Bold.json"
          size={fontSize}
          height={height}
          letterSpacing={letterSpacing}
          castShadow={false}
          receiveShadow={false}
          material={material}
        >
          {char}
        </Text3D>
      </Center>
    </group>
  );
};

export const NeonTextModelScene: React.FC<NeonTextModelSceneProps> = ({
  letters,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  enableMouseRotation = true,
  fontSize = 0.35,
  height = 0.15,
  letterSpacing = 0.04,
  color = "#796094",
  lightColor = "#d09eff",
  pitchSpeed = FLOATING_CONFIG.PITCH_SPEED,
  yawSpeed = FLOATING_CONFIG.YAW_SPEED,
  rollSpeed = FLOATING_CONFIG.ROLL_SPEED,
  pitchAmplitude = FLOATING_CONFIG.PITCH_AMPLITUDE,
  yawAmplitude = FLOATING_CONFIG.YAW_AMPLITUDE,
  rollAmplitude = FLOATING_CONFIG.ROLL_AMPLITUDE,
  phaseOffset = FLOATING_CONFIG.PHASE_OFFSET,
  secondaryPitchMult = FLOATING_CONFIG.SECONDARY_PITCH_MULT,
  secondaryYawMult = FLOATING_CONFIG.SECONDARY_YAW_MULT,
  secondaryRollMult = FLOATING_CONFIG.SECONDARY_ROLL_MULT,
  secondaryPitchSpeed = FLOATING_CONFIG.SECONDARY_PITCH_SPEED,
  secondaryYawSpeed = FLOATING_CONFIG.SECONDARY_YAW_SPEED,
  secondaryRollSpeed = FLOATING_CONFIG.SECONDARY_ROLL_SPEED,
  maxRotationX = Math.PI / 12,
  maxRotationY = Math.PI / 6,
  rotationSensitivity = 1.0,
  rotationSmoothness = 0.06,
  onReady,
}) => {
  const modelRef = useRef<Group>(null);
  const { shouldRenderFrame } = useFrameRateLimit({ targetFPS: 60 });
  const hasNotifiedReady = useRef(false);

  const mouse = useRef({ x: 0, y: 0 });
  const lastUpdate = useRef(0);

  const material = useMemo(
    () => getOrCreateMaterial(color, lightColor),
    [color, lightColor]
  );

  const letterGroups = useMemo(
    () =>
      letters.map((letter, i) => (
        <AnimatedLetter
          key={`${letter.char}-${letter.position[0]}-${letter.position[1]}-${i}`}
          char={letter.char}
          position={letter.position}
          baseRotation={letter.rotation || [0, 0, 0]}
          fontSize={fontSize}
          height={height}
          letterSpacing={letterSpacing}
          material={material}
          index={i}
          enableMouseRotation={enableMouseRotation}
          pitchSpeed={pitchSpeed}
          yawSpeed={yawSpeed}
          rollSpeed={rollSpeed}
          pitchAmplitude={pitchAmplitude}
          yawAmplitude={yawAmplitude}
          rollAmplitude={rollAmplitude}
          phaseOffset={phaseOffset}
          secondaryPitchMult={secondaryPitchMult}
          secondaryYawMult={secondaryYawMult}
          secondaryRollMult={secondaryRollMult}
          secondaryPitchSpeed={secondaryPitchSpeed}
          secondaryYawSpeed={secondaryYawSpeed}
          secondaryRollSpeed={secondaryRollSpeed}
        />
      )),
    [
      letters,
      fontSize,
      height,
      letterSpacing,
      material,
      enableMouseRotation,
      pitchSpeed,
      yawSpeed,
      rollSpeed,
      pitchAmplitude,
      yawAmplitude,
      rollAmplitude,
      phaseOffset,
      secondaryPitchMult,
      secondaryYawMult,
      secondaryRollMult,
      secondaryPitchSpeed,
      secondaryYawSpeed,
      secondaryRollSpeed,
    ]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    if (!modelRef.current) return;

    modelRef.current.position.set(...position);
    modelRef.current.rotation.set(...rotation);
    modelRef.current.scale.setScalar(scale);

    if (onReady && !hasNotifiedReady.current) {
      hasNotifiedReady.current = true;
      onReady();
    }
  }, [position, rotation, scale, onReady]);

  useFrame(() => {
    if (!modelRef.current || !shouldRenderFrame(performance.now())) return;
    if (!enableMouseRotation) return;
    const now = performance.now();
    if (now - lastUpdate.current < 16) return;
    lastUpdate.current = now;

    const targetY = mouse.current.x * maxRotationY * rotationSensitivity;
    const targetX = mouse.current.y * maxRotationX * rotationSensitivity;

    modelRef.current.rotation.y +=
      (targetY - modelRef.current.rotation.y) * rotationSmoothness;
    modelRef.current.rotation.x +=
      (targetX - modelRef.current.rotation.x) * rotationSmoothness;
  });

  return <group ref={modelRef}>{letterGroups}</group>;
};

export { cleanupMaterialCache };

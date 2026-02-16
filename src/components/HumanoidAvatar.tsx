import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { SignPose } from '@/lib/signDictionary';
import { DEFAULT_POSE } from '@/lib/signDictionary';

interface AvatarProps {
  pose: SignPose;
  color?: string;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function lerpEuler(
  ref: THREE.Object3D,
  target: [number, number, number],
  speed: number
) {
  ref.rotation.x = lerp(ref.rotation.x, target[0], speed);
  ref.rotation.y = lerp(ref.rotation.y, target[1], speed);
  ref.rotation.z = lerp(ref.rotation.z, target[2], speed);
}

// Skin material
function useSkinMaterial() {
  return useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#f5c6a0'),
        roughness: 0.6,
        metalness: 0.05,
      }),
    []
  );
}

// Body material
function useBodyMaterial(hex: string) {
  return useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(hex),
        roughness: 0.35,
        metalness: 0.3,
      }),
    [hex]
  );
}

/* ===================== FINGER ===================== */
function Finger({
  position,
  closed,
  length = 0.06,
}: {
  position: [number, number, number];
  closed: boolean;
  length?: number;
}) {
  const ref = useRef<THREE.Group>(null!);

  useFrame(() => {
    if (!ref.current) return;
    const targetRot = closed ? -1.2 : 0;
    ref.current.rotation.x = lerp(ref.current.rotation.x, targetRot, 0.08);
  });

  const skin = useSkinMaterial();

  return (
    <group position={position} ref={ref}>
      <mesh material={skin} position={[0, -length / 2, 0]}>
        <capsuleGeometry args={[0.012, length, 4, 8]} />
      </mesh>
    </group>
  );
}

/* ===================== HAND ===================== */
function Hand({ closed }: { closed: boolean }) {
  const skin = useSkinMaterial();
  const fingerPositions: [number, number, number][] = [
    [-0.03, -0.02, 0],
    [-0.015, -0.025, 0],
    [0, -0.028, 0],
    [0.015, -0.025, 0],
  ];

  return (
    <group>
      {/* Palm */}
      <mesh material={skin}>
        <boxGeometry args={[0.08, 0.04, 0.03]} />
      </mesh>
      {/* Thumb */}
      <Finger position={[-0.045, 0, 0.01]} closed={closed} length={0.04} />
      {/* Fingers */}
      {fingerPositions.map((pos, i) => (
        <Finger key={i} position={pos} closed={closed} length={0.055} />
      ))}
    </group>
  );
}

/* ===================== ARM ===================== */
function Arm({
  side,
  pose,
  bodyColor,
}: {
  side: 'left' | 'right';
  pose: SignPose;
  bodyColor: string;
}) {
  const shoulderRef = useRef<THREE.Group>(null!);
  const elbowRef = useRef<THREE.Group>(null!);
  const wristRef = useRef<THREE.Group>(null!);

  const bodyMat = useBodyMaterial(bodyColor);
  const skin = useSkinMaterial();

  const isLeft = side === 'left';
  const shoulderTarget = isLeft ? pose.leftShoulder : pose.rightShoulder;
  const elbowTarget = isLeft ? pose.leftElbow : pose.rightElbow;
  const wristTarget = isLeft ? pose.leftWrist : pose.rightWrist;
  const closed = isLeft ? pose.fingersClosed.left : pose.fingersClosed.right;

  useFrame(() => {
    if (shoulderRef.current) lerpEuler(shoulderRef.current, shoulderTarget, 0.06);
    if (elbowRef.current) lerpEuler(elbowRef.current, elbowTarget, 0.06);
    if (wristRef.current) lerpEuler(wristRef.current, wristTarget, 0.06);
  });

  const xOff = isLeft ? 0.22 : -0.22;

  return (
    <group position={[xOff, 0.55, 0]} ref={shoulderRef}>
      {/* Upper arm */}
      <mesh material={bodyMat} position={[0, -0.12, 0]}>
        <capsuleGeometry args={[0.04, 0.18, 6, 12]} />
      </mesh>
      {/* Elbow joint */}
      <group position={[0, -0.25, 0]} ref={elbowRef}>
        <mesh material={skin}>
          <sphereGeometry args={[0.035, 12, 12]} />
        </mesh>
        {/* Forearm */}
        <mesh material={skin} position={[0, -0.12, 0]}>
          <capsuleGeometry args={[0.032, 0.18, 6, 12]} />
        </mesh>
        {/* Wrist */}
        <group position={[0, -0.25, 0]} ref={wristRef}>
          <Hand closed={closed} />
        </group>
      </group>
    </group>
  );
}

/* ===================== HEAD ===================== */
function Head({ facial }: { facial: string }) {
  const skin = useSkinMaterial();
  const headRef = useRef<THREE.Group>(null!);

  // Subtle idle animation
  useFrame(({ clock }) => {
    if (!headRef.current) return;
    headRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.5) * 0.03;
  });

  return (
    <group position={[0, 0.85, 0]} ref={headRef}>
      {/* Head */}
      <mesh material={skin}>
        <sphereGeometry args={[0.14, 24, 24]} />
      </mesh>

      {/* Neck */}
      <mesh material={skin} position={[0, -0.14, 0]}>
        <cylinderGeometry args={[0.04, 0.05, 0.06, 12]} />
      </mesh>

      {/* Hair */}
      <mesh position={[0, 0.05, 0]}>
        <sphereGeometry args={[0.145, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        <meshStandardMaterial color="#2c1810" roughness={0.8} />
      </mesh>

      {/* Left Eye */}
      <group position={[-0.045, 0.02, 0.12]}>
        <mesh>
          <sphereGeometry args={[0.025, 16, 16]} />
          <meshStandardMaterial color="white" />
        </mesh>
        <mesh position={[0, 0, 0.015]}>
          <sphereGeometry args={[0.013, 12, 12]} />
          <meshStandardMaterial color="#3d2b1f" />
        </mesh>
        <mesh position={[0, 0, 0.022]}>
          <sphereGeometry args={[0.006, 8, 8]} />
          <meshStandardMaterial color="#111" />
        </mesh>
      </group>

      {/* Right Eye */}
      <group position={[0.045, 0.02, 0.12]}>
        <mesh>
          <sphereGeometry args={[0.025, 16, 16]} />
          <meshStandardMaterial color="white" />
        </mesh>
        <mesh position={[0, 0, 0.015]}>
          <sphereGeometry args={[0.013, 12, 12]} />
          <meshStandardMaterial color="#3d2b1f" />
        </mesh>
        <mesh position={[0, 0, 0.022]}>
          <sphereGeometry args={[0.006, 8, 8]} />
          <meshStandardMaterial color="#111" />
        </mesh>
      </group>

      {/* Eyebrows */}
      <mesh position={[-0.045, 0.055, 0.115]} rotation={[0, 0, 0.1]}>
        <boxGeometry args={[0.04, 0.006, 0.01]} />
        <meshStandardMaterial color="#2c1810" />
      </mesh>
      <mesh position={[0.045, 0.055, 0.115]} rotation={[0, 0, -0.1]}>
        <boxGeometry args={[0.04, 0.006, 0.01]} />
        <meshStandardMaterial color="#2c1810" />
      </mesh>

      {/* Nose */}
      <mesh position={[0, -0.02, 0.13]}>
        <coneGeometry args={[0.015, 0.03, 8]} />
        <meshStandardMaterial color="#e8b08a" roughness={0.6} />
      </mesh>

      {/* Mouth */}
      <mesh position={[0, -0.06, 0.12]}>
        <capsuleGeometry
          args={[
            facial === 'smile' ? 0.008 : 0.005,
            facial === 'smile' ? 0.04 : 0.03,
            4,
            8,
          ]}
        />
        <meshStandardMaterial
          color={facial === 'smile' ? '#c0392b' : facial === 'sad' ? '#7f8c8d' : '#b5706a'}
        />
      </mesh>

      {/* Ears */}
      <mesh position={[-0.14, 0, 0]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color="#e8b08a" roughness={0.6} />
      </mesh>
      <mesh position={[0.14, 0, 0]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color="#e8b08a" roughness={0.6} />
      </mesh>
    </group>
  );
}

/* ===================== TORSO ===================== */
function Torso({ color }: { color: string }) {
  const mat = useBodyMaterial(color);

  return (
    <group position={[0, 0.35, 0]}>
      {/* Upper torso */}
      <mesh material={mat}>
        <boxGeometry args={[0.4, 0.35, 0.2]} />
      </mesh>
      {/* Lower torso / hip */}
      <mesh material={mat} position={[0, -0.22, 0]}>
        <boxGeometry args={[0.32, 0.12, 0.18]} />
      </mesh>
      {/* Collar detail */}
      <mesh position={[0, 0.18, 0.08]}>
        <torusGeometry args={[0.06, 0.012, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.5} />
      </mesh>
    </group>
  );
}

/* ===================== LEGS ===================== */
function Legs({ color }: { color: string }) {
  const mat = useBodyMaterial('#1a1a2e');
  const shoeMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#2c2c3e', roughness: 0.4, metalness: 0.2 }),
    []
  );

  return (
    <group position={[0, -0.05, 0]}>
      {/* Left leg */}
      <mesh material={mat} position={[-0.09, -0.15, 0]}>
        <capsuleGeometry args={[0.05, 0.25, 6, 12]} />
      </mesh>
      <mesh material={shoeMat} position={[-0.09, -0.35, 0.02]}>
        <boxGeometry args={[0.08, 0.06, 0.12]} />
      </mesh>

      {/* Right leg */}
      <mesh material={mat} position={[0.09, -0.15, 0]}>
        <capsuleGeometry args={[0.05, 0.25, 6, 12]} />
      </mesh>
      <mesh material={shoeMat} position={[0.09, -0.35, 0.02]}>
        <boxGeometry args={[0.08, 0.06, 0.12]} />
      </mesh>
    </group>
  );
}

/* ===================== AVATAR ===================== */
export default function HumanoidAvatar({ pose, color = '#00b4d8' }: AvatarProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const currentPose = pose || DEFAULT_POSE;

  // Subtle breathing animation
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.position.y = Math.sin(clock.elapsedTime * 1.2) * 0.005;
  });

  return (
    <group ref={groupRef} position={[0, -0.3, 0]}>
      <Head facial={currentPose.facial} />
      <Torso color={color} />
      <Arm side="left" pose={currentPose} bodyColor={color} />
      <Arm side="right" pose={currentPose} bodyColor={color} />
      <Legs color={color} />
    </group>
  );
}

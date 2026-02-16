import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { SignPose, FingerState } from '@/lib/signDictionary';
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

function useSkinMaterial() {
  return useMemo(
    () => new THREE.MeshStandardMaterial({ color: new THREE.Color('#f5c6a0'), roughness: 0.6, metalness: 0.05 }),
    []
  );
}

function useBodyMaterial(hex: string) {
  return useMemo(
    () => new THREE.MeshStandardMaterial({ color: new THREE.Color(hex), roughness: 0.35, metalness: 0.3 }),
    [hex]
  );
}

/* ===================== FINGER (individually animated) ===================== */
function Finger({
  position,
  curl,
  length = 0.06,
  rotation,
}: {
  position: [number, number, number];
  curl: number; // 0 = open, 1 = fully closed
  length?: number;
  rotation?: [number, number, number];
}) {
  const seg1Ref = useRef<THREE.Group>(null!);
  const seg2Ref = useRef<THREE.Group>(null!);
  const skin = useSkinMaterial();

  const segLen = length * 0.5;

  useFrame(() => {
    if (seg1Ref.current) {
      const target = -curl * 1.3;
      seg1Ref.current.rotation.x = lerp(seg1Ref.current.rotation.x, target, 0.08);
    }
    if (seg2Ref.current) {
      const target = -curl * 0.9;
      seg2Ref.current.rotation.x = lerp(seg2Ref.current.rotation.x, target, 0.08);
    }
  });

  return (
    <group position={position} rotation={rotation || [0, 0, 0]}>
      {/* First segment */}
      <group ref={seg1Ref}>
        <mesh material={skin} position={[0, -segLen / 2, 0]}>
          <capsuleGeometry args={[0.01, segLen, 4, 8]} />
        </mesh>
        {/* Second segment (fingertip) */}
        <group position={[0, -segLen, 0]} ref={seg2Ref}>
          <mesh material={skin} position={[0, -segLen * 0.4, 0]}>
            <capsuleGeometry args={[0.009, segLen * 0.7, 4, 8]} />
          </mesh>
          {/* Fingernail */}
          <mesh position={[0, -segLen * 0.7, 0.008]}>
            <boxGeometry args={[0.012, 0.008, 0.003]} />
            <meshStandardMaterial color="#f0d0b8" roughness={0.3} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

/* ===================== THUMB ===================== */
function Thumb({ curl, side }: { curl: number; side: 'left' | 'right' }) {
  const ref = useRef<THREE.Group>(null!);
  const skin = useSkinMaterial();
  const xDir = side === 'left' ? -1 : 1;

  useFrame(() => {
    if (!ref.current) return;
    ref.current.rotation.z = lerp(ref.current.rotation.z, curl * 0.8 * xDir, 0.08);
    ref.current.rotation.x = lerp(ref.current.rotation.x, -curl * 0.5, 0.08);
  });

  return (
    <group position={[xDir * -0.04, 0.005, 0.01]} ref={ref}>
      <mesh material={skin} position={[xDir * -0.01, -0.015, 0]}>
        <capsuleGeometry args={[0.012, 0.03, 4, 8]} />
      </mesh>
    </group>
  );
}

/* ===================== HAND ===================== */
function Hand({ fingers, side }: { fingers: FingerState; side: 'left' | 'right' }) {
  const skin = useSkinMaterial();

  const fingerData: { pos: [number, number, number]; curl: number; len: number; rot?: [number, number, number] }[] = [
    { pos: [-0.027, -0.02, 0], curl: fingers.index, len: 0.055, rot: [0, 0, 0.05] },
    { pos: [-0.01, -0.025, 0], curl: fingers.middle, len: 0.058 },
    { pos: [0.008, -0.023, 0], curl: fingers.ring, len: 0.053, rot: [0, 0, -0.03] },
    { pos: [0.024, -0.02, 0], curl: fingers.pinky, len: 0.045, rot: [0, 0, -0.08] },
  ];

  return (
    <group>
      {/* Palm */}
      <mesh material={skin}>
        <boxGeometry args={[0.075, 0.04, 0.025]} />
      </mesh>
      {/* Knuckle bumps */}
      <mesh material={skin} position={[0, -0.018, 0.005]}>
        <boxGeometry args={[0.065, 0.01, 0.02]} />
      </mesh>

      {/* Thumb */}
      <Thumb curl={fingers.thumb} side={side} />

      {/* Fingers */}
      {fingerData.map((f, i) => (
        <Finger key={i} position={f.pos} curl={f.curl} length={f.len} rotation={f.rot} />
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
  const fingers = isLeft ? pose.leftFingers : pose.rightFingers;

  useFrame(() => {
    if (shoulderRef.current) lerpEuler(shoulderRef.current, shoulderTarget, 0.06);
    if (elbowRef.current) lerpEuler(elbowRef.current, elbowTarget, 0.06);
    if (wristRef.current) lerpEuler(wristRef.current, wristTarget, 0.06);
  });

  const xOff = isLeft ? 0.22 : -0.22;

  return (
    <group position={[xOff, 0.55, 0]} ref={shoulderRef}>
      {/* Shoulder joint */}
      <mesh material={bodyMat}>
        <sphereGeometry args={[0.042, 10, 10]} />
      </mesh>
      {/* Upper arm */}
      <mesh material={bodyMat} position={[0, -0.12, 0]}>
        <capsuleGeometry args={[0.038, 0.18, 6, 12]} />
      </mesh>
      {/* Elbow joint */}
      <group position={[0, -0.25, 0]} ref={elbowRef}>
        <mesh material={skin}>
          <sphereGeometry args={[0.033, 12, 12]} />
        </mesh>
        {/* Forearm */}
        <mesh material={skin} position={[0, -0.12, 0]}>
          <capsuleGeometry args={[0.03, 0.18, 6, 12]} />
        </mesh>
        {/* Wrist */}
        <group position={[0, -0.25, 0]} ref={wristRef}>
          <mesh material={skin}>
            <sphereGeometry args={[0.025, 8, 8]} />
          </mesh>
          <Hand fingers={fingers} side={side} />
        </group>
      </group>
    </group>
  );
}

/* ===================== HEAD ===================== */
function Head({ facial }: { facial: string }) {
  const skin = useSkinMaterial();
  const headRef = useRef<THREE.Group>(null!);
  const blinkRef = useRef<THREE.Group>(null!);
  const blinkRef2 = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (!headRef.current) return;
    headRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.5) * 0.03;

    // Blink animation
    const t = clock.elapsedTime;
    const blink = Math.abs(Math.sin(t * 0.3)) < 0.03 ? 0.001 : 1;
    if (blinkRef.current) blinkRef.current.scale.y = blink;
    if (blinkRef2.current) blinkRef2.current.scale.y = blink;
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
      <group position={[-0.045, 0.02, 0.12]} ref={blinkRef}>
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
      <group position={[0.045, 0.02, 0.12]} ref={blinkRef2}>
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
      <mesh position={[-0.045, 0.055, 0.115]} rotation={[0, 0, facial === 'questioning' ? 0.25 : 0.1]}>
        <boxGeometry args={[0.04, 0.006, 0.01]} />
        <meshStandardMaterial color="#2c1810" />
      </mesh>
      <mesh position={[0.045, 0.055, 0.115]} rotation={[0, 0, facial === 'questioning' ? -0.25 : -0.1]}>
        <boxGeometry args={[0.04, 0.006, 0.01]} />
        <meshStandardMaterial color="#2c1810" />
      </mesh>

      {/* Nose */}
      <mesh position={[0, -0.02, 0.13]} rotation={[0.2, 0, 0]}>
        <coneGeometry args={[0.014, 0.025, 8]} />
        <meshStandardMaterial color="#e8b08a" roughness={0.6} />
      </mesh>
      {/* Nostrils */}
      <mesh position={[-0.008, -0.035, 0.125]}>
        <sphereGeometry args={[0.005, 6, 6]} />
        <meshStandardMaterial color="#d4946e" />
      </mesh>
      <mesh position={[0.008, -0.035, 0.125]}>
        <sphereGeometry args={[0.005, 6, 6]} />
        <meshStandardMaterial color="#d4946e" />
      </mesh>

      {/* Mouth */}
      <mesh position={[0, -0.06, 0.12]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry
          args={[
            facial === 'smile' ? 0.007 : facial === 'questioning' ? 0.008 : 0.005,
            facial === 'smile' ? 0.04 : 0.025,
            4, 8,
          ]}
        />
        <meshStandardMaterial
          color={facial === 'smile' ? '#c0392b' : facial === 'sad' ? '#7f8c8d' : '#b5706a'}
        />
      </mesh>
      {/* Lips */}
      {facial === 'smile' && (
        <mesh position={[0, -0.065, 0.118]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.018, 0.004, 6, 12, Math.PI]} />
          <meshStandardMaterial color="#c0392b" />
        </mesh>
      )}

      {/* Ears */}
      <group position={[-0.14, 0, 0]}>
        <mesh>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshStandardMaterial color="#e8b08a" roughness={0.6} />
        </mesh>
        <mesh position={[0.005, 0, 0]}>
          <torusGeometry args={[0.015, 0.004, 6, 8, Math.PI]} />
          <meshStandardMaterial color="#d4946e" />
        </mesh>
      </group>
      <group position={[0.14, 0, 0]} rotation={[0, Math.PI, 0]}>
        <mesh>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshStandardMaterial color="#e8b08a" roughness={0.6} />
        </mesh>
        <mesh position={[0.005, 0, 0]}>
          <torusGeometry args={[0.015, 0.004, 6, 8, Math.PI]} />
          <meshStandardMaterial color="#d4946e" />
        </mesh>
      </group>
    </group>
  );
}

/* ===================== TORSO ===================== */
function Torso({ color }: { color: string }) {
  const mat = useBodyMaterial(color);

  return (
    <group position={[0, 0.35, 0]}>
      <mesh material={mat}>
        <boxGeometry args={[0.4, 0.35, 0.2]} />
      </mesh>
      <mesh material={mat} position={[0, -0.22, 0]}>
        <boxGeometry args={[0.32, 0.12, 0.18]} />
      </mesh>
      <mesh position={[0, 0.18, 0.08]}>
        <torusGeometry args={[0.06, 0.012, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.5} />
      </mesh>
    </group>
  );
}

/* ===================== LEGS ===================== */
function Legs() {
  const mat = useBodyMaterial('#1a1a2e');
  const shoeMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#2c2c3e', roughness: 0.4, metalness: 0.2 }),
    []
  );

  return (
    <group position={[0, -0.05, 0]}>
      <mesh material={mat} position={[-0.09, -0.15, 0]}>
        <capsuleGeometry args={[0.05, 0.25, 6, 12]} />
      </mesh>
      <mesh material={shoeMat} position={[-0.09, -0.35, 0.02]}>
        <boxGeometry args={[0.08, 0.06, 0.12]} />
      </mesh>
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
      <Legs />
    </group>
  );
}

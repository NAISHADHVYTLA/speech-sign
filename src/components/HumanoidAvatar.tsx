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
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#f5c6a0'),
        roughness: 0.55,
        metalness: 0.02,
        clearcoat: 0.15,
        clearcoatRoughness: 0.4,
        sheen: 0.3,
        sheenColor: new THREE.Color('#ffb088'),
      }),
    []
  );
}

function useBodyMaterial(hex: string) {
  return useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(hex),
        roughness: 0.3,
        metalness: 0.25,
        clearcoat: 0.1,
        clearcoatRoughness: 0.6,
      }),
    [hex]
  );
}

/* ===================== FINGER ===================== */
function Finger({
  position,
  curl,
  length = 0.06,
  rotation,
}: {
  position: [number, number, number];
  curl: number;
  length?: number;
  rotation?: [number, number, number];
}) {
  const seg1Ref = useRef<THREE.Group>(null!);
  const seg2Ref = useRef<THREE.Group>(null!);
  const skin = useSkinMaterial();

  const segLen = length * 0.5;

  useFrame(() => {
    if (seg1Ref.current) {
      seg1Ref.current.rotation.x = lerp(seg1Ref.current.rotation.x, -curl * 1.3, 0.08);
    }
    if (seg2Ref.current) {
      seg2Ref.current.rotation.x = lerp(seg2Ref.current.rotation.x, -curl * 0.9, 0.08);
    }
  });

  return (
    <group position={position} rotation={rotation || [0, 0, 0]}>
      <group ref={seg1Ref}>
        <mesh material={skin} position={[0, -segLen / 2, 0]}>
          <capsuleGeometry args={[0.01, segLen, 6, 12]} />
        </mesh>
        <group position={[0, -segLen, 0]} ref={seg2Ref}>
          <mesh material={skin} position={[0, -segLen * 0.4, 0]}>
            <capsuleGeometry args={[0.009, segLen * 0.7, 6, 12]} />
          </mesh>
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
        <capsuleGeometry args={[0.012, 0.03, 6, 12]} />
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
      <mesh material={skin}>
        <boxGeometry args={[0.075, 0.04, 0.025]} />
      </mesh>
      <mesh material={skin} position={[0, -0.018, 0.005]}>
        <boxGeometry args={[0.065, 0.01, 0.02]} />
      </mesh>
      <Thumb curl={fingers.thumb} side={side} />
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
        <sphereGeometry args={[0.042, 16, 16]} />
      </mesh>
      {/* Upper arm */}
      <mesh material={bodyMat} position={[0, -0.12, 0]}>
        <capsuleGeometry args={[0.038, 0.18, 8, 16]} />
      </mesh>
      {/* Elbow */}
      <group position={[0, -0.25, 0]} ref={elbowRef}>
        <mesh material={skin}>
          <sphereGeometry args={[0.033, 16, 16]} />
        </mesh>
        {/* Forearm */}
        <mesh material={skin} position={[0, -0.12, 0]}>
          <capsuleGeometry args={[0.03, 0.18, 8, 16]} />
        </mesh>
        {/* Wrist */}
        <group position={[0, -0.25, 0]} ref={wristRef}>
          <mesh material={skin}>
            <sphereGeometry args={[0.025, 12, 12]} />
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
  const leftEyelidRef = useRef<THREE.Group>(null!);
  const rightEyelidRef = useRef<THREE.Group>(null!);
  const leftBrowRef = useRef<THREE.Mesh>(null!);
  const rightBrowRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    if (!headRef.current) return;
    // Subtle idle head sway
    const t = clock.elapsedTime;
    headRef.current.rotation.y = Math.sin(t * 0.5) * 0.03;
    headRef.current.rotation.x = Math.sin(t * 0.35) * 0.01;

    // Natural blink – close for ~150ms every 3-5s
    const blinkCycle = t % 4;
    const isBlinking = blinkCycle > 3.8 && blinkCycle < 3.95;
    const eyelidScale = isBlinking ? 0.05 : 1;

    if (leftEyelidRef.current) leftEyelidRef.current.scale.y = lerp(leftEyelidRef.current.scale.y, eyelidScale, 0.25);
    if (rightEyelidRef.current) rightEyelidRef.current.scale.y = lerp(rightEyelidRef.current.scale.y, eyelidScale, 0.25);

    // Eyebrow micro-animation
    const browLift = Math.sin(t * 0.7) * 0.002;
    if (leftBrowRef.current) leftBrowRef.current.position.y = 0.055 + browLift;
    if (rightBrowRef.current) rightBrowRef.current.position.y = 0.055 + browLift;
  });

  const eyeMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: 'white', roughness: 0.1, metalness: 0, clearcoat: 0.8 }), []);
  const irisMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#3d6b5f', roughness: 0.2, metalness: 0.1, clearcoat: 0.6 }), []);
  const pupilMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#111', roughness: 0.3 }), []);
  const lipMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#c08080', roughness: 0.35, clearcoat: 0.3 }), []);

  return (
    <group position={[0, 0.85, 0]} ref={headRef}>
      {/* Head – smoother sphere */}
      <mesh material={skin}>
        <sphereGeometry args={[0.14, 32, 32]} />
      </mesh>

      {/* Neck */}
      <mesh material={skin} position={[0, -0.14, 0]}>
        <cylinderGeometry args={[0.04, 0.05, 0.06, 16]} />
      </mesh>

      {/* Hair */}
      <mesh position={[0, 0.05, 0]}>
        <sphereGeometry args={[0.146, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        <meshPhysicalMaterial color="#2c1810" roughness={0.9} metalness={0} />
      </mesh>

      {/* ---- Left Eye ---- */}
      <group position={[-0.045, 0.02, 0.12]} ref={leftEyelidRef}>
        <mesh material={eyeMat}>
          <sphereGeometry args={[0.025, 20, 20]} />
        </mesh>
        <mesh material={irisMat} position={[0, 0, 0.015]}>
          <sphereGeometry args={[0.013, 16, 16]} />
        </mesh>
        <mesh material={pupilMat} position={[0, 0, 0.022]}>
          <sphereGeometry args={[0.006, 12, 12]} />
        </mesh>
        {/* Eye highlight */}
        <mesh position={[0.004, 0.004, 0.025]}>
          <sphereGeometry args={[0.003, 8, 8]} />
          <meshBasicMaterial color="white" />
        </mesh>
      </group>

      {/* ---- Right Eye ---- */}
      <group position={[0.045, 0.02, 0.12]} ref={rightEyelidRef}>
        <mesh material={eyeMat}>
          <sphereGeometry args={[0.025, 20, 20]} />
        </mesh>
        <mesh material={irisMat} position={[0, 0, 0.015]}>
          <sphereGeometry args={[0.013, 16, 16]} />
        </mesh>
        <mesh material={pupilMat} position={[0, 0, 0.022]}>
          <sphereGeometry args={[0.006, 12, 12]} />
        </mesh>
        <mesh position={[0.004, 0.004, 0.025]}>
          <sphereGeometry args={[0.003, 8, 8]} />
          <meshBasicMaterial color="white" />
        </mesh>
      </group>

      {/* ---- Eyebrows ---- */}
      <mesh ref={leftBrowRef} position={[-0.045, 0.055, 0.115]} rotation={[0, 0, facial === 'questioning' ? 0.3 : 0.1]}>
        <capsuleGeometry args={[0.004, 0.03, 4, 8]} />
        <meshStandardMaterial color="#2c1810" />
      </mesh>
      <mesh ref={rightBrowRef} position={[0.045, 0.055, 0.115]} rotation={[0, 0, facial === 'questioning' ? -0.3 : -0.1]}>
        <capsuleGeometry args={[0.004, 0.03, 4, 8]} />
        <meshStandardMaterial color="#2c1810" />
      </mesh>

      {/* ---- Nose ---- */}
      <mesh position={[0, -0.015, 0.135]} rotation={[0.3, 0, 0]}>
        <sphereGeometry args={[0.016, 12, 12]} />
        <meshPhysicalMaterial color="#e8b08a" roughness={0.5} clearcoat={0.1} />
      </mesh>
      {/* Nostrils */}
      <mesh position={[-0.008, -0.032, 0.125]}>
        <sphereGeometry args={[0.005, 8, 8]} />
        <meshStandardMaterial color="#d4946e" />
      </mesh>
      <mesh position={[0.008, -0.032, 0.125]}>
        <sphereGeometry args={[0.005, 8, 8]} />
        <meshStandardMaterial color="#d4946e" />
      </mesh>

      {/* ---- Mouth ---- */}
      <mesh position={[0, -0.058, 0.12]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry
          args={[
            facial === 'smile' ? 0.007 : facial === 'questioning' ? 0.008 : 0.005,
            facial === 'smile' ? 0.04 : 0.025,
            6, 12,
          ]}
        />
        <meshPhysicalMaterial
          color={facial === 'smile' ? '#c0392b' : facial === 'sad' ? '#7f8c8d' : '#b5706a'}
          roughness={0.35}
          clearcoat={0.3}
        />
      </mesh>
      {/* Lips – subtle lower lip */}
      <mesh material={lipMat} position={[0, -0.065, 0.118]}>
        <capsuleGeometry args={[0.005, 0.022, 6, 10]} />
      </mesh>
      {facial === 'smile' && (
        <mesh position={[0, -0.065, 0.117]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.018, 0.004, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#c0392b" />
        </mesh>
      )}

      {/* ---- Ears ---- */}
      <group position={[-0.14, 0, 0]}>
        <mesh material={skin}>
          <sphereGeometry args={[0.025, 12, 12]} />
        </mesh>
        <mesh position={[0.005, 0, 0]}>
          <torusGeometry args={[0.015, 0.004, 8, 12, Math.PI]} />
          <meshStandardMaterial color="#d4946e" />
        </mesh>
      </group>
      <group position={[0.14, 0, 0]} rotation={[0, Math.PI, 0]}>
        <mesh material={skin}>
          <sphereGeometry args={[0.025, 12, 12]} />
        </mesh>
        <mesh position={[0.005, 0, 0]}>
          <torusGeometry args={[0.015, 0.004, 8, 12, Math.PI]} />
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
        <capsuleGeometry args={[0.16, 0.15, 8, 16]} />
      </mesh>
      <mesh material={mat} position={[0, -0.2, 0]}>
        <capsuleGeometry args={[0.12, 0.08, 8, 16]} />
      </mesh>
      {/* Collar */}
      <mesh position={[0, 0.16, 0.06]}>
        <torusGeometry args={[0.06, 0.012, 8, 20, Math.PI]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.5} />
      </mesh>
    </group>
  );
}

/* ===================== LEGS ===================== */
function Legs() {
  const mat = useBodyMaterial('#1a1a2e');
  const shoeMat = useMemo(
    () => new THREE.MeshPhysicalMaterial({ color: '#2c2c3e', roughness: 0.35, metalness: 0.15, clearcoat: 0.2 }),
    []
  );

  return (
    <group position={[0, -0.05, 0]}>
      <mesh material={mat} position={[-0.09, -0.15, 0]}>
        <capsuleGeometry args={[0.05, 0.25, 8, 16]} />
      </mesh>
      <mesh material={shoeMat} position={[-0.09, -0.35, 0.02]}>
        <capsuleGeometry args={[0.035, 0.04, 6, 12]} />
      </mesh>
      <mesh material={mat} position={[0.09, -0.15, 0]}>
        <capsuleGeometry args={[0.05, 0.25, 8, 16]} />
      </mesh>
      <mesh material={shoeMat} position={[0.09, -0.35, 0.02]}>
        <capsuleGeometry args={[0.035, 0.04, 6, 12]} />
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
    const t = clock.elapsedTime;
    // Idle breathing / body sway
    groupRef.current.position.y = Math.sin(t * 1.2) * 0.006 - 0.3;
    groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.015;
    groupRef.current.rotation.z = Math.sin(t * 0.4) * 0.005;
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

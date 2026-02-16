import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import HumanoidAvatar from './HumanoidAvatar';
import type { SignPose } from '@/lib/signDictionary';

interface AvatarViewerProps {
  pose: SignPose;
  avatarColor: string;
}

export default function AvatarViewer({ pose, avatarColor }: AvatarViewerProps) {
  return (
    <div className="w-full h-full rounded-lg overflow-hidden" style={{ background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
      <Canvas
        camera={{ position: [0, 0.4, 1.6], fov: 40 }}
        shadows
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 5, 3]} intensity={1.2} castShadow />
        <directionalLight position={[-2, 3, -1]} intensity={0.4} color="#7ec8e3" />
        <pointLight position={[0, 2, 2]} intensity={0.6} color="#00d4ff" />

        <HumanoidAvatar pose={pose} color={avatarColor} />

        {/* Ground disc */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.7, 0]} receiveShadow>
          <circleGeometry args={[0.6, 32]} />
          <meshStandardMaterial color="#0d1b2a" roughness={0.8} transparent opacity={0.5} />
        </mesh>

        <OrbitControls
          enablePan={false}
          minDistance={1}
          maxDistance={3}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 1.8}
          target={[0, 0.3, 0]}
        />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}

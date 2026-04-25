import React from 'react';
import { Float, RoundedBox, Cylinder, Torus } from '@react-three/drei';

const HardwareSwitch = ({ position, rotation, isActive, toggle }) => (
  <group position={position} rotation={rotation} onClick={(e) => { e.stopPropagation(); toggle(); }} className="cursor-pointer">
    <RoundedBox args={[0.3, 0.15, 0.05]} radius={0.02}>
      <meshStandardMaterial color={isActive ? "#22c55e" : "#3f3f46"} />
    </RoundedBox>
    <mesh position={[isActive ? 0.08 : -0.08, 0, 0.03]}>
      <boxGeometry args={[0.12, 0.12, 0.06]} />
      <meshStandardMaterial color="white" />
    </mesh>
  </group>
);

const SOSButton = ({ position, rotation, color, trigger }) => (
  <Cylinder args={[0.25, 0.25, 0.1, 32]} position={position} rotation={rotation} onClick={(e) => { e.stopPropagation(); trigger(); }}>
    <meshStandardMaterial color={color} roughness={0.3} metalness={0.7} />
  </Cylinder>
);

export const ModelKeychain = ({ trigger, tracking, toggleTrack }) => (
  <Float speed={1.5} rotationIntensity={0.2}>
    <group>
      <RoundedBox args={[1.1, 2.0, 0.5]} radius={0.15} castShadow>
        <meshStandardMaterial color="#111" roughness={0.8} />
      </RoundedBox>
      <Torus args={[0.35, 0.05, 16, 64]} position={[0, 1.3, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <meshStandardMaterial color="#888" metalness={1} />
      </Torus>
      <SOSButton position={[0, 0.1, 0.25]} rotation={[Math.PI / 2, 0, 0]} color="#050505" trigger={trigger} />
      <HardwareSwitch position={[0.55, 0.5, 0]} rotation={[0, Math.PI / 2, 0]} isActive={tracking} toggle={toggleTrack} />
    </group>
  </Float>
);

export const ModelSilicone = ({ trigger, tracking, toggleTrack }) => (
  <Float speed={1.5} rotationIntensity={0.2}>
    <group>
      {/* Main body */}
      <RoundedBox args={[1.3, 1.8, 0.6]} radius={0.3} castShadow>
        <meshStandardMaterial color="#f97316" roughness={0.9} />
      </RoundedBox>
      
      {/* Clip attachment (spaced away) */}
      <RoundedBox args={[0.4, 0.8, 0.2]} radius={0.08} position={[-0.85, 0.3, 0]} castShadow>
        <meshStandardMaterial color="#e06612" />
      </RoundedBox>
      
      {/* Clip connector detail */}
      <RoundedBox args={[0.15, 0.3, 0.15]} radius={0.05} position={[-0.6, 0.25, 0]}>
        <meshStandardMaterial color="#d45a0a" />
      </RoundedBox>
      
      <SOSButton position={[0, -0.1, 0.3]} rotation={[Math.PI / 2, 0, 0]} color="#ffffff" trigger={trigger} />
      <HardwareSwitch position={[0.65, 0.2, 0]} rotation={[0, Math.PI / 2, 0]} isActive={tracking} toggle={toggleTrack} />
    </group>
  </Float>
);

export const ModelPendant = ({ trigger, tracking, toggleTrack }) => (
  <Float speed={1.5} rotationIntensity={0.2}>
    <group>
      <Torus args={[0.8, 0.18, 32, 64]} castShadow>
        <meshStandardMaterial color="#D4AF37" metalness={1} roughness={0.1} />
      </Torus>
      <Cylinder args={[0.8, 0.8, 0.3, 64]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#0a0a0a" roughness={0.3} />
      </Cylinder>
      <Torus args={[0.15, 0.05, 16, 32]} position={[0, 1.0, 0]}>
        <meshStandardMaterial color="#D4AF37" metalness={1} />
      </Torus>
      <SOSButton position={[0, 0.1, -0.18]} rotation={[Math.PI / 2, 0, 0]} color="#b39700" trigger={trigger} />
      <HardwareSwitch position={[0, -0.3, -0.15]} rotation={[0, 0, 0]} isActive={tracking} toggle={toggleTrack} />
    </group>
  </Float>
);

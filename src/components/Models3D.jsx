import React, { useRef, useState } from 'react';
import { Float, RoundedBox, Cylinder, Torus } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

// ── Shared: Slide Switch ─────────────────────────────────────────────────────
const SlideSwitch = ({ position, rotation, isActive, toggle }) => (
  <group position={position} rotation={rotation}
    onClick={(e) => { e.stopPropagation(); toggle(); }}>
    <RoundedBox args={[0.42, 0.18, 0.08]} radius={0.09}>
      <meshStandardMaterial color={isActive ? '#22c55e' : '#3f3f46'} roughness={0.5} />
    </RoundedBox>
    <RoundedBox args={[0.16, 0.13, 0.12]} radius={0.05}
      position={[isActive ? 0.11 : -0.11, 0, 0.05]}>
      <meshStandardMaterial color="#e4e4e7" roughness={0.2} metalness={0.2} />
    </RoundedBox>
  </group>
);

// ── Shared: SOS Button ───────────────────────────────────────────────────────
const SOSButton = ({ position, rotation, trigger }) => {
  const btnRef = useRef();
  const [pressed, setPressed] = useState(false);

  useFrame(({ clock }) => {
    if (btnRef.current)
      btnRef.current.material.emissiveIntensity =
        0.25 + Math.sin(clock.elapsedTime * 2.5) * 0.18;
  });

  const handleClick = (e) => {
    e.stopPropagation();
    setPressed(true);
    trigger();
    setTimeout(() => setPressed(false), 250);
  };

  return (
    <group position={position} rotation={rotation} onClick={handleClick}>
      <Cylinder args={[0.215, 0.215, 0.045, 32]} position={[0, 0, -0.005]}>
        <meshStandardMaterial color="#0a0a0a" roughness={0.9} />
      </Cylinder>
      <Cylinder ref={btnRef} args={[0.155, 0.155, 0.085, 32]}
        position={[0, 0, pressed ? 0.008 : 0.025]}>
        <meshStandardMaterial color="#5b4b4b" emissive="#ff2200"
          emissiveIntensity={0.25} roughness={0.25} metalness={0.3} />
      </Cylinder>
    </group>
  );
};

// ── KEYCHAIN TAG — gold & black luxury form with chain attachment ───────────────
export const ModelKeychain = ({ trigger, tracking, toggleTrack }) => (
  <Float speed={1.1} rotationIntensity={0.12} floatIntensity={0.25}>
    <group>
      {/* Main body — gold with rounded corners */}
      <RoundedBox args={[0.9, 1.4, 0.28]} radius={0.18} castShadow>
        <meshStandardMaterial color="#1a1a1a" metalness={0.95} roughness={0.15} />
      </RoundedBox>
      {/* Face inset — darker gold center */}
      <RoundedBox args={[0.8, 1.28, 0.26]} radius={0.16} position={[0, 0, 0.01]}>
        <meshStandardMaterial color="#000000" metalness={0.9} roughness={0.2} />
      </RoundedBox>
      
      {/* Black accent stripe — vertical band down center */}
      <RoundedBox args={[0.16, 1.25, 0.27]} radius={0.08} position={[0, 0, 0.02]}>
        <meshStandardMaterial color="#7b6666" metalness={0.3} roughness={0.4} />
      </RoundedBox>

      {/* Top chain bail — gold loop */}
      <Torus args={[0.15, 0.013, 16, 32]} position={[0, 1.25, 0]}>
        <meshStandardMaterial color="#fff7dd" metalness={1} roughness={0.1} />
      </Torus>

      <Torus args={[0.1, 0.012, 16, 32]} position={[0, 1, 0]}>
        <meshStandardMaterial color="#fff7dd" metalness={1} roughness={0.1} />
      </Torus>
      <Torus args={[0.1, 0.012, 16, 32]} position={[0, 0.8, 0]}>
        <meshStandardMaterial color="#fff7dd" metalness={1} roughness={0.1} />
      </Torus>
      <Torus args={[0.1, 0.012, 16, 32]} position={[0, 0.6, 0]}>
        <meshStandardMaterial color="#fff7dd" metalness={1} roughness={0.1} />
      </Torus>
    

      {/* SOS button */}
      <SOSButton position={[0, 0.15, 0.16]} rotation={[Math.PI / 2, 0, 0]} trigger={trigger} />
      {/* Slide switch */}
      <SlideSwitch position={[0, -0.35, 0.16]} rotation={[Math.PI / 89, 0, 0]} isActive={tracking} toggle={toggleTrack} />
      
      {/* Charging Port — USB-C at bottom */}
      <RoundedBox args={[0.18, 0.08, 0.05]} rotation={[Math.PI / 2, 0, 0]} radius={0.02} position={[0, -0.70, 0.01]}>
        <meshStandardMaterial color="#0d0b0b" metalness={0.6} roughness={0.3} />
      </RoundedBox>
      <RoundedBox args={[0.12, 0.04, 0.02]} rotation={[Math.PI / 2, 0, 0]} radius={0.01} position={[0, -0.72, 0]}>
        <meshStandardMaterial color="#907e7e" metalness={0.8} roughness={0.2} />
      </RoundedBox>
    </group>
  </Float>
);

// ── SILICONE CLIP — tall pill body, matte black, back-clip spine ─────────────
export const ModelSilicone = ({ trigger, tracking, toggleTrack }) => (
  <Float speed={1.1} rotationIntensity={0.12} floatIntensity={0.25}>
    <group>
      {/* Body */}
      {/* <RoundedBox args={[0.95, 1.7, 0.48]} radius={0.26} castShadow>
        <meshStandardMaterial color="#111111" roughness={0.55} metalness={0.08} />
      </RoundedBox> */}
      {/* Face panel */}
      <RoundedBox args={[0.82, 1.56, 0.46]} radius={0.22} position={[0, 0, 0.01]}>
        <meshStandardMaterial color="#1a1a1a" roughness={0.5} metalness={0.05} />
      </RoundedBox>


      {/* Clip spine — back side, vertical rail */}
      <RoundedBox args={[0.5, 0.3, 0.14]} radius={0.07} position={[0, 0.9, -0.33]}>
        <meshStandardMaterial color="#27272a" roughness={0.4} metalness={0.5} />
      </RoundedBox>


      {/* Clip spine — back side, vertical rail */}
      <RoundedBox args={[0.5, 1.5, 0.14]} radius={0.07} position={[0, 0.08, -0.33]}>
        <meshStandardMaterial color="#27272a" roughness={0.4} metalness={0.5} />
      </RoundedBox>

      {/* Clip arm — open jaw above body */}
      <RoundedBox args={[0.22, 0.58, 0.09]} radius={0.06} position={[0, 0.76, -0.09]}>
        <meshStandardMaterial color="#3f3f46" roughness={0.3} metalness={0.55} />
      </RoundedBox>

      {/* Hinge pin */}
      <Cylinder args={[0.05, 0.05, 0.34, 16]}
        position={[0, 0.48, -0.2]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color="#71717a" metalness={0.9} roughness={0.15} />
      </Cylinder>

      {/* Hook tip at top of clip arm */}
      <RoundedBox args={[0.2, 0.14, 0.13]} radius={0.05} position={[0, 1.07, -0.14]}>
        <meshStandardMaterial color="#3f3f46" roughness={0.3} metalness={0.55} />
      </RoundedBox>

      {/* Hook tip at top of clip arm */}
      <RoundedBox args={[0.2, 0.14, 0.13]} radius={0.05} position={[0, 1.07, -0.2]}>
        <meshStandardMaterial color="#3f3f46" roughness={0.3} metalness={0.55} />
      </RoundedBox>

      {/* Hook tip at top of clip arm */}
      <RoundedBox args={[0.2, 0.14, 0.13]} radius={0.05} position={[0, 1.07, -0.3]}>
        <meshStandardMaterial color="#3f3f46" roughness={0.3} metalness={0.55} />
      </RoundedBox>

      {/* SOS button */}
      <SOSButton position={[0, 0.22, 0.26]} rotation={[Math.PI / 2, 0, 0]} trigger={trigger} />

      {/* Slide switch */}
      <SlideSwitch position={[0, -0.38, 0.26]} rotation={[Math.PI / 89, 0, 0]}
        isActive={tracking} toggle={toggleTrack} />
        
      {/* Charging Port — USB-C at bottom */}
      <RoundedBox args={[0.2, 0.1, 0.06]} radius={0.03} rotation={[Math.PI / 2, 0, 0]} position={[0, -0.77, 0]}>
        <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.3} />
      </RoundedBox>
      <RoundedBox args={[0.14, 0.05, 0.03]} radius={0.015} position={[0, -0.78, 0]}>
        <meshStandardMaterial color="#9c7d7d" metalness={0.8} roughness={0.2} />
      </RoundedBox>
    </group>
  </Float>
);

// ── GOLD PENDANT — flat round coin form, controls on back ────────────────────
export const ModelPendant = ({ trigger, tracking, toggleTrack }) => (
  <Float speed={1.5} rotationIntensity={0.2}>
    <group>
      {/* Outer gold solid coin — flat cylinder facing forward */}
      <Cylinder args={[0.84, 0.80, 0.5, 64]} rotation={[Math.PI / 2, 0, 0]} radius={0.84} castShadow>
        <meshStandardMaterial color="#bc8787" metalness={0.95} roughness={0.1} />
      </Cylinder>
      
        
      <Cylinder args={[0.75, 0.75, 0.16, 64]} position={[0, 0, 0.21]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#120c0c" metalness={0.85} roughness={0.01} />
      </Cylinder>

      {/* Inner face — darker gold inset on the front */}
      <Cylinder args={[0.75, 0.75, 0.16, 64]} position={[0, 0, -0.2]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#bc8787" metalness={0.85} roughness={0.1} />
      </Cylinder>




      {/* Front decorative ring — black accent */}
      <Torus args={[0.73, 0.1, 2, 64]} radius={0.1} position={[0, 0, 0.3]}>
        <meshStandardMaterial color="#000000" metalness={0.85} roughness={0.01} />
      </Torus>

      

      {/* Chain bail — gold loop at top */}
      <Torus args={[0.2, 0.07, 16, 32]} position={[0, 0.9, 0]}>
        <meshStandardMaterial color="#bc8787" metalness={1} roughness={0.1} />
      </Torus>

      {/* SOS BUTTON on back (z-negative) — rotated 180 on Y to face backwards */}
      <SOSButton position={[0, 0.2, -0.3]} rotation={[Math.PI / 2, Math.PI, 0]} trigger={trigger} />
      
      {/* Slide switch on back (z-negative) — rotated 180 on Y to face backwards */}
      <SlideSwitch position={[0, -0.2, -0.3]} rotation={[Math.PI / 89, Math.PI, 0]} isActive={tracking} toggle={toggleTrack} />
    </group>
  </Float>
);
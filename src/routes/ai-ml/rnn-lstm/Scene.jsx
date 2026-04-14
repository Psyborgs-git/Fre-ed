import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useScrollProgress } from '../../../lib/ScrollContext.jsx';
import { useReducedMotion } from '../../../three/hooks/useReducedMotion.js';

// ── Sequence of time steps ────────────────────────────────────────
const N_STEPS = 6;
const STEP_SPACING = 1.6;
const START_X = -(N_STEPS - 1) * STEP_SPACING * 0.5;

function stepX(t) {
  return START_X + t * STEP_SPACING;
}

// Hidden state "memory" strength — decays for vanilla RNN, preserved for LSTM
function hiddenStrength(stepIdx, cellType) {
  if (cellType === 'lstm') {
    // LSTM preserves memory well
    return 0.55 + stepIdx * 0.07;
  }
  // Vanilla RNN: exponential decay
  return Math.exp(-stepIdx * 0.4) * 0.9 + 0.1;
}

// Input token sphere at each time step
function InputToken({ stepIdx, progress, cellType }) {
  const meshRef = useRef();
  const appearAt = (stepIdx / N_STEPS) * 0.4;
  const t = Math.max(0, Math.min(1, (progress - appearAt) / 0.15));

  useFrame(() => {
    if (!meshRef.current) return;
    meshRef.current.scale.setScalar(t);
    meshRef.current.material.emissiveIntensity = 0.1 + t * 0.5;
  });

  return (
    <mesh ref={meshRef} position={[stepX(stepIdx), -1.8, 0]} scale={0}>
      <sphereGeometry args={[0.18, 20, 20]} />
      <meshStandardMaterial
        color="#a78bfa"
        emissive="#a78bfa"
        emissiveIntensity={0.1}
        roughness={0.3}
        metalness={0.5}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}

// Hidden state sphere — size/brightness encodes memory strength
function HiddenState({ stepIdx, progress, cellType }) {
  const meshRef = useRef();
  const glowRef = useRef();

  const appearAt = 0.05 + (stepIdx / N_STEPS) * 0.4;
  const t = Math.max(0, Math.min(1, (progress - appearAt) / 0.15));
  const strength = hiddenStrength(stepIdx, cellType);

  const color = cellType === 'lstm' ? '#22d3ee' : '#f59e0b';
  const radius = 0.12 + strength * 0.14;

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const pulse = 1 + Math.sin(clock.getElapsedTime() * 1.8 + stepIdx * 0.5) * 0.05 * t;
    meshRef.current.scale.setScalar(t * pulse);
    meshRef.current.material.emissiveIntensity = 0.15 + t * strength * 0.7;
    if (glowRef.current) glowRef.current.material.opacity = t * strength * 0.12;
  });

  return (
    <group position={[stepX(stepIdx), 0, 0]}>
      <mesh ref={glowRef}>
        <sphereGeometry args={[radius * 1.8, 16, 16]} />
        <meshStandardMaterial color={color} transparent opacity={0} side={THREE.BackSide} />
      </mesh>
      <mesh ref={meshRef} scale={0}>
        <sphereGeometry args={[radius, 22, 22]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.15}
          roughness={0.25}
          metalness={0.55}
          transparent
          opacity={0.9}
        />
      </mesh>
    </group>
  );
}

// Cell state (LSTM only) — horizontal "conveyor belt" line
function CellState({ stepIdx, nextStepIdx, progress }) {
  const t = Math.max(0, Math.min(1, (progress - 0.45) / 0.25));
  if (t < 0.01) return null;

  return (
    <Line
      points={[[stepX(stepIdx), 1.2, 0], [stepX(nextStepIdx), 1.2, 0]]}
      color="#34d399"
      lineWidth={2.5 + t * 1.5}
      transparent
      opacity={t * 0.85}
    />
  );
}

// Recurrent arrow from h_t to h_{t+1}
function RecurrentArrow({ stepIdx, nextStepIdx, progress, cellType }) {
  const showAt = 0.1 + (stepIdx / N_STEPS) * 0.35;
  const t = Math.max(0, Math.min(1, (progress - showAt) / 0.15));
  if (t < 0.01) return null;

  const color = cellType === 'lstm' ? '#22d3ee' : '#f59e0b';
  const opacity = cellType === 'rnn' ? t * hiddenStrength(stepIdx, 'rnn') * 0.9 : t * 0.75;

  return (
    <Line
      points={[[stepX(stepIdx) + 0.22, 0, 0], [stepX(nextStepIdx) - 0.22, 0, 0]]}
      color={color}
      lineWidth={1.2 + t * 0.6}
      transparent
      opacity={opacity}
    />
  );
}

// Input-to-hidden arrow (x_t → h_t)
function InputArrow({ stepIdx, progress }) {
  const showAt = (stepIdx / N_STEPS) * 0.4;
  const t = Math.max(0, Math.min(1, (progress - showAt) / 0.15));
  if (t < 0.01) return null;

  return (
    <Line
      points={[[stepX(stepIdx), -1.5, 0], [stepX(stepIdx), -0.22, 0]]}
      color="#a78bfa"
      lineWidth={0.8}
      transparent
      opacity={t * 0.6}
    />
  );
}

// Gate indicators (forget / input / output) for LSTM
function GateIndicator({ stepIdx, gateIdx, progress }) {
  const showAt = 0.55 + gateIdx * 0.04;
  const t = Math.max(0, Math.min(1, (progress - showAt) / 0.2));
  if (t < 0.01) return null;

  const colors = ['#f59e0b', '#22d3ee', '#a78bfa']; // forget, input, output
  const yOffsets = [0.55, 0.82, 1.1];
  const color = colors[gateIdx];
  const y = yOffsets[gateIdx];

  return (
    <mesh position={[stepX(stepIdx), y, 0.15]} scale={t}>
      <boxGeometry args={[0.14, 0.1, 0.14]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} roughness={0.2} metalness={0.5} transparent opacity={t * 0.9} />
    </mesh>
  );
}

function CameraRig({ progress, reducedMotion }) {
  const ref = useRef(progress);
  ref.current = progress;

  useFrame(({ camera }) => {
    const p = ref.current;
    const targetZ = 8 + p * 2.5;
    const targetX = p * 0.5;
    if (reducedMotion) {
      camera.position.z = targetZ;
      camera.position.x = targetX;
    } else {
      camera.position.z += (targetZ - camera.position.z) * 0.04;
      camera.position.x += (targetX - camera.position.x) * 0.04;
    }
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function SceneContent({ cellType, reducedMotion }) {
  const { progress } = useScrollProgress();

  return (
    <>
      <color attach="background" args={['#0a0a0f']} />
      <ambientLight intensity={0.22} />
      <pointLight position={[0, 5, 5]} intensity={2.5} color="#22d3ee" />
      <pointLight position={[-5, -3, -3]} intensity={1.2} color="#a78bfa" />
      <pointLight position={[5, -2, 3]} intensity={0.8} color="#f59e0b" />

      {/* Input tokens */}
      {Array.from({ length: N_STEPS }, (_, i) => (
        <InputToken key={`inp-${i}`} stepIdx={i} progress={progress} cellType={cellType} />
      ))}

      {/* Input→hidden arrows */}
      {Array.from({ length: N_STEPS }, (_, i) => (
        <InputArrow key={`ia-${i}`} stepIdx={i} progress={progress} />
      ))}

      {/* Hidden states */}
      {Array.from({ length: N_STEPS }, (_, i) => (
        <HiddenState key={`h-${i}`} stepIdx={i} progress={progress} cellType={cellType} />
      ))}

      {/* Recurrent arrows h_t → h_{t+1} */}
      {Array.from({ length: N_STEPS - 1 }, (_, i) => (
        <RecurrentArrow key={`ra-${i}`} stepIdx={i} nextStepIdx={i + 1} progress={progress} cellType={cellType} />
      ))}

      {/* LSTM: cell state conveyor belt */}
      {cellType === 'lstm' && Array.from({ length: N_STEPS - 1 }, (_, i) => (
        <CellState key={`cs-${i}`} stepIdx={i} nextStepIdx={i + 1} progress={progress} />
      ))}

      {/* LSTM: gate indicators */}
      {cellType === 'lstm' && Array.from({ length: N_STEPS }, (_, si) =>
        [0, 1, 2].map((gi) => (
          <GateIndicator key={`gate-${si}-${gi}`} stepIdx={si} gateIdx={gi} progress={progress} />
        ))
      )}

      <CameraRig progress={progress} reducedMotion={reducedMotion} />
      <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI * 0.75} minPolarAngle={Math.PI * 0.25} />
    </>
  );
}

/**
 * RNN/LSTM scene — hidden states flowing through 6 time steps.
 *
 * Scroll choreography:
 *   0–40%  Input tokens and hidden states appear step by step
 *  40–55%  Recurrent arrows draw between adjacent hidden states
 *  55–75%  LSTM: cell state (green conveyor belt) appears; gate cubes light up
 *  75–100% Camera pulls back to show full sequence; memory strength visible
 */
export default function Scene({ cellType = 'lstm' }) {
  const reducedMotion = useReducedMotion();

  return (
    <Canvas
      aria-hidden="true"
      camera={{ position: [0, 0.2, 8], fov: 52 }}
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 2]}
    >
      <SceneContent cellType={cellType} reducedMotion={reducedMotion} />
    </Canvas>
  );
}

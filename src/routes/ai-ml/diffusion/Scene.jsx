import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useScrollProgress } from '../../../lib/ScrollContext.jsx';
import { useReducedMotion } from '../../../three/hooks/useReducedMotion.js';

// ── Diffusion process: T timesteps of a data point ───────────────
const N_STEPS = 8; // diffusion timesteps visualised
const STEP_X_SPACING = 1.4;
const START_X = -(N_STEPS - 1) * STEP_X_SPACING * 0.5;

// Seeded noise position offsets (stable across renders)
function seededOffset(seed, scale) {
  const s1 = Math.sin(seed * 127.1) * 43758.5453;
  const s2 = Math.sin(seed * 311.7) * 43758.5453;
  return [(s1 - Math.floor(s1) - 0.5) * scale, (s2 - Math.floor(s2) - 0.5) * scale];
}

// A single "data point" particle with noise offset
function DataParticle({ stepIdx, particleIdx, noiseLevel, progress, showAt, color }) {
  const meshRef = useRef();

  const [ox, oy] = useMemo(() => seededOffset(stepIdx * 100 + particleIdx, noiseLevel * 1.2), [stepIdx, particleIdx, noiseLevel]);
  const baseX = START_X + stepIdx * STEP_X_SPACING;
  const baseY = (particleIdx - 2) * 0.4;

  const t = Math.max(0, Math.min(1, (progress - showAt) / 0.15));

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const flutter = noiseLevel > 0.5 ? Math.sin(clock.getElapsedTime() * 2.5 + particleIdx * 0.8) * noiseLevel * 0.06 : 0;
    meshRef.current.position.set(baseX + ox + flutter, baseY + oy, 0);
    meshRef.current.scale.setScalar(t * (0.6 + (1 - noiseLevel) * 0.5));
    meshRef.current.material.emissiveIntensity = 0.1 + (1 - noiseLevel) * 0.7 * t;
    meshRef.current.material.opacity = 0.3 + (1 - noiseLevel * 0.6) * 0.65 * t;
  });

  return (
    <mesh ref={meshRef} position={[baseX + ox, baseY + oy, 0]} scale={0}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.1}
        transparent
        opacity={0.5}
        roughness={0.3}
        metalness={0.4}
      />
    </mesh>
  );
}

// Noise cloud (random scattered points at high noise steps)
function NoiseCloud({ stepIdx, progress, showAt, noiseLevel }) {
  const N_CLOUD = 12;
  const t = Math.max(0, Math.min(1, (progress - showAt) / 0.15));
  if (t < 0.01) return null;

  const baseX = START_X + stepIdx * STEP_X_SPACING;

  return (
    <group>
      {Array.from({ length: N_CLOUD }, (_, i) => {
        const [ox, oy] = seededOffset(stepIdx * 200 + i + 50, noiseLevel * 1.8);
        return (
          <mesh key={i} position={[baseX + ox, oy, 0]} scale={t * noiseLevel * 0.6}>
            <sphereGeometry args={[0.06, 10, 10]} />
            <meshStandardMaterial color="#64748b" emissive="#334155" emissiveIntensity={0.2} transparent opacity={t * noiseLevel * 0.4} />
          </mesh>
        );
      })}
    </group>
  );
}

// Arrow showing forward (noising) direction
function ForwardArrow({ fromStep, toStep, progress, showAt }) {
  const t = Math.max(0, Math.min(1, (progress - showAt) / 0.15));
  if (t < 0.01) return null;

  const fromX = START_X + fromStep * STEP_X_SPACING + 0.2;
  const toX   = START_X + toStep   * STEP_X_SPACING - 0.2;

  return (
    <Line
      points={[[fromX, 1.4, 0], [toX, 1.4, 0]]}
      color="#f59e0b"
      lineWidth={0.8}
      transparent
      opacity={t * 0.6}
    />
  );
}

// Arrow showing reverse (denoising) direction
function ReverseArrow({ fromStep, toStep, progress, showAt }) {
  const t = Math.max(0, Math.min(1, (progress - showAt) / 0.15));
  if (t < 0.01) return null;

  const fromX = START_X + fromStep * STEP_X_SPACING - 0.2;
  const toX   = START_X + toStep   * STEP_X_SPACING + 0.2;

  return (
    <Line
      points={[[fromX, -1.4, 0], [toX, -1.4, 0]]}
      color="#22d3ee"
      lineWidth={0.8}
      transparent
      opacity={t * 0.7}
    />
  );
}

function CameraRig({ progress, reducedMotion }) {
  const ref = useRef(progress);
  ref.current = progress;

  useFrame(({ camera }) => {
    const p = ref.current;
    const targetZ = 8 + p * 2.5;
    const targetY = 0.5 + p * 0.8;
    if (reducedMotion) {
      camera.position.z = targetZ;
      camera.position.y = targetY;
    } else {
      camera.position.z += (targetZ - camera.position.z) * 0.04;
      camera.position.y += (targetY - camera.position.y) * 0.04;
    }
    camera.lookAt(0, 0, 0);
  });
  return null;
}

const N_PARTICLES = 5;

function SceneContent({ showReverse, reducedMotion }) {
  const { progress } = useScrollProgress();

  return (
    <>
      <color attach="background" args={['#0a0a0f']} />
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 5, 5]} intensity={2.2} color="#22d3ee" />
      <pointLight position={[-5, -3, -3]} intensity={1.2} color="#a78bfa" />
      <pointLight position={[5, -2, 3]} intensity={0.8} color="#f59e0b" />

      {Array.from({ length: N_STEPS }, (_, si) => {
        const noiseLevel = si / (N_STEPS - 1); // 0 = clean, 1 = pure noise
        const color = si < 2 ? '#a78bfa' : si < 5 ? '#22d3ee' : '#64748b';
        const showAt = (si / N_STEPS) * 0.45;

        return (
          <group key={`step-${si}`}>
            {Array.from({ length: N_PARTICLES }, (_, pi) => (
              <DataParticle
                key={pi}
                stepIdx={si}
                particleIdx={pi}
                noiseLevel={noiseLevel}
                progress={progress}
                showAt={showAt}
                color={color}
              />
            ))}
            {noiseLevel > 0.3 && <NoiseCloud stepIdx={si} progress={progress} showAt={showAt} noiseLevel={noiseLevel} />}
          </group>
        );
      })}

      {/* Forward noising arrows */}
      {Array.from({ length: N_STEPS - 1 }, (_, i) => (
        <ForwardArrow key={`fa-${i}`} fromStep={i} toStep={i + 1} progress={progress} showAt={0.5 + i * 0.02} />
      ))}

      {/* Reverse denoising arrows */}
      {showReverse && Array.from({ length: N_STEPS - 1 }, (_, i) => (
        <ReverseArrow key={`ra-${i}`} fromStep={N_STEPS - 1 - i} toStep={N_STEPS - 2 - i} progress={progress} showAt={0.65 + i * 0.02} />
      ))}

      <CameraRig progress={progress} reducedMotion={reducedMotion} />
      <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI * 0.75} minPolarAngle={Math.PI * 0.25} />
    </>
  );
}

/**
 * Diffusion scene — forward noising and reverse denoising process.
 *
 * Scroll choreography:
 *   0–45%  Data particles at each timestep appear (left = clean, right = noisy)
 *  45–65%  Forward arrows show noising direction (amber, top lane)
 *  65–100% Reverse arrows show denoising (cyan, bottom lane); camera pulls back
 */
export default function Scene({ showReverse = true }) {
  const reducedMotion = useReducedMotion();

  return (
    <Canvas
      aria-hidden="true"
      camera={{ position: [0, 0.5, 8], fov: 52 }}
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 2]}
    >
      <SceneContent showReverse={showReverse} reducedMotion={reducedMotion} />
    </Canvas>
  );
}

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useScrollProgress } from '../../../lib/ScrollContext.jsx';
import { useReducedMotion } from '../../../three/hooks/useReducedMotion.js';

// ── Layout constants ──────────────────────────────────────────────────
const INPUT_SIZE = 7;   // 7×7 input grid
const FILTER_SIZE = 3;  // 3×3 conv filter
const FEAT_SIZE = 5;    // 5×5 feature map (valid conv: 7-3+1=5)
const POOL_SIZE = 2;    // 2×2 max pool

const CELL = 0.32;      // pixel cell size
const GAP_X = 0.25;     // gap between stages

const INPUT_X = -4.0;
const CONV_X  = INPUT_X + (INPUT_SIZE * CELL) / 2 + GAP_X + (FEAT_SIZE * CELL) / 2 + 0.5;
const POOL_X  = CONV_X + (FEAT_SIZE * CELL) / 2 + GAP_X + ((FEAT_SIZE / POOL_SIZE) * CELL) / 2 + 0.5;
const FC_X    = POOL_X + 2.0;

const KERNEL_STYLES = {
  edge: { input: (r, c) => 1 - ((r + c) / ((INPUT_SIZE - 1) * 2)), feature: (r, c) => Math.abs(r - c) / (FEAT_SIZE - 1), color: '#f59e0b' },
  blur: { input: (r, c) => 0.3 + (Math.sin((r + c) * 0.8) + 1) * 0.25, feature: () => 0.45, color: '#38bdf8' },
  sharpen: { input: (r, c) => (r === c || r + c === INPUT_SIZE - 1 ? 1 : 0.25), feature: (r, c) => (r === c ? 1 : 0.2), color: '#fb7185' },
};

// ── Input image grid ─────────────────────────────────────────────────

function InputGrid({ progress, kernelPreset }) {
  // Simulate a simple diagonal-edge image (bright top-left, dark bottom-right)
  const pixelValue = (r, c) => {
    const v = KERNEL_STYLES[kernelPreset].input(r, c);
    return 0.1 + v * 0.9;
  };

  const t = Math.max(0, Math.min(1, progress / 0.3));

  return (
    <group position={[INPUT_X, 0, 0]}>
      {Array.from({ length: INPUT_SIZE }, (_, r) =>
        Array.from({ length: INPUT_SIZE }, (_, c) => {
          const x = (c - (INPUT_SIZE - 1) / 2) * CELL;
          const y = ((INPUT_SIZE - 1) / 2 - r) * CELL;
          const v = pixelValue(r, c);
          return (
            <mesh key={`${r}-${c}`} position={[x, y, 0]}>
              <planeGeometry args={[CELL * 0.88, CELL * 0.88]} />
              <meshStandardMaterial
                color={new THREE.Color(v * 0.15, v * 0.55, v * 0.9)}
                emissive={new THREE.Color(v * 0.05, v * 0.2, v * 0.35)}
                emissiveIntensity={0.5 + t * 0.5}
                transparent
                opacity={0.4 + t * 0.6}
              />
            </mesh>
          );
        }),
      )}
      {/* Input border */}
      <mesh position={[0, 0, -0.05]}>
        <planeGeometry args={[INPUT_SIZE * CELL + 0.06, INPUT_SIZE * CELL + 0.06]} />
        <meshStandardMaterial
          color="#26262f"
          transparent
          opacity={t * 0.6}
        />
      </mesh>
    </group>
  );
}

// ── Sliding filter (3×3 kernel) ───────────────────────────────────────

function SlidingFilter({ progress, kernelPreset }) {
  // Filter slides across the feature map during 20–65% scroll
  const slideT = Math.max(0, Math.min(1, (progress - 0.2) / 0.45));
  if (slideT < 0.01) return null;

  // Total positions: (5)×(5) = 25 positions (valid convolution)
  const totalPositions = FEAT_SIZE * FEAT_SIZE;
  const posIdx = Math.floor(slideT * totalPositions);
  const pr = Math.floor(posIdx / FEAT_SIZE);
  const pc = posIdx % FEAT_SIZE;

  // Map from output position back to input position
  const inputRow = pr;
  const inputCol = pc;
  const cx = INPUT_X + (inputCol - (INPUT_SIZE - 1) / 2 + 1) * CELL;
  const cy = ((INPUT_SIZE - 1) / 2 - inputRow - 1) * CELL;

  // Position is applied declaratively via the JSX prop — no useFrame needed.
  return (
    <group position={[cx, cy, 0.1]}>
      {/* 3×3 filter highlight */}
      {Array.from({ length: FILTER_SIZE }, (_, fr) =>
        Array.from({ length: FILTER_SIZE }, (_, fc) => {
          const x = (fc - 1) * CELL;
          const y = (1 - fr) * CELL;
          return (
            <mesh key={`${fr}-${fc}`} position={[x, y, 0]}>
              <planeGeometry args={[CELL * 0.9, CELL * 0.9]} />
              <meshStandardMaterial
                 color={KERNEL_STYLES[kernelPreset].color}
                 emissive={KERNEL_STYLES[kernelPreset].color}
                emissiveIntensity={0.8}
                transparent
                opacity={0.35}
              />
            </mesh>
          );
        }),
      )}
      {/* Filter border */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[FILTER_SIZE * CELL + 0.04, FILTER_SIZE * CELL + 0.04]} />
        <meshStandardMaterial color={KERNEL_STYLES[kernelPreset].color} transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

// ── Feature map ───────────────────────────────────────────────────────

function FeatureMap({ progress, kernelPreset }) {
  // Feature map appears during 25–70% scroll
  const slideT = Math.max(0, Math.min(1, (progress - 0.2) / 0.45));
  const totalPositions = FEAT_SIZE * FEAT_SIZE;
  const revealedCount = Math.floor(slideT * totalPositions);

  // Edge-detection kernel response (simple approximation)
  const featureValue = (r, c) => {
    const v = KERNEL_STYLES[kernelPreset].feature(r, c);
    return v;
  };

  return (
    <group position={[CONV_X, 0, 0]}>
      {Array.from({ length: FEAT_SIZE }, (_, r) =>
        Array.from({ length: FEAT_SIZE }, (_, c) => {
          const linearIdx = r * FEAT_SIZE + c;
          const revealed = linearIdx < revealedCount;
          if (!revealed) return null;

          const v = featureValue(r, c);
          const x = (c - (FEAT_SIZE - 1) / 2) * CELL;
          const y = ((FEAT_SIZE - 1) / 2 - r) * CELL;

          return (
            <mesh key={`${r}-${c}`} position={[x, y, 0]}>
              <planeGeometry args={[CELL * 0.88, CELL * 0.88]} />
              <meshStandardMaterial
                color={new THREE.Color(0.05, v * 0.85, 0.6)}
                emissive={new THREE.Color(0, v * 0.4, 0.25)}
                emissiveIntensity={0.6}
                transparent
                opacity={0.85}
              />
            </mesh>
          );
        }),
      )}
    </group>
  );
}

// ── Pooled feature map (2×2 max pool → 2×2 output) ───────────────────

function PooledMap({ progress }) {
  const t = Math.max(0, Math.min(1, (progress - 0.65) / 0.25));
  if (t < 0.01) return null;

  const POOLED = Math.floor(FEAT_SIZE / POOL_SIZE); // = 2 (floor 5/2)

  return (
    <group position={[POOL_X, 0, 0]}>
      {Array.from({ length: POOLED }, (_, r) =>
        Array.from({ length: POOLED }, (_, c) => {
          const v = Math.abs(r - c) / Math.max(POOLED - 1, 1);
          const x = (c - (POOLED - 1) / 2) * CELL * 1.5;
          const y = ((POOLED - 1) / 2 - r) * CELL * 1.5;
          return (
            <mesh key={`${r}-${c}`} position={[x, y, 0]}>
              <planeGeometry args={[CELL * 1.3, CELL * 1.3]} />
              <meshStandardMaterial
                color={new THREE.Color(0.05, v * 0.85, 0.55)}
                emissive={new THREE.Color(0, v * 0.5, 0.3)}
                emissiveIntensity={0.8}
                transparent
                opacity={t * 0.9}
              />
            </mesh>
          );
        }),
      )}
      {/* Pool-region highlight overlay on feature map */}
      <mesh position={[CONV_X - POOL_X, 0, 0.05]}>
        <planeGeometry args={[POOL_SIZE * CELL + 0.06, POOL_SIZE * CELL + 0.06]} />
        <meshStandardMaterial
          color="#22d3ee"
          transparent
          opacity={t * 0.15}
        />
      </mesh>
    </group>
  );
}

// ── Fully-connected output spheres ────────────────────────────────────

function FCLayer({ progress }) {
  const t = Math.max(0, Math.min(1, (progress - 0.82) / 0.18));
  if (t < 0.01) return null;

  const N_CLASSES = 4;
  const spacing = 0.6;
  const offset = ((N_CLASSES - 1) * spacing) / 2;

  return (
    <group position={[FC_X, 0, 0]}>
      {Array.from({ length: N_CLASSES }, (_, i) => {
        const y = i * spacing - offset;
        const isTop = i === 2;
        const color = isTop ? '#f59e0b' : '#22d3ee';
        return (
          <group key={i}>
            <Line
              points={[[POOL_X - FC_X + 0.3, 0, 0], [0, y, 0]]}
              color={color}
              lineWidth={isTop ? 2.5 : 1}
              transparent
              opacity={(isTop ? 0.7 : 0.25) * t}
            />
            <mesh position={[0, y, 0]}>
              <sphereGeometry args={[0.18, 20, 20]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={isTop ? 0.9 * t : 0.3 * t}
                roughness={0.3}
                metalness={0.5}
                transparent
                opacity={t * 0.9}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// ── Stage connector arrows ────────────────────────────────────────────

function StageConnectors({ progress }) {
  const t1 = Math.max(0, Math.min(1, (progress - 0.18) / 0.15));
  const t2 = Math.max(0, Math.min(1, (progress - 0.6) / 0.15));

  return (
    <>
      {t1 > 0.01 && (
        <Line
          points={[[INPUT_X + (INPUT_SIZE * CELL) / 2 + 0.05, 0, 0], [CONV_X - (FEAT_SIZE * CELL) / 2 - 0.05, 0, 0]]}
          color="#a78bfa"
          lineWidth={2}
          transparent
          opacity={t1 * 0.6}
        />
      )}
      {t2 > 0.01 && (
        <Line
          points={[[CONV_X + (FEAT_SIZE * CELL) / 2 + 0.05, 0, 0], [POOL_X - 0.5, 0, 0]]}
          color="#a78bfa"
          lineWidth={2}
          transparent
          opacity={t2 * 0.6}
        />
      )}
    </>
  );
}

// ── Camera ────────────────────────────────────────────────────────────

function CameraRig({ progress, reducedMotion }) {
  const progressRef = useRef(progress);
  progressRef.current = progress;

  useFrame(({ camera }) => {
    // Gradually pan right as stages are revealed
    const p = progressRef.current;
    const targetX = p * 2.5;
    const targetZ = 8 + p * 1.5;
    if (reducedMotion) {
      camera.position.x = targetX;
      camera.position.z = targetZ;
    } else {
      camera.position.x += (targetX - camera.position.x) * 0.04;
      camera.position.z += (targetZ - camera.position.z) * 0.04;
    }
    camera.lookAt(targetX * 0.4, 0, 0);
  });
  return null;
}

// ── Scene root ────────────────────────────────────────────────────────

function SceneContent({ kernelPreset, reducedMotion }) {
  const { progress } = useScrollProgress();

  return (
    <>
      <color attach="background" args={['#0a0a0f']} />

      <ambientLight intensity={0.2} />
      <pointLight position={[0, 5, 5]} intensity={2.5} color="#22d3ee" />
      <pointLight position={[-4, -3, -3]} intensity={1.2} color="#a78bfa" />
      <pointLight position={[6, 2, 3]} intensity={1.0} color="#f59e0b" />

      <InputGrid progress={progress} kernelPreset={kernelPreset} />
      <SlidingFilter progress={progress} kernelPreset={kernelPreset} />
      <FeatureMap progress={progress} kernelPreset={kernelPreset} />
      <StageConnectors progress={progress} />
      <PooledMap progress={progress} />
      <FCLayer progress={progress} />

      <CameraRig progress={progress} reducedMotion={reducedMotion} />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI * 0.75}
        minPolarAngle={Math.PI * 0.25}
      />
    </>
  );
}

/**
 * Segment A — CNN from Scratch 3D scene.
 *
 * Pipeline (left → right):
 *   7×7 input image → (sliding 3×3 amber filter) → 5×5 feature map →
 *   2×2 max pooled map → 4 FC output neurons
 *
 * Scroll choreography:
 *   0 %  — Input image fades in
 *   20 % — 3×3 filter starts sliding across input; feature map fills in step-by-step
 *   65 % — Max pool appears; pooled map shown
 *   82 % — FC layer appears; top prediction highlighted amber
 *   100% — Full pipeline visible; camera panned right to show all stages
 */
export default function Scene({ kernelPreset = 'edge' }) {
  const reducedMotion = useReducedMotion();

  return (
    <Canvas
      aria-hidden="true"
      camera={{ position: [-1, 0.5, 8], fov: 55 }}
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 2]}
    >
      <SceneContent kernelPreset={kernelPreset} reducedMotion={reducedMotion} />
    </Canvas>
  );
}

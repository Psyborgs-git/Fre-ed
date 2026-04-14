import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useScrollProgress } from '../../../lib/ScrollContext.jsx';
import { useReducedMotion } from '../../../three/hooks/useReducedMotion.js';

const N_NEURONS = 8;
const LAYER_X = [-3.5, 0, 3.5]; // pre-norm, norm, post-norm

// Generate sample activation values (spread wide before norm, tight after)
function genActivations(scale, offset) {
  return Array.from({ length: N_NEURONS }, (_, i) => ({
    y: (i - (N_NEURONS - 1) / 2) * scale + offset,
    idx: i,
  }));
}

const PRE_ACTIVATIONS  = genActivations(0.72, 0.8);   // spread, shifted
const POST_ACTIVATIONS = genActivations(0.45, 0);       // normalised: mean≈0, tighter

function ActivationBar({ x, activation, progress, showAt, color }) {
  const meshRef = useRef();
  const t = Math.max(0, Math.min(1, (progress - showAt) / 0.25));

  const height = Math.max(0.08, Math.abs(activation.y) * 0.9);
  const yPos = activation.y * 0.5;

  useFrame(() => {
    if (!meshRef.current) return;
    meshRef.current.material.opacity = 0.18 + t * 0.7;
    meshRef.current.material.emissiveIntensity = 0.1 + t * 0.55;
  });

  return (
    <mesh ref={meshRef} position={[x, yPos, 0]}>
      <boxGeometry args={[0.28, height, 0.28]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.1}
        transparent
        opacity={0.18}
        roughness={0.3}
        metalness={0.4}
      />
    </mesh>
  );
}

// Mean line across a column
function MeanLine({ x, mean, progress, showAt }) {
  const t = Math.max(0, Math.min(1, (progress - showAt) / 0.2));
  if (t < 0.01) return null;

  const y = mean * 0.5;
  return (
    <Line
      points={[[x - 0.5, y, 0.2], [x + 0.5, y, 0.2]]}
      color="#f59e0b"
      lineWidth={1.5}
      transparent
      opacity={t * 0.85}
    />
  );
}

// Bracket showing std spread
function StdBracket({ x, std, progress, showAt, color = '#22d3ee' }) {
  const t = Math.max(0, Math.min(1, (progress - showAt) / 0.2));
  if (t < 0.01) return null;

  const half = std * 0.45;
  return (
    <group>
      <Line points={[[x + 0.55, -half, 0.2], [x + 0.55, half, 0.2]]} color={color} lineWidth={1.2} transparent opacity={t * 0.7} />
      <Line points={[[x + 0.45, -half, 0.2], [x + 0.65, -half, 0.2]]} color={color} lineWidth={1.2} transparent opacity={t * 0.7} />
      <Line points={[[x + 0.45,  half, 0.2], [x + 0.65,  half, 0.2]]} color={color} lineWidth={1.2} transparent opacity={t * 0.7} />
    </group>
  );
}

// Arrow from pre to post showing the normalisation transform
function NormArrow({ progress }) {
  const t = Math.max(0, Math.min(1, (progress - 0.45) / 0.25));
  if (t < 0.01) return null;

  return (
    <Line
      points={[[-1.8, 0, 0.3], [1.8, 0, 0.3]]}
      color="#34d399"
      lineWidth={2 + t}
      transparent
      opacity={t * 0.9}
    />
  );
}

function CameraRig({ progress, reducedMotion }) {
  const ref = useRef(progress);
  ref.current = progress;

  useFrame(({ camera }) => {
    const p = ref.current;
    const targetZ = 7 + p * 2.5;
    if (reducedMotion) {
      camera.position.z = targetZ;
    } else {
      camera.position.z += (targetZ - camera.position.z) * 0.04;
    }
    camera.lookAt(0, 0.5, 0);
  });
  return null;
}

function SceneContent({ normType, reducedMotion }) {
  const { progress } = useScrollProgress();

  const preMean   = useMemo(() => PRE_ACTIVATIONS.reduce((s, a) => s + a.y, 0) / N_NEURONS, []);
  const preStd    = useMemo(() => Math.sqrt(PRE_ACTIVATIONS.reduce((s, a) => s + (a.y - preMean) ** 2, 0) / N_NEURONS), [preMean]);
  const postMean  = 0;
  const postStd   = useMemo(() => Math.sqrt(POST_ACTIVATIONS.reduce((s, a) => s + a.y ** 2, 0) / N_NEURONS), []);

  const preColor  = '#a78bfa';
  const postColor = normType === 'batch' ? '#22d3ee' : normType === 'layer' ? '#34d399' : '#f59e0b';

  return (
    <>
      <color attach="background" args={['#0a0a0f']} />
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 6, 6]} intensity={2.5} color="#22d3ee" />
      <pointLight position={[-4, -3, -3]} intensity={1.2} color="#a78bfa" />
      <pointLight position={[4, -2, 3]} intensity={0.8} color="#f59e0b" />

      {/* Pre-normalisation column */}
      {PRE_ACTIVATIONS.map((act, i) => (
        <ActivationBar
          key={`pre-${i}`}
          x={LAYER_X[0]}
          activation={act}
          progress={progress}
          showAt={i * 0.03}
          color={preColor}
        />
      ))}
      <MeanLine x={LAYER_X[0]} mean={preMean} progress={progress} showAt={0.28} />
      <StdBracket x={LAYER_X[0]} std={preStd} progress={progress} showAt={0.32} color={preColor} />

      {/* Post-normalisation column */}
      {POST_ACTIVATIONS.map((act, i) => (
        <ActivationBar
          key={`post-${i}`}
          x={LAYER_X[2]}
          activation={act}
          progress={progress}
          showAt={0.5 + i * 0.025}
          color={postColor}
        />
      ))}
      <MeanLine x={LAYER_X[2]} mean={postMean} progress={progress} showAt={0.72} />
      <StdBracket x={LAYER_X[2]} std={postStd} progress={progress} showAt={0.76} color={postColor} />

      {/* Normalisation arrow */}
      <NormArrow progress={progress} />

      <CameraRig progress={progress} reducedMotion={reducedMotion} />
      <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI * 0.75} minPolarAngle={Math.PI * 0.25} />
    </>
  );
}

/**
 * Normalisation scene — activation distributions before and after.
 *
 * Scroll choreography:
 *   0–25%  Pre-norm activation bars appear (spread, shifted)
 *  25–45%  Mean line and std bracket shown on pre-norm column
 *  45–70%  Post-norm bars appear (centred, tighter)
 *  70–100% Std bracket on post-norm column; camera pulls back
 */
export default function Scene({ normType = 'layer' }) {
  const reducedMotion = useReducedMotion();

  return (
    <Canvas
      aria-hidden="true"
      camera={{ position: [0, 0.5, 7], fov: 52 }}
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 2]}
    >
      <SceneContent normType={normType} reducedMotion={reducedMotion} />
    </Canvas>
  );
}

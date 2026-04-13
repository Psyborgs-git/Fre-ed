import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useScrollProgress } from '../../../lib/ScrollContext.jsx';
import { useReducedMotion } from '../../../three/hooks/useReducedMotion.js';

// ── Network topology: input(3) → hidden1(4) → hidden2(4) → output(2) ──
const LAYERS = [
  { count: 3, x: -3.6 },
  { count: 4, x: -1.2 },
  { count: 4, x: 1.2 },
  { count: 2, x: 3.6 },
];

// Colours per layer role
const LAYER_COLORS = ['#a78bfa', '#22d3ee', '#22d3ee', '#f59e0b'];
const LAYER_EMISSIVE = ['#a78bfa', '#22d3ee', '#22d3ee', '#f59e0b'];

const PRESET_SCALE = {
  compact: { x: 0.82, y: 0.78 },
  standard: { x: 1, y: 1 },
  wide: { x: 1.18, y: 1.14 },
};

function layerPositions(layer, scale) {
  const { count } = layer;
  const spacing = 0.85 * scale.y;
  const offset = ((count - 1) * spacing) / 2;
  return Array.from({ length: count }, (_, i) => [layer.x * scale.x, i * spacing - offset, 0]);
}

// ── Per-neuron activation pulse ──────────────────────────────────────

function Neuron({ position, color, emissive, progress, layerIdx, neuronIdx, reducedMotion }) {
  const meshRef = useRef();
  const glowRef = useRef();

  // Activation arrives layer by layer as scroll progresses
  const activateAt = (layerIdx / (LAYERS.length - 1)) * 0.6;
  const localT = Math.max(0, Math.min(1, (progress - activateAt) / 0.25));

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    // Ripple: each neuron in the same layer fires with a tiny phase offset
    const phase = neuronIdx * 0.4;
    const pulse = reducedMotion ? 1 : 1 + Math.sin(t * 2.8 + phase) * 0.05 * localT;
    meshRef.current.scale.setScalar(pulse);
    meshRef.current.material.emissiveIntensity = 0.15 + localT * 0.65;
    if (glowRef.current) {
      glowRef.current.material.opacity = 0.03 + localT * 0.07;
    }
  });

  return (
    <group position={position}>
      {/* Glow halo */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshStandardMaterial color={color} transparent opacity={0.03} side={THREE.BackSide} />
      </mesh>
      {/* Core sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.18, 24, 24]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={0.15}
          roughness={0.3}
          metalness={0.55}
        />
      </mesh>
    </group>
  );
}

// ── Connections between adjacent layers ──────────────────────────────

function LayerConnections({ fromPosns, toPosns, progress, connIdx }) {
  // Connection band appears when the source layer activates
  const activateAt = (connIdx / (LAYERS.length - 2)) * 0.55;
  const t = Math.max(0, Math.min(1, (progress - activateAt) / 0.25));

  if (t < 0.01) return null;

  const isOutputConn = connIdx === LAYERS.length - 2;
  const lineColor = isOutputConn ? '#f59e0b' : '#22d3ee';

  return (
    <group>
      {fromPosns.map((from, fi) =>
        toPosns.map((to, ti) => (
          <Line
            key={`${fi}-${ti}`}
            points={[from, to]}
            color={lineColor}
            lineWidth={0.6 + t * 0.5}
            transparent
            opacity={0.06 + t * 0.18}
          />
        )),
      )}
    </group>
  );
}

// ── Forward-pass wave: a bright sphere travelling across layers ───────

/**
 * The wave sphere travels from layer 0 to layer L-1.
 * As it passes each layer, a brief emissive flash is applied via the
 * waveFlash prop passed down to Neuron.  The flash value peaks to 1
 * when waveT matches that layer's normalised position and decays fast.
 */
function ForwardPassWave({ progress }) {
  // Wave starts at 60% scroll and traverses the network by 95%
  const waveT = Math.max(0, Math.min(1, (progress - 0.6) / 0.35));
  if (waveT < 0.01) return null;

  const firstX = LAYERS[0].x;
  const lastX = LAYERS[LAYERS.length - 1].x;
  const x = firstX + (lastX - firstX) * waveT;

  return (
    <mesh position={[x, 0, 0.3]}>
      <sphereGeometry args={[0.12, 16, 16]} />
      <meshStandardMaterial
        color="#ffffff"
        emissive="#ffffff"
        emissiveIntensity={1.5}
        transparent
        opacity={0.6 * (1 - Math.abs(waveT - 0.5) * 0.6)}
      />
    </mesh>
  );
}

// ── Layer flash — brief white-hot spike when the wave passes ──────────

function LayerFlash({ layerIdx, progress }) {
  const meshRef = useRef();
  const progressRef = useRef(progress);
  progressRef.current = progress;

  const layerNorm = layerIdx / (LAYERS.length - 1);
  const height = LAYERS[layerIdx].count * 0.85 + 0.3;

  useFrame(() => {
    if (!meshRef.current) return;
    const waveT = Math.max(0, Math.min(1, (progressRef.current - 0.6) / 0.35));
    // Flash when wave is within 0.12 of this layer's normalised position
    const dist = Math.abs(waveT - layerNorm);
    const flash = Math.max(0, 1 - dist / 0.12);
    meshRef.current.material.opacity = flash * 0.18;
  });

  return (
    <mesh ref={meshRef} position={[LAYERS[layerIdx].x, 0, 0.25]}>
      <planeGeometry args={[0.25, height]} />
      <meshStandardMaterial
        color="#ffffff"
        emissive="#ffffff"
        emissiveIntensity={1}
        transparent
        opacity={0}
        depthWrite={false}
      />
    </mesh>
  );
}

// ── XOR decision boundary plane (appears near end of scroll) ─────────

function DecisionBoundary({ progress }) {
  const ref = useRef();
  const progressRef = useRef(progress);
  progressRef.current = progress;

  const t = Math.max(0, Math.min(1, (progress - 0.75) / 0.25));

  useFrame(() => {
    if (!ref.current) return;
    const tt = Math.max(0, Math.min(1, (progressRef.current - 0.75) / 0.25));
    ref.current.material.opacity = tt * 0.12;
    ref.current.rotation.z = tt * Math.PI * 0.08;
  });

  if (t < 0.01) return null;

  return (
    <mesh ref={ref} position={[0, 0, -0.5]} rotation={[Math.PI / 2, 0, 0]}>
      <planeGeometry args={[9, 4, 1, 1]} />
      <meshStandardMaterial
        color="#22d3ee"
        transparent
        opacity={0}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

// ── Layer labels (subtle, positioned below each layer) ────────────────

function LayerLabel({ x, count, progress, showAt }) {
  // Labels fade in sequentially
  const t = Math.max(0, Math.min(1, (progress - showAt) / 0.2));
  if (t < 0.01) return null;

  // We can't easily render text in R3F without a text mesh, so use a thin
  // emissive bar as a visual divider instead (labels are in the prose).
  const height = count * 0.85 + 0.6;

  return (
    <mesh position={[x, 0, -0.2]}>
      <planeGeometry args={[0.04, height]} />
      <meshStandardMaterial
        color="#26262f"
        transparent
        opacity={t * 0.6}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// ── Camera gentle drift ───────────────────────────────────────────────

function CameraRig({ progress, reducedMotion }) {
  const progressRef = useRef(progress);
  progressRef.current = progress;

  useFrame(({ camera }) => {
    const p = progressRef.current;
    const targetZ = 7.5 + p * 1.8;
    const targetY = p * 0.5;
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

// ── Scene root ────────────────────────────────────────────────────────

function SceneContent({ preset, reducedMotion }) {
  const { progress } = useScrollProgress();
  const scale = useMemo(() => PRESET_SCALE[preset] ?? PRESET_SCALE.standard, [preset]);

  // Pre-compute positions for all layers
  const allPositions = useMemo(() => LAYERS.map((layer) => layerPositions(layer, scale)), [scale]);

  return (
    <>
      <color attach="background" args={['#0a0a0f']} />

      {/* Lighting */}
      <ambientLight intensity={0.25} />
      <pointLight position={[0, 5, 5]} intensity={2.5} color="#22d3ee" />
      <pointLight position={[-4, -4, -3]} intensity={1.2} color="#a78bfa" />
      <pointLight position={[4, -2, 3]} intensity={0.8} color="#f59e0b" />

      {/* Neurons */}
      {LAYERS.map((layer, li) =>
        allPositions[li].map((pos, ni) => (
          <Neuron
            key={`n-${li}-${ni}`}
            position={pos}
            color={LAYER_COLORS[li]}
            emissive={LAYER_EMISSIVE[li]}
            progress={progress}
            layerIdx={li}
            neuronIdx={ni}
            reducedMotion={reducedMotion}
          />
        )),
      )}

      {/* Connections */}
      {LAYERS.slice(0, -1).map((_, li) => (
        <LayerConnections
          key={`c-${li}`}
          fromPosns={allPositions[li]}
          toPosns={allPositions[li + 1]}
          progress={progress}
          connIdx={li}
        />
      ))}

      {/* Layer separator bars */}
      {LAYERS.map((layer, li) => (
        <LayerLabel
          key={`l-${li}`}
          x={layer.x * scale.x}
          count={layer.count}
          progress={progress}
          showAt={li * 0.18}
        />
      ))}

      {/* Forward-pass travelling pulse */}
      <ForwardPassWave progress={progress} />

      {/* Layer flash — white-hot ring when the wave passes */}
      {LAYERS.map((_, li) => (
        <LayerFlash key={`f-${li}`} layerIdx={li} progress={progress} />
      ))}

      {/* Decision boundary hint */}
      <DecisionBoundary progress={progress} />

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
 * Segment A — Multi-Layer Perceptron 3D scene.
 *
 * Network topology (left to right):
 *   3 violet inputs → 4 cyan hidden → 4 cyan hidden → 2 amber outputs
 *
 * Scroll choreography:
 *   0 %  — Neurons visible, dim; no connections
 *   25 % — Input→H1 connections appear; H1 neurons brighten
 *   50 % — H1→H2 connections; H2 activates; H2→Output connections
 *   75 % — Output lights up; decision boundary plane fades in
 *   100% — Forward-pass wave sweeps left→right; full activation
 */
export default function Scene({ preset = 'standard' }) {
  const reducedMotion = useReducedMotion();

  return (
    <Canvas
      aria-hidden="true"
      camera={{ position: [0, 0.3, 7.5], fov: 52 }}
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 2]}
    >
      <SceneContent preset={preset} reducedMotion={reducedMotion} />
    </Canvas>
  );
}

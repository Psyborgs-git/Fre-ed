import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useScrollProgress } from '../../../lib/ScrollContext.jsx';

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

function layerPositions(layer) {
  const { count } = layer;
  const spacing = 0.85;
  const offset = ((count - 1) * spacing) / 2;
  return Array.from({ length: count }, (_, i) => [layer.x, i * spacing - offset, 0]);
}

// ── Per-neuron activation pulse ──────────────────────────────────────

function Neuron({ position, color, emissive, progress, layerIdx, neuronIdx }) {
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
    const pulse = 1 + Math.sin(t * 2.8 + phase) * 0.05 * localT;
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

function LayerConnections({ fromLayer, toLayer, fromPosns, toPosns, progress, connIdx }) {
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

function ForwardPassWave({ progress }) {
  const ref = useRef();
  // Wave starts at 60% scroll and traverses the network by 95%
  const waveT = Math.max(0, Math.min(1, (progress - 0.6) / 0.35));
  if (waveT < 0.01) return null;

  const firstX = LAYERS[0].x;
  const lastX = LAYERS[LAYERS.length - 1].x;
  const x = firstX + (lastX - firstX) * waveT;

  return (
    <mesh ref={ref} position={[x, 0, 0.3]}>
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

// ── XOR decision boundary plane (appears near end of scroll) ─────────

function DecisionBoundary({ progress }) {
  const ref = useRef();
  const t = Math.max(0, Math.min(1, (progress - 0.75) / 0.25));

  useFrame(() => {
    if (!ref.current) return;
    ref.current.material.opacity = t * 0.12;
    ref.current.rotation.z = t * Math.PI * 0.08;
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

function LayerLabel({ x, label, progress, showAt }) {
  // Labels fade in sequentially
  const t = Math.max(0, Math.min(1, (progress - showAt) / 0.2));
  if (t < 0.01) return null;

  // We can't easily render text in R3F without a text mesh, so use a thin
  // emissive bar as a visual divider instead (labels are in the prose).
  const height = LAYERS.find((l) => l.x === x)?.count * 0.85 + 0.6 ?? 2;

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

function CameraRig({ progress }) {
  useFrame(({ camera }) => {
    const targetZ = 7.5 + progress * 1.8;
    const targetY = progress * 0.5;
    camera.position.z += (targetZ - camera.position.z) * 0.04;
    camera.position.y += (targetY - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

// ── Scene root ────────────────────────────────────────────────────────

function SceneContent() {
  const { progress } = useScrollProgress();

  // Pre-compute positions for all layers
  const allPositions = LAYERS.map(layerPositions);

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
          />
        )),
      )}

      {/* Connections */}
      {LAYERS.slice(0, -1).map((_, li) => (
        <LayerConnections
          key={`c-${li}`}
          fromLayer={LAYERS[li]}
          toLayer={LAYERS[li + 1]}
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
          x={layer.x}
          label={['Input', 'Hidden 1', 'Hidden 2', 'Output'][li]}
          progress={progress}
          showAt={li * 0.18}
        />
      ))}

      {/* Forward-pass travelling pulse */}
      <ForwardPassWave progress={progress} />

      {/* Decision boundary hint */}
      <DecisionBoundary progress={progress} />

      <CameraRig progress={progress} />

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
export default function Scene() {
  return (
    <Canvas
      aria-hidden="true"
      camera={{ position: [0, 0.3, 7.5], fov: 52 }}
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 2]}
    >
      <SceneContent />
    </Canvas>
  );
}

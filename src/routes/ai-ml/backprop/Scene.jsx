import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useScrollProgress } from '../../../lib/ScrollContext.jsx';
import { useReducedMotion } from '../../../three/hooks/useReducedMotion.js';

// ── 3-layer network topology (same as MLP but gradient-focused) ──────
// Layers: input(3) → hidden(3) → output(2)
const LAYERS = [
  { count: 3, x: -3 },
  { count: 3, x: 0 },
  { count: 2, x: 3 },
];

const FWD_COLOR = '#22d3ee';   // Forward-pass signal
const GRAD_COLOR = '#f59e0b';  // Backward gradient signal
const INPUT_COLOR = '#a78bfa';
const OUTPUT_COLOR = '#f59e0b';

function layerPositions(layer) {
  const spacing = 1.0;
  const offset = ((layer.count - 1) * spacing) / 2;
  return Array.from({ length: layer.count }, (_, i) => [layer.x, i * spacing - offset, 0]);
}

const ALL_POSITIONS = LAYERS.map(layerPositions);

// ── Neuron with dual-mode rendering (forward or gradient glow) ───────

function Neuron({ position, layerIdx, neuronIdx, progress }) {
  const coreRef = useRef();
  const glowRef = useRef();

  // Forward pass lights up at 0–45 % scroll (left to right)
  const fwdActivate = (layerIdx / (LAYERS.length - 1)) * 0.4;
  const fwdT = Math.max(0, Math.min(1, (progress - fwdActivate) / 0.2));

  // Gradient pass lights up at 50–85 % scroll (right to left — reversed!)
  const revLayerIdx = LAYERS.length - 1 - layerIdx;
  const gradActivate = 0.5 + (revLayerIdx / (LAYERS.length - 1)) * 0.35;
  const gradT = Math.max(0, Math.min(1, (progress - gradActivate) / 0.2));

  const isInput = layerIdx === 0;
  const isOutput = layerIdx === LAYERS.length - 1;
  const baseColor = isInput ? INPUT_COLOR : isOutput ? OUTPUT_COLOR : FWD_COLOR;
  const phase = neuronIdx * 0.5;

  useFrame(({ clock }) => {
    if (!coreRef.current) return;
    const t = clock.getElapsedTime();
    const pulse = 1 + Math.sin(t * 3 + phase) * 0.04 * Math.max(fwdT, gradT * 0.8);
    coreRef.current.scale.setScalar(pulse);

    // Blend between forward (cyan) and gradient (amber) states
    const mat = coreRef.current.material;
    if (gradT > 0.05) {
      mat.emissive.set(GRAD_COLOR);
      mat.emissiveIntensity = 0.3 + gradT * 0.6;
    } else {
      mat.emissive.set(baseColor);
      mat.emissiveIntensity = 0.1 + fwdT * 0.5;
    }

    if (glowRef.current) {
      glowRef.current.material.opacity = Math.max(fwdT, gradT) * 0.08;
      if (gradT > 0.05) {
        glowRef.current.material.color.set(GRAD_COLOR);
      } else {
        glowRef.current.material.color.set(baseColor);
      }
    }
  });

  return (
    <group position={position}>
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color={baseColor} transparent opacity={0} side={THREE.BackSide} />
      </mesh>
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.2, 24, 24]} />
        <meshStandardMaterial
          color={baseColor}
          emissive={baseColor}
          emissiveIntensity={0.1}
          roughness={0.3}
          metalness={0.55}
        />
      </mesh>
    </group>
  );
}

// ── Connections — forward (cyan) and backward gradient (amber) ────────

function Connections({ fromIdx, _toIdx, fromPosns, toPosns, progress, learningRate }) {
  // Forward connections appear at ~0–45%
  const fwdAppear = (fromIdx / (LAYERS.length - 1)) * 0.4;
  const fwdT = Math.max(0, Math.min(1, (progress - fwdAppear) / 0.2));

  // Gradient connections appear going backwards at 50–85%
  const revConnIdx = LAYERS.length - 2 - fromIdx; // reversed order
  const gradAppear = 0.5 + (revConnIdx / (LAYERS.length - 1)) * 0.35;
  const gradT = Math.max(0, Math.min(1, (progress - gradAppear) / 0.2));

  if (fwdT < 0.01 && gradT < 0.01) return null;

  return (
    <group>
      {fromPosns.map((from, fi) =>
        toPosns.map((to, ti) => (
          <group key={`${fi}-${ti}`}>
            {/* Forward connection */}
            {fwdT > 0.01 && (
              <Line
                points={[from, to]}
                color={FWD_COLOR}
                lineWidth={0.8}
                transparent
                opacity={fwdT * 0.22 * (gradT < 0.05 ? 1 : 0.4)}
              />
            )}
            {/* Gradient arrow — travels backwards (to → from) */}
            {gradT > 0.01 && (
              <Line
                points={[to, from]}
                color={GRAD_COLOR}
                lineWidth={1.1 + gradT + learningRate}
                transparent
                opacity={gradT * (0.35 + learningRate * 0.4)}
              />
            )}
          </group>
        )),
      )}
    </group>
  );
}

// ── Forward-pass pulse ────────────────────────────────────────────────

function ForwardPulse({ progress }) {
  // Delayed start (0.05) so the pulse never races ahead of the connections
  const t = Math.max(0, Math.min(1, (progress - 0.05) / 0.4));
  if (t < 0.01) return null;

  const firstX = LAYERS[0].x;
  const lastX = LAYERS[LAYERS.length - 1].x;
  const x = firstX + (lastX - firstX) * t;

  return (
    <mesh position={[x, 0, 0.4]}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshStandardMaterial
        color={FWD_COLOR}
        emissive={FWD_COLOR}
        emissiveIntensity={2}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

// ── Gradient pulse — travels right to left ────────────────────────────

function GradientPulse({ progress }) {
  const t = Math.max(0, Math.min(1, (progress - 0.5) / 0.45));
  if (t < 0.01) return null;

  const firstX = LAYERS[0].x;
  const lastX = LAYERS[LAYERS.length - 1].x;
  // Travels from output (right) back to input (left)
  const x = lastX - (lastX - firstX) * t;

  return (
    <mesh position={[x, 0, 0.4]}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshStandardMaterial
        color={GRAD_COLOR}
        emissive={GRAD_COLOR}
        emissiveIntensity={2}
        transparent
        opacity={0.85}
      />
    </mesh>
  );
}

// ── Loss sphere (output zone) — appears after forward pass ───────────

function LossSphere({ progress, learningRate, reducedMotion }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = Math.max(0, Math.min(1, (progress - 0.4) / 0.2));
    const tt = clock.getElapsedTime();
    ref.current.material.emissiveIntensity = 0.4 + (reducedMotion ? 0 : Math.sin(tt * 3) * 0.2 * t) + learningRate * 0.15;
  });
  const t = Math.max(0, Math.min(1, (progress - 0.4) / 0.2));
  if (t < 0.01) return null;

  return (
    <mesh ref={ref} position={[5, 0, 0]}>
      <sphereGeometry args={[0.3, 20, 20]} />
      <meshStandardMaterial
        color="#ef4444"
        emissive="#ef4444"
        emissiveIntensity={0.4}
        roughness={0.3}
        metalness={0.4}
        transparent
        opacity={t * 0.9}
      />
    </mesh>
  );
}

// ── Loss label line ───────────────────────────────────────────────────

function LossLine({ progress }) {
  const t = Math.max(0, Math.min(1, (progress - 0.4) / 0.2));
  if (t < 0.01) return null;

  const outputX = LAYERS[LAYERS.length - 1].x;
  return (
    <Line
      points={[[outputX + 0.22, 0, 0], [4.7, 0, 0]]}
      color="#ef4444"
      lineWidth={1.5}
      transparent
      opacity={t * 0.5}
    />
  );
}

// ── Camera ────────────────────────────────────────────────────────────

function CameraRig({ progress, reducedMotion }) {
  const progressRef = useRef(progress);
  progressRef.current = progress;

  useFrame(({ camera }) => {
    const p = progressRef.current;
    // Shift camera right during forward pass, back left during gradient pass
    const targetX = p < 0.5 ? p * 1.0 : (1 - p) * 1.0;
    const targetZ = 7.5 + p * 1.5;
    if (reducedMotion) {
      camera.position.x = targetX;
      camera.position.z = targetZ;
    } else {
      camera.position.x += (targetX - camera.position.x) * 0.04;
      camera.position.z += (targetZ - camera.position.z) * 0.04;
    }
    camera.lookAt(0, 0, 0);
  });
  return null;
}

// ── Scene root ────────────────────────────────────────────────────────

function SceneContent({ learningRate, reducedMotion }) {
  const { progress } = useScrollProgress();

  return (
    <>
      <color attach="background" args={['#0a0a0f']} />

      <ambientLight intensity={0.25} />
      <pointLight position={[5, 5, 5]} intensity={2} color="#22d3ee" />
      <pointLight position={[-5, -4, -3]} intensity={1.5} color="#a78bfa" />
      <pointLight position={[5, 0, 3]} intensity={1.2} color="#f59e0b" />
      <pointLight position={[6, 2, 2]} intensity={0.8} color="#ef4444" />

      {/* Network neurons */}
      {LAYERS.map((layer, li) =>
        ALL_POSITIONS[li].map((pos, ni) => (
          <Neuron
            key={`n-${li}-${ni}`}
            position={pos}
            layerIdx={li}
            neuronIdx={ni}
            progress={progress}
          />
        )),
      )}

      {/* Connections (forward + gradient) */}
      {LAYERS.slice(0, -1).map((_, li) => (
        <Connections
          key={`c-${li}`}
          fromIdx={li}
          _toIdx={li + 1}
          fromPosns={ALL_POSITIONS[li]}
          toPosns={ALL_POSITIONS[li + 1]}
          progress={progress}
          learningRate={learningRate}
        />
      ))}

      {/* Loss sphere (the target we're differentiating) */}
      <LossSphere progress={progress} learningRate={learningRate} reducedMotion={reducedMotion} />
      <LossLine progress={progress} />

      {/* Travelling pulses */}
      <ForwardPulse progress={progress} />
      <GradientPulse progress={progress} />

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
 * Segment A — Backpropagation 3D scene.
 *
 * Visual language:
 *   Cyan  = forward-pass signal (input → output)
 *   Amber = gradient signal (output → input, backwards)
 *   Red   = loss (computed at output, drives gradients)
 *
 * Scroll choreography:
 *   0 %  — Network visible, dim
 *   25 % — Forward pulse sweeps cyan left → right
 *   45 % — Red loss sphere appears at output
 *   55 % — Gradient pulse sweeps amber right → left
 *   75 % — All connections switch from cyan to amber
 *   100% — Network in fully "trained" state; gradient flow complete
 */
export default function Scene({ learningRate = 0.3 }) {
  const reducedMotion = useReducedMotion();

  return (
    <Canvas
      aria-hidden="true"
      camera={{ position: [0.5, 0, 7.5], fov: 52 }}
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 2]}
    >
      <SceneContent learningRate={learningRate} reducedMotion={reducedMotion} />
    </Canvas>
  );
}

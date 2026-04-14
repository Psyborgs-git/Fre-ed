import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useScrollProgress } from '../../../lib/ScrollContext.jsx';
import { useReducedMotion } from '../../../three/hooks/useReducedMotion.js';

// ── Fixed weight values for the 4 inputs ─────────────────────────
// Positive weights → cyan lines (same direction as output)
// Negative weights → amber lines (opposing)
const INPUT_Y = [-1.2, -0.4, 0.4, 1.2];
const INPUT_X = -2.6;

// ── Central neuron ────────────────────────────────────────────────

function Neuron({ progress, reducedMotion }) {
  const meshRef = useRef();
  const glowRef = useRef();
  const progressRef = useRef(progress);
  progressRef.current = progress;

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const p = progressRef.current;
    // Pulse intensity scales with scroll progress
    const pulse = reducedMotion ? 1 : 1 + Math.sin(t * 2.5) * 0.06 * p;
    meshRef.current.scale.setScalar(pulse);

    // Emissive intensity driven by progress (neuron "activates")
    if (meshRef.current.material) {
      meshRef.current.material.emissiveIntensity = 0.3 + p * 0.7;
    }
    if (glowRef.current?.material) {
      glowRef.current.material.opacity = 0.04 + p * 0.08;
    }
  });

  return (
    <group>
      {/* Outer glow shell */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.62, 24, 24]} />
        <meshStandardMaterial
          color="#22d3ee"
          transparent
          opacity={0.04}
          side={THREE.BackSide}
        />
      </mesh>
      {/* Core */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshStandardMaterial
          color="#22d3ee"
          emissive="#22d3ee"
          emissiveIntensity={0.3}
          roughness={0.25}
          metalness={0.6}
        />
      </mesh>
    </group>
  );
}

// ── Input nodes + weight lines ────────────────────────────────────

function InputLayer({ progress, weights }) {
  return (
    <group>
      {weights.map((w, i) => {
        const y = INPUT_Y[i];
        const isPositive = w >= 0;
        const lineColor = isPositive ? '#22d3ee' : '#f59e0b';
        const lineWidth = Math.abs(w) * 4 + 0.5;

        return (
          <group key={i}>
            {/* Input sphere */}
            <mesh position={[INPUT_X, y, 0]}>
              <sphereGeometry args={[0.16, 16, 16]} />
              <meshStandardMaterial
                color="#a78bfa"
                emissive="#a78bfa"
                emissiveIntensity={0.3 + progress * 0.3}
                roughness={0.4}
                metalness={0.4}
              />
            </mesh>

            {/* Weight line — opacity grows with scroll */}
            <Line
              points={[
                [INPUT_X, y, 0],
                [0, 0, 0],
              ]}
              color={lineColor}
              lineWidth={lineWidth}
              transparent
              opacity={0.3 + progress * 0.45}
            />

            {/* Small weight label dot at midpoint */}
            <mesh position={[(INPUT_X + 0) / 2, y / 2, 0]}>
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshStandardMaterial
                color={lineColor}
                emissive={lineColor}
                emissiveIntensity={0.8}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// ── Output node + connection ──────────────────────────────────────

function OutputLayer({ progress, confidence }) {
  const meshRef = useRef();
  const progressRef = useRef(progress);
  progressRef.current = progress;

  useFrame(() => {
    if (meshRef.current?.material) {
      meshRef.current.material.emissiveIntensity = 0.2 + progressRef.current * 0.6;
    }
  });

  return (
    <group>
      <Line
        points={[
          [0, 0, 0],
          [2.4, 0, 0],
        ]}
        color="#f59e0b"
        lineWidth={2.5}
        transparent
        opacity={0.3 + confidence * 0.35 + progress * 0.25}
      />
      <mesh ref={meshRef} position={[2.6, 0, 0]}>
        <sphereGeometry args={[0.22, 20, 20]} />
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#f59e0b"
          emissiveIntensity={0.2 + confidence * 0.5}
          roughness={0.3}
          metalness={0.5}
        />
      </mesh>
    </group>
  );
}

// ── Decision boundary plane ───────────────────────────────────────
// Tilts as scroll progresses, representing the changing hyperplane

function DecisionBoundary({ progress, weights, bias }) {
  const meshRef = useRef();
  const progressRef = useRef(progress);
  progressRef.current = progress;
  const targetRotation = useMemo(() => (weights[0] - weights[1] + bias * 0.6) * 0.22, [bias, weights]);

  useFrame(() => {
    if (!meshRef.current) return;
    const p = progressRef.current;
    // Plane tilts and opacity grows with progress
    meshRef.current.rotation.z = targetRotation * p;
    meshRef.current.material.opacity = 0.05 + p * 0.1;
  });

  return (
    <mesh ref={meshRef} rotation={[Math.PI / 2, 0, 0]}>
      <planeGeometry args={[5, 5, 1, 1]} />
      <meshStandardMaterial
        color="#22d3ee"
        transparent
        opacity={0.05}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

// ── Scroll choreography: camera drift ────────────────────────────

function CameraRig({ progress, reducedMotion }) {
  const progressRef = useRef(progress);
  progressRef.current = progress;

  useFrame(({ camera }) => {
    const p = progressRef.current;
    // Gradually pull back and tilt as user scrolls
    const targetZ = 6 + p * 1.5;
    const targetY = p * 0.8;
    if (reducedMotion) {
      camera.position.z = targetZ;
      camera.position.y = targetY;
    } else {
      camera.position.z += (targetZ - camera.position.z) * 0.05;
      camera.position.y += (targetY - camera.position.y) * 0.05;
    }
    camera.lookAt(0, 0, 0);
  });
  return null;
}

// ── Scene root ────────────────────────────────────────────────────

function SceneContent({ weights, bias, reducedMotion }) {
  const { progress } = useScrollProgress();
  const confidence = useMemo(() => {
    const score = weights.reduce((sum, weight) => sum + weight, bias);
    return 1 / (1 + Math.exp(-score));
  }, [bias, weights]);

  return (
    <>
      <color attach="background" args={['#0a0a0f']} />

      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={2} color="#22d3ee" />
      <pointLight position={[-5, -3, -3]} intensity={1} color="#a78bfa" />
      <pointLight position={[3, -2, 2]} intensity={0.5} color="#f59e0b" />

      <InputLayer progress={progress} weights={weights} />
      <Neuron progress={progress} reducedMotion={reducedMotion} />
      <OutputLayer progress={progress} confidence={confidence} />
      <DecisionBoundary progress={progress} weights={weights} bias={bias} />
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
 * Segment A — Perceptron 3D scene.
 *
 * Layout (from left to right):
 *   4 violet input spheres → weight lines (cyan/amber by sign) → cyan neuron → amber output
 *
 * Scroll animations (via ScrollContext):
 *   0%   — static wireframe, dim weight lines
 *   25%  — weight lines brighten, neuron begins to glow
 *   50%  — decision boundary plane fades in
 *   75%  — neuron pulses, camera drifts back
 *   100% — full brightness, plane titled, camera pulled wide
 *
 * Prefers-reduced-motion: OrbitControls still works; frame animations are passive.
 */
export default function Scene({ weights = [-0.8, 0.6, -0.3, 0.9], bias = 0.2 }) {
  const reducedMotion = useReducedMotion();

  return (
    <Canvas
      aria-hidden="true"
      camera={{ position: [0, 0.5, 6], fov: 50 }}
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 2]}
    >
      <SceneContent weights={weights} bias={bias} reducedMotion={reducedMotion} />
    </Canvas>
  );
}

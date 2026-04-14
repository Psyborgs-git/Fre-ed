import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useScrollProgress } from '../../../lib/ScrollContext.jsx';
import { useReducedMotion } from '../../../three/hooks/useReducedMotion.js';

// ── Loss landscape: a 2D bowl with a narrow valley (Rosenbrock-ish) ───
const GRID_W = 32;
const GRID_H = 32;

function lossValue(x, z) {
  // Banana / valley landscape
  const a = 0.3;
  const b = 4;
  return a * (1 - x) ** 2 + b * (z - x * x) ** 2;
}

function buildSurface() {
  const vertices = [];
  const colors   = [];
  const indices  = [];

  for (let iz = 0; iz < GRID_H; iz++) {
    for (let ix = 0; ix < GRID_W; ix++) {
      const x = (ix / (GRID_W - 1)) * 4 - 2;
      const z = (iz / (GRID_H - 1)) * 4 - 2;
      const y = -lossValue(x, z) * 0.6; // invert so minima are "valleys"
      vertices.push(x, y, z);

      // Colour: low loss = cyan, high loss = violet
      const t = Math.min(1, Math.max(0, (y + 1.5) / 1.5));
      colors.push(0.13 + t * 0.67, 0.3 + t * 0.52, 0.85 - t * 0.32);
    }
  }

  for (let iz = 0; iz < GRID_H - 1; iz++) {
    for (let ix = 0; ix < GRID_W - 1; ix++) {
      const a = iz * GRID_W + ix;
      const b = a + 1;
      const c = a + GRID_W;
      const d = c + 1;
      indices.push(a, c, b, b, c, d);
    }
  }

  return { vertices: new Float32Array(vertices), colors: new Float32Array(colors), indices };
}

// Optimiser path trajectories (pre-computed illustrative paths)
function buildPath(optimizer) {
  const steps = 30;
  let x = -1.6, z = 1.6; // start top-left
  const points = [[x, 0, z]];

  for (let i = 0; i < steps; i++) {
    const t = i / steps;
    if (optimizer === 'sgd') {
      // Slow, zigzaggy descent
      x += 0.085 + Math.sin(i * 0.8) * 0.04;
      z -= 0.085 + Math.cos(i * 0.6) * 0.06;
    } else if (optimizer === 'momentum') {
      // Smoother but overshoots
      x += 0.095 + Math.sin(i * 0.4) * 0.02;
      z -= 0.09 + Math.cos(i * 0.3) * 0.03;
    } else if (optimizer === 'rmsprop') {
      // Adaptive: faster on flat, slower near minimum
      const rate = 0.1 * (1 - 0.5 * t);
      x += rate + Math.sin(i * 0.3) * 0.01;
      z -= rate + Math.cos(i * 0.2) * 0.01;
    } else {
      // Adam: fastest, direct
      x += 0.11 * (1 - 0.6 * t) + Math.sin(i * 0.2) * 0.008;
      z -= 0.10 * (1 - 0.6 * t) + Math.cos(i * 0.15) * 0.006;
    }
    const y = -lossValue(x, z) * 0.6 + 0.08;
    points.push([x, y, z]);
  }
  return points;
}

const PATH_COLORS = {
  sgd:      '#a78bfa',
  momentum: '#f59e0b',
  rmsprop:  '#34d399',
  adam:     '#22d3ee',
};

function LandscapeMesh({ progress }) {
  const geomRef = useRef();
  const { vertices, colors, indices } = useMemo(() => buildSurface(), []);

  const meshRef = useRef();
  const t = Math.max(0, Math.min(1, progress / 0.15));

  useFrame(() => {
    if (!meshRef.current) return;
    meshRef.current.material.opacity = 0.18 + t * 0.45;
  });

  return (
    <mesh ref={meshRef}>
      <bufferGeometry ref={geomRef}>
        <bufferAttribute attach="attributes-position" args={[vertices, 3]} />
        <bufferAttribute attach="attributes-color"    args={[colors,   3]} />
        <bufferAttribute attach="index"               args={[new Uint16Array(indices), 1]} />
      </bufferGeometry>
      <meshStandardMaterial
        vertexColors
        transparent
        opacity={0.18}
        roughness={0.7}
        metalness={0.1}
        side={THREE.DoubleSide}
        wireframe={false}
      />
    </mesh>
  );
}

function OptimizerPath({ optimizer, progress, showAt }) {
  const points = useMemo(() => buildPath(optimizer), [optimizer]);
  const color  = PATH_COLORS[optimizer];

  const visibleCount = Math.floor(Math.max(0, Math.min(1, (progress - showAt) / 0.3)) * points.length);
  if (visibleCount < 2) return null;

  return (
    <Line
      points={points.slice(0, visibleCount)}
      color={color}
      lineWidth={2.2}
      transparent
      opacity={0.88}
    />
  );
}

// Minimum marker (star-ish glow)
function MinimumMarker({ progress }) {
  const meshRef = useRef();
  const t = Math.max(0, Math.min(1, (progress - 0.85) / 0.15));

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const pulse = 1 + Math.sin(clock.getElapsedTime() * 3) * 0.15 * t;
    meshRef.current.scale.setScalar(t * pulse);
    meshRef.current.material.emissiveIntensity = 0.8 + t * 0.6;
  });

  return (
    <mesh ref={meshRef} position={[1.0, -lossValue(1, 0) * 0.6 + 0.12, 0]} scale={0}>
      <sphereGeometry args={[0.14, 20, 20]} />
      <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} roughness={0.1} metalness={0.6} />
    </mesh>
  );
}

function CameraRig({ progress, reducedMotion }) {
  const ref = useRef(progress);
  ref.current = progress;

  useFrame(({ camera }) => {
    const p = ref.current;
    const targetX = -1 + p * 2;
    const targetY =  2 + p * 1;
    const targetZ =  6 - p * 1;
    if (reducedMotion) {
      camera.position.set(targetX, targetY, targetZ);
    } else {
      camera.position.x += (targetX - camera.position.x) * 0.04;
      camera.position.y += (targetY - camera.position.y) * 0.04;
      camera.position.z += (targetZ - camera.position.z) * 0.04;
    }
    camera.lookAt(0, -0.5, 0);
  });
  return null;
}

function SceneContent({ visibleOptimizers, reducedMotion }) {
  const { progress } = useScrollProgress();

  return (
    <>
      <color attach="background" args={['#0a0a0f']} />
      <ambientLight intensity={0.22} />
      <pointLight position={[0, 5, 4]} intensity={2.2} color="#22d3ee" />
      <pointLight position={[-3, 3, -3]} intensity={1.0} color="#a78bfa" />
      <pointLight position={[3, -2, 3]} intensity={0.7} color="#f59e0b" />

      <LandscapeMesh progress={progress} />

      {visibleOptimizers.includes('sgd') && (
        <OptimizerPath optimizer="sgd" progress={progress} showAt={0.18} />
      )}
      {visibleOptimizers.includes('momentum') && (
        <OptimizerPath optimizer="momentum" progress={progress} showAt={0.22} />
      )}
      {visibleOptimizers.includes('rmsprop') && (
        <OptimizerPath optimizer="rmsprop" progress={progress} showAt={0.26} />
      )}
      {visibleOptimizers.includes('adam') && (
        <OptimizerPath optimizer="adam" progress={progress} showAt={0.30} />
      )}

      <MinimumMarker progress={progress} />

      <CameraRig progress={progress} reducedMotion={reducedMotion} />
      <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI * 0.65} minPolarAngle={Math.PI * 0.1} />
    </>
  );
}

/**
 * Optimizers scene — loss landscape with optimizer trajectories.
 *
 * Scroll choreography:
 *   0–15%  Loss surface materialises
 *  15–60%  Optimizer paths draw one by one across the landscape
 *  60–85%  Camera angles to show depth of the valley
 *  85–100% Global minimum marker glows white at the bottom
 */
export default function Scene({ visibleOptimizers = ['sgd', 'momentum', 'rmsprop', 'adam'] }) {
  const reducedMotion = useReducedMotion();

  return (
    <Canvas
      aria-hidden="true"
      camera={{ position: [-1, 2, 6], fov: 52 }}
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 2]}
    >
      <SceneContent visibleOptimizers={visibleOptimizers} reducedMotion={reducedMotion} />
    </Canvas>
  );
}

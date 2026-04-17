import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useScrollProgress } from '../../../lib/ScrollContext.jsx';
import { useReducedMotion } from '../../../three/hooks/useReducedMotion.js';

const N = 60;

// Deterministic signal data
const SIGNAL_DATA = Array.from({ length: N }, (_, i) => {
  const trend = 0.03 * i - 0.9;
  const cycle = 0.4 * Math.sin(i * 0.3);
  const noise = 0.25 * Math.sin(i * 2.7 + 1.3) + 0.15 * Math.sin(i * 4.1 + 0.7);
  return { trend, raw: trend + cycle + noise };
});

const X_STEP = 0.165;
const X_OFFSET = -((N - 1) * X_STEP) / 2;

function toX(i) { return X_OFFSET + i * X_STEP; }

function RawLine({ opacity }) {
  const pts = useMemo(
    () => SIGNAL_DATA.map((d, i) => [toX(i), d.raw, 0]),
    []
  );
  return (
    <Line
      points={pts}
      color="#f59e0b"
      lineWidth={1.5}
      transparent
    />
  );
}

function TrendLine({ opacity }) {
  const pts = useMemo(
    () => SIGNAL_DATA.map((d, i) => [toX(i), d.trend, 0]),
    []
  );
  return (
    <Line
      points={pts}
      color="#22d3ee"
      lineWidth={3}
      transparent
    />
  );
}

// Animated wrapper that sets line opacity via useFrame by updating a ref
function AnimatedRawLine({ progressRef, reducedMotion }) {
  const ref = useRef();
  const pts = useMemo(
    () => SIGNAL_DATA.map((d, i) => [toX(i), d.raw, 0]),
    []
  );

  useFrame(() => {
    if (!ref.current) return;
    const p = progressRef.current;
    // raw line dims as scroll increases
    ref.current.material.opacity = Math.max(0.15, 1 - p * 0.75);
  });

  return (
    <line ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={new Float32Array(pts.flat())}
          count={pts.length}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#f59e0b" transparent opacity={1} />
    </line>
  );
}

function AnimatedTrendLine({ progressRef, reducedMotion }) {
  const ref = useRef();
  const pts = useMemo(
    () => SIGNAL_DATA.map((d, i) => [toX(i), d.trend, 0]),
    []
  );

  useFrame(() => {
    if (!ref.current) return;
    const p = progressRef.current;
    // trend line brightens and comes forward as scroll increases
    ref.current.material.opacity = Math.min(1, p * 1.5);
  });

  return (
    <line ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={new Float32Array(pts.flat())}
          count={pts.length}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#22d3ee" transparent opacity={0} lineWidth={3} />
    </line>
  );
}

function GridLines() {
  const ys = [-1.5, -0.75, 0, 0.75, 1.5];
  return (
    <>
      {ys.map((y) => (
        <Line
          key={y}
          points={[[-6, y, 0], [6, y, 0]]}
          color="#1e293b"
          lineWidth={0.5}
        />
      ))}
    </>
  );
}

function SceneContent({ reducedMotion }) {
  const { progress } = useScrollProgress();
  const progressRef = useRef(progress);
  progressRef.current = progress;

  return (
    <>
      <color attach="background" args={['#0a0a0f']} />
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 4, 4]} intensity={1.5} color="#22d3ee" />
      <pointLight position={[-3, 2, 3]} intensity={1} color="#f59e0b" />

      <GridLines />

      {/* Raw noisy signal — dims as scroll increases */}
      <AnimatedRawLine progressRef={progressRef} reducedMotion={reducedMotion} />

      {/* Underlying trend — fades in as scroll increases */}
      <AnimatedTrendLine progressRef={progressRef} reducedMotion={reducedMotion} />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI * 0.65}
        minPolarAngle={Math.PI * 0.35}
        maxAzimuthAngle={Math.PI * 0.2}
        minAzimuthAngle={-Math.PI * 0.2}
      />
    </>
  );
}

export default function Scene() {
  const reducedMotion = useReducedMotion();
  return (
    <Canvas
      aria-hidden="true"
      camera={{ position: [0, 0, 6], fov: 50 }}
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 2]}
    >
      <SceneContent reducedMotion={reducedMotion} />
    </Canvas>
  );
}

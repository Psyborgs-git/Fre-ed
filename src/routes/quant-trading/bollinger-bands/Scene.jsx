import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useScrollProgress } from '../../../lib/ScrollContext.jsx';
import { useReducedMotion } from '../../../three/hooks/useReducedMotion.js';

const N = 50;
const BB_PRICES = Array.from({ length: N }, (_, i) => {
  const trend = 100 + i * 0.3;
  const cycle = 4 * Math.sin(i * 0.25);
  const squeeze = i >= 20 && i <= 30 ? 0.4 : 1.0;
  const noise = squeeze * (2 * Math.sin(i * 2.1 + 0.8) + 1.5 * Math.sin(i * 3.2 + 1.4));
  return trend + cycle + noise;
});

const BB_MIN = Math.min(...BB_PRICES);
const BB_MAX = Math.max(...BB_PRICES);
const BB_RANGE = BB_MAX - BB_MIN;

const X_STEP = 8 / (N - 1);
const X_OFFSET = -4;

function toX(i) { return X_OFFSET + i * X_STEP; }
function toY(p) { return ((p - BB_MIN) / BB_RANGE) * 4 - 2; }

function computeBands(period, stdDev) {
  const upper = [];
  const lower = [];
  const sma = [];
  for (let i = 0; i < N; i++) {
    if (i < period - 1) {
      upper.push(null);
      lower.push(null);
      sma.push(null);
    } else {
      const slice = BB_PRICES.slice(i - period + 1, i + 1);
      const mean = slice.reduce((s, v) => s + v, 0) / period;
      const variance = slice.reduce((s, v) => s + (v - mean) ** 2, 0) / period;
      const std = Math.sqrt(variance);
      upper.push(mean + stdDev * std);
      lower.push(mean - stdDev * std);
      sma.push(mean);
    }
  }
  return { upper, lower, sma };
}

function findSignals(upper, lower) {
  const upperTouches = [];
  const lowerTouches = [];
  for (let i = 0; i < N; i++) {
    if (upper[i] === null) continue;
    if (BB_PRICES[i] >= upper[i]) upperTouches.push(i);
    if (BB_PRICES[i] <= lower[i]) lowerTouches.push(i);
  }
  return { upperTouches, lowerTouches };
}

function BandLine({ values, color, lineWidth, dashed }) {
  const pts = useMemo(() => {
    const valid = [];
    for (let i = 0; i < values.length; i++) {
      if (values[i] !== null) valid.push([toX(i), toY(values[i]), 0]);
    }
    return valid;
  }, [values]);
  if (pts.length < 2) return null;
  if (dashed) return <Line points={pts} color={color} lineWidth={lineWidth} dashed dashSize={0.2} gapSize={0.12} />;
  return <Line points={pts} color={color} lineWidth={lineWidth} />;
}

function GridLines() {
  const ys = [-2, -1, 0, 1, 2];
  return (
    <>
      {ys.map((y) => (
        <Line key={y} points={[[-4.5, y, 0], [4.5, y, 0]]} color="#1e293b" lineWidth={0.5} />
      ))}
    </>
  );
}

function SceneContent({ period, stdDev, reducedMotion }) {
  const { progress } = useScrollProgress();
  const visibleCount = Math.max(2, Math.floor(progress * N));

  const { upper, lower, sma } = useMemo(() => computeBands(period, stdDev), [period, stdDev]);

  const { upperTouches, lowerTouches } = useMemo(() => findSignals(upper, lower), [upper, lower]);

  const pricePoints = useMemo(
    () => BB_PRICES.slice(0, visibleCount).map((p, i) => [toX(i), toY(p), 0]),
    [visibleCount]
  );

  const upperSlice = upper.slice(0, visibleCount);
  const lowerSlice = lower.slice(0, visibleCount);
  const smaSlice = sma.slice(0, visibleCount);

  return (
    <>
      <color attach="background" args={['#0a0a0f']} />
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={2} color="#22d3ee" />
      <pointLight position={[-5, -3, -3]} intensity={1} color="#a78bfa" />

      <GridLines />

      {/* SMA middle band (violet, subtle) */}
      <BandLine values={smaSlice} color="#a78bfa" lineWidth={1} />

      {/* Upper and lower Bollinger bands (amber) */}
      <BandLine values={upperSlice} color="#f59e0b" lineWidth={1.8} />
      <BandLine values={lowerSlice} color="#f59e0b" lineWidth={1.8} />

      {/* Price line (cyan) */}
      {pricePoints.length >= 2 && (
        <Line points={pricePoints} color="#22d3ee" lineWidth={2} />
      )}

      {/* Upper band touches: red spheres */}
      {upperTouches.filter((i) => i < visibleCount).map((i) => (
        <mesh key={`u${i}`} position={[toX(i), toY(BB_PRICES[i]), 0]}>
          <sphereGeometry args={[0.13, 16, 16]} />
          <meshStandardMaterial color="#f43f5e" emissive="#f43f5e" emissiveIntensity={0.9} />
        </mesh>
      ))}

      {/* Lower band touches: green spheres */}
      {lowerTouches.filter((i) => i < visibleCount).map((i) => (
        <mesh key={`l${i}`} position={[toX(i), toY(BB_PRICES[i]), 0]}>
          <sphereGeometry args={[0.13, 16, 16]} />
          <meshStandardMaterial color="#34d399" emissive="#34d399" emissiveIntensity={0.9} />
        </mesh>
      ))}

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI * 0.75}
        minPolarAngle={Math.PI * 0.25}
        maxAzimuthAngle={Math.PI * 0.2}
        minAzimuthAngle={-Math.PI * 0.2}
      />
    </>
  );
}

export default function Scene({ period = 20, stdDev = 2.0 }) {
  const reducedMotion = useReducedMotion();
  return (
    <Canvas
      aria-hidden="true"
      camera={{ position: [0, 0, 8], fov: 50 }}
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 2]}
    >
      <SceneContent period={period} stdDev={stdDev} reducedMotion={reducedMotion} />
    </Canvas>
  );
}

import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useScrollProgress } from '../../../lib/ScrollContext.jsx';
import { useReducedMotion } from '../../../three/hooks/useReducedMotion.js';

const N = 60;
const EQUITY = Array.from({ length: N }, (_, i) => {
  const trend = 1 + i * 0.012;
  const dd1 = i >= 15 && i <= 25 ? -0.12 * Math.sin((i - 15) * Math.PI / 10) : 0;
  const dd2 = i >= 38 && i <= 50 ? -0.18 * Math.sin((i - 38) * Math.PI / 12) : 0;
  const noise = 0.02 * Math.sin(i * 1.4 + 0.3);
  return trend + dd1 + dd2 + noise;
});

const DRAWDOWN = EQUITY.map((v, i) => {
  const peak = Math.max(...EQUITY.slice(0, i + 1));
  return (v - peak) / peak;
});

const EQ_MIN = Math.min(...EQUITY);
const EQ_MAX = Math.max(...EQUITY);
const EQ_RANGE = EQ_MAX - EQ_MIN;

const X_STEP = 8 / (N - 1);
const X_OFFSET = -4;

function toX(i) { return X_OFFSET + i * X_STEP; }
function toY(v) { return ((v - EQ_MIN) / EQ_RANGE) * 3.2 - 0.4; }

const BAR_WIDTH = X_STEP * 0.85;

function DrawdownBars({ visibleCount }) {
  return (
    <>
      {EQUITY.slice(0, visibleCount).map((v, i) => {
        const dd = DRAWDOWN[i];
        if (dd >= -0.005) return null;
        const height = Math.abs(dd) * 3.2;
        const x = toX(i);
        const topY = toY(v);
        return (
          <mesh key={i} position={[x, topY - height / 2, 0]}>
            <boxGeometry args={[BAR_WIDTH, height, 0.08]} />
            <meshStandardMaterial
              color="#f43f5e"
              emissive="#f43f5e"
              emissiveIntensity={0.4}
              transparent
              opacity={0.7}
            />
          </mesh>
        );
      })}
    </>
  );
}

function GridLines() {
  const ys = [-0.4, 0.4, 1.2, 2.0, 2.8];
  return (
    <>
      {ys.map((y) => (
        <Line key={y} points={[[-4.5, y, 0], [4.5, y, 0]]} color="#1e293b" lineWidth={0.5} />
      ))}
    </>
  );
}

function SceneContent({ reducedMotion }) {
  const { progress } = useScrollProgress();
  const visibleCount = Math.max(2, Math.floor(progress * N));

  const equityPoints = useMemo(
    () => EQUITY.slice(0, visibleCount).map((v, i) => [toX(i), toY(v), 0]),
    [visibleCount]
  );

  // Start line at initial equity value
  const startY = toY(EQUITY[0]);
  const startLinePts = [[-4, startY, 0], [4, startY, 0]];

  return (
    <>
      <color attach="background" args={['#0a0a0f']} />
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={2} color="#22d3ee" />
      <pointLight position={[-5, -3, -3]} intensity={1} color="#a78bfa" />

      <GridLines />

      {/* Portfolio start baseline (dashed white) */}
      <Line points={startLinePts} color="#94a3b8" lineWidth={1} dashed dashSize={0.2} gapSize={0.12} />

      {/* Drawdown bars (red, filled area below equity) */}
      <DrawdownBars visibleCount={visibleCount} />

      {/* Equity curve (cyan) */}
      {equityPoints.length >= 2 && (
        <Line points={equityPoints} color="#22d3ee" lineWidth={2.5} />
      )}

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

export default function Scene() {
  const reducedMotion = useReducedMotion();
  return (
    <Canvas
      aria-hidden="true"
      camera={{ position: [0, 1, 8], fov: 50 }}
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 2]}
    >
      <SceneContent reducedMotion={reducedMotion} />
    </Canvas>
  );
}

import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useScrollProgress } from '../../../lib/ScrollContext.jsx';
import { useReducedMotion } from '../../../three/hooks/useReducedMotion.js';

const STRATEGIES = Array.from({ length: 25 }, (_, i) => {
  const vol = 0.05 + (i % 5) * 0.04 + Math.floor(i / 5) * 0.01;
  const ret = 0.02 + Math.sin(i * 0.7) * 0.08 + Math.cos(i * 0.4) * 0.04;
  const sharpe = ret / vol;
  return { vol, ret, sharpe };
});

const SHARPE_VALUES = STRATEGIES.map((s) => s.sharpe);
const SHARPE_MIN = Math.min(...SHARPE_VALUES);
const SHARPE_MAX = Math.max(...SHARPE_VALUES);
const BEST_IDX = SHARPE_VALUES.indexOf(SHARPE_MAX);

function toPos(s) {
  return [s.vol * 20 - 3, s.ret * 20 - 1, s.sharpe * 0.5];
}

// Map a 0..1 value to a hex color from red → amber → green
function ratioToColor(t) {
  if (t < 0.5) {
    // red (#f43f5e) → amber (#f59e0b)
    const u = t * 2;
    const r = Math.round(0xf4 + (0xf5 - 0xf4) * u);
    const g = Math.round(0x3f + (0x9e - 0x3f) * u);
    const b = Math.round(0x5e + (0x0b - 0x5e) * u);
    return new THREE.Color(r / 255, g / 255, b / 255);
  }
  // amber (#f59e0b) → green (#34d399)
  const u = (t - 0.5) * 2;
  const r = Math.round(0xf5 + (0x34 - 0xf5) * u);
  const g = Math.round(0x9e + (0xd3 - 0x9e) * u);
  const b = Math.round(0x0b + (0x99 - 0x0b) * u);
  return new THREE.Color(r / 255, g / 255, b / 255);
}

function getMetricValue(s, metric) {
  if (metric === 'sortino') return s.sharpe * 1.2;
  if (metric === 'calmar') return s.sharpe * 0.75;
  return s.sharpe;
}

function StrategyPoint({ s, idx, metric, progress }) {
  const isBest = idx === BEST_IDX;
  const metricVal = getMetricValue(s, metric);
  const metricMin = metric === 'sortino' ? SHARPE_MIN * 1.2 : metric === 'calmar' ? SHARPE_MIN * 0.75 : SHARPE_MIN;
  const metricMax = metric === 'sortino' ? SHARPE_MAX * 1.2 : metric === 'calmar' ? SHARPE_MAX * 0.75 : SHARPE_MAX;
  const t = (metricVal - metricMin) / (metricMax - metricMin);
  const col = isBest ? new THREE.Color('#22d3ee') : ratioToColor(t);
  const pos = toPos(s);

  return (
    <mesh position={pos}>
      <sphereGeometry args={isBest ? [0.18, 20, 20] : [0.12, 16, 16]} />
      <meshStandardMaterial
        color={col}
        emissive={col}
        emissiveIntensity={isBest ? 1.2 * progress : 0.5 * progress}
        roughness={0.3}
        metalness={0.3}
      />
    </mesh>
  );
}

function CapitalMarketLine() {
  const best = STRATEGIES[BEST_IDX];
  const origin = [-3, -1, 0];
  const end = toPos(best);
  const pts = [origin, end];
  return <Line points={pts} color="#22d3ee" lineWidth={1.5} dashed dashSize={0.2} gapSize={0.12} />;
}

function AxisLines() {
  return (
    <>
      {/* x-axis (vol) */}
      <Line points={[[-3.5, -1, 0], [3.5, -1, 0]]} color="#334155" lineWidth={0.8} />
      {/* y-axis (return) */}
      <Line points={[[-3, -1.5, 0], [-3, 2.5, 0]]} color="#334155" lineWidth={0.8} />
    </>
  );
}

function SceneContent({ metric, reducedMotion }) {
  const { progress } = useScrollProgress();
  const visibleCount = Math.floor(progress * STRATEGIES.length);

  return (
    <>
      <color attach="background" args={['#0a0a0f']} />
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={2} color="#22d3ee" />
      <pointLight position={[-5, -3, -3]} intensity={1} color="#a78bfa" />

      <AxisLines />
      <CapitalMarketLine />

      {STRATEGIES.slice(0, visibleCount).map((s, idx) => (
        <StrategyPoint key={idx} s={s} idx={idx} metric={metric} progress={progress} />
      ))}

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI * 0.75}
        minPolarAngle={Math.PI * 0.25}
      />
    </>
  );
}

export default function Scene({ metric = 'sharpe' }) {
  const reducedMotion = useReducedMotion();
  return (
    <Canvas
      aria-hidden="true"
      camera={{ position: [2, 1, 8], fov: 50 }}
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 2]}
    >
      <SceneContent metric={metric} reducedMotion={reducedMotion} />
    </Canvas>
  );
}

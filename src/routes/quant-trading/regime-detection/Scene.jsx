import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useScrollProgress } from '../../../lib/ScrollContext.jsx';
import { useReducedMotion } from '../../../three/hooks/useReducedMotion.js';

const REGIME_DATA = Array.from({ length: 80 }, (_, i) => {
  let regime, price;
  if (i < 25) {
    regime = 0; price = 1 + i * 0.04 + 0.1 * Math.sin(i * 0.8);
  } else if (i < 45) {
    regime = 1; price = 2.0 - (i - 25) * 0.05 + 0.08 * Math.sin(i * 1.2);
  } else if (i < 65) {
    regime = 2; price = 1.0 + 0.15 * Math.sin(i * 0.6 + 1.5) + 0.08 * Math.sin(i * 1.8);
  } else {
    regime = 0; price = 1.0 + (i - 65) * 0.05 + 0.1 * Math.sin(i * 0.7);
  }
  return { regime, price };
});

const REGIME_COLORS = ['#34d399', '#f43f5e', '#f59e0b'];
const REGIME_NAMES  = ['Bull', 'Bear', 'Ranging'];

const PRICE_MIN = Math.min(...REGIME_DATA.map((d) => d.price));
const PRICE_MAX = Math.max(...REGIME_DATA.map((d) => d.price));
const N = REGIME_DATA.length;
const X_STEP = 7 / (N - 1);
const X_OFF = -3.5;

function toX(i) { return X_OFF + i * X_STEP; }
function toY(p) { return ((p - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 2.4 - 2.0; }

// Group consecutive same-regime indices into segments
function buildSegments(visibleCount) {
  const segments = [];
  let start = 0;
  while (start < visibleCount) {
    const regime = REGIME_DATA[start].regime;
    let end = start + 1;
    while (end < visibleCount && REGIME_DATA[end].regime === regime) end++;
    // Include one extra overlapping point for seamless lines
    const sliceTo = Math.min(end, visibleCount);
    const pts = [];
    for (let k = start; k < sliceTo; k++) {
      pts.push([toX(k), toY(REGIME_DATA[k].price), 0]);
    }
    // Bridge to next segment
    if (end < visibleCount) pts.push([toX(end), toY(REGIME_DATA[end].price), 0]);
    if (pts.length >= 2) segments.push({ regime, pts });
    start = end;
  }
  return segments;
}

// HMM node positions vary slightly by model
const HMM_CONFIGS = {
  hmm:        { positions: [[0, 2.0, 0], [-1.5, -0.5, 0], [1.5, -0.5, 0]] },
  volatility: { positions: [[0, 1.8, 0.3], [-1.4, -0.6, -0.2], [1.4, -0.4, 0.1]] },
  trend:      { positions: [[0, 2.1, 0], [-1.6, -0.3, 0], [1.6, -0.7, 0]] },
};

function buildCurvedArrow(from, to) {
  const mid = [
    (from[0] + to[0]) / 2 + (to[1] - from[1]) * 0.3,
    (from[1] + to[1]) / 2 + (from[0] - to[0]) * 0.3,
    0,
  ];
  return [from, mid, to];
}

function HMMDiagram({ model, opacity }) {
  const config = HMM_CONFIGS[model] ?? HMM_CONFIGS.hmm;
  const { positions } = config;

  const arrows = useMemo(() => {
    const pairs = [[0, 1], [1, 0], [1, 2], [2, 1], [2, 0], [0, 2]];
    return pairs.map(([a, b]) => buildCurvedArrow(positions[a], positions[b]));
  }, [positions]);

  return (
    <group position={[2.5, 0.4, 0]}>
      {/* Transition arrows */}
      {arrows.map((pts, idx) => (
        <Line key={idx} points={pts} color="#94a3b8" lineWidth={0.8} transparent opacity={opacity * 0.6} />
      ))}
      {/* State nodes */}
      {positions.map((pos, idx) => (
        <mesh key={idx} position={pos}>
          <sphereGeometry args={[0.32, 24, 24]} />
          <meshStandardMaterial
            color={REGIME_COLORS[idx]}
            emissive={REGIME_COLORS[idx]}
            emissiveIntensity={0.5 * opacity}
            transparent
            opacity={opacity}
          />
        </mesh>
      ))}
    </group>
  );
}

function SceneContent({ model, reducedMotion }) {
  const { progress } = useScrollProgress();
  const visibleCount = Math.max(2, Math.floor(progress * N));
  const hmmOpacity = Math.max(0, (progress - 0.6) / 0.4);

  const segments = useMemo(() => buildSegments(visibleCount), [visibleCount]);

  return (
    <>
      <color attach="background" args={['#0a0a0f']} />
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={2} color="#22d3ee" />
      <pointLight position={[-5, -3, -3]} intensity={1} color="#a78bfa" />

      {/* Baseline grid */}
      {[-2, -1, 0, 1].map((y) => (
        <Line key={y} points={[[-4, y, 0], [4.5, y, 0]]} color="#1e293b" lineWidth={0.5} />
      ))}

      {/* Price line coloured by regime */}
      {segments.map((seg, idx) => (
        <Line key={idx} points={seg.pts} color={REGIME_COLORS[seg.regime]} lineWidth={2.2} />
      ))}

      {/* HMM diagram fades in after 60% scroll */}
      {hmmOpacity > 0 && <HMMDiagram model={model} opacity={hmmOpacity} />}

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI * 0.75}
        minPolarAngle={Math.PI * 0.25}
        maxAzimuthAngle={Math.PI * 0.25}
        minAzimuthAngle={-Math.PI * 0.25}
      />
    </>
  );
}

export default function Scene({ model = 'hmm' }) {
  const reducedMotion = useReducedMotion();
  return (
    <Canvas
      aria-hidden="true"
      camera={{ position: [0, 0, 8], fov: 50 }}
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 2]}
    >
      <SceneContent model={model} reducedMotion={reducedMotion} />
    </Canvas>
  );
}

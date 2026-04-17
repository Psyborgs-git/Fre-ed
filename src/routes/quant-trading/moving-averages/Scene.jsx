import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useScrollProgress } from '../../../lib/ScrollContext.jsx';
import { useReducedMotion } from '../../../three/hooks/useReducedMotion.js';

// 40 deterministic price points using cosine formula
const PRICES = Array.from({ length: 40 }, (_, i) => {
  const trend = 100 + i * 0.5;
  const cycle = 8 * Math.cos(i * 0.4);
  const micro  = 3 * Math.cos(i * 1.3 + 1);
  return trend + cycle + micro;
});

const PRICE_MIN = Math.min(...PRICES);
const PRICE_MAX = Math.max(...PRICES);
const PRICE_RANGE = PRICE_MAX - PRICE_MIN;

function normY(p) {
  return ((p - PRICE_MIN) / PRICE_RANGE) * 3.5 - 1.75;
}

const X_STEP = 0.27;
const X_OFFSET = -((PRICES.length - 1) * X_STEP) / 2;

function priceToX(i) {
  return X_OFFSET + i * X_STEP;
}

function computeSMA(prices, period) {
  return prices.map((_, i) => {
    if (i < period - 1) return null;
    const slice = prices.slice(i - period + 1, i + 1);
    return slice.reduce((s, v) => s + v, 0) / period;
  });
}

function computeEMA(prices, period) {
  const k = 2 / (period + 1);
  const result = new Array(prices.length).fill(null);
  // seed with first SMA
  if (prices.length < period) return result;
  let sma = 0;
  for (let i = 0; i < period; i++) sma += prices[i];
  sma /= period;
  result[period - 1] = sma;
  for (let i = period; i < prices.length; i++) {
    result[i] = prices[i] * k + result[i - 1] * (1 - k);
  }
  return result;
}

function findCrossovers(sma, ema) {
  const crosses = [];
  for (let i = 1; i < sma.length; i++) {
    if (sma[i] === null || ema[i] === null || sma[i - 1] === null || ema[i - 1] === null) continue;
    const prevDiff = sma[i - 1] - ema[i - 1];
    const currDiff = sma[i] - ema[i];
    if (prevDiff * currDiff < 0) {
      crosses.push({ i, bullish: currDiff < 0 });
    }
  }
  return crosses;
}

function PriceLine({ progress }) {
  const pts = useMemo(
    () => PRICES.map((p, i) => [priceToX(i), normY(p), 0]),
    []
  );
  return <Line points={pts} color="#f59e0b" lineWidth={1.5} />;
}

function MALine({ values, color, lineWidth }) {
  const pts = useMemo(() => {
    const valid = [];
    for (let i = 0; i < values.length; i++) {
      if (values[i] !== null) valid.push([priceToX(i), normY(values[i]), 0]);
    }
    return valid;
  }, [values]);

  if (pts.length < 2) return null;
  return <Line points={pts} color={color} lineWidth={lineWidth} />;
}

function CrossoverSpheres({ crosses, smaValues, progress }) {
  return (
    <>
      {crosses.map(({ i, bullish }) => {
        const val = smaValues[i];
        if (val === null) return null;
        return (
          <mesh key={i} position={[priceToX(i), normY(val), 0]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial
              color={bullish ? '#34d399' : '#f43f5e'}
              emissive={bullish ? '#34d399' : '#f43f5e'}
              emissiveIntensity={0.8 * progress}
            />
          </mesh>
        );
      })}
    </>
  );
}

// Grid lines
function GridLines() {
  const ys = [-1.75, -0.875, 0, 0.875, 1.75];
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

function SceneContent({ period, reducedMotion }) {
  const { progress } = useScrollProgress();

  const sma = useMemo(() => computeSMA(PRICES, period), [period]);
  const ema = useMemo(() => computeEMA(PRICES, period), [period]);
  const crosses = useMemo(() => findCrossovers(sma, ema), [sma, ema]);

  return (
    <>
      <color attach="background" args={['#0a0a0f']} />
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 4, 4]} intensity={2} color="#22d3ee" />

      <GridLines />
      <PriceLine progress={progress} />
      <MALine values={sma} color="#22d3ee" lineWidth={2} />
      <MALine values={ema} color="#a78bfa" lineWidth={2} />
      <CrossoverSpheres crosses={crosses} smaValues={sma} progress={progress} />

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

export default function Scene({ period = 10 }) {
  const reducedMotion = useReducedMotion();
  return (
    <Canvas
      aria-hidden="true"
      camera={{ position: [0, 0, 7], fov: 50 }}
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 2]}
    >
      <SceneContent period={period} reducedMotion={reducedMotion} />
    </Canvas>
  );
}

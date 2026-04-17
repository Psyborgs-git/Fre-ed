import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useScrollProgress } from '../../../lib/ScrollContext.jsx';
import { useReducedMotion } from '../../../three/hooks/useReducedMotion.js';

const N = 50;
const PRICES = Array.from({ length: N }, (_, i) => {
  return 1.5 * Math.sin(i * 0.35) + 0.7 * Math.sin(i * 0.8 + 1.2) + 0.3 * Math.sin(i * 1.6 + 0.5);
});
const MEAN = 0;
const STD = 1.0;

const X_STEP = 8 / (N - 1);
const X_OFFSET = -4;

function toX(i) { return X_OFFSET + i * X_STEP; }
function toY(p) { return p * 1.3; }

function findSignals(zThreshold) {
  const entries = [];
  const exits = [];
  let inTrade = false;
  for (let i = 1; i < N; i++) {
    const z = PRICES[i] / STD;
    const zPrev = PRICES[i - 1] / STD;
    if (!inTrade && zPrev >= -zThreshold && z < -zThreshold) {
      entries.push(i);
      inTrade = true;
    }
    if (inTrade && PRICES[i - 1] < 0 && PRICES[i] >= 0) {
      exits.push(i);
      inTrade = false;
    }
  }
  return { entries, exits };
}

function GridLines() {
  const ys = [-2.6, -1.3, 0, 1.3, 2.6];
  return (
    <>
      {ys.map((y) => (
        <Line key={y} points={[[-4.5, y, 0], [4.5, y, 0]]} color="#1e293b" lineWidth={0.5} />
      ))}
    </>
  );
}

function SceneContent({ zThreshold, reducedMotion }) {
  const { progress } = useScrollProgress();
  const visibleCount = Math.max(2, Math.floor(progress * N));

  const pricePoints = useMemo(
    () => PRICES.slice(0, visibleCount).map((p, i) => [toX(i), toY(p), 0]),
    [visibleCount]
  );

  const { entries, exits } = useMemo(() => findSignals(zThreshold), [zThreshold]);

  const yBand = toY(zThreshold * STD);
  const meanPts = [[-4, toY(MEAN), 0], [4, toY(MEAN), 0]];
  const upperPts = [[-4, yBand, 0], [4, yBand, 0]];
  const lowerPts = [[-4, -yBand, 0], [4, -yBand, 0]];

  return (
    <>
      <color attach="background" args={['#0a0a0f']} />
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={2} color="#22d3ee" />
      <pointLight position={[-5, -3, -3]} intensity={1} color="#a78bfa" />

      <GridLines />

      {/* Mean line (cyan) */}
      <Line points={meanPts} color="#22d3ee" lineWidth={2} />

      {/* Z-threshold bands (amber dashed) */}
      <Line points={upperPts} color="#f59e0b" lineWidth={1.5} dashed dashSize={0.2} gapSize={0.12} />
      <Line points={lowerPts} color="#f59e0b" lineWidth={1.5} dashed dashSize={0.2} gapSize={0.12} />

      {/* Price line (violet) */}
      {pricePoints.length >= 2 && (
        <Line points={pricePoints} color="#a78bfa" lineWidth={2} />
      )}

      {/* Entry spheres: green — price crosses below lower band */}
      {entries.filter((i) => i < visibleCount).map((i) => (
        <mesh key={`entry-${i}`} position={[toX(i), toY(PRICES[i]), 0]}>
          <sphereGeometry args={[0.13, 16, 16]} />
          <meshStandardMaterial color="#34d399" emissive="#34d399" emissiveIntensity={0.9} />
        </mesh>
      ))}

      {/* Exit spheres: red — price crosses back through mean */}
      {exits.filter((i) => i < visibleCount).map((i) => (
        <mesh key={`exit-${i}`} position={[toX(i), toY(PRICES[i]), 0]}>
          <sphereGeometry args={[0.13, 16, 16]} />
          <meshStandardMaterial color="#f43f5e" emissive="#f43f5e" emissiveIntensity={0.9} />
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

export default function Scene({ zThreshold = 2.0 }) {
  const reducedMotion = useReducedMotion();
  return (
    <Canvas
      aria-hidden="true"
      camera={{ position: [0, 0, 8], fov: 50 }}
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 2]}
    >
      <SceneContent zThreshold={zThreshold} reducedMotion={reducedMotion} />
    </Canvas>
  );
}

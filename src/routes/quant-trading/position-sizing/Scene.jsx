import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useScrollProgress } from '../../../lib/ScrollContext.jsx';
import { useReducedMotion } from '../../../three/hooks/useReducedMotion.js';

// Bar colors by conviction rank (green → amber → red)
const BAR_COLORS = ['#34d399', '#6ee7b7', '#f59e0b', '#fb923c', '#f43f5e'];
const BAR_LABELS = ['High', 'Med-Hi', 'Medium', 'Med-Lo', 'Low'];

function computeKellyFraction(winRate, riskPct) {
  // Simplified Kelly: f* = W - (1-W)/R where R = reward/risk ratio
  // Use riskPct to derive a reward/risk ratio (assume 1.5× reward on each % risk)
  const R = 1.5;
  const kelly = winRate - (1 - winRate) / R;
  return Math.max(0, kelly);
}

function getBarHeights(riskPct, winRate) {
  const kelly = computeKellyFraction(winRate, riskPct);
  // Five conviction tiers: fractional Kelly scaled by riskPct
  const scale = riskPct * kelly * 4;
  return [
    scale * 1.0,   // highest conviction
    scale * 0.75,
    scale * 0.55,
    scale * 0.35,
    scale * 0.18,  // lowest conviction
  ].map((h) => Math.max(h, 0.05));
}

function Bar({ x, height, color, progress, reducedMotion }) {
  const meshRef = useRef();
  const heightRef = useRef(height);
  heightRef.current = height;

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const pulse = reducedMotion ? 1 : 1 + Math.sin(t * 1.5 + x) * 0.015;
    meshRef.current.scale.y = pulse;
    if (meshRef.current.material) {
      meshRef.current.material.emissiveIntensity = 0.2 + progress * 0.4;
    }
  });

  const displayH = Math.min(height, 3.5);

  return (
    <mesh ref={meshRef} position={[x, displayH / 2, 0]}>
      <boxGeometry args={[0.55, displayH, 0.3]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.2}
        roughness={0.3}
        metalness={0.4}
      />
    </mesh>
  );
}

function MaxRiskLine({ riskPct }) {
  const y = Math.min(riskPct * 0.5, 3.5);
  const pts = useMemo(() => [[-2.2, y, 0], [2.2, y, 0]], [y]);
  return (
    <Line points={pts} color="#f43f5e" lineWidth={1.5} dashed dashSize={0.15} gapSize={0.1} />
  );
}

function GridLines() {
  const ys = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5];
  return (
    <>
      {ys.map((y) => (
        <Line
          key={y}
          points={[[-2.5, y, 0], [2.5, y, 0]]}
          color="#1e293b"
          lineWidth={0.5}
        />
      ))}
      {/* Floor */}
      <Line
        points={[[-2.5, 0, 0], [2.5, 0, 0]]}
        color="#334155"
        lineWidth={1}
      />
    </>
  );
}

const BAR_XS = [-1.6, -0.8, 0, 0.8, 1.6];

function SceneContent({ riskPct, winRate, reducedMotion }) {
  const { progress } = useScrollProgress();

  const heights = useMemo(() => getBarHeights(riskPct, winRate), [riskPct, winRate]);

  return (
    <>
      <color attach="background" args={['#0a0a0f']} />
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 5, 5]} intensity={2} color="#34d399" />
      <pointLight position={[3, 3, 3]} intensity={1} color="#f59e0b" />

      <GridLines />

      {BAR_XS.map((x, i) => (
        <Bar
          key={i}
          x={x}
          height={heights[i]}
          color={BAR_COLORS[i]}
          progress={progress}
          reducedMotion={reducedMotion}
        />
      ))}

      <MaxRiskLine riskPct={riskPct} />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI * 0.7}
        minPolarAngle={Math.PI * 0.2}
        maxAzimuthAngle={Math.PI * 0.3}
        minAzimuthAngle={-Math.PI * 0.3}
      />
    </>
  );
}

export default function Scene({ riskPct = 1.0, winRate = 0.55 }) {
  const reducedMotion = useReducedMotion();
  return (
    <Canvas
      aria-hidden="true"
      camera={{ position: [0, 2, 7], fov: 45 }}
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 2]}
    >
      <SceneContent riskPct={riskPct} winRate={winRate} reducedMotion={reducedMotion} />
    </Canvas>
  );
}

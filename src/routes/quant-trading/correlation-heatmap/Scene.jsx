import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useScrollProgress } from '../../../lib/ScrollContext.jsx';
import { useReducedMotion } from '../../../three/hooks/useReducedMotion.js';

const CORR_MATRICES = {
  equities: [
    [1.00, 0.82, 0.75, 0.68, 0.55],
    [0.82, 1.00, 0.71, 0.64, 0.48],
    [0.75, 0.71, 1.00, 0.58, 0.41],
    [0.68, 0.64, 0.58, 1.00, 0.35],
    [0.55, 0.48, 0.41, 0.35, 1.00],
  ],
  'multi-asset': [
    [1.00,  0.45, -0.22,  0.31,  0.18],
    [0.45,  1.00, -0.15,  0.28,  0.22],
    [-0.22, -0.15, 1.00, -0.38, -0.12],
    [0.31,  0.28, -0.38,  1.00,  0.42],
    [0.18,  0.22, -0.12,  0.42,  1.00],
  ],
  crypto: [
    [1.00, 0.88, 0.79, 0.72, 0.65],
    [0.88, 1.00, 0.84, 0.76, 0.69],
    [0.79, 0.84, 1.00, 0.81, 0.73],
    [0.72, 0.76, 0.81, 1.00, 0.78],
    [0.65, 0.69, 0.73, 0.78, 1.00],
  ],
};

function corrToColor(v) {
  if (v >= 0) {
    const r = 1 - v;
    const g = v * 0.85 + 0.15;
    const b = 0.15;
    return new THREE.Color(r, g, b);
  }
  const t = -v; // 0..1 negative side
  const r = t * 0.96 + (1 - t);
  const g = (1 - t) * 0.15;
  const b = (1 - t) * 0.15;
  return new THREE.Color(r, g, b);
}

function HeatmapCell({ row, col, value, progress }) {
  const animatedValue = value * progress;
  const color = useMemo(() => corrToColor(animatedValue), [animatedValue]);
  const position = [(col - 2) * 1.0, (2 - row) * 1.0, 0];
  return (
    <mesh position={position}>
      <boxGeometry args={[0.85, 0.85, 0.15]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
    </mesh>
  );
}

function SceneContent({ assets, reducedMotion }) {
  const { progress } = useScrollProgress();
  const matrix = CORR_MATRICES[assets] ?? CORR_MATRICES.equities;

  const cells = useMemo(() => {
    const result = [];
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        result.push({ row, col, value: matrix[row][col] });
      }
    }
    return result;
  }, [matrix]);

  return (
    <>
      <color attach="background" args={['#0a0a0f']} />
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={2} color="#22d3ee" />
      <pointLight position={[-5, -3, -3]} intensity={1} color="#a78bfa" />

      {cells.map(({ row, col, value }) => (
        <HeatmapCell key={`${row}-${col}`} row={row} col={col} value={value} progress={progress} />
      ))}

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI * 0.75}
        minPolarAngle={Math.PI * 0.25}
        maxAzimuthAngle={Math.PI * 0.35}
        minAzimuthAngle={-Math.PI * 0.35}
      />
    </>
  );
}

export default function Scene({ assets = 'equities' }) {
  const reducedMotion = useReducedMotion();
  return (
    <Canvas
      aria-hidden="true"
      camera={{ position: [1.5, 1.2, 7], fov: 50 }}
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 2]}
    >
      <SceneContent assets={assets} reducedMotion={reducedMotion} />
    </Canvas>
  );
}

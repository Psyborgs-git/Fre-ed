import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useScrollProgress } from '../../../lib/ScrollContext.jsx';
import { useReducedMotion } from '../../../three/hooks/useReducedMotion.js';

function generatePortfolios(numAssets) {
  return Array.from({ length: 50 }, (_, i) => {
    const theta  = (i / 50) * Math.PI * 1.5;
    const spread = 0.3 + numAssets * 0.05;
    const vol    = 0.08 + 0.12 * Math.abs(Math.cos(theta)) + spread * 0.02 * ((i % 7) / 6);
    const ret    = 0.05 + 0.15 * Math.sin(theta * 0.8 + 0.3) + 0.03 * Math.sin(i * 0.4);
    const sharpe = ret / vol;
    return { vol, ret, sharpe };
  });
}

// Map vol/ret/sharpe to scene coordinates
const VOL_MIN = 0.05, VOL_MAX = 0.30;
const RET_MIN = -0.05, RET_MAX = 0.24;
const SHR_MIN = -0.5, SHR_MAX = 2.5;

function toScene(vol, ret, sharpe) {
  const x = ((vol    - VOL_MIN) / (VOL_MAX - VOL_MIN)) * 6 - 3;
  const y = ((ret    - RET_MIN) / (RET_MAX - RET_MIN)) * 4 - 2;
  const z = ((sharpe - SHR_MIN) / (SHR_MAX - SHR_MIN)) * 3 - 1.5;
  return [x, y, z];
}

function sharpeColor(sharpe) {
  const t = Math.max(0, Math.min(1, (sharpe - SHR_MIN) / (SHR_MAX - SHR_MIN)));
  if (t < 0.5) {
    const s = t * 2;
    return new THREE.Color(
      0.957 * (1 - s) + 0.133 * s,
      0.247 * (1 - s) + 0.827 * s,
      0.357 * (1 - s) + 0.933 * s,
    );
  }
  const s = (t - 0.5) * 2;
  return new THREE.Color(
    0.133 + (0.655 - 0.133) * s,
    0.827 * (1 - s) + 0.545 * s,
    0.933 * (1 - s) + 0.984 * s,
  );
}

// Find pareto-efficient portfolios (max return per vol bucket)
function efficientFrontier(portfolios) {
  const sorted = [...portfolios].sort((a, b) => a.vol - b.vol);
  const frontier = [];
  let maxRet = -Infinity;
  for (const p of sorted) {
    if (p.ret > maxRet) {
      maxRet = p.ret;
      frontier.push(p);
    }
  }
  return frontier;
}

function RotatingGroup({ reducedMotion, children }) {
  const groupRef = useRef();
  useFrame((_, delta) => {
    if (!reducedMotion && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });
  return <group ref={groupRef}>{children}</group>;
}

function SceneContent({ numAssets, reducedMotion }) {
  const { progress } = useScrollProgress();

  const portfolios = useMemo(() => generatePortfolios(numAssets), [numAssets]);
  const frontier   = useMemo(() => efficientFrontier(portfolios), [portfolios]);

  const minVar  = useMemo(() => portfolios.reduce((a, b) => (a.vol < b.vol ? a : b)), [portfolios]);
  const maxShr  = useMemo(() => portfolios.reduce((a, b) => (a.sharpe > b.sharpe ? a : b)), [portfolios]);

  const frontierPts = useMemo(
    () => frontier.map((p) => toScene(p.vol, p.ret, p.sharpe)),
    [frontier],
  );

  const visibleCount = Math.max(0, Math.floor(progress * portfolios.length));

  return (
    <>
      <color attach="background" args={['#0a0a0f']} />
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={2} color="#22d3ee" />
      <pointLight position={[-5, -3, -3]} intensity={1} color="#a78bfa" />
      <pointLight position={[0, 3, -4]} intensity={1} color="#f59e0b" />

      <RotatingGroup reducedMotion={reducedMotion}>
        {/* Portfolio scatter points */}
        {portfolios.slice(0, visibleCount).map((p, idx) => {
          const pos   = toScene(p.vol, p.ret, p.sharpe);
          const color = sharpeColor(p.sharpe);
          return (
            <mesh key={idx} position={pos}>
              <sphereGeometry args={[0.07, 10, 10]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} />
            </mesh>
          );
        })}

        {/* Efficient frontier curve — appears after 50% scroll */}
        {progress > 0.5 && frontierPts.length >= 2 && (
          <Line
            points={frontierPts}
            color="#22d3ee"
            lineWidth={2.5}
            transparent
            opacity={Math.min(1, (progress - 0.5) * 4)}
          />
        )}

        {/* Min-variance portfolio — glowing violet sphere */}
        {progress > 0.65 && (
          <mesh position={toScene(minVar.vol, minVar.ret, minVar.sharpe)}>
            <sphereGeometry args={[0.16, 20, 20]} />
            <meshStandardMaterial
              color="#a78bfa"
              emissive="#a78bfa"
              emissiveIntensity={1.2}
              transparent
              opacity={Math.min(1, (progress - 0.65) * 5)}
            />
          </mesh>
        )}

        {/* Max-Sharpe portfolio — glowing amber sphere */}
        {progress > 0.8 && (
          <mesh position={toScene(maxShr.vol, maxShr.ret, maxShr.sharpe)}>
            <sphereGeometry args={[0.16, 20, 20]} />
            <meshStandardMaterial
              color="#f59e0b"
              emissive="#f59e0b"
              emissiveIntensity={1.2}
              transparent
              opacity={Math.min(1, (progress - 0.8) * 6)}
            />
          </mesh>
        )}
      </RotatingGroup>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI * 0.8}
        minPolarAngle={Math.PI * 0.15}
      />
    </>
  );
}

export default function Scene({ numAssets = 5 }) {
  const reducedMotion = useReducedMotion();
  return (
    <Canvas
      aria-hidden="true"
      camera={{ position: [3, 2, 5], fov: 50 }}
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 2]}
    >
      <SceneContent numAssets={numAssets} reducedMotion={reducedMotion} />
    </Canvas>
  );
}

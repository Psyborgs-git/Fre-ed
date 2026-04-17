import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useScrollProgress } from '../../../lib/ScrollContext.jsx';
import { useReducedMotion } from '../../../three/hooks/useReducedMotion.js';

const GRID = 10; // 10×10 = 100 points
const STRIKES  = Array.from({ length: GRID }, (_, i) => 0.8 + (i / (GRID - 1)) * 0.4);  // 0.8–1.2
const EXPIRIES  = Array.from({ length: GRID }, (_, j) => 0.1 + (j / (GRID - 1)) * 1.9); // 0.1–2.0 yrs

function impliedVol(strike, expiry, shape) {
  const moneyness = Math.log(strike);
  const atmVol = 0.20 + 0.05 * Math.exp(-expiry);
  if (shape === 'flat') return atmVol;
  if (shape === 'smile') return atmVol + 0.15 * moneyness * moneyness;
  // skew
  return atmVol - 0.10 * moneyness + 0.08 * moneyness * moneyness;
}

// Pre-compute all surface points for each shape
function buildSurface(shape) {
  const pts = [];
  for (let j = 0; j < GRID; j++) {
    for (let i = 0; i < GRID; i++) {
      const x = (STRIKES[i] - 1.0) * 6;          // map 0.8–1.2 → −1.2 to +1.2 scaled
      const z = (EXPIRIES[j] - 1.05) * 2.5;      // map 0.1–2.0 → centred
      const vol = impliedVol(STRIKES[i], EXPIRIES[j], shape);
      pts.push({ x, z, vol, si: i, sj: j });
    }
  }
  return pts;
}

const SURFACES = {
  smile: buildSurface('smile'),
  skew:  buildSurface('skew'),
  flat:  buildSurface('flat'),
};

const VOL_MIN = 0.15;
const VOL_MAX = 0.42;

function volToColor(vol) {
  const t = Math.max(0, Math.min(1, (vol - VOL_MIN) / (VOL_MAX - VOL_MIN)));
  if (t < 0.5) {
    // purple → cyan
    const s = t * 2;
    return new THREE.Color(
      0.655 * (1 - s) + 0.133 * s,
      0.545 * (1 - s) + 0.827 * s,
      0.984 * (1 - s) + 0.933 * s,
    );
  }
  // cyan → amber
  const s = (t - 0.5) * 2;
  return new THREE.Color(
    0.133 + (0.961 - 0.133) * s,
    0.827 + (0.620 - 0.827) * s,
    0.933 * (1 - s) + 0.043 * s,
  );
}

function VolSpheres({ shape, progress }) {
  const pts = SURFACES[shape] ?? SURFACES.smile;
  return (
    <>
      {pts.map(({ x, z, vol, si, sj }) => {
        const y = (vol - 0.15) * 8 * progress;
        const color = volToColor(vol);
        return (
          <mesh key={`${si}-${sj}`} position={[x, y, z]}>
            <sphereGeometry args={[0.12, 10, 10]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.35} />
          </mesh>
        );
      })}
    </>
  );
}

function RotatingGroup({ reducedMotion, children }) {
  const groupRef = useRef();
  useFrame((_, delta) => {
    if (!reducedMotion && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });
  return <group ref={groupRef}>{children}</group>;
}

function SceneContent({ shape, reducedMotion }) {
  const { progress } = useScrollProgress();

  return (
    <>
      <color attach="background" args={['#0a0a0f']} />
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={2} color="#22d3ee" />
      <pointLight position={[-5, -3, -3]} intensity={1.5} color="#a78bfa" />
      <pointLight position={[0, -4, 2]} intensity={1} color="#f59e0b" />

      <RotatingGroup reducedMotion={reducedMotion}>
        <VolSpheres shape={shape} progress={progress} />
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

export default function Scene({ shape = 'smile' }) {
  const reducedMotion = useReducedMotion();
  return (
    <Canvas
      aria-hidden="true"
      camera={{ position: [3, 2.5, 5], fov: 50 }}
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 2]}
    >
      <SceneContent shape={shape} reducedMotion={reducedMotion} />
    </Canvas>
  );
}

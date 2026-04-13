import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
import { useScrollProgress } from '../../../lib/ScrollContext.jsx';
import { useReducedMotion } from '../../../three/hooks/useReducedMotion.js';

// ── Expert grid layout — 2 rows × 4 cols ─────────────────────────
const N_EXPERTS = 8;
const EXPERT_COLS = 4;
const TOP_K_SELECTIONS = {
  1: [1],
  2: [1, 5],
  4: [1, 2, 5, 6],
};

function expertPos(i) {
  const col = i % EXPERT_COLS;
  const row = Math.floor(i / EXPERT_COLS);
  return [
    1.2 + col * 1.1,
    (row - 0.5) * 1.4,
    0,
  ];
}

// ── Input token ───────────────────────────────────────────────────

function InputToken({ progress, reducedMotion }) {
  const ref = useRef();
  const progressRef = useRef(progress);
  progressRef.current = progress;

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const p = progressRef.current;
    ref.current.material.emissiveIntensity = 0.2 + (reducedMotion ? 0 : Math.sin(clock.getElapsedTime() * 2) * 0.1) * Math.min(p * 3, 1);
  });
  return (
    <mesh ref={ref} position={[-3.5, 0, 0]}>
      <sphereGeometry args={[0.3, 24, 24]} />
      <meshStandardMaterial
        color="#a78bfa"
        emissive="#a78bfa"
        emissiveIntensity={0.2}
        roughness={0.3}
        metalness={0.5}
      />
    </mesh>
  );
}

// ── Router (octahedron) ───────────────────────────────────────────

function Router({ progress, reducedMotion }) {
  const ref = useRef();
  const progressRef = useRef(progress);
  progressRef.current = progress;
  const t = Math.max(0, (progress - 0.15) / 0.3);

  useFrame(() => {
    if (!ref.current) return;
    if (!reducedMotion) ref.current.rotation.y += 0.01;
    ref.current.material.emissiveIntensity = progressRef.current > 0.15
      ? Math.max(0, (progressRef.current - 0.15) / 0.3) * 0.5
      : 0;
  });

  return (
    <mesh ref={ref} position={[-1.2, 0, 0]} scale={t > 0.01 ? 1 : 0.01}>
      <octahedronGeometry args={[0.4, 0]} />
      <meshStandardMaterial
        color="#f5f5f7"
        emissive="#f5f5f7"
        emissiveIntensity={0}
        roughness={0.2}
        metalness={0.7}
        wireframe={t < 0.5}
      />
    </mesh>
  );
}

// ── Expert blocks ─────────────────────────────────────────────────

function ExpertGrid({ progress, selectedExperts }) {
  const gateT = Math.max(0, (progress - 0.4) / 0.3); // when gating fires

  return (
    <group>
      {Array.from({ length: N_EXPERTS }, (_, i) => {
        const pos = expertPos(i);
        const isSelected = selectedExperts.has(i);
        const color = isSelected ? '#22d3ee' : '#26262f';
        const emissive = isSelected ? '#22d3ee' : '#000000';
        const emissiveInt = isSelected ? gateT * 0.7 : 0;
        const opacity = isSelected ? 0.4 + gateT * 0.6 : 0.25 + gateT * 0.05;

        return (
          <mesh key={i} position={pos}>
            <boxGeometry args={[0.7, 0.7, 0.3]} />
            <meshStandardMaterial
              color={color}
              emissive={emissive}
              emissiveIntensity={emissiveInt}
              roughness={0.4}
              metalness={0.3}
              transparent
              opacity={opacity}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// ── Routing lines (router → experts) ─────────────────────────────

function RoutingLines({ progress, selectedExperts }) {
  const routerT = Math.max(0, (progress - 0.15) / 0.3);
  if (routerT < 0.02) return null;

  const gateT = Math.max(0, (progress - 0.4) / 0.3);

  return (
    <group>
      {Array.from({ length: N_EXPERTS }, (_, i) => {
        const pos = expertPos(i);
        const isSelected = selectedExperts.has(i);
        const lineColor = isSelected ? '#f59e0b' : '#26262f';
        const lineWidth = isSelected ? 2 + gateT * 2 : 0.5;
        const opacity = isSelected
          ? 0.3 + gateT * 0.6
          : routerT * 0.2;

        return (
          <Line
            key={i}
            points={[[-1.2, 0, 0], pos]}
            color={lineColor}
            lineWidth={lineWidth}
            transparent
            opacity={opacity}
          />
        );
      })}
    </group>
  );
}

// ── Output sphere ─────────────────────────────────────────────────

function OutputToken({ progress, selectedExperts }) {
  const t = Math.max(0, (progress - 0.7) / 0.3);
  return (
    <group>
      {[...selectedExperts].map((expert) => (
        <Line
          key={expert}
          points={[expertPos(expert), [5.5, 0, 0]]}
          color="#f59e0b"
          lineWidth={t * 2}
          transparent
          opacity={t * 0.65}
        />
      ))}
      <mesh position={[5.5, 0, 0]}>
        <sphereGeometry args={[0.25, 20, 20]} />
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#f59e0b"
          emissiveIntensity={t * 0.8}
          roughness={0.3}
          metalness={0.4}
          transparent
          opacity={t}
        />
      </mesh>
    </group>
  );
}

// ── Input→router line ─────────────────────────────────────────────

function InputLine({ progress }) {
  const t = Math.max(0, progress / 0.3);
  return (
    <Line
      points={[[-3.5, 0, 0], [-1.2, 0, 0]]}
      color="#a78bfa"
      lineWidth={2}
      transparent
      opacity={Math.min(t, 1) * 0.7}
    />
  );
}

// ── Camera ────────────────────────────────────────────────────────

function CameraRig({ progress, reducedMotion }) {
  const progressRef = useRef(progress);
  progressRef.current = progress;

  useFrame(({ camera }) => {
    const p = progressRef.current;
    const targetX = p * 1.5;
    const targetZ = 9 + p * 1.5;
    if (reducedMotion) {
      camera.position.x = targetX;
      camera.position.z = targetZ;
    } else {
      camera.position.x += (targetX - camera.position.x) * 0.04;
      camera.position.z += (targetZ - camera.position.z) * 0.04;
    }
    camera.lookAt(1, 0, 0);
  });
  return null;
}

// ── Scene root ────────────────────────────────────────────────────

function SceneContent({ topK, reducedMotion }) {
  const { progress } = useScrollProgress();
  const selectedExperts = new Set(TOP_K_SELECTIONS[topK] ?? TOP_K_SELECTIONS[2]);

  return (
    <>
      <color attach="background" args={['#0a0a0f']} />

      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={2} color="#22d3ee" />
      <pointLight position={[-5, -3, -3]} intensity={1} color="#a78bfa" />
      <pointLight position={[3, 0, 3]} intensity={0.8} color="#f59e0b" />

      <InputToken progress={progress} reducedMotion={reducedMotion} />
      <InputLine progress={progress} />
      <Router progress={progress} reducedMotion={reducedMotion} />
      <ExpertGrid progress={progress} selectedExperts={selectedExperts} />
      <RoutingLines progress={progress} selectedExperts={selectedExperts} />
      <OutputToken progress={progress} selectedExperts={selectedExperts} />
      <CameraRig progress={progress} reducedMotion={reducedMotion} />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI * 0.75}
        minPolarAngle={Math.PI * 0.25}
      />
    </>
  );
}

/**
 * Segment A — Mixture of Experts 3D scene.
 *
 * Layout (left → right):
 *   Violet input token → line → white router octahedron →
 *   routing lines (dim to all 8 experts, bright amber to top-2) →
 *   2×4 expert grid (selected experts glow cyan) →
 *   amber output token
 *
 * Scroll choreography:
 *   0%   — input token only
 *   25%  — router appears, dim routing lines to all experts
 *   50%  — top-2 experts glow cyan; routing lines to them turn amber
 *   75%  — signal flows through selected experts; output token appears
 *   100% — full brightness; unselected experts dimmed; camera shifted right
 */
export default function Scene({ topK = 2 }) {
  const reducedMotion = useReducedMotion();

  return (
    <Canvas
      aria-hidden="true"
      camera={{ position: [0.5, 0, 9] , fov: 52 }}
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 2]}
    >
      <SceneContent topK={topK} reducedMotion={reducedMotion} />
    </Canvas>
  );
}

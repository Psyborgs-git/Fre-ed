import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useScrollProgress } from '../../../lib/ScrollContext.jsx';
import { useReducedMotion } from '../../../three/hooks/useReducedMotion.js';

// ── Token definitions: word → 3D embedding position (illustrative) ───
const TOKENS = [
  { label: 'king',   pos: [ 2.2,  1.6, 0.4], color: '#a78bfa' },
  { label: 'queen',  pos: [ 1.8,  1.0, 1.2], color: '#a78bfa' },
  { label: 'man',    pos: [ 2.6, -0.2, 0.2], color: '#22d3ee' },
  { label: 'woman',  pos: [ 2.2, -0.8, 1.0], color: '#22d3ee' },
  { label: 'dog',    pos: [-2.0, -1.4, 0.6], color: '#f59e0b' },
  { label: 'cat',    pos: [-2.4, -1.0, 1.4], color: '#f59e0b' },
  { label: 'paris',  pos: [-1.6,  1.8, -0.8], color: '#34d399' },
  { label: 'france', pos: [-2.2,  1.2, -1.2], color: '#34d399' },
];

// Analogy arrow: king - man + woman ≈ queen
const ANALOGY_START = TOKENS[0].pos; // king
const ANALOGY_END   = TOKENS[1].pos; // queen

function TokenSphere({ token, progress, index }) {
  const meshRef = useRef();
  const glowRef = useRef();

  const appearAt = (index / TOKENS.length) * 0.4;
  const t = Math.max(0, Math.min(1, (progress - appearAt) / 0.2));

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const pulse = 1 + Math.sin(clock.getElapsedTime() * 1.8 + index * 0.7) * 0.04 * t;
    meshRef.current.scale.setScalar(t * pulse);
    meshRef.current.material.emissiveIntensity = 0.2 + t * 0.6;
    if (glowRef.current) glowRef.current.material.opacity = t * 0.08;
  });

  return (
    <group position={token.pos}>
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.32, 16, 16]} />
        <meshStandardMaterial color={token.color} transparent opacity={0} side={THREE.BackSide} />
      </mesh>
      <mesh ref={meshRef} scale={0}>
        <sphereGeometry args={[0.18, 24, 24]} />
        <meshStandardMaterial
          color={token.color}
          emissive={token.color}
          emissiveIntensity={0.2}
          roughness={0.25}
          metalness={0.5}
        />
      </mesh>
    </group>
  );
}

// Similarity line between two tokens
function SimilarityLine({ from, to, progress, showAt, color = '#22d3ee' }) {
  const t = Math.max(0, Math.min(1, (progress - showAt) / 0.2));
  if (t < 0.01) return null;

  return (
    <Line
      points={[from, to]}
      color={color}
      lineWidth={0.8 + t * 0.4}
      transparent
      opacity={0.08 + t * 0.22}
    />
  );
}

// Analogy arrow: king - man + woman → queen
function AnalogyArrow({ progress }) {
  const t = Math.max(0, Math.min(1, (progress - 0.7) / 0.3));
  if (t < 0.01) return null;

  const start = new THREE.Vector3(...ANALOGY_START);
  const end = new THREE.Vector3(...ANALOGY_END);

  return (
    <Line
      points={[start, end]}
      color="#f59e0b"
      lineWidth={2 + t * 1}
      transparent
      opacity={t * 0.9}
    />
  );
}

// Axis lines to show the embedding space
function EmbeddingAxes({ progress }) {
  const t = Math.max(0, Math.min(1, progress / 0.2));
  if (t < 0.01) return null;

  const len = 3.8;
  const axes = [
    { from: [-len, 0, 0], to: [len, 0, 0], color: '#334155' },
    { from: [0, -len, 0], to: [0, len, 0], color: '#334155' },
    { from: [0, 0, -len], to: [0, 0, len], color: '#334155' },
  ];

  return (
    <group>
      {axes.map((ax, i) => (
        <Line
          key={i}
          points={[ax.from, ax.to]}
          color={ax.color}
          lineWidth={0.5}
          transparent
          opacity={t * 0.3}
        />
      ))}
    </group>
  );
}

function CameraRig({ progress, reducedMotion }) {
  const ref = useRef(progress);
  ref.current = progress;

  useFrame(({ camera }) => {
    const p = ref.current;
    const targetZ = 8 + p * 2;
    const targetY = 0.5 + p * 1.2;
    if (reducedMotion) {
      camera.position.z = targetZ;
      camera.position.y = targetY;
    } else {
      camera.position.z += (targetZ - camera.position.z) * 0.04;
      camera.position.y += (targetY - camera.position.y) * 0.04;
    }
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function SceneContent({ reducedMotion }) {
  const { progress } = useScrollProgress();

  // Similarity pairs (within same semantic group)
  const similarityPairs = useMemo(() => [
    { from: TOKENS[0].pos, to: TOKENS[1].pos, color: '#a78bfa', showAt: 0.42 }, // king–queen
    { from: TOKENS[2].pos, to: TOKENS[3].pos, color: '#22d3ee', showAt: 0.46 }, // man–woman
    { from: TOKENS[4].pos, to: TOKENS[5].pos, color: '#f59e0b', showAt: 0.50 }, // dog–cat
    { from: TOKENS[6].pos, to: TOKENS[7].pos, color: '#34d399', showAt: 0.54 }, // paris–france
  ], []);

  return (
    <>
      <color attach="background" args={['#0a0a0f']} />
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 6, 6]} intensity={2.5} color="#22d3ee" />
      <pointLight position={[-5, -4, -3]} intensity={1.4} color="#a78bfa" />
      <pointLight position={[5, -2, 3]} intensity={0.9} color="#f59e0b" />

      <EmbeddingAxes progress={progress} />

      {TOKENS.map((tok, i) => (
        <TokenSphere key={tok.label} token={tok} progress={progress} index={i} />
      ))}

      {similarityPairs.map((pair, i) => (
        <SimilarityLine key={i} {...pair} progress={progress} />
      ))}

      <AnalogyArrow progress={progress} />

      <CameraRig progress={progress} reducedMotion={reducedMotion} />

      <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI * 0.8} minPolarAngle={Math.PI * 0.2} />
    </>
  );
}

/**
 * Embeddings scene — tokens as points in 3-D space.
 *
 * Scroll choreography:
 *   0–20%  Axes grid appears; token spheres materialise one by one
 *  20–55%  Intra-cluster similarity lines draw between semantically close tokens
 *  55–70%  Camera pulls back to reveal cluster structure
 *  70–100% Analogy arrow (king→queen) glows amber, camera orbits slightly
 */
export default function Scene() {
  const reducedMotion = useReducedMotion();

  return (
    <Canvas
      aria-hidden="true"
      camera={{ position: [0, 1, 8], fov: 52 }}
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 2]}
    >
      <SceneContent reducedMotion={reducedMotion} />
    </Canvas>
  );
}

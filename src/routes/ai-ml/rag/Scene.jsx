import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useScrollProgress } from '../../../lib/ScrollContext.jsx';
import { useReducedMotion } from '../../../three/hooks/useReducedMotion.js';

// ── Document corpus — 16 flat rectangles scattered in 3D ─────────
const N_DOCS = 16;
// Pre-seeded random positions in a hemisphere around the origin
const DOC_POSITIONS = Array.from({ length: N_DOCS }, (_, i) => {
  const angle = (i / N_DOCS) * Math.PI * 2;
  const r = 2.5 + (i % 3) * 0.6;
  const ySpread = ((i % 4) - 1.5) * 0.9;
  return [Math.cos(angle) * r, ySpread, Math.sin(angle) * r * 0.5 - 0.5];
});

const QUERY_PRESETS = {
  transformers: [2, 7, 11],
  vectors: [1, 4, 10],
  retrieval: [0, 6, 14],
};

// ── Document rectangles ───────────────────────────────────────────

function DocCorpus({ progress, retrievedDocs }) {
  const raysT = Math.max(0, (progress - 0.15) / 0.3);
  const selectT = Math.max(0, (progress - 0.4) / 0.3);
  const driftT = Math.max(0, (progress - 0.65) / 0.3);

  return (
    <group>
      {DOC_POSITIONS.map((pos, i) => {
        const isRetrieved = retrievedDocs.has(i);
        const color = isRetrieved ? '#f59e0b' : '#26262f';
        const emissive = isRetrieved ? '#f59e0b' : '#000000';
        const emissiveInt = isRetrieved ? selectT * 0.6 : 0;
        const opacity = isRetrieved ? 0.3 + selectT * 0.7 : 0.4 + raysT * 0.1;

        // Retrieved docs drift to a column on the left at high scroll
        const retrievedIndex = [...retrievedDocs].indexOf(i);
        const driftX = isRetrieved ? pos[0] + (-4.5 - pos[0]) * driftT : pos[0];
        const driftY = isRetrieved ? pos[1] + ((retrievedIndex - 1) * 1.2 - pos[1]) * driftT : pos[1];
        const driftZ = isRetrieved ? pos[2] * (1 - driftT) : pos[2];

        return (
          <mesh
            key={i}
            position={[driftX, driftY, driftZ]}
            rotation={[0, (i / N_DOCS) * Math.PI * 0.4, 0]}
          >
            <boxGeometry args={[0.65, 0.85, 0.06]} />
            <meshStandardMaterial
              color={color}
              emissive={emissive}
              emissiveIntensity={emissiveInt}
              roughness={0.6}
              metalness={0.1}
              transparent
              opacity={opacity}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// ── Query sphere (centre, glowing) ────────────────────────────────

function QuerySphere({ progress }) {
  const ref = useRef();
  const glowRef = useRef();
  const progressRef = useRef(progress);
  progressRef.current = progress;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ref.current?.material) {
      ref.current.material.emissiveIntensity = 0.3 + Math.sin(t * 2) * 0.1;
    }
    if (glowRef.current?.material) {
      const p = progressRef.current;
      glowRef.current.material.opacity = 0.04 + Math.min(p * 0.08, 0.08);
    }
  });

  return (
    <group>
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.55, 20, 20]} />
        <meshStandardMaterial
          color="#22d3ee"
          transparent
          opacity={0.04}
          side={THREE.BackSide}
        />
      </mesh>
      <mesh ref={ref}>
        <sphereGeometry args={[0.3, 24, 24]} />
        <meshStandardMaterial
          color="#22d3ee"
          emissive="#22d3ee"
          emissiveIntensity={0.3}
          roughness={0.2}
          metalness={0.6}
        />
      </mesh>
    </group>
  );
}

// ── Similarity rays (query → each doc) ───────────────────────────

function SimilarityRays({ progress, retrievedDocs }) {
  const opacity = Math.max(0, (progress - 0.1) / 0.3);
  if (opacity < 0.01) return null;

  const driftT = Math.max(0, (progress - 0.65) / 0.3);

  return (
    <group>
      {DOC_POSITIONS.map((pos, i) => {
        const isRetrieved = retrievedDocs.has(i);
        const retrievedIndex = [...retrievedDocs].indexOf(i);
        const driftX = isRetrieved ? pos[0] + (-4.5 - pos[0]) * driftT : pos[0];
        const driftY = isRetrieved ? pos[1] + ((retrievedIndex - 1) * 1.2 - pos[1]) * driftT : pos[1];
        const driftZ = isRetrieved ? pos[2] * (1 - driftT) : pos[2];

        return (
          <Line
            key={i}
            points={[[0, 0, 0], [driftX, driftY, driftZ]]}
            color={isRetrieved ? '#f59e0b' : '#22d3ee'}
            lineWidth={isRetrieved ? 1.5 : 0.4}
            transparent
            opacity={isRetrieved ? opacity * 0.7 : opacity * 0.15}
          />
        );
      })}
    </group>
  );
}

// ── LLM generation box ────────────────────────────────────────────

function GenerationBox({ progress }) {
  const t = Math.max(0, (progress - 0.72) / 0.28);

  // Token stream: a few small spheres flowing out to the right
  const tokenCount = Math.floor(t * 5);

  return (
    <group>
      {/* Context window: connecting lines from retrieved docs to LLM box */}
      {t > 0.05 && (
        <Line
          points={[[-4.5, 0, 0], [3.5, 0, 0]]}
          color="#f59e0b"
          lineWidth={1.5}
          transparent
          opacity={t * 0.5}
        />
      )}

      {/* LLM box */}
      <mesh position={[3.5, 0, 0]}>
        <boxGeometry args={[1.0, 1.5, 0.25]} />
        <meshStandardMaterial
          color="#a78bfa"
          emissive="#a78bfa"
          emissiveIntensity={t * 0.5}
          roughness={0.4}
          metalness={0.3}
          transparent
          opacity={t}
        />
      </mesh>

      {/* Output tokens streaming right */}
      {Array.from({ length: tokenCount }, (_, k) => (
        <mesh key={k} position={[4.6 + k * 0.55, 0, 0]}>
          <sphereGeometry args={[0.1, 10, 10]} />
          <meshStandardMaterial
            color="#22d3ee"
            emissive="#22d3ee"
            emissiveIntensity={0.8}
            transparent
            opacity={t * 0.9}
          />
        </mesh>
      ))}
    </group>
  );
}

// ── Camera ────────────────────────────────────────────────────────

function CameraRig({ progress, reducedMotion }) {
  const progressRef = useRef(progress);
  progressRef.current = progress;

  useFrame(({ camera }) => {
    const p = progressRef.current;
    const targetZ = 7 + p * 2.5;
    const targetY = p * 0.8;
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

// ── Scene root ────────────────────────────────────────────────────

function SceneContent({ queryPreset, reducedMotion }) {
  const { progress } = useScrollProgress();
  const retrievedDocs = new Set(QUERY_PRESETS[queryPreset] ?? QUERY_PRESETS.transformers);

  return (
    <>
      <color attach="background" args={['#0a0a0f']} />

      <ambientLight intensity={0.3} />
      <pointLight position={[0, 4, 4]} intensity={2} color="#22d3ee" />
      <pointLight position={[-4, -2, -2]} intensity={1} color="#a78bfa" />
      <pointLight position={[4, 0, 2]} intensity={0.8} color="#f59e0b" />

      <DocCorpus progress={progress} retrievedDocs={retrievedDocs} />
      <QuerySphere progress={progress} />
      <SimilarityRays progress={progress} retrievedDocs={retrievedDocs} />
      <GenerationBox progress={progress} />
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
 * Segment A — RAG 3D scene.
 *
 * Layout:
 *   16 flat document rectangles scattered in a hemisphere around the
 *   glowing cyan query sphere at the origin. Similarity rays fan out.
 *   Top-3 retrieved docs glow amber, then drift left into a context
 *   column. A violet LLM box accepts them and streams output tokens.
 *
 * Scroll choreography:
 *   0%   — query sphere + scattered document corpus
 *   25%  — similarity rays fan out from query to all docs
 *   50%  — top-3 docs glow amber (retrieved)
 *   75%  — retrieved docs drift left; LLM box appears
 *   100% — generation tokens stream out; camera pulled back
 */
export default function Scene({ queryPreset = 'transformers' }) {
  const reducedMotion = useReducedMotion();

  return (
    <Canvas
      aria-hidden="true"
      camera={{ position: [0, 1, 7], fov: 55 }}
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 2]}
    >
      <SceneContent queryPreset={queryPreset} reducedMotion={reducedMotion} />
    </Canvas>
  );
}

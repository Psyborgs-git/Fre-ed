import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
import { useScrollProgress } from '../../../lib/ScrollContext.jsx';
import { useReducedMotion } from '../../../three/hooks/useReducedMotion.js';

// ── Constants ─────────────────────────────────────────────────────
const N = 6; // number of tokens
const TOKEN_Y = [-2.5, -1.5, -0.5, 0.5, 1.5, 2.5];

// Hard-coded pseudo-random score matrix (upper triangular pattern with variety)
// scores[i][j] represents the raw attention score from token i to token j
const SCORES = Array.from({ length: N }, (_, i) =>
  Array.from({ length: N }, (_, j) => {
    const v = ((i * 7 + j * 13 + 3) % 17) / 17;
    return 0.2 + v * 0.8;
  })
);

// Softmax of each row (used for weight visualisation)
function softmaxRow(row) {
  const max = Math.max(...row);
  const exps = row.map((v) => Math.exp(v - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((v) => v / sum);
}
const SOFTMAX = SCORES.map(softmaxRow);

// ── Input token column ────────────────────────────────────────────

function TokenColumn({ progress, selectedToken }) {
  const t = Math.min(1, progress * 4);
  return (
    <group>
      {TOKEN_Y.map((y, i) => (
        <mesh key={i} position={[-4.5, y, 0]}>
          <sphereGeometry args={[0.18, 20, 20]} />
          <meshStandardMaterial
            color="#a78bfa"
            emissive="#a78bfa"
            emissiveIntensity={(i === selectedToken ? 0.45 : 0.2) + t * 0.5}
            roughness={0.3}
            metalness={0.5}
            transparent
            opacity={(i === selectedToken ? 0.7 : 0.4) + t * (i === selectedToken ? 0.3 : 0.6)}
          />
        </mesh>
      ))}
    </group>
  );
}

// ── Q / K / V projection spheres ─────────────────────────────────

function QKVProjections({ progress }) {
  const t = Math.max(0, Math.min(1, (progress - 0.15) / 0.25));
  if (t < 0.01) return null;

  // Q at x=-2.8, K at x=-1.8, V at x=-0.8
  const PROJ = [
    { x: -2.8, color: '#22d3ee', label: 'Q' },  // cyan
    { x: -1.8, color: '#f59e0b', label: 'K' },  // amber
    { x: -0.8, color: '#a78bfa', label: 'V' },  // violet
  ];

  return (
    <group>
      {TOKEN_Y.map((y, ti) =>
        PROJ.map(({ x, color }, pi) => (
          <group key={`${ti}-${pi}`}>
            {/* Projection line from token to Q/K/V sphere */}
            <Line
              points={[[-4.5, y, 0], [x, y, 0]]}
              color={color}
              lineWidth={0.8}
              transparent
              opacity={t * 0.4}
            />
            {/* Q / K / V sphere */}
            <mesh position={[x, y, 0]}>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={t * 0.7}
                roughness={0.3}
                metalness={0.4}
                transparent
                opacity={t * 0.9}
              />
            </mesh>
          </group>
        ))
      )}
    </group>
  );
}

// ── Q·K score lines ───────────────────────────────────────────────

function ScoreLines({ progress, selectedToken }) {
  const lines = useMemo(() => {
    const result = [];
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        if (i === j) continue;
        const score = SCORES[i][j];
        const softScore = SOFTMAX[i][j];
        result.push({ i, j, score, softScore });
      }
    }
    return result;
  }, []);
  const scoresT = Math.max(0, Math.min(1, (progress - 0.25) / 0.3));
  const softT = Math.max(0, Math.min(1, (progress - 0.5) / 0.2));

  if (scoresT < 0.01) return null;

  return (
    <group>
      {lines.map(({ i, j, score, softScore }, idx) => {
        // After softmax: dim all weak connections, brighten top ones
        const weight = softT > 0.3 ? softScore : score;
        const focused = i === selectedToken;
        const opacity = scoresT * weight * (softT > 0.3 ? 1.2 : 0.5) * (focused ? 1.4 : 0.28);
        const lineWidth = (focused ? 0.8 : 0.4) + weight * (focused ? 2.2 : 1.2);
        return (
          <Line
            key={idx}
            points={[
              [-2.8, TOKEN_Y[i], 0],
              [-2.0, (TOKEN_Y[i] + TOKEN_Y[j]) / 2, 0.3],
              [-1.8, TOKEN_Y[j], 0],
            ]}
            color="#22d3ee"
            lineWidth={lineWidth}
            transparent
            opacity={Math.min(0.8, opacity)}
          />
        );
      })}
    </group>
  );
}

// ── Attention weight matrix (6×6 grid of small quads) ─────────────

function AttentionMatrix({ progress, selectedToken }) {
  const t = Math.max(0, Math.min(1, (progress - 0.5) / 0.2));
  if (t < 0.01) return null;

  const CELL = 0.28;
  const GAP = 0.32;

  return (
    <group>
      {Array.from({ length: N }, (_, i) =>
        Array.from({ length: N }, (_, j) => {
          const weight = SOFTMAX[i][j];
          // Colour lerp: cyan (low weight) → amber (high weight)
          const r = Math.round(0x22 + weight * (0xf5 - 0x22)).toString(16).padStart(2, '0');
          const g = Math.round(0xd3 + weight * (0x9e - 0xd3)).toString(16).padStart(2, '0');
          const b = Math.round(0xee + weight * (0x0b - 0xee)).toString(16).padStart(2, '0');
          const color = `#${r}${g}${b}`;
          const x = (j - (N - 1) / 2) * GAP;
          const y = ((N - 1) / 2 - i) * GAP;
          const selectedRow = i === selectedToken;
          return (
            <mesh key={`${i}-${j}`} position={[x, y, 0]}>
              <planeGeometry args={[CELL, CELL]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={t * weight * (selectedRow ? 1.6 : 0.8)}
                transparent
                opacity={t * (selectedRow ? 0.7 : 0.28 + weight * 0.6)}
              />
            </mesh>
          );
        })
      )}
    </group>
  );
}

// ── Context vector aggregation lines (V-weighted blend) ───────────

function ContextLines({ progress, selectedToken }) {
  const t = Math.max(0, Math.min(1, (progress - 0.7) / 0.2));
  if (t < 0.01) return null;

  return (
    <group>
      {TOKEN_Y.map((outY, i) => {
        if (i !== selectedToken) return null;
        // Each output token blends the top-2 V projections for token i
        const weights = SOFTMAX[i];
        const topTwo = [...weights.map((w, j) => ({ w, j }))]
          .sort((a, b) => b.w - a.w)
          .slice(0, 2);

        return topTwo.map(({ w, j }) => (
          <Line
            key={`ctx-${i}-${j}`}
            points={[[-0.8, TOKEN_Y[j], 0], [2.8, outY, 0]]}
            color="#f59e0b"
            lineWidth={t * w * 3}
            transparent
            opacity={t * w * 0.7}
          />
        ));
      })}
    </group>
  );
}

// ── Output token column ───────────────────────────────────────────

function OutputColumn({ progress, selectedToken }) {
  const t = Math.max(0, Math.min(1, (progress - 0.7) / 0.2));
  if (t < 0.01) return null;

  return (
    <group>
      {TOKEN_Y.map((y, i) => (
        <mesh key={i} position={[2.8, y, 0]}>
          <sphereGeometry args={[0.18, 20, 20]} />
          <meshStandardMaterial
            color="#22d3ee"
            emissive="#22d3ee"
            emissiveIntensity={t * (i === selectedToken ? 1.2 : 0.5)}
            roughness={0.3}
            metalness={0.5}
            transparent
            opacity={t * (i === selectedToken ? 1 : 0.35)}
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
    const targetZ = 9 + p * 3;
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

function SceneContent({ selectedToken, reducedMotion }) {
  const { progress } = useScrollProgress();

  return (
    <>
      <color attach="background" args={['#0a0a0f']} />

      <ambientLight intensity={0.3} />
      <pointLight position={[0, 5, 5]} intensity={2} color="#22d3ee" />
      <pointLight position={[-5, -3, -3]} intensity={1} color="#a78bfa" />
      <pointLight position={[3, 0, 3]} intensity={0.8} color="#f59e0b" />

      {/* Input tokens (violet) */}
      <TokenColumn progress={progress} selectedToken={selectedToken} />

      {/* Q / K / V projection spheres */}
      <QKVProjections progress={progress} />

      {/* Q·K score lines */}
      <ScoreLines progress={progress} selectedToken={selectedToken} />

      {/* Attention weight matrix at centre */}
      <group position={[0, 0, -0.5]}>
        <AttentionMatrix progress={progress} selectedToken={selectedToken} />
      </group>

      {/* Context aggregation (V-weighted) */}
      <ContextLines progress={progress} selectedToken={selectedToken} />

      {/* Output tokens (cyan) */}
      <OutputColumn progress={progress} selectedToken={selectedToken} />

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
 * Segment A — Self-Attention 3D scene.
 *
 * Layout (left → right):
 *   Violet input tokens → cyan Q spheres + amber K spheres + violet V spheres
 *   → Q·K score lines (N×N, width/opacity by score) → attention matrix (6×6 quads)
 *   → V-weighted context lines → cyan output tokens
 *
 * Scroll choreography:
 *   0%   — Input token column appears
 *   15%  — Q/K/V projection spheres and lines fan out
 *   25%  — All-to-all Q·K score lines appear (N×N connections)
 *   50%  — Softmax concentration: weak lines dim, strong ones brighten;
 *           attention weight matrix materialises at centre
 *   70%  — Context aggregation lines show V-weighted blend; output column appears
 *   90%  — Camera pulled back for full-scene view
 */
export default function Scene({ selectedToken = 0 }) {
  const reducedMotion = useReducedMotion();

  return (
    <Canvas
      aria-hidden="true"
      camera={{ position: [0, 0, 9], fov: 52 }}
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 2]}
    >
      <SceneContent selectedToken={selectedToken} reducedMotion={reducedMotion} />
    </Canvas>
  );
}

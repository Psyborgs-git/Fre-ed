import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
import { useScrollProgress } from '../../../lib/ScrollContext.jsx';
import { useReducedMotion } from '../../../three/hooks/useReducedMotion.js';

// ── Layout constants ──────────────────────────────────────────────
// W matrix: 8×8 grid representing a large frozen weight matrix
const W_ROWS = 8;
const W_COLS = 8;
const W_CELL = 0.22;   // cell size
const W_GAP  = 0.26;   // spacing

const A_ROWS = 8;
const A_CELL = 0.22;
const A_GAP  = 0.28;

const B_COLS = 8;
const B_CELL = 0.22;
const B_GAP  = 0.28;

function gridPos(row, col, rows, cols, cellGap, offsetX, offsetY) {
  const x = offsetX + (col - (cols - 1) / 2) * cellGap;
  const y = offsetY + ((rows - 1) / 2 - row) * cellGap;
  return [x, y, 0];
}

// ── Frozen W matrix ───────────────────────────────────────────────

function WMatrix({ progress }) {
  const freezeT = Math.max(0, (progress - 0.15) / 0.25); // dims as adapters appear
  const deltaT  = Math.max(0, (progress - 0.55) / 0.3);  // delta overlay fades in

  return (
    <group>
      {Array.from({ length: W_ROWS * W_COLS }, (_, idx) => {
        const row = Math.floor(idx / W_COLS);
        const col = idx % W_COLS;
        const pos = gridPos(row, col, W_ROWS, W_COLS, W_GAP, 0, 0);

        // Delta overlay: highlight a 3×3 region in the centre of W
        const isDelta = row >= 2 && row <= 4 && col >= 2 && col <= 5;
        const color = isDelta && deltaT > 0.1 ? '#f59e0b' : '#26262f';
        const emissiveInt = isDelta ? deltaT * 0.6 : 0;
        const opacity = 0.5 - freezeT * 0.25 + (isDelta ? deltaT * 0.5 : 0);

        return (
          <mesh key={idx} position={pos}>
            <boxGeometry args={[W_CELL, W_CELL, 0.04]} />
            <meshStandardMaterial
              color={color}
              emissive={isDelta ? '#f59e0b' : '#000000'}
              emissiveIntensity={emissiveInt}
              roughness={0.5}
              metalness={0.2}
              transparent
              opacity={Math.max(0.05, opacity)}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// ── A adapter matrix (d×r = 8×2, cyan) ───────────────────────────

function AMatrix({ progress, rank }) {
  const t = Math.max(0, (progress - 0.2) / 0.25);
  if (t < 0.02) return null;

  const offsetX = -3.1 - Math.max(0, rank - 2) * 0.18;
  const offsetY = 0;

  return (
    <group>
      {Array.from({ length: A_ROWS * rank }, (_, idx) => {
        const row = Math.floor(idx / rank);
        const col = idx % rank;
        const pos = gridPos(row, col, A_ROWS, rank, A_GAP, offsetX, offsetY);

        return (
          <mesh key={idx} position={pos}>
            <boxGeometry args={[A_CELL, A_CELL, 0.06]} />
            <meshStandardMaterial
              color="#22d3ee"
              emissive="#22d3ee"
              emissiveIntensity={t * 0.5}
              roughness={0.3}
              metalness={0.5}
              transparent
              opacity={t * 0.9}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// ── B adapter matrix (r×d = 2×8, violet) ─────────────────────────

function BMatrix({ progress, rank }) {
  const t = Math.max(0, (progress - 0.2) / 0.25);
  if (t < 0.02) return null;

  const offsetX = 3.1 + Math.max(0, rank - 2) * 0.18;
  const offsetY = 0;

  return (
    <group>
      {Array.from({ length: rank * B_COLS }, (_, idx) => {
        const row = Math.floor(idx / B_COLS);
        const col = idx % B_COLS;
        const pos = gridPos(row, col, rank, B_COLS, B_GAP, offsetX, offsetY);

        return (
          <mesh key={idx} position={pos}>
            <boxGeometry args={[B_CELL, B_CELL, 0.06]} />
            <meshStandardMaterial
              color="#a78bfa"
              emissive="#a78bfa"
              emissiveIntensity={t * 0.5}
              roughness={0.3}
              metalness={0.5}
              transparent
              opacity={t * 0.9}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// ── Multiply lines: A cols → B rows (show BA composition) ─────────

function MultiplyLines({ progress, rank }) {
  const t = Math.max(0, (progress - 0.42) / 0.25);
  if (t < 0.02) return null;

  const normalizedRankSpan = Math.max(rank - 1, 1); // keep the interpolation stable when rank is very small

  // Two rank nodes positioned at the bottleneck midpoint (x = 0)
  // Lines go from each A's rightmost column position to each B's leftmost column position
  const rankLines = [];
  for (let r = 0; r < rank; r++) {
    const aRow = Math.min(A_ROWS - 1, Math.floor((r / normalizedRankSpan) * (A_ROWS - 1)));
    const aPos = gridPos(aRow, rank - 1, A_ROWS, rank, A_GAP, -3.1 - Math.max(0, rank - 2) * 0.18, 0);
    // B matrix leftmost column (0), each rank row
    const bPos = gridPos(r, 0, rank, B_COLS, B_GAP, 3.1 + Math.max(0, rank - 2) * 0.18, 0);
    // Bottleneck midpoint
    const midY = (aPos[1] + bPos[1]) / 2;
    rankLines.push({ aPos, bPos, midY, key: r });
  }

  return (
    <group>
      {rankLines.map(({ aPos, bPos, midY, key }) => (
        <group key={key}>
          {/* A → bottleneck node */}
          <Line
            points={[aPos, [0, midY, 0.3]]}
            color="#f59e0b"
            lineWidth={2}
            transparent
            opacity={t * 0.7}
          />
          {/* Bottleneck node → B */}
          <Line
            points={[[0, midY, 0.3], bPos]}
            color="#f59e0b"
            lineWidth={2}
            transparent
            opacity={t * 0.7}
          />
          {/* Rank-node sphere at the bottleneck */}
          <mesh position={[0, midY, 0.3]}>
            <sphereGeometry args={[0.09, 14, 14]} />
            <meshStandardMaterial
              color="#f59e0b"
              emissive="#f59e0b"
              emissiveIntensity={t * 0.9}
              roughness={0.3}
              metalness={0.4}
              transparent
              opacity={t}
            />
          </mesh>
        </group>
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
    const targetY = p * 0.5;
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

function SceneContent({ rank, reducedMotion }) {
  const { progress } = useScrollProgress();

  return (
    <>
      <color attach="background" args={['#0a0a0f']} />

      <ambientLight intensity={0.3} />
      <pointLight position={[0, 5, 5]} intensity={1.5} color="#22d3ee" />
      <pointLight position={[-4, -3, -3]} intensity={0.8} color="#a78bfa" />
      <pointLight position={[4, 0, 2]} intensity={0.6} color="#f59e0b" />

      <WMatrix progress={progress} />
      <AMatrix progress={progress} rank={rank} />
      <BMatrix progress={progress} rank={rank} />
      <MultiplyLines progress={progress} rank={rank} />
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
 * Segment A — LoRA 3D scene.
 *
 * Layout:
 *   Centre: large 8×8 grey W matrix grid (frozen base weights)
 *   Left:   tall narrow cyan A matrix (8×2, d×r adapter)
 *   Right:  short wide violet B matrix (2×8, r×d adapter)
 *
 * The size contrast (64 cells in W vs 16 in A + 16 in B) visually
 * communicates that the adapters are far smaller than the base model.
 *
 * Scroll choreography:
 *   0%   — full-brightness W matrix
 *   25%  — W dims to grey (frozen); A and B matrices fade in
 *   50%  — multiply lines show B·A bottleneck (rank-2)
 *   75%  — delta ΔW overlay highlights centre of W (amber)
 *   100% — camera pulled back to show full size contrast
 */
export default function Scene({ rank = 2 }) {
  const reducedMotion = useReducedMotion();

  return (
    <Canvas
      aria-hidden="true"
      camera={{ position: [0, 0, 7], fov: 52 }}
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 2]}
    >
      <SceneContent rank={rank} reducedMotion={reducedMotion} />
    </Canvas>
  );
}

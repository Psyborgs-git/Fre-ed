import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
import { useScrollProgress } from '../../../lib/ScrollContext.jsx';
import { useReducedMotion } from '../../../three/hooks/useReducedMotion.js';

// ── Constants ─────────────────────────────────────────────────────
const N_TOKENS = 6;
const TOKEN_Y = [-2.5, -1.5, -0.5, 0.5, 1.5, 2.5];
const TOKEN_COLOR_IN = '#a78bfa';   // violet — input
const TOKEN_COLOR_OUT = '#22d3ee';  // cyan   — output
const FFN_COLOR = '#f59e0b';        // amber  — FFN sublayer
const HEAD_COLORS = ['#22d3ee', '#67e8f9', '#a78bfa', '#f59e0b'];

// ── Input token column ────────────────────────────────────────────

function TokenColumn({ x, color, progress, delay = 0, selectedHead }) {
  return (
    <group>
      {TOKEN_Y.map((y, i) => (
        <mesh key={i} position={[x, y, 0]}>
          <sphereGeometry args={[0.2, 20, 20]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={Math.max(0, progress - delay) * (selectedHead === i % HEAD_COLORS.length ? 0.95 : 0.6)}
            roughness={0.3}
            metalness={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

// ── Attention connections (all-to-all) ────────────────────────────

function AttentionLines({ progress, selectedHead }) {
  const lines = useMemo(() => {
    const result = [];
    for (let i = 0; i < N_TOKENS; i++) {
      for (let j = 0; j < N_TOKENS; j++) {
        if (i === j) continue;
        // Strength varies per pair to show varied attention weights
        const strength = 0.3 + ((i * 3 + j * 7) % 10) / 10 * 0.7;
        result.push({ i, j, strength, head: (i + j) % HEAD_COLORS.length });
      }
    }
    return result;
  }, []);

  const opacity = Math.max(0, (progress - 0.1) / 0.4);
  if (opacity < 0.01) return null;

  return (
    <group>
      {lines.map(({ i, j, strength, head }, idx) => {
        const focused = head === selectedHead;
        return (
          <Line
            key={idx}
            points={[
              [-3, TOKEN_Y[i], 0],
              [-1, (TOKEN_Y[i] + TOKEN_Y[j]) / 2, 0.5],
              [-3, TOKEN_Y[j], 0],
            ]}
            color={HEAD_COLORS[head]}
            lineWidth={strength * (focused ? 1.9 : 0.9)}
            transparent
            opacity={opacity * strength * (focused ? 0.8 : 0.12)}
          />
        );
      })}
    </group>
  );
}

// ── FFN sublayer boxes ────────────────────────────────────────────

function FFNLayer({ progress, selectedHead }) {
  const t = Math.max(0, (progress - 0.4) / 0.35);

  return (
    <group>
      {TOKEN_Y.map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <boxGeometry args={[0.45, 0.45, 0.45]} />
          <meshStandardMaterial
            color={FFN_COLOR}
            emissive={FFN_COLOR}
            emissiveIntensity={t * (selectedHead === i % HEAD_COLORS.length ? 0.85 : 0.5)}
            roughness={0.4}
            metalness={0.3}
            transparent
            opacity={0.3 + t * 0.7}
          />
        </mesh>
      ))}
    </group>
  );
}

// ── Residual bypass lines (skip connections) ──────────────────────

function ResidualLines({ progress }) {
  const opacity = Math.max(0, (progress - 0.65) / 0.35);
  if (opacity < 0.01) return null;

  return (
    <group>
      {TOKEN_Y.map((y, i) => (
        <Line
          key={i}
          points={[
            [-3, y, -0.3],
            [3, y, -0.3],
          ]}
          color="#f5f5f7"
          lineWidth={1}
          dashed
          dashSize={0.15}
          gapSize={0.1}
          transparent
          opacity={opacity * 0.4}
        />
      ))}
    </group>
  );
}

// ── Feed lines: attention → FFN → output ─────────────────────────

function FeedLines({ progress }) {
  const t1 = Math.max(0, (progress - 0.25) / 0.25); // attn → ffn
  const t2 = Math.max(0, (progress - 0.55) / 0.25); // ffn → out

  return (
    <group>
      {TOKEN_Y.map((y, i) => (
        <group key={i}>
          <Line
            points={[[-3, y, 0], [0, y, 0]]}
            color={TOKEN_COLOR_OUT}
            lineWidth={1.5}
            transparent
            opacity={t1 * 0.6}
          />
          <Line
            points={[[0, y, 0], [3, y, 0]]}
            color={FFN_COLOR}
            lineWidth={1.5}
            transparent
            opacity={t2 * 0.6}
          />
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
    const targetZ = 8 + p * 2;
    const targetY = p * 1.2;
    if (reducedMotion) {
      camera.position.z = targetZ;
      camera.position.y = targetY;
    } else {
      camera.position.z += (targetZ - camera.position.z) * 0.05;
      camera.position.y += (targetY - camera.position.y) * 0.05;
    }
    camera.lookAt(0, 0, 0);
  });
  return null;
}

// ── Scene root ────────────────────────────────────────────────────

function SceneContent({ selectedHead, reducedMotion }) {
  const { progress } = useScrollProgress();

  return (
    <>
      <color attach="background" args={['#0a0a0f']} />

      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={2} color="#22d3ee" />
      <pointLight position={[-5, -3, -3]} intensity={1} color="#a78bfa" />
      <pointLight position={[0, 0, 4]} intensity={0.5} color="#f59e0b" />

      {/* Input tokens */}
      <TokenColumn
        x={-3}
        color={TOKEN_COLOR_IN}
        progress={progress}
        delay={0}
        selectedHead={selectedHead}
      />

      {/* Attention connections */}
      <AttentionLines progress={progress} selectedHead={selectedHead} />

      {/* FFN sublayer */}
      <FFNLayer progress={progress} selectedHead={selectedHead} />

      {/* Feed lines */}
      <FeedLines progress={progress} />

      {/* Residual skip connections */}
      <ResidualLines progress={progress} />

      {/* Output tokens */}
      <TokenColumn
        x={3}
        color={TOKEN_COLOR_OUT}
        progress={progress}
        delay={0.55}
        selectedHead={selectedHead}
      />

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
 * Segment A — Transformer Block 3D scene.
 *
 * Layout (left → right):
 *   Violet input tokens → all-to-all attention lines → amber FFN boxes → cyan output tokens
 *   White dashed residual lines bypass both sublayers.
 *
 * Scroll choreography:
 *   0%   — input token spheres, everything else invisible
 *   25%  — attention lines fan out between all token pairs
 *   50%  — FFN boxes activate (amber glow); feed lines appear
 *   75%  — output tokens brighten; residual lines materialise
 *   100% — full scene; camera pulled back for whole-block view
 */
export default function Scene({ selectedHead = 0 }) {
  const reducedMotion = useReducedMotion();

  return (
    <Canvas
      aria-hidden="true"
      camera={{ position: [0, 0, 8], fov: 52 }}
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 2]}
    >
      <SceneContent selectedHead={selectedHead} reducedMotion={reducedMotion} />
    </Canvas>
  );
}

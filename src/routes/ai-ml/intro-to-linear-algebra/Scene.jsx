import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useScrollProgress } from '../../../lib/ScrollContext.jsx';
import { useTheme } from '../../../lib/ThemeContext.jsx';

const SCENE_PALETTES = {
  dark: {
    background: '#060912',
    fog: '#060912',
    axisX: '#27d9ff',
    axisY: '#9a7cff',
    axisZ: '#f8fafc',
    vector: '#ffb84d',
    projection: '#ffd56a',
    plane: '#4bd5ff',
    planeGlow: '#7dd3fc',
    gridCell: '#143447',
    gridSection: '#1d4f66',
    floorGlow: '#0c1d31',
    origin: '#f8fafc',
    originGlow: '#cbd5f5',
    ambient: 0.42,
    keyLight: '#52e3ff',
    fillLight: '#9b8cff',
    rimLight: '#f59e0b',
  },
  light: {
    background: '#edf4ff',
    fog: '#edf4ff',
    axisX: '#0891b2',
    axisY: '#7c3aed',
    axisZ: '#1f2937',
    vector: '#ea580c',
    projection: '#f59e0b',
    plane: '#38bdf8',
    planeGlow: '#0ea5e9',
    gridCell: '#bfd4e6',
    gridSection: '#90b8d4',
    floorGlow: '#d8e8ff',
    origin: '#ffffff',
    originGlow: '#dbeafe',
    ambient: 0.66,
    keyLight: '#38bdf8',
    fillLight: '#8b5cf6',
    rimLight: '#f97316',
  },
};

// ── Helper: Arrow (vector visualisation) ─────────────────────────

function Arrow({ from = [0, 0, 0], to, color, lineWidth = 3 }) {
  const dir = useMemo(() => {
    const d = new THREE.Vector3(...to).sub(new THREE.Vector3(...from));
    return d;
  }, [from, to]);

  const length = dir.length();
  const normalizedDir = useMemo(() => {
    if (length === 0) {
      return new THREE.Vector3(0, 1, 0);
    }

    return dir.clone().normalize();
  }, [dir, length]);
  const coneHeight = Math.min(0.25, length * 0.25);
  const conePos = useMemo(() => {
    const tip = new THREE.Vector3(...to);
    return tip.sub(normalizedDir.clone().multiplyScalar(coneHeight / 2)).toArray();
  }, [to, normalizedDir, coneHeight]);

  const coneQuat = useMemo(() => {
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normalizedDir);
    return q;
  }, [normalizedDir]);

  return (
    <group>
      <Line points={[from, to]} color={color} lineWidth={lineWidth} />
      <mesh position={conePos} quaternion={coneQuat}>
        <coneGeometry args={[0.07, coneHeight, 12]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
      <mesh position={to}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.9}
          roughness={0.15}
          metalness={0.08}
        />
      </mesh>
    </group>
  );
}

// ── Basis vectors and a custom vector ────────────────────────────

function VectorSpace({ progress, palette, shouldAnimate }) {
  const groupRef = useRef();

  // Custom vector that appears as scroll progresses
  const customVec = useMemo(
    () => [1.5 * progress, 1.2 * progress, 0.8 * progress],
    [progress]
  );

  useFrame(() => {
    if (shouldAnimate && groupRef.current) {
      // Gentle auto-rotation augmented by scroll
      groupRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Basis vectors: î (cyan), ĵ (violet), k̂ (white) */}
      <Arrow to={[2, 0, 0]} color={palette.axisX} />
      <Arrow to={[0, 2, 0]} color={palette.axisY} />
      <Arrow to={[0, 0, 2]} color={palette.axisZ} />

      {/* Origin sphere */}
      <mesh>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial
          color={palette.origin}
          emissive={palette.originGlow}
          emissiveIntensity={0.7}
          roughness={0.2}
          metalness={0.08}
        />
      </mesh>

      {/* Custom vector — fades in on scroll */}
      {progress > 0.05 && (
        <group>
          <Arrow
            to={customVec}
            color={palette.vector}
            lineWidth={4}
          />
          {/* Dashed projections onto axes */}
          <Line
            points={[customVec, [customVec[0], 0, 0]]}
            color={palette.projection}
            lineWidth={1}
            dashed
            dashSize={0.08}
            gapSize={0.05}
            transparent
            opacity={0.4}
          />
          <Line
            points={[customVec, [0, customVec[1], 0]]}
            color={palette.projection}
            lineWidth={1}
            dashed
            dashSize={0.08}
            gapSize={0.05}
            transparent
            opacity={0.4}
          />
        </group>
      )}
    </group>
  );
}

// ── Transformation demo (appears at high scroll %) ────────────────

function TransformPlane({ progress, palette }) {
  if (progress < 0.6) return null;
  const t = (progress - 0.6) / 0.4; // 0→1 from 60% scroll

  return (
    <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, t * Math.PI * 0.25]}>
      <planeGeometry args={[3, 3, 6, 6]} />
      <meshStandardMaterial
        color={palette.plane}
        emissive={palette.planeGlow}
        emissiveIntensity={0.18 + t * 0.12}
        transparent
        opacity={0.06 + t * 0.06}
        wireframe
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// ── Scene root ────────────────────────────────────────────────────

function SceneContent({ palette, shouldAnimate }) {
  const { progress } = useScrollProgress();

  return (
    <>
      <color attach="background" args={[palette.background]} />
      <fog attach="fog" args={[palette.fog, 8, 15]} />

      {/* Lighting */}
      <ambientLight intensity={palette.ambient} />
      <pointLight position={[4, 6, 4]} intensity={2.2} color={palette.keyLight} />
      <pointLight position={[-4, -3, -3]} intensity={0.95} color={palette.fillLight} />
      <pointLight position={[0, 2.5, -4]} intensity={0.8} color={palette.rimLight} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <circleGeometry args={[4.75, 64]} />
        <meshBasicMaterial color={palette.floorGlow} transparent opacity={0.2} />
      </mesh>

      {/* Grid floor */}
      <Grid
        args={[12, 12]}
        cellSize={1}
        cellThickness={0.3}
        cellColor={palette.gridCell}
        sectionSize={2}
        sectionThickness={0.6}
        sectionColor={palette.gridSection}
        fadeDistance={10}
        position={[0, -0.01, 0]}
      />

      <VectorSpace progress={progress} palette={palette} shouldAnimate={shouldAnimate} />
      <TransformPlane progress={progress} palette={palette} />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        maxPolarAngle={Math.PI * 0.8}
        minPolarAngle={Math.PI * 0.15}
        autoRotate={false}
      />
    </>
  );
}

/**
 * Segment A — Linear Algebra 3D scene.
 *
 * Shows basis vectors î, ĵ, k̂ in 3D space.
 * Scroll progress (from ScrollContext) animates a custom vector and a
 * transformation plane overlay.
 *
 * Prefers-reduced-motion: Canvas is still mounted (no layout shift) but
 * frame-level animations read from a shared motion preference check.
 */
export default function Scene() {
  const { theme } = useTheme();
  const palette = SCENE_PALETTES[theme] ?? SCENE_PALETTES.dark;
  const shouldAnimate = useMemo(() => {
    if (typeof window === 'undefined') return true;

    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  return (
    <Canvas
      aria-hidden="true"
      camera={{ position: [4.35, 3.15, 4.4], fov: 44 }}
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 2]}
    >
      <SceneContent palette={palette} shouldAnimate={shouldAnimate} />
    </Canvas>
  );
}

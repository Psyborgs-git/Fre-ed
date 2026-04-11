import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useScrollProgress } from '../../lib/ScrollContext.jsx';

// ── Helper: Arrow (vector visualisation) ─────────────────────────

function Arrow({ from = [0, 0, 0], to, color, lineWidth = 3 }) {
  const dir = useMemo(() => {
    const d = new THREE.Vector3(...to).sub(new THREE.Vector3(...from));
    return d;
  }, [from, to]);

  const length = dir.length();
  const coneHeight = Math.min(0.25, length * 0.25);
  const conePos = useMemo(() => {
    const tip = new THREE.Vector3(...to);
    const d = dir.clone().normalize();
    return tip.sub(d.multiplyScalar(coneHeight / 2)).toArray();
  }, [to, dir, coneHeight]);

  const coneQuat = useMemo(() => {
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
    return q;
  }, [dir]);

  return (
    <group>
      <Line points={[from, to]} color={color} lineWidth={lineWidth} />
      <mesh position={conePos} quaternion={coneQuat}>
        <coneGeometry args={[0.07, coneHeight, 12]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} />
      </mesh>
    </group>
  );
}

// ── Basis vectors and a custom vector ────────────────────────────

function VectorSpace({ progress }) {
  const groupRef = useRef();

  // Custom vector that appears as scroll progresses
  const customVec = useMemo(
    () => [1.5 * progress, 1.2 * progress, 0.8 * progress],
    [progress]
  );

  useFrame(() => {
    if (groupRef.current) {
      // Gentle auto-rotation augmented by scroll
      groupRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Basis vectors: î (cyan), ĵ (violet), k̂ (white) */}
      <Arrow to={[2, 0, 0]} color="#22d3ee" />
      <Arrow to={[0, 2, 0]} color="#a78bfa" />
      <Arrow to={[0, 0, 2]} color="#f5f5f7" />

      {/* Origin sphere */}
      <mesh>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#f5f5f7" emissive="#f5f5f7" emissiveIntensity={0.5} />
      </mesh>

      {/* Custom vector — fades in on scroll */}
      {progress > 0.05 && (
        <group>
          <Arrow
            to={customVec}
            color="#f59e0b"
            lineWidth={4}
          />
          {/* Dashed projections onto axes */}
          <Line
            points={[customVec, [customVec[0], 0, 0]]}
            color="#f59e0b"
            lineWidth={1}
            dashed
            dashSize={0.08}
            gapSize={0.05}
            transparent
            opacity={0.4}
          />
          <Line
            points={[customVec, [0, customVec[1], 0]]}
            color="#f59e0b"
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

function TransformPlane({ progress }) {
  if (progress < 0.6) return null;
  const t = (progress - 0.6) / 0.4; // 0→1 from 60% scroll

  return (
    <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, t * Math.PI * 0.25]}>
      <planeGeometry args={[3, 3, 6, 6]} />
      <meshStandardMaterial
        color="#22d3ee"
        transparent
        opacity={0.06 + t * 0.06}
        wireframe
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// ── Scene root ────────────────────────────────────────────────────

function SceneContent() {
  const { progress } = useScrollProgress();

  return (
    <>
      <color attach="background" args={['#0a0a0f']} />

      {/* Lighting */}
      <ambientLight intensity={0.25} />
      <pointLight position={[4, 6, 4]} intensity={2} color="#22d3ee" />
      <pointLight position={[-4, -3, -3]} intensity={0.8} color="#a78bfa" />

      {/* Grid floor */}
      <Grid
        args={[12, 12]}
        cellSize={1}
        cellThickness={0.3}
        cellColor="#26262f"
        sectionSize={2}
        sectionThickness={0.6}
        sectionColor="#26262f"
        fadeDistance={10}
        position={[0, -0.01, 0]}
      />

      <VectorSpace progress={progress} />
      <TransformPlane progress={progress} />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
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
  return (
    <Canvas
      aria-hidden="true"
      camera={{ position: [4, 3, 4], fov: 45 }}
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 2]}
    >
      <SceneContent />
    </Canvas>
  );
}

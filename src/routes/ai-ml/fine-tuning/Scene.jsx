import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useScrollProgress } from '../../../lib/ScrollContext.jsx';

// ── Loss landscape geometry ───────────────────────────────────────
// f(x, z) = 2 - 1.8*exp(-((x-1.5)²+(z-1.5)²)/3) + 0.3*sin(x)*cos(z)
// Creates a smooth valley near (1.5, 1.5) — the fine-tuned minimum
// and a broad plateau near (-1.5, -1.5) — the pre-trained minimum

function lossHeight(x, z) {
  const valleyTerm = 1.8 * Math.exp(-((x - 1.5) ** 2 + (z - 1.5) ** 2) / 3);
  const noiseTerm  = 0.3 * Math.sin(x) * Math.cos(z);
  return 2 - valleyTerm + noiseTerm;
}

// ── Gradient path waypoints (pre-computed plateau → valley) ──────
const PATH_POINTS = [
  [-1.5, 0, -1.5],
  [-0.9, 0, -1.0],
  [-0.3, 0, -0.5],
  [ 0.3, 0,  0.0],
  [ 0.8, 0,  0.5],
  [ 1.1, 0,  1.0],
  [ 1.4, 0,  1.3],
  [ 1.5, 0,  1.5],
].map(([x, _, z]) => [x, lossHeight(x, z) + 0.12, z]);

// ── Loss Landscape Mesh ───────────────────────────────────────────

function LossTerrain() {
  const geomRef = useRef();

  const geometry = useMemo(() => {
    const segs = 40;
    const geo  = new THREE.PlaneGeometry(8, 8, segs, segs);
    geo.rotateX(-Math.PI / 2); // lay flat on XZ plane

    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      pos.setY(i, lossHeight(x, z));
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
    return geo;
  }, []);

  // Wireframe overlay
  const wireGeo = useMemo(() => new THREE.WireframeGeometry(geometry), [geometry]);

  return (
    <group>
      {/* Solid base layer — subtle gradient fill */}
      <mesh geometry={geometry}>
        <meshStandardMaterial
          color="#15151d"
          roughness={0.9}
          metalness={0.1}
          side={THREE.FrontSide}
        />
      </mesh>
      {/* Wireframe overlay */}
      <lineSegments geometry={wireGeo}>
        <lineBasicMaterial color="#26262f" transparent opacity={0.7} />
      </lineSegments>
    </group>
  );
}

// ── Pre-trained sphere (plateau, cyan) ────────────────────────────

function PreTrainedSphere({ progress }) {
  const t = Math.max(0, (progress - 0.2) / 0.2);
  if (t < 0.02) return null;

  const [x, y, z] = PATH_POINTS[0];

  return (
    <mesh position={[x, y, z]}>
      <sphereGeometry args={[0.18, 24, 24]} />
      <meshStandardMaterial
        color="#22d3ee"
        emissive="#22d3ee"
        emissiveIntensity={t * 0.8}
        roughness={0.2}
        metalness={0.6}
        transparent
        opacity={t}
      />
    </mesh>
  );
}

// ── Fine-tuned sphere (valley, amber) ─────────────────────────────

function FineTunedSphere({ progress }) {
  const t = Math.max(0, (progress - 0.85) / 0.15);
  if (t < 0.02) return null;

  const [x, y, z] = PATH_POINTS[PATH_POINTS.length - 1];

  return (
    <mesh position={[x, y, z]}>
      <sphereGeometry args={[0.18, 24, 24]} />
      <meshStandardMaterial
        color="#f59e0b"
        emissive="#f59e0b"
        emissiveIntensity={t * 1.2}
        roughness={0.2}
        metalness={0.5}
        transparent
        opacity={t}
      />
    </mesh>
  );
}

// ── Gradient arrows ────────────────────────────────────────────────

function GradientArrows({ progress }) {
  const t = Math.max(0, (progress - 0.42) / 0.2);
  if (t < 0.02) return null;

  // 4 arrows pointing downhill from mid-path positions
  const arrowDefs = [
    { from: [-0.9, lossHeight(-0.9, -1.0) + 0.15, -1.0], dir: [0.4, -0.1, 0.3] },
    { from: [-0.3, lossHeight(-0.3, -0.5) + 0.15, -0.5], dir: [0.4, -0.08, 0.35] },
    { from: [ 0.3, lossHeight( 0.3,  0.0) + 0.15,  0.0], dir: [0.35, -0.06, 0.4] },
    { from: [ 0.8, lossHeight( 0.8,  0.5) + 0.15,  0.5], dir: [0.25, -0.04, 0.3] },
  ];

  return (
    <group>
      {arrowDefs.map(({ from, dir }, i) => {
        const origin = new THREE.Vector3(...from);
        const direction = new THREE.Vector3(...dir).normalize();
        const length = 0.45;

        // Shaft
        const shaftEnd = origin.clone().addScaledVector(direction, length * 0.75);
        const shaftPoints = [origin.toArray(), shaftEnd.toArray()];

        // Head (small cone tip direction)
        const headEnd = origin.clone().addScaledVector(direction, length);

        return (
          <group key={i}>
            {/* Shaft line */}
            <line>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  args={[new Float32Array([...shaftPoints[0], ...shaftPoints[1]]), 3]}
                />
              </bufferGeometry>
              <lineBasicMaterial
                color="#f59e0b"
                transparent
                opacity={t * 0.85}
              />
            </line>
            {/* Arrowhead cone */}
            <mesh
              position={headEnd.toArray()}
              quaternion={new THREE.Quaternion().setFromUnitVectors(
                new THREE.Vector3(0, 1, 0),
                direction
              )}
            >
              <coneGeometry args={[0.055, 0.18, 8]} />
              <meshStandardMaterial
                color="#f59e0b"
                emissive="#f59e0b"
                emissiveIntensity={t * 0.6}
                transparent
                opacity={t * 0.9}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// ── Optimisation path trail spheres ──────────────────────────────

function OptimPath({ progress }) {
  const trailT = Math.max(0, (progress - 0.6) / 0.35);
  if (trailT < 0.02) return null;

  // Show progressively more waypoints as scroll advances
  const count = Math.ceil(trailT * PATH_POINTS.length);

  return (
    <group>
      {PATH_POINTS.slice(0, count).map(([x, y, z], i) => {
        const frac = i / (PATH_POINTS.length - 1);
        // Colour lerp: cyan (start) → amber (end)
        const r = Math.round(0x22 + frac * (0xf5 - 0x22)).toString(16).padStart(2, '0');
        const g = Math.round(0xd3 + frac * (0x9e - 0xd3)).toString(16).padStart(2, '0');
        const b = Math.round(0xee + frac * (0x0b - 0xee)).toString(16).padStart(2, '0');
        const col = `#${r}${g}${b}`;

        const pointOpacity = Math.min(1, (trailT - (i / PATH_POINTS.length) * 0.7) * 3);

        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[0.07, 12, 12]} />
            <meshStandardMaterial
              color={col}
              emissive={col}
              emissiveIntensity={0.6}
              transparent
              opacity={Math.max(0, pointOpacity)}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// ── Camera ────────────────────────────────────────────────────────

function CameraRig({ progress }) {
  useFrame(({ camera }) => {
    // Drift from angled overview → birds-eye
    const targetZ = 7 - progress * 1.5;
    const targetY = 5 + progress * 2.5;
    const targetX = -0.5 + progress * 0.5;
    camera.position.x += (targetX - camera.position.x) * 0.04;
    camera.position.y += (targetY - camera.position.y) * 0.04;
    camera.position.z += (targetZ - camera.position.z) * 0.04;
    camera.lookAt(0, 0.5, 0);
  });
  return null;
}

// ── Scene root ────────────────────────────────────────────────────

function SceneContent() {
  const { progress } = useScrollProgress();

  return (
    <>
      <color attach="background" args={['#0a0a0f']} />

      <ambientLight intensity={0.3} />
      <pointLight position={[5, 8, 5]}   intensity={1.5} color="#22d3ee" />
      <pointLight position={[-5, 5, -3]} intensity={0.8} color="#a78bfa" />
      <pointLight position={[2, 3, 2]}   intensity={0.6} color="#f59e0b" />

      <LossTerrain />
      <PreTrainedSphere progress={progress} />
      <GradientArrows   progress={progress} />
      <OptimPath        progress={progress} />
      <FineTunedSphere  progress={progress} />
      <CameraRig        progress={progress} />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI * 0.45}
        minPolarAngle={Math.PI * 0.1}
      />
    </>
  );
}

/**
 * Segment A — Fine-Tuning 3D scene.
 *
 * Layout:
 *   A parametric loss landscape (PlaneGeometry 40×40 segments displaced
 *   by f(x,z) = 2 - 1.8·exp(-((x-1.5)²+(z-1.5)²)/3) + 0.3·sin(x)·cos(z))
 *   with wireframe overlay, showing a broad plateau (pre-trained region)
 *   and a sharp valley (task-specific minimum).
 *
 * Scroll choreography:
 *   0%   — loss landscape only (wireframe terrain)
 *   25%  — pre-trained sphere appears at plateau (cyan)
 *   50%  — gradient arrows appear, pointing downhill (amber)
 *   75%  — optimisation path trail animates plateau → valley
 *   100% — fine-tuned sphere lights up at valley; camera birds-eye
 */
export default function Scene() {
  return (
    <Canvas
      aria-hidden="true"
      camera={{ position: [-0.5, 7, 5.5], fov: 52 }}
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 2]}
    >
      <SceneContent />
    </Canvas>
  );
}

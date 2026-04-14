import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useScrollProgress } from '../../../lib/ScrollContext.jsx';
import { useReducedMotion } from '../../../three/hooks/useReducedMotion.js';

// ── Network topology ────────────────────────────────────────────────
const LAYERS = [
  { count: 4, x: -3 },
  { count: 6, x: -1 },
  { count: 6, x:  1 },
  { count: 3, x:  3 },
];

function layerPositions(layer) {
  const spacing = 0.7;
  const offset = ((layer.count - 1) * spacing) / 2;
  return Array.from({ length: layer.count }, (_, i) => [layer.x, i * spacing - offset, 0]);
}

// Seeded pseudo-random for stable dropout masks between renders
function seededRandom(seed) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function buildDropoutMask(layer, dropRate, seed) {
  return Array.from({ length: layer.count }, (_, i) => seededRandom(seed * 100 + i) > dropRate);
}

function Neuron({ position, active, progress, layerIdx, reducedMotion }) {
  const meshRef = useRef();
  const appearAt = (layerIdx / LAYERS.length) * 0.35;
  const t = Math.max(0, Math.min(1, (progress - appearAt) / 0.2));

  const color = active ? '#22d3ee' : '#334155';
  const emissive = active ? '#22d3ee' : '#1e293b';

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const pulse = active && !reducedMotion ? 1 + Math.sin(clock.getElapsedTime() * 2.2 + layerIdx * 0.5) * 0.04 * t : 1;
    meshRef.current.scale.setScalar(t * pulse);
    meshRef.current.material.emissiveIntensity = active ? 0.15 + t * 0.6 : 0.05 + t * 0.1;
    meshRef.current.material.opacity = active ? 0.9 : 0.22 + t * 0.1;
  });

  return (
    <mesh ref={meshRef} position={position} scale={0}>
      <sphereGeometry args={[0.16, 20, 20]} />
      <meshStandardMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={0.15}
        transparent
        opacity={active ? 0.9 : 0.3}
        roughness={0.3}
        metalness={0.5}
      />
    </mesh>
  );
}

function Connection({ from, to, active, progress, showAt }) {
  const t = Math.max(0, Math.min(1, (progress - showAt) / 0.2));
  if (t < 0.01) return null;

  return (
    <Line
      points={[from, to]}
      color={active ? '#22d3ee' : '#1e293b'}
      lineWidth={active ? 0.7 + t * 0.4 : 0.3}
      transparent
      opacity={active ? 0.06 + t * 0.18 : 0.04}
    />
  );
}

function CameraRig({ progress, reducedMotion }) {
  const ref = useRef(progress);
  ref.current = progress;

  useFrame(({ camera }) => {
    const p = ref.current;
    const targetZ = 7 + p * 2;
    const targetY = p * 0.4;
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

function SceneContent({ dropRate, reducedMotion }) {
  const { progress } = useScrollProgress();

  // Regenerate mask on dropRate change
  const seed = Math.round(progress * 10); // changes mask every 10% scroll
  const allPositions = useMemo(() => LAYERS.map(layerPositions), []);

  const masks = useMemo(
    () => LAYERS.map((layer, li) => buildDropoutMask(layer, progress > 0.4 ? dropRate : 0, li + seed)),
    [dropRate, seed, progress]
  );

  return (
    <>
      <color attach="background" args={['#0a0a0f']} />
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 5, 5]} intensity={2.5} color="#22d3ee" />
      <pointLight position={[-4, -4, -3]} intensity={1.0} color="#a78bfa" />

      {/* Neurons */}
      {LAYERS.map((layer, li) =>
        allPositions[li].map((pos, ni) => (
          <Neuron
            key={`n-${li}-${ni}`}
            position={pos}
            active={masks[li][ni]}
            progress={progress}
            layerIdx={li}
            reducedMotion={reducedMotion}
          />
        ))
      )}

      {/* Connections — only draw if both ends active */}
      {LAYERS.slice(0, -1).map((_, li) =>
        allPositions[li].map((from, fi) =>
          allPositions[li + 1].map((to, ti) => {
            const active = masks[li][fi] && masks[li + 1][ti];
            return (
              <Connection
                key={`c-${li}-${fi}-${ti}`}
                from={from}
                to={to}
                active={active}
                progress={progress}
                showAt={0.15 + li * 0.08}
              />
            );
          })
        )
      )}

      <CameraRig progress={progress} reducedMotion={reducedMotion} />
      <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI * 0.75} minPolarAngle={Math.PI * 0.25} />
    </>
  );
}

/**
 * Regularization scene — neural network with dropout applied.
 *
 * Scroll choreography:
 *   0–35%  Full network materialises (all neurons active, cyan)
 *  35–60%  Dropout kicks in — random neurons dim grey/dark
 *  60–80%  Dropout mask changes subtly to show stochastic nature
 *  80–100% Camera pulls back revealing sparse connectivity
 */
export default function Scene({ dropRate = 0.4 }) {
  const reducedMotion = useReducedMotion();

  return (
    <Canvas
      aria-hidden="true"
      camera={{ position: [0, 0.2, 7], fov: 52 }}
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 2]}
    >
      <SceneContent dropRate={dropRate} reducedMotion={reducedMotion} />
    </Canvas>
  );
}

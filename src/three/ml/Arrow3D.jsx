import { useMemo } from 'react';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

export default function Arrow3D({ from = [0, 0, 0], to, color, lineWidth = 3 }) {
  const dir = useMemo(() => new THREE.Vector3(...to).sub(new THREE.Vector3(...from)), [from, to]);
  const length = dir.length();
  const normalizedDir = useMemo(() => {
    if (length === 0) return new THREE.Vector3(0, 1, 0);
    return dir.clone().normalize();
  }, [dir, length]);
  const coneHeight = Math.min(0.25, length * 0.25);
  const conePos = useMemo(() => {
    const tip = new THREE.Vector3(...to);
    return tip.sub(normalizedDir.clone().multiplyScalar(coneHeight / 2)).toArray();
  }, [to, normalizedDir, coneHeight]);
  const coneQuat = useMemo(() => {
    const quat = new THREE.Quaternion();
    quat.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normalizedDir);
    return quat;
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
          emissiveIntensity={0.85}
          roughness={0.15}
          metalness={0.08}
        />
      </mesh>
    </group>
  );
}

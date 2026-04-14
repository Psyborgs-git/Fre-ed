import * as THREE from 'three';

export default function GlowSphere({
  radius = 0.2,
  glowRadius = radius * 1.45,
  color = '#22d3ee',
  glowOpacity = 0.08,
  emissiveIntensity = 0.5,
  position = [0, 0, 0],
}) {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[glowRadius, 18, 18]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={glowOpacity}
          side={THREE.BackSide}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[radius, 24, 24]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={emissiveIntensity}
          roughness={0.25}
          metalness={0.55}
        />
      </mesh>
    </group>
  );
}

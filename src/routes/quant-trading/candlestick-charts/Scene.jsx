import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useScrollProgress } from '../../../lib/ScrollContext.jsx';
import { useReducedMotion } from '../../../three/hooks/useReducedMotion.js';

// Deterministic OHLC data — 20 candles
const OHLC_DATA = [
  { o: 100, h: 108, l: 98,  c: 106 },
  { o: 106, h: 110, l: 104, c: 108 },
  { o: 108, h: 112, l: 105, c: 107 },
  { o: 107, h: 111, l: 103, c: 104 },
  { o: 104, h: 109, l: 101, c: 108 },
  { o: 108, h: 113, l: 107, c: 112 },
  { o: 112, h: 116, l: 110, c: 111 },
  { o: 111, h: 114, l: 108, c: 113 },
  { o: 113, h: 118, l: 111, c: 116 },
  { o: 116, h: 120, l: 114, c: 115 },
  { o: 115, h: 119, l: 112, c: 113 },
  { o: 113, h: 116, l: 110, c: 115 },
  { o: 115, h: 120, l: 113, c: 119 },
  { o: 119, h: 123, l: 117, c: 121 },
  { o: 121, h: 124, l: 118, c: 119 },
  { o: 119, h: 122, l: 116, c: 117 },
  { o: 117, h: 121, l: 114, c: 120 },
  { o: 120, h: 125, l: 118, c: 123 },
  { o: 123, h: 127, l: 121, c: 122 },
  { o: 122, h: 126, l: 119, c: 125 },
];

// Volume data (deterministic)
const VOLUMES = [42, 55, 38, 60, 47, 70, 35, 52, 65, 48, 58, 44, 73, 61, 39, 50, 67, 76, 43, 80];

const PRICE_MIN = 98;
const PRICE_MAX = 127;
const PRICE_RANGE = PRICE_MAX - PRICE_MIN;
const VOL_MAX = 80;

function normalisePrice(p) {
  return ((p - PRICE_MIN) / PRICE_RANGE) * 3.5 - 1.75;
}

const COLOR_UP   = '#34d399';
const COLOR_DOWN = '#f43f5e';

// Pre-compute per-candle geometry data
const CANDLE_GEOM = OHLC_DATA.map((d, i) => {
  const isUp  = d.c >= d.o;
  const bodyLo = normalisePrice(Math.min(d.o, d.c));
  const bodyHi = normalisePrice(Math.max(d.o, d.c));
  const bodyH  = Math.max(bodyHi - bodyLo, 0.04);
  const bodyY  = bodyLo + bodyH / 2;
  const wickLo = normalisePrice(d.l);
  const wickHi = normalisePrice(d.h);
  const xPos   = (i - 9.5) * 0.55;
  const volH   = (VOLUMES[i] / VOL_MAX) * 0.6;
  return { isUp, bodyH, bodyY, wickLo, wickHi, xPos, volH, color: isUp ? COLOR_UP : COLOR_DOWN };
});

function Candle({ geom, visible }) {
  const meshRef = useRef();

  return (
    <group position={[geom.xPos, 0, 0]} visible={visible}>
      {/* Body */}
      <mesh ref={meshRef} position={[0, geom.bodyY, 0]}>
        <boxGeometry args={[0.3, geom.bodyH, 0.15]} />
        <meshStandardMaterial
          color={geom.color}
          emissive={geom.color}
          emissiveIntensity={0.25}
          roughness={0.4}
          metalness={0.3}
        />
      </mesh>

      {/* Wick */}
      <Line
        points={[[0, geom.wickLo, 0], [0, geom.wickHi, 0]]}
        color={geom.color}
        lineWidth={1}
      />

      {/* Volume bar — positioned below chart floor */}
      <mesh position={[0, -2.5 + geom.volH / 2, 0]}>
        <boxGeometry args={[0.28, geom.volH, 0.12]} />
        <meshStandardMaterial
          color={geom.color}
          emissive={geom.color}
          emissiveIntensity={0.15}
          transparent
          opacity={0.6}
          roughness={0.6}
        />
      </mesh>
    </group>
  );
}

// Horizontal grid lines
function GridLines() {
  const lines = useMemo(() => {
    return [-1.75, -0.875, 0, 0.875, 1.75].map((y) => ({
      y,
      pts: [[-5.5, y, 0], [5.5, y, 0]],
    }));
  }, []);

  return (
    <>
      {lines.map(({ y, pts }) => (
        <Line key={y} points={pts} color="#334155" lineWidth={0.5} />
      ))}
    </>
  );
}

function SceneContent({ reducedMotion }) {
  const { progress } = useScrollProgress();

  // How many candles are revealed (scroll animates them left to right)
  const revealCount = Math.round(progress * CANDLE_GEOM.length);

  return (
    <>
      <color attach="background" args={['#0a0a0f']} />
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 4, 4]} intensity={2} color="#22d3ee" />
      <pointLight position={[-3, 2, 3]} intensity={1} color="#f59e0b" />

      <GridLines />

      {CANDLE_GEOM.map((geom, i) => (
        <Candle key={i} geom={geom} visible={i < revealCount} />
      ))}

      {/* Separator line between candles and volume bars */}
      <Line
        points={[[-5.5, -2.2, 0], [5.5, -2.2, 0]]}
        color="#334155"
        lineWidth={1}
      />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI * 0.65}
        minPolarAngle={Math.PI * 0.35}
        maxAzimuthAngle={Math.PI * 0.2}
        minAzimuthAngle={-Math.PI * 0.2}
      />
    </>
  );
}

export default function Scene() {
  const reducedMotion = useReducedMotion();
  return (
    <Canvas
      aria-hidden="true"
      camera={{ position: [0, 0, 8], fov: 50 }}
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 2]}
    >
      <SceneContent reducedMotion={reducedMotion} />
    </Canvas>
  );
}

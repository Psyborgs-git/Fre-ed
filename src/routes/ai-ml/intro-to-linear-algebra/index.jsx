import { lazy, useState } from 'react';
import RouteLayout from '../../../components/RouteLayout.jsx';
import { meta } from './meta.js';
import Page from './Page.mdx';

// 3D scene is code-split — loads only when this route is visited
const Scene = lazy(() => import('./Scene.jsx'));

const CHAPTERS = ['Axes', 'Vector components', 'Projection', 'Transforms', 'ML intuition'];
const LEGEND = [
  { label: 'Cyan', color: '#22d3ee', description: 'x-axis and primary basis direction' },
  { label: 'Violet', color: '#a78bfa', description: 'y-axis and secondary structure' },
  { label: 'Amber', color: '#f59e0b', description: 'your editable vector in space' },
];
const MATRIX_OPTIONS = [
  { label: 'Identity', value: 'identity' },
  { label: 'Shear', value: 'shear' },
  { label: 'Rotate', value: 'rotate' },
];

export default function IntroToLinearAlgebra() {
  const [vectorX, setVectorX] = useState(1.5);
  const [vectorY, setVectorY] = useState(1.2);
  const [vectorZ, setVectorZ] = useState(0.8);
  const [matrixPreset, setMatrixPreset] = useState('identity');

  return (
    <RouteLayout
      Scene={Scene}
      meta={meta}
      chapters={CHAPTERS}
      sceneProps={{ vector: [vectorX, vectorY, vectorZ], matrixPreset }}
      sceneLegend={LEGEND}
      scenePrompt="Dial a vector and switch the matrix preset to see how the same point moves through space."
      interactionHint="Orbit to inspect the basis · Adjust vector and matrix controls to explore transformations"
      sceneControls={[
        { type: 'range', id: 'vector-x', label: 'Vector X', value: vectorX, min: -2, max: 2, step: 0.1, onChange: setVectorX },
        { type: 'range', id: 'vector-y', label: 'Vector Y', value: vectorY, min: -2, max: 2, step: 0.1, onChange: setVectorY },
        { type: 'range', id: 'vector-z', label: 'Vector Z', value: vectorZ, min: -2, max: 2, step: 0.1, onChange: setVectorZ },
        { type: 'segmented', id: 'matrix-preset', label: 'Matrix preset', value: matrixPreset, options: MATRIX_OPTIONS, onChange: setMatrixPreset },
      ]}
    >
      <Page />
    </RouteLayout>
  );
}

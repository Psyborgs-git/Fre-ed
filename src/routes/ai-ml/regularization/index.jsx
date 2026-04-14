import { lazy, useState } from 'react';
import RouteLayout from '../../../components/RouteLayout.jsx';
import { meta } from './meta.js';
import Page from './Page.mdx';

const Scene = lazy(() => import('./Scene.jsx'));

const CHAPTERS = ['Full network', 'Dropout applied', 'Sparse connectivity', 'Ensemble effect'];
const LEGEND = [
  { label: 'Cyan',       color: '#22d3ee', description: 'active neuron — participates this forward pass' },
  { label: 'Dark grey',  color: '#334155', description: 'dropped neuron — silenced this training step' },
];
const DROPOUT_OPTIONS = [
  { label: '0%',  value: 0 },
  { label: '20%', value: 0.2 },
  { label: '40%', value: 0.4 },
  { label: '60%', value: 0.6 },
];

export default function Regularization() {
  const [dropRate, setDropRate] = useState(0.4);

  return (
    <RouteLayout
      Scene={Scene}
      meta={meta}
      chapters={CHAPTERS}
      sceneProps={{ dropRate }}
      sceneLegend={LEGEND}
      scenePrompt="Adjust dropout rate to see how sparsity affects the active network."
      sceneControls={[
        { type: 'segmented', id: 'drop-rate', label: 'Dropout rate', value: dropRate, options: DROPOUT_OPTIONS, onChange: setDropRate },
      ]}
    >
      <Page />
    </RouteLayout>
  );
}

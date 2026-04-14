import { lazy, useState } from 'react';
import RouteLayout from '../../../components/RouteLayout.jsx';
import { meta } from './meta.js';
import Page from './Page.mdx';

const Scene = lazy(() => import('./Scene.jsx'));

const CHAPTERS = ['Raw activations', 'Statistics', 'After normalisation', 'Distribution comparison'];
const LEGEND = [
  { label: 'Violet', color: '#a78bfa', description: 'pre-normalisation activations (spread, biased)' },
  { label: 'Cyan',   color: '#22d3ee', description: 'post-BatchNorm (centred, unit variance)' },
  { label: 'Green',  color: '#34d399', description: 'post-LayerNorm' },
  { label: 'Amber',  color: '#f59e0b', description: 'mean line indicator' },
];
const NORM_OPTIONS = [
  { label: 'LayerNorm', value: 'layer' },
  { label: 'BatchNorm', value: 'batch' },
  { label: 'RMSNorm',   value: 'rms' },
];

export default function Normalization() {
  const [normType, setNormType] = useState('layer');

  return (
    <RouteLayout
      Scene={Scene}
      meta={meta}
      chapters={CHAPTERS}
      sceneProps={{ normType }}
      sceneLegend={LEGEND}
      scenePrompt="Switch normalisation type to compare how BatchNorm, LayerNorm, and RMSNorm each reshape the distribution."
      sceneControls={[
        { type: 'segmented', id: 'norm-type', label: 'Normalisation method', value: normType, options: NORM_OPTIONS, onChange: setNormType },
      ]}
    >
      <Page />
    </RouteLayout>
  );
}

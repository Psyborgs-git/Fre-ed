import { lazy, useState } from 'react';
import RouteLayout from '../../../components/RouteLayout.jsx';
import { meta } from './meta.js';
import Page from './Page.mdx';

const Scene = lazy(() => import('./Scene.jsx'));

const CHAPTERS = ['Loss landscape', 'SGD path', 'Adaptive optimisers', 'Convergence'];
const LEGEND = [
  { label: 'Violet', color: '#a78bfa', description: 'SGD — slow, zigzag descent' },
  { label: 'Amber',  color: '#f59e0b', description: 'SGD + Momentum — smoother trajectory' },
  { label: 'Green',  color: '#34d399', description: 'RMSProp — adaptive per-parameter rates' },
  { label: 'Cyan',   color: '#22d3ee', description: 'Adam — fastest, direct convergence' },
];

const OPTIMIZER_SETS = [
  { label: 'All four', value: 'all' },
  { label: 'SGD only', value: 'sgd-only' },
  { label: 'Adam only', value: 'adam-only' },
];

export default function Optimizers() {
  const [optiSet, setOptiSet] = useState('all');

  const visibleOptimizers = {
    all:       ['sgd', 'momentum', 'rmsprop', 'adam'],
    'sgd-only': ['sgd'],
    'adam-only': ['adam'],
  }[optiSet];

  return (
    <RouteLayout
      Scene={Scene}
      meta={meta}
      chapters={CHAPTERS}
      sceneProps={{ visibleOptimizers }}
      sceneLegend={LEGEND}
      scenePrompt="Toggle between all optimisers and individual ones to compare convergence paths."
      sceneControls={[
        { type: 'segmented', id: 'optimizer-set', label: 'Show optimisers', value: optiSet, options: OPTIMIZER_SETS, onChange: setOptiSet },
      ]}
    >
      <Page />
    </RouteLayout>
  );
}

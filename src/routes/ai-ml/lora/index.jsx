import { lazy, useState } from 'react';
import RouteLayout from '../../../components/RouteLayout.jsx';
import { meta } from './meta.js';
import Page from './Page.mdx';

const Scene = lazy(() => import('./Scene.jsx'));
const CHAPTERS = ['Frozen base', 'Adapter matrices', 'Low-rank bottleneck', 'Merged delta'];
const LEGEND = [
  { label: 'Grey W', color: '#64748b', description: 'the frozen base model weights' },
  { label: 'Cyan A', color: '#22d3ee', description: 'down projection into a low-rank space' },
  { label: 'Violet B', color: '#a78bfa', description: 'up projection back into model space' },
];
const RANK_OPTIONS = [
  { label: 'r=2', value: 2 },
  { label: 'r=4', value: 4 },
  { label: 'r=8', value: 8 },
];

export default function Lora() {
  const [rank, setRank] = useState(2);

  return (
    <RouteLayout
      Scene={Scene}
      meta={meta}
      chapters={CHAPTERS}
      sceneProps={{ rank }}
      sceneLegend={LEGEND}
      scenePrompt="Increase the rank to see the adapter grow, then compare it against the frozen base matrix."
      sceneControls={[
        { type: 'segmented', id: 'adapter-rank', label: 'Adapter rank', value: rank, options: RANK_OPTIONS, onChange: setRank },
      ]}
    >
      <Page />
    </RouteLayout>
  );
}

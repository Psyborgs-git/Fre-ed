import { lazy, useState } from 'react';
import RouteLayout from '../../../components/RouteLayout.jsx';
import { meta } from './meta.js';
import Page from './Page.mdx';

const Scene = lazy(() => import('./Scene.jsx'));
const CHAPTERS = ['Input token', 'Router scores', 'Selected experts', 'Merged output'];
const LEGEND = [
  { label: 'Violet token', color: '#a78bfa', description: 'the token entering the router' },
  { label: 'Cyan experts', color: '#22d3ee', description: 'experts chosen by the gate' },
  { label: 'Amber routes', color: '#f59e0b', description: 'the active top-k paths' },
];
const TOP_K_OPTIONS = [
  { label: 'k=1', value: 1 },
  { label: 'k=2', value: 2 },
  { label: 'k=4', value: 4 },
];

export default function Moe() {
  const [topK, setTopK] = useState(2);

  return (
    <RouteLayout
      Scene={Scene}
      meta={meta}
      chapters={CHAPTERS}
      sceneProps={{ topK }}
      sceneLegend={LEGEND}
      scenePrompt="Raise top-k to spread one token across more experts and compare the routing pattern."
      sceneControls={[
        { type: 'segmented', id: 'top-k', label: 'Top-k', value: topK, options: TOP_K_OPTIONS, onChange: setTopK },
      ]}
    >
      <Page />
    </RouteLayout>
  );
}

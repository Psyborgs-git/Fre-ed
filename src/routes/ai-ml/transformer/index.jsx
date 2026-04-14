import { lazy, useState } from 'react';
import RouteLayout from '../../../components/RouteLayout.jsx';
import { meta } from './meta.js';
import Page from './Page.mdx';

const Scene = lazy(() => import('./Scene.jsx'));
const CHAPTERS = ['Input tokens', 'Attention heads', 'Feedforward mix', 'Residual output'];
const LEGEND = [
  { label: 'Violet tokens', color: '#a78bfa', description: 'inputs entering the block' },
  { label: 'Cyan head', color: '#22d3ee', description: 'the selected attention head' },
  { label: 'Amber FFN', color: '#f59e0b', description: 'feedforward refinement before output' },
];
const HEAD_OPTIONS = [
  { label: 'Head 1', value: 0 },
  { label: 'Head 2', value: 1 },
  { label: 'Head 3', value: 2 },
  { label: 'Head 4', value: 3 },
];

export default function Transformer() {
  const [selectedHead, setSelectedHead] = useState(0);

  return (
    <RouteLayout
      Scene={Scene}
      meta={meta}
      chapters={CHAPTERS}
      sceneProps={{ selectedHead }}
      sceneLegend={LEGEND}
      scenePrompt="Switch between attention heads to isolate different communication patterns before the FFN stage."
      sceneControls={[
        { type: 'segmented', id: 'transformer-head', label: 'Attention head', value: selectedHead, options: HEAD_OPTIONS, onChange: setSelectedHead, formatValue: (value) => `Head ${value + 1}` },
      ]}
    >
      <Page />
    </RouteLayout>
  );
}

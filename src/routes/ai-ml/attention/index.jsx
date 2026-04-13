import { lazy, useState } from 'react';
import RouteLayout from '../../../components/RouteLayout.jsx';
import { meta } from './meta.js';
import Page from './Page.mdx';

const Scene = lazy(() => import('./Scene.jsx'));

const CHAPTERS = ['Query · Key · Value', 'Dot-product scores', 'Softmax attention weights', 'Context vectors'];
const LEGEND = [
  { label: 'Violet tokens', color: '#a78bfa', description: 'input token embeddings' },
  { label: 'Cyan links', color: '#22d3ee', description: 'attention scores and matrix highlights' },
  { label: 'Amber output', color: '#f59e0b', description: 'the strongest attended context' },
];
const TOKEN_OPTIONS = Array.from({ length: 6 }, (_, index) => ({
  label: `T${index + 1}`,
  value: index,
}));

export default function Attention() {
  const [selectedToken, setSelectedToken] = useState(0);

  return (
    <RouteLayout
      Scene={Scene}
      meta={meta}
      chapters={CHAPTERS}
      sceneProps={{ selectedToken }}
      sceneLegend={LEGEND}
      scenePrompt="Pick a token and follow its row across the score lines and softmax matrix to see what it attends to."
      sceneControls={[
        { type: 'segmented', id: 'attention-token', label: 'Focus token', value: selectedToken, options: TOKEN_OPTIONS, onChange: setSelectedToken, formatValue: (value) => `T${value + 1}` },
      ]}
    >
      <Page />
    </RouteLayout>
  );
}

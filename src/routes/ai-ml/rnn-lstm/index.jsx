import { lazy, useState } from 'react';
import RouteLayout from '../../../components/RouteLayout.jsx';
import { meta } from './meta.js';
import Page from './Page.mdx';

const Scene = lazy(() => import('./Scene.jsx'));

const CHAPTERS = ['Input sequence', 'Hidden states', 'Cell state (LSTM)', 'Gates & memory'];
const LEGEND = [
  { label: 'Violet',  color: '#a78bfa', description: 'input tokens x_t' },
  { label: 'Cyan',    color: '#22d3ee', description: 'LSTM hidden state h_t (brighter = stronger memory)' },
  { label: 'Amber',   color: '#f59e0b', description: 'vanilla RNN hidden state (fades over time)' },
  { label: 'Green',   color: '#34d399', description: 'LSTM cell state c_t — long-range conveyor belt' },
];

const CELL_OPTIONS = [
  { label: 'LSTM', value: 'lstm' },
  { label: 'Vanilla RNN', value: 'rnn' },
];

export default function RnnLstm() {
  const [cellType, setCellType] = useState('lstm');

  return (
    <RouteLayout
      Scene={Scene}
      meta={meta}
      chapters={CHAPTERS}
      sceneProps={{ cellType }}
      sceneLegend={LEGEND}
      scenePrompt="Switch between LSTM and vanilla RNN to see how memory strength decays differently."
      sceneControls={[
        { type: 'segmented', id: 'cell-type', label: 'Cell type', value: cellType, options: CELL_OPTIONS, onChange: setCellType },
      ]}
    >
      <Page />
    </RouteLayout>
  );
}

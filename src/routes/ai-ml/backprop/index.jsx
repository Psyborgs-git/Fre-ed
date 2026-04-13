import { lazy, useState } from 'react';
import RouteLayout from '../../../components/RouteLayout.jsx';
import { meta } from './meta.js';
import Page from './Page.mdx';

const Scene = lazy(() => import('./Scene.jsx'));

const CHAPTERS = ['Forward pass', 'Loss computed', 'Gradients flow back', 'Weights updated'];
const LEGEND = [
  { label: 'Cyan pulse', color: '#22d3ee', description: 'forward activations moving to the output' },
  { label: 'Red loss', color: '#ef4444', description: 'the error signal to minimize' },
  { label: 'Amber pulse', color: '#f59e0b', description: 'gradients travelling backward through the net' },
];

export default function Backprop() {
  const [learningRate, setLearningRate] = useState(0.3);

  return (
    <RouteLayout
      Scene={Scene}
      meta={meta}
      chapters={CHAPTERS}
      sceneProps={{ learningRate }}
      sceneLegend={LEGEND}
      scenePrompt="Increase the learning rate to make the backward signal more aggressive, then lower it to see a gentler update."
      sceneControls={[
        { type: 'range', id: 'learning-rate', label: 'Learning rate', value: learningRate, min: 0.1, max: 1, step: 0.05, onChange: setLearningRate },
      ]}
    >
      <Page />
    </RouteLayout>
  );
}

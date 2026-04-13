import { lazy, useState } from 'react';
import RouteLayout from '../../../components/RouteLayout.jsx';
import { meta } from './meta.js';
import Page from './Page.mdx';

// 3D scene is code-split — loads only when this route is visited
const Scene = lazy(() => import('./Scene.jsx'));
const CHAPTERS = ['Inputs', 'Weighted sum', 'Activation', 'Decision boundary'];
const LEGEND = [
  { label: 'Violet nodes', color: '#a78bfa', description: 'input features entering the neuron' },
  { label: 'Cyan core', color: '#22d3ee', description: 'the neuron combining weights and bias' },
  { label: 'Amber output', color: '#f59e0b', description: 'the final activation and class vote' },
];

export default function Perceptron() {
  const [w1, setW1] = useState(-0.8);
  const [w2, setW2] = useState(0.6);
  const [w3, setW3] = useState(-0.3);
  const [w4, setW4] = useState(0.9);
  const [bias, setBias] = useState(0.2);

  return (
    <RouteLayout
      Scene={Scene}
      meta={meta}
      chapters={CHAPTERS}
      sceneProps={{ weights: [w1, w2, w3, w4], bias }}
      sceneLegend={LEGEND}
      scenePrompt="Flip a weight from negative to positive and watch the boundary tilt while the output neuron changes confidence."
      interactionHint="Scroll to stage the walkthrough · Tweak weights and bias to probe the classifier"
      sceneControls={[
        { type: 'range', id: 'w1', label: 'Weight 1', value: w1, min: -1.5, max: 1.5, step: 0.1, onChange: setW1 },
        { type: 'range', id: 'w2', label: 'Weight 2', value: w2, min: -1.5, max: 1.5, step: 0.1, onChange: setW2 },
        { type: 'range', id: 'w3', label: 'Weight 3', value: w3, min: -1.5, max: 1.5, step: 0.1, onChange: setW3 },
        { type: 'range', id: 'w4', label: 'Weight 4', value: w4, min: -1.5, max: 1.5, step: 0.1, onChange: setW4 },
        { type: 'range', id: 'bias', label: 'Bias', value: bias, min: -1.5, max: 1.5, step: 0.1, onChange: setBias },
      ]}
    >
      <Page />
    </RouteLayout>
  );
}

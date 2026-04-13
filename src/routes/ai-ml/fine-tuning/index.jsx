import { lazy, useState } from 'react';
import RouteLayout from '../../../components/RouteLayout.jsx';
import { meta } from './meta.js';
import Page from './Page.mdx';

const Scene = lazy(() => import('./Scene.jsx'));
const CHAPTERS = ['Pre-trained plateau', 'Gradient direction', 'Optimization path', 'Fine-tuned valley'];
const LEGEND = [
  { label: 'Cyan sphere', color: '#22d3ee', description: 'the pre-trained starting point' },
  { label: 'Amber arrows', color: '#f59e0b', description: 'gradient direction and optimizer steps' },
  { label: 'Amber valley', color: '#f59e0b', description: 'the task-specific optimum' },
];
const OPTIMIZER_OPTIONS = [
  { label: 'SGD', value: 'sgd' },
  { label: 'Momentum', value: 'momentum' },
  { label: 'Adam', value: 'adam' },
];

export default function FineTuning() {
  const [optimizer, setOptimizer] = useState('adam');
  const [learningRate, setLearningRate] = useState(0.3);

  return (
    <RouteLayout
      Scene={Scene}
      meta={meta}
      chapters={CHAPTERS}
      sceneProps={{ optimizer, learningRate }}
      sceneLegend={LEGEND}
      scenePrompt="Compare optimizers and learning rates to see how the path into the valley changes."
      sceneControls={[
        { type: 'segmented', id: 'optimizer', label: 'Optimizer', value: optimizer, options: OPTIMIZER_OPTIONS, onChange: setOptimizer },
        { type: 'range', id: 'ft-learning-rate', label: 'Learning rate', value: learningRate, min: 0.1, max: 1, step: 0.05, onChange: setLearningRate },
      ]}
    >
      <Page />
    </RouteLayout>
  );
}

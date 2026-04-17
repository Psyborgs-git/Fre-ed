import { lazy } from 'react';
import RouteLayout from '../../../components/RouteLayout.jsx';
import { meta } from './meta.js';
import Page from './Page.mdx';

const Scene = lazy(() => import('./Scene.jsx'));

const CHAPTERS = ['Raw signal', 'Smoothing', 'Trend extraction', 'Noise floor'];

const LEGEND = [
  { label: 'Raw signal (amber)', color: '#f59e0b', description: 'noisy price series = trend + cycle + noise' },
  { label: 'Trend (cyan)',       color: '#22d3ee', description: 'underlying directional component, revealed by scroll' },
];

export default function TrendVsNoise() {
  return (
    <RouteLayout
      Scene={Scene}
      meta={meta}
      chapters={CHAPTERS}
      sceneProps={{}}
      sceneLegend={LEGEND}
      scenePrompt="Scroll to separate signal from noise. The noisy amber line dims as the clean cyan trend emerges — just like smoothing a price series."
    >
      <Page />
    </RouteLayout>
  );
}

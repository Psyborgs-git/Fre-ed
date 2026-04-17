import { lazy, useState } from 'react';
import RouteLayout from '../../../components/RouteLayout.jsx';
import { meta } from './meta.js';
import Page from './Page.mdx';

const Scene = lazy(() => import('./Scene.jsx'));

const CHAPTERS = ['Price series', 'Simple MA', 'Exponential MA', 'Crossover signals'];

const LEGEND = [
  { label: 'Price (amber)',   color: '#f59e0b', description: 'raw 40-point price series' },
  { label: 'SMA (cyan)',      color: '#22d3ee', description: 'Simple Moving Average — equal weight over the period' },
  { label: 'EMA (violet)',    color: '#a78bfa', description: 'Exponential Moving Average — more weight on recent prices' },
  { label: 'Crossover (green)', color: '#34d399', description: 'golden cross — EMA crosses above SMA (bullish)' },
  { label: 'Crossover (red)', color: '#f43f5e', description: 'death cross — EMA crosses below SMA (bearish)' },
];

export default function MovingAverages() {
  const [period, setPeriod] = useState(10);

  return (
    <RouteLayout
      Scene={Scene}
      meta={meta}
      chapters={CHAPTERS}
      sceneProps={{ period }}
      sceneLegend={LEGEND}
      scenePrompt="Drag the Period slider to change the look-back window. Watch how the averages lag and how crossover signals shift."
      sceneControls={[
        {
          type: 'range',
          id: 'period',
          label: 'Period',
          value: period,
          min: 5,
          max: 30,
          step: 1,
          onChange: setPeriod,
        },
      ]}
    >
      <Page />
    </RouteLayout>
  );
}

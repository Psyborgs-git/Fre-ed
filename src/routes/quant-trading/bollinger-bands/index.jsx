import { lazy, useState } from 'react';
import RouteLayout from '../../../components/RouteLayout.jsx';
import { meta } from './meta.js';
import Page from './Page.mdx';

const Scene = lazy(() => import('./Scene.jsx'));

const CHAPTERS = ['Band construction', 'Squeeze & expansion', 'Mean reversion signals', 'Breakout signals'];

const LEGEND = [
  { label: 'Price (cyan)',        color: '#22d3ee', description: 'raw price series' },
  { label: 'Bands (amber)',       color: '#f59e0b', description: 'upper and lower Bollinger bands at ±stdDev σ' },
  { label: 'SMA (violet)',        color: '#a78bfa', description: 'simple moving average — band midline' },
  { label: 'Upper touch (red)',   color: '#f43f5e', description: 'price touches upper band — potential reversal' },
  { label: 'Lower touch (green)', color: '#34d399', description: 'price touches lower band — potential reversal' },
];

export default function BollingerBands() {
  const [period, setPeriod]   = useState(20);
  const [stdDev, setStdDev]   = useState(2.0);

  return (
    <RouteLayout
      Scene={Scene}
      meta={meta}
      chapters={CHAPTERS}
      sceneProps={{ period, stdDev }}
      sceneLegend={LEGEND}
      scenePrompt="Adjust Period to change the SMA window, and StdDev to widen or narrow the bands. Watch signal spheres appear when price touches a band."
      sceneControls={[
        {
          type: 'range',
          id: 'period',
          label: 'Period',
          value: period,
          min: 10,
          max: 30,
          step: 2,
          onChange: setPeriod,
        },
        {
          type: 'range',
          id: 'stdDev',
          label: 'StdDev',
          value: stdDev,
          min: 1.0,
          max: 3.0,
          step: 0.25,
          onChange: setStdDev,
        },
      ]}
    >
      <Page />
    </RouteLayout>
  );
}

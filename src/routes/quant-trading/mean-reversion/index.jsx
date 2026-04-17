import { lazy, useState } from 'react';
import RouteLayout from '../../../components/RouteLayout.jsx';
import { meta } from './meta.js';
import Page from './Page.mdx';

const Scene = lazy(() => import('./Scene.jsx'));

const CHAPTERS = ['What is mean reversion', 'Z-score signals', 'Entry & exit rules', 'Edge persistence'];

const LEGEND = [
  { label: 'Price (violet)',     color: '#a78bfa', description: 'oscillating price series' },
  { label: 'Mean (cyan)',        color: '#22d3ee', description: 'equilibrium level the price reverts to' },
  { label: 'Z-bands (amber)',    color: '#f59e0b', description: '±Z-threshold standard deviation bands' },
  { label: 'Entry (green)',      color: '#34d399', description: 'price crosses below lower band — long entry signal' },
  { label: 'Exit (red)',         color: '#f43f5e', description: 'price reverts to mean — trade exit signal' },
];

export default function MeanReversion() {
  const [zThreshold, setZThreshold] = useState(2.0);

  return (
    <RouteLayout
      Scene={Scene}
      meta={meta}
      chapters={CHAPTERS}
      sceneProps={{ zThreshold }}
      sceneLegend={LEGEND}
      scenePrompt="Drag the Z-threshold slider to tighten or loosen entry rules. Watch how green entry and red exit markers shift as the band width changes."
      sceneControls={[
        {
          type: 'range',
          id: 'zThreshold',
          label: 'Z-threshold',
          value: zThreshold,
          min: 1.0,
          max: 3.0,
          step: 0.25,
          onChange: setZThreshold,
        },
      ]}
    >
      <Page />
    </RouteLayout>
  );
}

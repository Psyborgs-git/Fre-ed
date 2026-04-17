import { lazy, useState } from 'react';
import RouteLayout from '../../../components/RouteLayout.jsx';
import { meta } from './meta.js';
import Page from './Page.mdx';

const Scene = lazy(() => import('./Scene.jsx'));

const CHAPTERS = ['Market regimes', 'Hidden Markov Models', 'Volatility clustering', 'Regime-conditional strategies'];

const LEGEND = [
  { label: 'Bull (green)',    color: '#34d399', description: 'uptrending phase — positive drift' },
  { label: 'Bear (red)',      color: '#f43f5e', description: 'downtrending phase — negative drift' },
  { label: 'Ranging (amber)', color: '#f59e0b', description: 'sideways consolidation — mean-reverting' },
];

export default function RegimeDetection() {
  const [model, setModel] = useState('hmm');

  return (
    <RouteLayout
      Scene={Scene}
      meta={meta}
      chapters={CHAPTERS}
      sceneProps={{ model }}
      sceneLegend={LEGEND}
      scenePrompt="Scroll to build the price series and reveal regime labels. After 60% scroll the HMM state diagram fades in. Switch Model to see different regime-classification approaches."
      sceneControls={[
        {
          type: 'segmented',
          id: 'model',
          label: 'Model',
          value: model,
          options: [
            { label: 'HMM',        value: 'hmm' },
            { label: 'Volatility', value: 'volatility' },
            { label: 'Trend',      value: 'trend' },
          ],
          onChange: setModel,
        },
      ]}
    >
      <Page />
    </RouteLayout>
  );
}

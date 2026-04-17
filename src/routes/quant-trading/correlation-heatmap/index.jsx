import { lazy, useState } from 'react';
import RouteLayout from '../../../components/RouteLayout.jsx';
import { meta } from './meta.js';
import Page from './Page.mdx';

const Scene = lazy(() => import('./Scene.jsx'));

const CHAPTERS = ['What is correlation', 'Covariance matrix', 'Diversification', 'Regime breakdown'];

const LEGEND = [
  { label: 'Perfect positive (green)', color: '#34d399', description: 'correlation = +1, assets move in lockstep' },
  { label: 'Uncorrelated (white)',     color: '#ffffff', description: 'correlation = 0, no linear relationship' },
  { label: 'Perfect negative (red)',   color: '#f43f5e', description: 'correlation = −1, assets move in opposite directions' },
];

export default function CorrelationHeatmap() {
  const [assets, setAssets] = useState('equities');

  return (
    <RouteLayout
      Scene={Scene}
      meta={meta}
      chapters={CHAPTERS}
      sceneProps={{ assets }}
      sceneLegend={LEGEND}
      scenePrompt="Scroll to animate the heatmap from zero to the true correlation values. Switch Assets to compare equity, multi-asset, and crypto correlation regimes."
      sceneControls={[
        {
          type: 'segmented',
          id: 'assets',
          label: 'Assets',
          value: assets,
          options: [
            { label: 'Equities',    value: 'equities' },
            { label: 'Multi-asset', value: 'multi-asset' },
            { label: 'Crypto',      value: 'crypto' },
          ],
          onChange: setAssets,
        },
      ]}
    >
      <Page />
    </RouteLayout>
  );
}

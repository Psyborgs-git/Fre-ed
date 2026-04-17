import { lazy, useState } from 'react';
import RouteLayout from '../../../components/RouteLayout.jsx';
import { meta } from './meta.js';
import Page from './Page.mdx';

const Scene = lazy(() => import('./Scene.jsx'));

const CHAPTERS = ['Mean-variance framework', 'The efficient frontier', 'Min-variance & max-Sharpe', 'Beyond MVO'];

const LEGEND = [
  { label: 'Efficient frontier (cyan)',    color: '#22d3ee', description: 'highest return for each level of risk — appears at 50% scroll' },
  { label: 'Min-variance (violet sphere)', color: '#a78bfa', description: 'lowest achievable portfolio volatility' },
  { label: 'Max-Sharpe (amber sphere)',    color: '#f59e0b', description: 'tangency portfolio — highest Sharpe ratio' },
];

export default function EfficientFrontier() {
  const [numAssets, setNumAssets] = useState(5);

  return (
    <RouteLayout
      Scene={Scene}
      meta={meta}
      chapters={CHAPTERS}
      sceneProps={{ numAssets }}
      sceneLegend={LEGEND}
      scenePrompt="Scroll to plot portfolio points one by one, then reveal the efficient frontier curve (cyan) and special portfolios. Increase Assets to see how more diversification opportunities expand the cloud."
      sceneControls={[
        {
          type: 'range',
          id: 'numAssets',
          label: 'Assets',
          value: numAssets,
          min: 3,
          max: 10,
          step: 1,
          onChange: setNumAssets,
        },
      ]}
    >
      <Page />
    </RouteLayout>
  );
}

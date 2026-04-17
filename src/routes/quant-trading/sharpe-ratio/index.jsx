import { lazy, useState } from 'react';
import RouteLayout from '../../../components/RouteLayout.jsx';
import { meta } from './meta.js';
import Page from './Page.mdx';

const Scene = lazy(() => import('./Scene.jsx'));

const CHAPTERS = ['Return vs risk', 'Sharpe ratio', 'Sortino & Calmar', 'Comparing strategies'];

const LEGEND = [
  { label: 'High Sharpe (green)', color: '#34d399', description: 'strategy with best risk-adjusted return' },
  { label: 'Low Sharpe (red)',    color: '#f43f5e', description: 'strategy with poor risk-adjusted return' },
  { label: 'Best point (cyan)',   color: '#22d3ee', description: 'highest Sharpe strategy — glows cyan' },
  { label: 'CML (cyan dashed)',   color: '#22d3ee', description: 'capital market line from origin to best strategy' },
];

export default function SharpeRatio() {
  const [metric, setMetric] = useState('sharpe');

  return (
    <RouteLayout
      Scene={Scene}
      meta={meta}
      chapters={CHAPTERS}
      sceneProps={{ metric }}
      sceneLegend={LEGEND}
      scenePrompt="Switch metrics to see how the color ranking changes. Each axis: x = volatility, y = return, z = ratio value."
      sceneControls={[
        {
          type: 'segmented',
          id: 'metric',
          label: 'Metric',
          value: metric,
          options: [
            { label: 'Sharpe',  value: 'sharpe' },
            { label: 'Sortino', value: 'sortino' },
            { label: 'Calmar',  value: 'calmar' },
          ],
          onChange: setMetric,
        },
      ]}
    >
      <Page />
    </RouteLayout>
  );
}

import { lazy } from 'react';
import RouteLayout from '../../../components/RouteLayout.jsx';
import { meta } from './meta.js';
import Page from './Page.mdx';

const Scene = lazy(() => import('./Scene.jsx'));

const CHAPTERS = ['Equity curve', 'Drawdown', 'Walk-forward', 'Survivorship bias'];

const LEGEND = [
  { label: 'Equity curve (cyan)', color: '#22d3ee', description: 'cumulative portfolio value over time' },
  { label: 'Drawdown (red)',      color: '#f43f5e', description: 'depth of loss from running peak — filled area' },
  { label: 'Start level (grey)',  color: '#94a3b8', description: 'initial portfolio value baseline' },
];

export default function Backtesting() {
  return (
    <RouteLayout
      Scene={Scene}
      meta={meta}
      chapters={CHAPTERS}
      sceneProps={{}}
      sceneLegend={LEGEND}
      scenePrompt="Scroll to build the equity curve left-to-right. Red bars show how deep the strategy fell below its running peak at each point in time."
    >
      <Page />
    </RouteLayout>
  );
}

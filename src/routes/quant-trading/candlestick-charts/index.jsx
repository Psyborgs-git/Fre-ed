import { lazy } from 'react';
import RouteLayout from '../../../components/RouteLayout.jsx';
import { meta } from './meta.js';
import Page from './Page.mdx';

const Scene = lazy(() => import('./Scene.jsx'));

const CHAPTERS = ['OHLC data', 'Body & wicks', 'Bullish patterns', 'Bearish patterns'];

const LEGEND = [
  { label: 'Green candle', color: '#34d399', description: 'close ≥ open — buyers dominated the period' },
  { label: 'Red candle',   color: '#f43f5e', description: 'close < open — sellers dominated the period' },
  { label: 'Wick lines',   color: '#94a3b8', description: 'high and low price extremes reached during the period' },
];

export default function CandlestickCharts() {
  return (
    <RouteLayout
      Scene={Scene}
      meta={meta}
      chapters={CHAPTERS}
      sceneProps={{}}
      sceneLegend={LEGEND}
      scenePrompt="Scroll to reveal candles one by one. Each bar is an OHLC story — body height shows conviction, wick length shows rejection."
    >
      <Page />
    </RouteLayout>
  );
}

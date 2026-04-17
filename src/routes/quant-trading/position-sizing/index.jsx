import { lazy, useState } from 'react';
import RouteLayout from '../../../components/RouteLayout.jsx';
import { meta } from './meta.js';
import Page from './Page.mdx';

const Scene = lazy(() => import('./Scene.jsx'));

const CHAPTERS = ['The 1% rule', 'Kelly criterion', 'Risk of ruin', 'Practical sizing'];

const LEGEND = [
  { label: 'Green bar',       color: '#34d399', description: 'highest-conviction position — largest Kelly-sized bet' },
  { label: 'Amber bar',       color: '#f59e0b', description: 'medium-conviction position — scaled down' },
  { label: 'Red bar',         color: '#f43f5e', description: 'lowest-conviction position — minimal sizing' },
  { label: 'Red dashed line', color: '#f43f5e', description: 'max risk threshold — bars above this are oversized' },
];

export default function PositionSizing() {
  const [riskPct, setRiskPct] = useState(1.0);
  const [winRate, setWinRate] = useState(0.55);

  return (
    <RouteLayout
      Scene={Scene}
      meta={meta}
      chapters={CHAPTERS}
      sceneProps={{ riskPct, winRate }}
      sceneLegend={LEGEND}
      scenePrompt="Adjust Risk % and Win Rate to reshape the Kelly pyramid. Watch how higher win rates permit taller bars and how higher risk % shifts the max-risk threshold."
      sceneControls={[
        {
          type: 'range',
          id: 'riskPct',
          label: 'Risk %',
          value: riskPct,
          min: 0.5,
          max: 5,
          step: 0.5,
          onChange: setRiskPct,
        },
        {
          type: 'range',
          id: 'winRate',
          label: 'Win Rate',
          value: winRate,
          min: 0.3,
          max: 0.8,
          step: 0.05,
          onChange: setWinRate,
        },
      ]}
    >
      <Page />
    </RouteLayout>
  );
}

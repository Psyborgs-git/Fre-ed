import { lazy, useState } from 'react';
import RouteLayout from '../../../components/RouteLayout.jsx';
import { meta } from './meta.js';
import Page from './Page.mdx';

const Scene = lazy(() => import('./Scene.jsx'));

const CHAPTERS = ['Implied volatility', 'The volatility smile', 'Term structure', 'Surface arbitrage'];

const LEGEND = [
  { label: 'Low vol (violet)', color: '#a78bfa', description: 'implied volatility near ATM minimum' },
  { label: 'Mid vol (cyan)',   color: '#22d3ee', description: 'intermediate implied volatility' },
  { label: 'High vol (amber)', color: '#f59e0b', description: 'high implied volatility — OTM wings or short expiry' },
];

export default function VolatilitySurface() {
  const [shape, setShape] = useState('smile');

  return (
    <RouteLayout
      Scene={Scene}
      meta={meta}
      chapters={CHAPTERS}
      sceneProps={{ shape }}
      sceneLegend={LEGEND}
      scenePrompt="Scroll to raise the volatility surface from flat to its true shape. The surface slowly rotates — drag to explore. Switch Shape to compare the smile, skew, and flat profiles."
      sceneControls={[
        {
          type: 'segmented',
          id: 'shape',
          label: 'Shape',
          value: shape,
          options: [
            { label: 'Smile', value: 'smile' },
            { label: 'Skew',  value: 'skew' },
            { label: 'Flat',  value: 'flat' },
          ],
          onChange: setShape,
        },
      ]}
    >
      <Page />
    </RouteLayout>
  );
}

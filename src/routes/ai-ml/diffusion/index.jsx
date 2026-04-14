import { lazy, useState } from 'react';
import RouteLayout from '../../../components/RouteLayout.jsx';
import { meta } from './meta.js';
import Page from './Page.mdx';

const Scene = lazy(() => import('./Scene.jsx'));

const CHAPTERS = ['Forward noising', 'Pure noise', 'Reverse denoising', 'Generated data'];
const LEGEND = [
  { label: 'Violet', color: '#a78bfa', description: 'clean data (low noise timesteps)' },
  { label: 'Cyan',   color: '#22d3ee', description: 'partially noised (mid timesteps)' },
  { label: 'Grey',   color: '#64748b', description: 'pure noise (high timesteps)' },
  { label: 'Amber',  color: '#f59e0b', description: 'forward noising direction →' },
  { label: 'Cyan arrows', color: '#22d3ee', description: 'reverse denoising direction ←' },
];

const DISPLAY_OPTIONS = [
  { label: 'Both directions', value: 'both' },
  { label: 'Forward only',    value: 'forward' },
];

export default function Diffusion() {
  const [display, setDisplay] = useState('both');

  return (
    <RouteLayout
      Scene={Scene}
      meta={meta}
      chapters={CHAPTERS}
      sceneProps={{ showReverse: display === 'both' }}
      sceneLegend={LEGEND}
      scenePrompt="Toggle to see forward noising alone, then add the reverse denoising path."
      sceneControls={[
        { type: 'segmented', id: 'diffusion-display', label: 'Display', value: display, options: DISPLAY_OPTIONS, onChange: setDisplay },
      ]}
    >
      <Page />
    </RouteLayout>
  );
}

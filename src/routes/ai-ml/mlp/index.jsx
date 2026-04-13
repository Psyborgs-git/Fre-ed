import { lazy, useState } from 'react';
import RouteLayout from '../../../components/RouteLayout.jsx';
import { meta } from './meta.js';
import Page from './Page.mdx';

const Scene = lazy(() => import('./Scene.jsx'));

const CHAPTERS = ['Input layer', 'Hidden layer 1', 'Hidden layer 2', 'Output & boundary'];
const LEGEND = [
  { label: 'Violet', color: '#a78bfa', description: 'input features before nonlinear mixing' },
  { label: 'Cyan', color: '#22d3ee', description: 'hidden neurons building internal features' },
  { label: 'Amber', color: '#f59e0b', description: 'output layer and final decision' },
];
const PRESET_OPTIONS = [
  { label: 'Compact', value: 'compact' },
  { label: 'Standard', value: 'standard' },
  { label: 'Wide', value: 'wide' },
];

export default function Mlp() {
  const [preset, setPreset] = useState('standard');

  return (
    <RouteLayout
      Scene={Scene}
      meta={meta}
      chapters={CHAPTERS}
      sceneProps={{ preset }}
      sceneLegend={LEGEND}
      scenePrompt="Switch network width presets to compare how extra hidden capacity changes the visual flow."
      sceneControls={[
        { type: 'segmented', id: 'mlp-preset', label: 'Network width', value: preset, options: PRESET_OPTIONS, onChange: setPreset },
      ]}
    >
      <Page />
    </RouteLayout>
  );
}

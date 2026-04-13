import { lazy, useState } from 'react';
import RouteLayout from '../../../components/RouteLayout.jsx';
import { meta } from './meta.js';
import Page from './Page.mdx';

const Scene = lazy(() => import('./Scene.jsx'));

const CHAPTERS = ['Input image', 'Conv filter sliding', 'Feature map', 'Pool → FC'];
const LEGEND = [
  { label: 'Blue grid', color: '#22d3ee', description: 'input image or intermediate feature values' },
  { label: 'Amber kernel', color: '#f59e0b', description: 'the active convolution filter' },
  { label: 'Amber output', color: '#f59e0b', description: 'the strongest predicted class' },
];
const FILTER_OPTIONS = [
  { label: 'Edge', value: 'edge' },
  { label: 'Blur', value: 'blur' },
  { label: 'Sharpen', value: 'sharpen' },
];

export default function Cnn() {
  const [kernelPreset, setKernelPreset] = useState('edge');

  return (
    <RouteLayout
      Scene={Scene}
      meta={meta}
      chapters={CHAPTERS}
      sceneProps={{ kernelPreset }}
      sceneLegend={LEGEND}
      scenePrompt="Swap the kernel preset to compare how an edge detector, blur filter, and sharpen filter light up different regions."
      sceneControls={[
        { type: 'segmented', id: 'kernel-preset', label: 'Kernel', value: kernelPreset, options: FILTER_OPTIONS, onChange: setKernelPreset },
      ]}
    >
      <Page />
    </RouteLayout>
  );
}

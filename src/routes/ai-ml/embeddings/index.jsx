import { lazy } from 'react';
import RouteLayout from '../../../components/RouteLayout.jsx';
import { meta } from './meta.js';
import Page from './Page.mdx';

const Scene = lazy(() => import('./Scene.jsx'));

const CHAPTERS = ['Token space', 'Clusters form', 'Similarity lines', 'Analogy geometry'];
const LEGEND = [
  { label: 'Violet', color: '#a78bfa', description: 'royalty tokens (king, queen)' },
  { label: 'Cyan',   color: '#22d3ee', description: 'gender tokens (man, woman)' },
  { label: 'Amber',  color: '#f59e0b', description: 'animal tokens (dog, cat)' },
  { label: 'Green',  color: '#34d399', description: 'geography tokens (paris, france)' },
];

export default function Embeddings() {
  return (
    <RouteLayout
      Scene={Scene}
      meta={meta}
      chapters={CHAPTERS}
      sceneLegend={LEGEND}
      scenePrompt="Watch clusters appear, then see the king − man + woman ≈ queen analogy drawn as an amber arrow."
      interactionHint="Drag to orbit · Scroll to animate token clusters"
    >
      <Page />
    </RouteLayout>
  );
}

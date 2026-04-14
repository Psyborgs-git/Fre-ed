import { lazy, useState } from 'react';
import RouteLayout from '../../../components/RouteLayout.jsx';
import { meta } from './meta.js';
import Page from './Page.mdx';

const Scene = lazy(() => import('./Scene.jsx'));
const CHAPTERS = ['Query vector', 'Similarity search', 'Retrieved context', 'Generation'];
const LEGEND = [
  { label: 'Cyan query', color: '#22d3ee', description: 'the question embedding' },
  { label: 'Amber docs', color: '#f59e0b', description: 'documents retrieved for context' },
  { label: 'Violet box', color: '#a78bfa', description: 'the generator consuming retrieved facts' },
];
const QUERY_OPTIONS = [
  { label: 'Transformers', value: 'transformers' },
  { label: 'Vectors', value: 'vectors' },
  { label: 'Retrieval', value: 'retrieval' },
];

export default function Rag() {
  const [queryPreset, setQueryPreset] = useState('transformers');

  return (
    <RouteLayout
      Scene={Scene}
      meta={meta}
      chapters={CHAPTERS}
      sceneProps={{ queryPreset }}
      sceneLegend={LEGEND}
      scenePrompt="Switch the query preset to watch a different slice of the corpus get pulled into the context window."
      sceneControls={[
        { type: 'segmented', id: 'query-preset', label: 'Query preset', value: queryPreset, options: QUERY_OPTIONS, onChange: setQueryPreset },
      ]}
    >
      <Page />
    </RouteLayout>
  );
}

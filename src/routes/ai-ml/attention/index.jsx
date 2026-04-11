import { lazy } from 'react';
import RouteLayout from '../../../components/RouteLayout.jsx';
import { meta } from './meta.js';
import Page from './Page.mdx';

const Scene = lazy(() => import('./Scene.jsx'));

const CHAPTERS = ['Query · Key · Value', 'Dot-product scores', 'Softmax attention weights', 'Context vectors'];

export default function Attention() {
  return (
    <RouteLayout Scene={Scene} meta={meta} chapters={CHAPTERS}>
      <Page />
    </RouteLayout>
  );
}

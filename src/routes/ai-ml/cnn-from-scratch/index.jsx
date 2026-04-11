import { lazy } from 'react';
import RouteLayout from '../../../components/RouteLayout.jsx';
import { meta } from './meta.js';
import Page from './Page.mdx';

const Scene = lazy(() => import('./Scene.jsx'));

const CHAPTERS = ['Input image', 'Conv filter sliding', 'Feature map', 'Pool → FC'];

export default function Cnn() {
  return (
    <RouteLayout Scene={Scene} meta={meta} chapters={CHAPTERS}>
      <Page />
    </RouteLayout>
  );
}

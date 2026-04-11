import { lazy } from 'react';
import RouteLayout from '../../../components/RouteLayout.jsx';
import { meta } from './meta.js';
import Page from './Page.mdx';

const Scene = lazy(() => import('./Scene.jsx'));

const CHAPTERS = ['Forward pass', 'Loss computed', 'Gradients flow back', 'Weights updated'];

export default function Backprop() {
  return (
    <RouteLayout Scene={Scene} meta={meta} chapters={CHAPTERS}>
      <Page />
    </RouteLayout>
  );
}

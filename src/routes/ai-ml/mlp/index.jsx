import { lazy } from 'react';
import RouteLayout from '../../../components/RouteLayout.jsx';
import { meta } from './meta.js';
import Page from './Page.mdx';

const Scene = lazy(() => import('./Scene.jsx'));

const CHAPTERS = ['Input layer', 'Hidden layer 1', 'Hidden layer 2', 'Output & boundary'];

export default function Mlp() {
  return (
    <RouteLayout Scene={Scene} meta={meta} chapters={CHAPTERS}>
      <Page />
    </RouteLayout>
  );
}

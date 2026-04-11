import { lazy } from 'react';
import RouteLayout from '../../../components/RouteLayout.jsx';
import { meta } from './meta.js';
import Page from './Page.mdx';

const Scene = lazy(() => import('./Scene.jsx'));

export default function FineTuning() {
  return (
    <RouteLayout Scene={Scene} meta={meta}>
      <Page />
    </RouteLayout>
  );
}

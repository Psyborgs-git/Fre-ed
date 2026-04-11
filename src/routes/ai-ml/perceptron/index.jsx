import { lazy } from 'react';
import RouteLayout from '../../../components/RouteLayout.jsx';
import { meta } from './meta.js';
import Page from './Page.mdx';

// 3D scene is code-split — loads only when this route is visited
const Scene = lazy(() => import('./Scene.jsx'));

export default function Perceptron() {
  return (
    <RouteLayout Scene={Scene} meta={meta}>
      <Page />
    </RouteLayout>
  );
}

import { Suspense, lazy } from 'react';

const modelViewerModule = import('./ModelViewer');
const ModelViewer = lazy(() => modelViewerModule);

function SkeletonViewer() {
  return (
    <div className="model-skeleton" role="status" aria-live="polite">
      <div className="model-loader">
        <span className="eyebrow">Preparing Aether model</span>
        <div className="loader-bar" aria-hidden="true">
          <span style={{ width: '42%' }} />
        </div>
      </div>
    </div>
  );
}

export default function LazyModelViewer() {
  return (
    <Suspense fallback={<SkeletonViewer />}>
      <ModelViewer />
    </Suspense>
  );
}
